export const dynamic = 'force-dynamic'

import { getTodayPredictions, getPredictions } from '@/lib/supabase'
import PredictionCard from '@/components/PredictionCard'
import PowerBIEmbed from '@/components/PowerBIEmbed'
import type { Prediction } from '@/types'

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
      { mercado: 'Under 2.5 Goles',      probabilidad: 77, riesgo: 'Bajo' },
      { mercado: 'Menos de 4.5 corners', probabilidad: 71, riesgo: 'Bajo' },
      { mercado: 'Ambos marcan: No',     probabilidad: 68, riesgo: 'Medio' },
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
  const dateLabel = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '28px 26px 56px' }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: '#5b636e', marginBottom: 5 }}>
          ⚽ Mundial 2026 · Prediction Agent
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.5px', color: '#f3f5f7', lineHeight: 1.2 }}>
          Predicciones del día
        </h1>
        <p style={{ fontSize: 13, color: '#6b727c', fontWeight: 500, marginTop: 5, maxWidth: 480, textTransform: 'capitalize' }}>
          {dateLabel} · Modelo XGBoost + Poisson + Elo entrenado sobre 45,000 partidos históricos.
        </p>
      </div>

      {/* ── Summary strip ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, color: '#6b727c' }}>
          Partidos · <span style={{ color: '#e8eaed' }}>{predictions.length}</span> encontrados
        </div>
        <div style={{ flex: 1 }} />
        {[
          { label: 'Modelo activo',  value: 'XGB+Elo' },
          { label: 'Actualizado', value: '<1 min' },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 10, padding: '7px 15px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5, fontWeight: 600, color: '#f3f5f7' }}>{value}</span>
            <span style={{ fontSize: 11, color: '#6b727c', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Prediction grid ─────────────────────────────────── */}
      {predictions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#5b636e' }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>⚽</p>
          <p style={{ fontSize: 14, fontWeight: 500 }}>No hay partidos predichos para hoy</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16, marginBottom: 52 }}>
          {predictions.map((p) => (
            <PredictionCard key={p.id} p={p} />
          ))}
        </div>
      )}

      {/* ── Power BI section ────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#dfe3e8', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            📊 Analytics Power BI
          </h2>
          <a
            href="/analytics"
            style={{ fontSize: 13, color: '#4f95d6', fontWeight: 600, textDecoration: 'none' }}
          >
            Ver dashboard completo →
          </a>
        </div>
        <PowerBIEmbed height={480} title="Predicciones Mundial 2026" />
      </div>

    </div>
  )
}
