export const dynamic = 'force-dynamic'

import { getTodayPredictions, getPredictions } from '@/lib/supabase'
import PredictorView from '@/components/PredictorView'
import type { Prediction } from '@/types'

const DEMO: Prediction[] = [
  {
    id: 'demo-1', created_at: new Date().toISOString(),
    partido: 'Scotland vs Morocco', fecha: '2026-06-19', hora: '18:00',
    ronda: 'Matchday 9', grupo: 'C', equipo1: 'Scotland', equipo2: 'Morocco',
    prob_equipo1: 34.9, prob_empate: 34.5, prob_equipo2: 30.6,
    resultado_predicho: 'Scotland', confianza: 'Baja',
    prob_over25: 23.3, prob_btts: 31.8, lambda1: 0.87, lambda2: 0.79,
    elo1: 1848, elo2: 1945, cuota1: 5.38, cuota_empate: 3.6, cuota2: 1.73,
    prob_impl1: 18.6, prob_impl_empate: 27.8, prob_impl2: 57.8,
    resultado_real: null, goles_equipo1: null, goles_equipo2: null, acierto: null,
    corners_avg: 5.2, amarillas_avg: 3.1, tiros_avg: 11.4,
    top5_apuestas: null,
    pred_over25: 'Under 2.5', pred_btts: 'No',
    analisis_completo: null, tiene_lesiones: null, tiene_suspension: null, hay_noticias_impacto: null,
  },
]

async function fetchPredictions(): Promise<Prediction[]> {
  try {
    const today = await getTodayPredictions()
    if (today.length) return today
    const all = await getPredictions()
    return all.slice(0, 6)
  } catch {
    return DEMO
  }
}

export default async function DashboardPage() {
  const predictions = await fetchPredictions()
  const today = new Date().toISOString().split('T')[0]

  return <PredictorView predictions={predictions} dateDefault={today} />
}
