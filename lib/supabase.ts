import { createClient } from '@supabase/supabase-js'
import type { Prediction, AlternativeMarket } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auto-scale: if value is in [0,1] range, convert to percentage [0,100]
function pct(v: unknown): number {
  if (v == null) return 0
  const n = Number(v)
  if (isNaN(n)) return 0
  return n > 0 && n <= 1 ? n * 100 : n
}

function maybeNum(v: unknown): number | null {
  if (v == null) return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transform(row: Record<string, any>): Prediction {
  return {
    id:         String(row.id ?? ''),
    created_at: String(row.created_at ?? ''),
    // Construct partido name if not stored directly
    partido:    String(row.partido ?? `${row.equipo1 ?? ''} vs ${row.equipo2 ?? ''}`),
    fecha:      String(row.fecha ?? ''),
    hora:       String(row.hora ?? ''),
    ronda:      String(row.ronda ?? ''),
    // Strip "Group " / "Grupo " prefix → "C" not "Group C"
    grupo:      String(row.grupo ?? '').replace(/^(Group|Grupo)\s+/i, ''),
    equipo1:    String(row.equipo1 ?? ''),
    equipo2:    String(row.equipo2 ?? ''),

    // Model probabilities:
    // DB cols: pred_prob_t1, pred_prob_draw, pred_prob_t2
    // Fallback to prob_equipo* in case schema uses those names directly
    prob_equipo1: pct(row.pred_prob_t1   ?? row.prob_equipo1),
    prob_empate:  pct(row.pred_prob_draw ?? row.prob_empate_model ?? (row.pred_prob_t1 != null ? null : row.prob_empate)),
    prob_equipo2: pct(row.pred_prob_t2   ?? row.prob_equipo2),

    resultado_predicho: String(row.resultado_predicho ?? ''),
    confianza: (row.confianza as 'Alta' | 'Media' | 'Baja') ?? 'Baja',

    prob_over25: pct(row.prob_over25),
    prob_btts:   pct(row.prob_btts),

    lambda1: Number(row.lambda1 ?? 0) || 0,
    lambda2: Number(row.lambda2 ?? 0) || 0,
    elo1:    Number(row.elo1    ?? 0) || 0,
    elo2:    Number(row.elo2    ?? 0) || 0,

    // Market odds
    cuota1:       maybeNum(row.cuota1),
    cuota_empate: maybeNum(row.cuota_empate),
    cuota2:       maybeNum(row.cuota2),

    // Market-implied probabilities:
    // DB cols: prob_local (home implied), prob_empate (draw implied), prob_visita (away implied)
    prob_impl1:       row.prob_local   != null ? pct(row.prob_local)   : maybeNum(row.prob_impl1) != null ? pct(row.prob_impl1) : null,
    prob_impl_empate: row.prob_empate  != null && row.pred_prob_t1 != null ? pct(row.prob_empate) : maybeNum(row.prob_impl_empate) != null ? pct(row.prob_impl_empate) : null,
    prob_impl2:       row.prob_visita  != null ? pct(row.prob_visita)  : maybeNum(row.prob_impl2) != null ? pct(row.prob_impl2) : null,

    // Results (populated after match)
    resultado_real: (row.resultado_real as string | null) ?? null,
    goles_equipo1:  maybeNum(row.goles_equipo1),
    goles_equipo2:  maybeNum(row.goles_equipo2),
    acierto:        (row.acierto as boolean | null) ?? null,

    // Stats
    corners_avg:   maybeNum(row.corners_avg),
    amarillas_avg: maybeNum(row.amarillas_avg),
    tiros_avg:     maybeNum(row.tiros_avg),
    top5_apuestas: (row.top5_apuestas as AlternativeMarket[] | null) ?? null,
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
    .select('acierto, confianza, resultado_predicho')
    .not('acierto', 'is', null)

  if (error) throw error

  const total = data.length
  const aciertos = data.filter(d => d.acierto).length
  const byConfianza = {
    Alta:  { total: 0, aciertos: 0 },
    Media: { total: 0, aciertos: 0 },
    Baja:  { total: 0, aciertos: 0 },
  }

  for (const d of data) {
    const c = d.confianza as 'Alta' | 'Media' | 'Baja'
    if (byConfianza[c]) {
      byConfianza[c].total++
      if (d.acierto) byConfianza[c].aciertos++
    }
  }

  return {
    total,
    aciertos,
    pct: total > 0 ? Math.round((aciertos / total) * 100) : 0,
    byConfianza,
  }
}
