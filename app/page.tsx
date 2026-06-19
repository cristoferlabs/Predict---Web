export const dynamic = 'force-dynamic'

import { getTodayPredictions, getPredictions } from '@/lib/supabase'
import PredictionCard from '@/components/PredictionCard'
import PowerBIEmbed from '@/components/PowerBIEmbed'
import type { Prediction } from '@/types'

export const revalidate = 60 // revalidate every 60s

// Demo data for when Supabase is not configured
const DEMO: Prediction[] = [
  {
    id: 'demo-1',
    created_at: new Date().toISOString(),
    partido: 'Scotland vs Morocco',
    fecha: '2026-06-19',
    hora: '18:00',
    ronda: 'Matchday 9',
    grupo: 'C',
    equipo1: 'Scotland',
    equipo2: 'Morocco',
    prob_equipo1: 34.9,
    prob_empate: 34.5,
    prob_equipo2: 30.6,
    resultado_predicho: 'Scotland',
    confianza: 'Baja',
    prob_over25: 23.3,
    prob_btts: 31.8,
    lambda1: 0.87,
    lambda2: 0.79,
    elo1: 1848,
    elo2: 1945,
    cuota1: 5.38,
    cuota_empate: 3.6,
    cuota2: 1.73,
    prob_impl1: 18.6,
    prob_impl_empate: 27.8,
    prob_impl2: 57.8,
    resultado_real: null,
    goles_equipo1: null,
    goles_equipo2: null,
    acierto: null,
    corners_avg: 5.2,
    amarillas_avg: 3.1,
    tiros_avg: 11.4,
    top5_apuestas: [
      { mercado: 'Doble Oportunidad 1X', probabilidad: 69, riesgo: 'Medio' },
      { mercado: 'Under 2.5 Goles', probabilidad: 77, riesgo: 'Bajo' },
      { mercado: 'Menos de 4.5 corners (c/equipo)', probabilidad: 71, riesgo: 'Bajo' },
      { mercado: 'Ambos marcan: No', probabilidad: 68, riesgo: 'Medio' },
      { mercado: 'Menos de 3.5 amarillas', probabilidad: 55, riesgo: 'Medio' },
    ],
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
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🏆</span>
          <div>
            <h1 className="text-3xl font-black">
              <span className="text-gradient">Mundial 2026</span>
            </h1>
            <p className="text-slate-400 capitalize">{today}</p>
          </div>
        </div>
        <p className="text-slate-400 max-w-xl">
          Predicciones generadas con IA, modelo XGBoost + Poisson + Elo entrenado sobre 45,000 partidos históricos.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Partidos hoy', value: predictions.length },
          { label: 'Modelo activo', value: 'XGB+Elo' },
          { label: 'Actualizado', value: 'Hace <1 min' },
        ].map((s) => (
          <div key={s.label} className="bg-surface-700 border border-surface-500 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-brand-gold">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Prediction grid */}
      <h2 className="text-lg font-bold text-white mb-4">Predicciones del día</h2>
      {predictions.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">⚽</p>
          <p>No hay partidos predichos para hoy</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
          {predictions.map((p) => (
            <PredictionCard key={p.id} p={p} />
          ))}
        </div>
      )}

      {/* Power BI section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">📊 Analytics Power BI</h2>
          <a
            href="/analytics"
            className="text-sm text-brand-gold hover:underline"
          >
            Ver dashboard completo →
          </a>
        </div>
        <PowerBIEmbed height={480} title="Predicciones Mundial 2026" />
      </div>
    </div>
  )
}
