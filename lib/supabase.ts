import { createClient } from '@supabase/supabase-js'
import type { Prediction, AlternativeMarket } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

function maybeNum(v: unknown): number | null {
  if (v == null) return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

// Implied probability from decimal odd: 1/odd * 100
function impliedProb(odd: unknown): number | null {
  const o = maybeNum(odd)
  if (o == null || o <= 0) return null
  return Math.round((1 / o) * 1000) / 10  // one decimal
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transform(row: Record<string, any>): Prediction {
  return {
    // Identity
    id:         String(row.id ?? ''),
    created_at: String(row.created_at ?? ''),
    partido:    `${row.equipo1 ?? ''} vs ${row.equipo2 ?? ''}`,
    fecha:      String(row.fecha ?? ''),
    hora:       String(row.hora  ?? ''),
    ronda:      String(row.ronda ?? ''),
    grupo:      String(row.grupo ?? '').replace(/^(Group|Grupo)\s+/i, ''),
    equipo1:    String(row.equipo1 ?? ''),
    equipo2:    String(row.equipo2 ?? ''),

    // Model probabilities — DB stores as float percentages (34.9, not 0.349)
    prob_equipo1: Number(row.prob_local  ?? 0) || 0,
    prob_empate:  Number(row.prob_empate ?? 0) || 0,
    prob_equipo2: Number(row.prob_visita ?? 0) || 0,

    // IA prediction
    resultado_predicho: String(row.pred_1x2 ?? ''),
    confianza: (row.pred_1x2_confianza as 'Alta' | 'Media' | 'Baja') ?? 'Baja',

    // Over/BTTS — not stored as floats in DB; default 0
    prob_over25: 0,
    prob_btts:   0,

    // Mathematical model
    lambda1: Number(row.lambda1 ?? 0) || 0,
    lambda2: Number(row.lambda2 ?? 0) || 0,
    elo1:    Number(row.elo1    ?? 0) || 0,
    elo2:    Number(row.elo2    ?? 0) || 0,

    // Market odds — DB cols: odd_local, odd_empate, odd_visita
    cuota1:       maybeNum(row.odd_local),
    cuota_empate: maybeNum(row.odd_empate),
    cuota2:       maybeNum(row.odd_visita),

    // Implied probabilities derived from odds (1/odd × 100)
    prob_impl1:       impliedProb(row.odd_local),
    prob_impl_empate: impliedProb(row.odd_empate),
    prob_impl2:       impliedProb(row.odd_visita),

    // Post-match results — DB cols: resultado_1x2, resultado_goles1/2, acierto_1x2
    resultado_real: (row.resultado_1x2 as string | null) ?? null,
    goles_equipo1:  maybeNum(row.resultado_goles1),
    goles_equipo2:  maybeNum(row.resultado_goles2),
    acierto:        (row.acierto_1x2 as boolean | null) ?? null,

    // Match stats
    corners_avg:   maybeNum(row.corners_avg),
    amarillas_avg: maybeNum(row.amarillas_avg),
    tiros_avg:     maybeNum(row.tiros_avg),
    top5_apuestas: null,

    // IA text predictions
    pred_over25: (row.pred_over25 as string | null) ?? null,
    pred_btts:   (row.pred_btts   as string | null) ?? null,

    // IA full analysis text and alert flags
    analisis_completo:    (row.analisis_completo as string | null) ?? null,
    tiene_lesiones:       (row.tiene_lesiones as boolean | null) ?? null,
    tiene_suspension:     (row.tiene_suspension as boolean | null) ?? null,
    hay_noticias_impacto: (row.hay_noticias_impacto as boolean | null) ?? null,
  }
}

export async function getPredictions(fecha?: string): Promise<Prediction[]> {
  let query = supabase
    .from('predicciones')
    .select('*')
    .order('fecha', { ascending: true })

  if (fecha) {
    query = query.eq('fecha', fecha)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(transform)
}

export async function getPredictionById(id: string): Promise<Prediction | null> {
  const { data, error } = await supabase
    .from('predicciones')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return transform(data)
}

export async function getTodayPredictions(): Promise<Prediction[]> {
  const today = new Date().toISOString().split('T')[0]
  return getPredictions(today)
}

export async function getAccuracyStats() {
  const { data, error } = await supabase
    .from('predicciones')
    .select('acierto_1x2, pred_1x2_confianza, pred_1x2')
    .not('acierto_1x2', 'is', null)

  if (error) throw error

  const total = data.length
  const aciertos = data.filter(d => d.acierto_1x2).length
  const byConfianza = {
    Alta:  { total: 0, aciertos: 0 },
    Media: { total: 0, aciertos: 0 },
    Baja:  { total: 0, aciertos: 0 },
  }

  for (const d of data) {
    const c = d.pred_1x2_confianza as 'Alta' | 'Media' | 'Baja'
    if (byConfianza[c]) {
      byConfianza[c].total++
      if (d.acierto_1x2) byConfianza[c].aciertos++
    }
  }

  return {
    total,
    aciertos,
    pct: total > 0 ? Math.round((aciertos / total) * 100) : 0,
    byConfianza,
  }
}
