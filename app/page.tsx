export const dynamic = 'force-dynamic'

import { getTodayPredictions, getPredictions } from '@/lib/supabase'
import PredictorView from '@/components/PredictorView'
import type { Prediction } from '@/types'

const DEMO: Prediction[] = [
  {
    id: 'demo-1', created_at: new Date().toISOString(),
    partido: 'REAL MADRID vs FC BARCELONA', fecha: '2026-06-19', hora: '20:00',
    ronda: 'Matchday 9', grupo: 'C', equipo1: 'REAL MADRID', equipo2: 'FC BARCELONA',
    prob_equipo1: 45.0, prob_empate: 25.0, prob_equipo2: 30.0,
    resultado_predicho: 'REAL MADRID', confianza: 'Alta',
    prob_over25: 65.0, prob_btts: 72.0, lambda1: 2.1, lambda2: 1.8,
    elo1: 2045, elo2: 1980, cuota1: 1.85, cuota_empate: 3.6, cuota2: 4.2,
    prob_impl1: 54.1, prob_impl_empate: 27.8, prob_impl2: 18.1,
    resultado_real: null, goles_equipo1: null, goles_equipo2: null, acierto: null,
    corners_avg: 5.2, amarillas_avg: 3.1, tiros_avg: 11.4,
    top5_apuestas: null,
    pred_over25: 'Over 2.5', pred_btts: 'Yes',
    analisis_completo: null, tiene_lesiones: null, tiene_suspension: null, hay_noticias_impacto: null,
  },
  {
    id: 'demo-2', created_at: new Date().toISOString(),
    partido: 'INTER MILAN vs JUVENTUS', fecha: '2026-06-19', hora: '20:45',
    ronda: 'Matchday 9', grupo: 'A', equipo1: 'INTER MILAN', equipo2: 'JUVENTUS',
    prob_equipo1: 52.0, prob_empate: 28.0, prob_equipo2: 20.0,
    resultado_predicho: 'INTER MILAN', confianza: 'Media',
    prob_over25: 42.0, prob_btts: 45.0, lambda1: 1.6, lambda2: 1.2,
    elo1: 1920, elo2: 1880, cuota1: 1.92, cuota_empate: 3.4, cuota2: 4.8,
    prob_impl1: 52.1, prob_impl_empate: 29.4, prob_impl2: 18.5,
    resultado_real: null, goles_equipo1: null, goles_equipo2: null, acierto: null,
    corners_avg: 4.8, amarillas_avg: 4.2, tiros_avg: 12.1,
    top5_apuestas: null,
    pred_over25: 'Under 2.5', pred_btts: 'No',
    analisis_completo: null, tiene_lesiones: null, tiene_suspension: null, hay_noticias_impacto: null,
  },
]

async function fetchPredictions(): Promise<Prediction[]> {
  try {
    const today = await getTodayPredictions()
    if (today && today.length) return today
    const all = await getPredictions()
    if (all && all.length) return all.slice(0, 10)
    return DEMO
  } catch {
    return DEMO
  }
}

export default async function DashboardPage() {
  const predictions = await fetchPredictions()
  const today = new Date().toISOString().split('T')[0]

  return (
    <PredictorView predictions={predictions} dateDefault={today} />
  )
}
