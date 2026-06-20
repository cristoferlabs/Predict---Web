export const dynamic = 'force-dynamic'

import { getTodayPredictions, getPredictions, getUpcomingPredictions, getPredictionsWithOdds } from '@/lib/supabase'
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

async function fetchAll() {
  const [today, upcoming, withOdds] = await Promise.all([
    getTodayPredictions().catch(() => [] as Prediction[]),
    getUpcomingPredictions().catch(() => [] as Prediction[]),
    getPredictionsWithOdds().catch(() => [] as Prediction[]),
  ])

  // Today's predictions for hero/hit-rate/alt-markets
  let predictions = today
  if (!predictions.length) {
    predictions = await getPredictions().catch(() => [])
    predictions = predictions.slice(0, 10)
  }
  if (!predictions.length) predictions = DEMO

  // Upcoming for carousel — fall back to today's if empty
  const upcomingFinal = upcoming.length ? upcoming : predictions

  return { predictions, upcoming: upcomingFinal, withOdds }
}

export default async function DashboardPage() {
  const { predictions, upcoming, withOdds } = await fetchAll()
  const today = new Date().toISOString().split('T')[0]

  return (
    <PredictorView
      predictions={predictions}
      upcomingPredictions={upcoming}
      predictionsWithOdds={withOdds}
      dateDefault={today}
    />
  )
}
