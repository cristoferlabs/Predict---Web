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
  // Inline text parser for analisis_completo fallback
  const txt = (row.analisis_completo as string) || ''
  const pct = (re: RegExp) => { const m = txt.match(re); return m ? +m[1] : 0 }

  const rawP1 = (row.prob_local  as number) || 0
  const rawPD = (row.prob_empate as number) || 0
  const rawP2 = (row.prob_visita as number) || 0

  // If DB fields are > 1 they are already percentages; otherwise parse from text
  const prob1 = rawP1 > 1 ? rawP1 : pct(/(\d+\.?\d*)\s*%.*?(?:gana|local)/i) || pct(/local[:\s]+(\d+\.?\d*)%/i)
  const probD = rawPD > 1 ? rawPD : pct(/[Ee]mpate[:\s]+(\d+\.?\d*)%/)
  const prob2 = rawP2 > 1 ? rawP2 : pct(/(?:visita|gana)[^%]*?(\d+\.?\d*)\s*%(?!.*gana)/i)
  const probO = pct(/[Oo]ver\s*2\.5[:\s]+(\d+\.?\d*)%/) || (row.pred_prob_over25 as number) || 0
  const probB = pct(/BTTS[:\s]+(?:Si|Sí)\s+(\d+\.?\d*)%/i) || (row.pred_prob_btts_si as number) || 0

  const txtResultado = txt.match(/Resultado:\s*([^\n\-–]+)/)?.[1]?.trim() || ''
  const txtConfianza = txt.match(/Confianza\s+(Alta|Media|Baja)/i)?.[1] || ''

  // Use pred_1x2 unless it wrongly says "Empate" when model clearly favors equipo1
  const dbResultado = (row.pred_1x2 as string) || ''
  const resultado_predicho = dbResultado && !(dbResultado === 'Empate' && prob1 > probD)
    ? dbResultado
    : txtResultado || dbResultado

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

    prob_equipo1: prob1,
    prob_empate:  probD,
    prob_equipo2: prob2,

    resultado_predicho,
    confianza: ((row.pred_1x2_confianza as string) || txtConfianza || 'Baja') as 'Alta' | 'Media' | 'Baja',

    prob_over25: probO,
    prob_btts:   probB,

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

// Returns today + next 7 days, ordered by fecha+hora (for fixture carousel)
export async function getUpcomingPredictions(): Promise<Prediction[]> {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('predicciones')
    .select('*')
    .gte('fecha', today)
    .order('fecha', { ascending: true })
    .order('hora',  { ascending: true })
    .limit(20)
  if (error) return []
  return (data ?? []).map(transform)
}

// Returns all predictions that have market odds (for Model vs Market chart)
export async function getPredictionsWithOdds(): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from('predicciones')
    .select('*')
    .not('odd_local', 'is', null)
    .order('fecha', { ascending: true })
    .limit(50)
  if (error) return []
  return (data ?? []).map(transform)
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
