'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
  Cell
} from 'recharts'
import type { Prediction } from '@/types'

const GOLD = '#F5A623'
const BLUE = '#1A8FFF'
const GRAY = '#64748B'

// Model vs Market comparison bar chart
export function ModelVsMarketChart({ p }: { p: Prediction }) {
  if (!p.prob_impl1) return null

  const data = [
    {
      name: p.equipo1,
      Modelo: p.prob_equipo1.toFixed(1),
      Mercado: p.prob_impl1?.toFixed(1) ?? 0,
    },
    {
      name: 'Empate',
      Modelo: p.prob_empate.toFixed(1),
      Mercado: p.prob_impl_empate?.toFixed(1) ?? 0,
    },
    {
      name: p.equipo2,
      Modelo: p.prob_equipo2.toFixed(1),
      Mercado: p.prob_impl2?.toFixed(1) ?? 0,
    },
  ]

  return (
    <div className="bg-surface-700 rounded-2xl p-5 border border-surface-500">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
        📊 Modelo vs Mercado
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" />
          <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[0, 100]} unit="%" />
          <Tooltip
            contentStyle={{ background: '#1C2333', border: '1px solid #2E384D', borderRadius: 8 }}
            labelStyle={{ color: '#E2E8F0' }}
            formatter={(v: number) => `${v}%`}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
          <Bar dataKey="Modelo" fill={GOLD} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Mercado" fill={BLUE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Radar chart for team profile
export function TeamRadarChart({ p }: { p: Prediction }) {
  const data = [
    { subject: 'Elo', A: Math.min(100, (p.elo1 / 2100) * 100), B: Math.min(100, (p.elo2 / 2100) * 100) },
    { subject: 'Ataque λ', A: Math.min(100, p.lambda1 * 25), B: Math.min(100, p.lambda2 * 25) },
    { subject: 'Prob Ganar', A: p.prob_equipo1, B: p.prob_equipo2 },
    { subject: 'Over 2.5', A: p.prob_over25, B: 100 - p.prob_over25 },
    { subject: 'BTTS', A: p.prob_btts, B: 100 - p.prob_btts },
  ]

  return (
    <div className="bg-surface-700 rounded-2xl p-5 border border-surface-500">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
        🎯 Perfil de Equipos
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
          <PolarGrid stroke="#252D3D" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
          <Radar name={p.equipo1} dataKey="A" stroke={GOLD} fill={GOLD} fillOpacity={0.2} />
          <Radar name={p.equipo2} dataKey="B" stroke={BLUE} fill={BLUE} fillOpacity={0.2} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Top 5 alternative markets
export function AlternativeMarketsChart({ p }: { p: Prediction }) {
  if (!p.top5_apuestas?.length) return null

  const riskColor = (r: string) =>
    r === 'Bajo' ? '#00C853' : r === 'Medio' ? '#F5A623' : '#FF3D57'

  return (
    <div className="bg-surface-700 rounded-2xl p-5 border border-surface-500">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
        🏆 Top 5 Apuestas
      </h3>
      <div className="space-y-3">
        {p.top5_apuestas.map((ap, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-brand-gold font-bold text-sm w-5">{i + 1}.</span>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-white">{ap.mercado}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{ap.probabilidad}%</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: riskColor(ap.riesgo) + '33', color: riskColor(ap.riesgo) }}
                  >
                    {ap.riesgo}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${ap.probabilidad}%`, background: riskColor(ap.riesgo) }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
