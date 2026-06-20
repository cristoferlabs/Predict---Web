export const dynamic = 'force-dynamic'

import { getTodayPredictions, getPredictions } from '@/lib/supabase'
import PredictorView from '@/components/PredictorView'
import type { Prediction } from '@/types'

const DEMO: Prediction[] = [
  {
    id: 'premium-1', created_at: new Date().toISOString(),
    partido: 'SCOTLAND vs MOROCCO', fecha: '2026-06-19', hora: '18:00',
    ronda: 'Matchday 9', grupo: 'C', equipo1: 'SCOTLAND', equipo2: 'MOROCCO',
    prob_equipo1: 35.0, prob_empate: 34.0, prob_equipo2: 31.0,
    resultado_predicho: 'SCOTLAND', confianza: 'Alta',
    prob_over25: 68.4, prob_btts: 52.1, lambda1: 2.14, lambda2: 0.98,
    elo1: 2045, elo2: 1980, cuota1: 2.10, cuota_empate: 3.2, cuota2: 3.5,
    prob_impl1: 47.6, prob_impl_empate: 31.2, prob_impl2: 21.2,
    resultado_real: null, goles_equipo1: null, goles_equipo2: null, acierto: null,
    corners_avg: 5.2, amarillas_avg: 3.1, tiros_avg: 14.2,
    top5_apuestas: null,
    pred_over25: 'Over 2.5', pred_btts: 'Yes',
    analisis_completo: null, tiene_lesiones: null, tiene_suspension: null, hay_noticias_impacto: null,
  },
  {
    id: 'premium-2', created_at: new Date().toISOString(),
    partido: 'SPAIN vs ITALY', fecha: '2026-06-20', hora: '21:00',
    ronda: 'Matchday 10', grupo: 'B', equipo1: 'SPAIN', equipo2: 'ITALY',
    prob_equipo1: 42.0, prob_empate: 28.0, prob_equipo2: 30.0,
    resultado_predicho: 'SPAIN', confianza: 'Media',
    prob_over25: 45.0, prob_btts: 48.0, lambda1: 1.8, lambda2: 1.4,
    elo1: 1920, elo2: 1880, cuota1: 2.25, cuota_empate: 3.1, cuota2: 3.4,
    prob_impl1: 44.4, prob_impl_empate: 32.3, prob_impl2: 23.3,
    resultado_real: null, goles_equipo1: null, goles_equipo2: null, acierto: null,
    corners_avg: 4.8, amarillas_avg: 4.2, tiros_avg: 11.5,
    top5_apuestas: null,
    pred_over25: 'Under 2.5', pred_btts: 'No',
    analisis_completo: null, tiene_lesiones: null, tiene_suspension: null, hay_noticias_impacto: null,
  },
  {
    id: 'premium-3', created_at: new Date().toISOString(),
    partido: 'FRANCE vs GERMANY', fecha: '2026-06-21', hora: '15:30',
    ronda: 'Matchday 10', grupo: 'A', equipo1: 'FRANCE', equipo2: 'GERMANY',
    prob_equipo1: 48.0, prob_empate: 22.0, prob_equipo2: 30.0,
    resultado_predicho: 'FRANCE', confianza: 'Alta',
    prob_over25: 72.0, prob_btts: 65.0, lambda1: 2.5, lambda2: 1.2,
    elo1: 2100, elo2: 1950, cuota1: 1.95, cuota_empate: 3.8, cuota2: 4.5,
    prob_impl1: 51.3, prob_impl_empate: 26.3, prob_impl2: 22.4,
    resultado_real: null, goles_equipo1: null, goles_equipo2: null, acierto: null,
    corners_avg: 6.1, amarillas_avg: 2.8, tiros_avg: 16.4,
    top5_apuestas: null,
    pred_over25: 'Over 2.5', pred_btts: 'Yes',
    analisis_completo: null, tiene_lesiones: null, tiene_suspension: null, hay_noticias_impacto: null,
  },
  {
    id: 'premium-4', created_at: new Date().toISOString(),
    partido: 'BRAZIL vs ARGENTINA', fecha: '2026-06-22', hora: '20:00',
    ronda: 'World Qualifiers', grupo: '', equipo1: 'BRAZIL', equipo2: 'ARGENTINA',
    prob_equipo1: 55.0, prob_empate: 25.0, prob_equipo2: 20.0,
    resultado_predicho: 'BRAZIL', confianza: 'Alta',
    prob_over25: 58.0, prob_btts: 55.0, lambda1: 1.9, lambda2: 1.1,
    elo1: 2080, elo2: 2120, cuota1: 1.85, cuota_empate: 3.5, cuota2: 5.2,
    prob_impl1: 54.1, prob_impl_empate: 28.6, prob_impl2: 17.3,
    resultado_real: null, goles_equipo1: null, goles_equipo2: null, acierto: null,
    corners_avg: 5.5, amarillas_avg: 5.1, tiros_avg: 13.8,
    top5_apuestas: null,
    pred_over25: 'Over 2.5', pred_btts: 'Yes',
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
