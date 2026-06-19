'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from 'recharts'
import type { Prediction } from '@/types'

const C_BLUE   = '#4f95d6'
const C_YELLOW = '#fbbf24'
const C_GREEN  = '#34d399'
const C_GRID   = '#1c2127'
const C_TICK   = '#7c8492'
const C_TT_BG  = '#14171c'
const C_TT_BR  = '#232830'

const n = (v: number | null | undefined, d = 1) => Number((v ?? 0).toFixed(d))

export function ModelVsMarketChart({ p }: { p: Prediction }) {
  if (!p.prob_impl1) return null

  const data = [
    { name: p.equipo1, Modelo: n(p.prob_equipo1), Mercado: n(p.prob_impl1) },
    { name: 'Empate',  Modelo: n(p.prob_empate),  Mercado: n(p.prob_impl_empate) },
    { name: p.equipo2, Modelo: n(p.prob_equipo2), Mercado: n(p.prob_impl2) },
  ]

  return (
    <div style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 16, padding: '18px 20px' }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>
        📊 Modelo vs Mercado
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke={C_GRID} />
          <XAxis dataKey="name" tick={{ fill: C_TICK, fontSize: 12, fontFamily: 'Public Sans, system-ui, sans-serif' }} />
          <YAxis tick={{ fill: C_TICK, fontSize: 11 }} domain={[0, 100]} unit="%" />
          <Tooltip
            contentStyle={{ background: C_TT_BG, border: `1px solid ${C_TT_BR}`, borderRadius: 10, fontFamily: 'IBM Plex Mono, monospace' }}
            labelStyle={{ color: '#e8eaed', fontFamily: 'Public Sans, system-ui, sans-serif' }}
            formatter={(v: number) => [`${v}%`]}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: C_TICK }} />
          <Bar dataKey="Modelo"  fill={C_YELLOW} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Mercado" fill={C_BLUE}   radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TeamRadarChart({ p }: { p: Prediction }) {
  const data = [
    { subject: 'Elo',       A: Math.min(100, ((p.elo1 ?? 0) / 2100) * 100), B: Math.min(100, ((p.elo2 ?? 0) / 2100) * 100) },
    { subject: 'Ataque λ',  A: Math.min(100, (p.lambda1 ?? 0) * 25),        B: Math.min(100, (p.lambda2 ?? 0) * 25) },
    { subject: 'Prob Ganar',A: p.prob_equipo1 ?? 0,                          B: p.prob_equipo2 ?? 0 },
    { subject: 'Over 2.5',  A: p.prob_over25 ?? 0,                          B: 100 - (p.prob_over25 ?? 0) },
    { subject: 'BTTS',      A: p.prob_btts ?? 0,                            B: 100 - (p.prob_btts ?? 0) },
  ]

  return (
    <div style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 16, padding: '18px 20px' }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>
        🎯 Perfil de Equipos
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
          <PolarGrid stroke={C_GRID} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: C_TICK, fontSize: 11, fontFamily: 'Public Sans, system-ui, sans-serif' }} />
          <Radar name={p.equipo1} dataKey="A" stroke={C_YELLOW} fill={C_YELLOW} fillOpacity={0.18} />
          <Radar name={p.equipo2} dataKey="B" stroke={C_BLUE}   fill={C_BLUE}   fillOpacity={0.18} />
          <Legend wrapperStyle={{ fontSize: 12, color: C_TICK }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AlternativeMarketsChart({ p }: { p: Prediction }) {
  if (!p.top5_apuestas?.length) return null

  const riskColor = (r: string) =>
    r === 'Bajo' ? C_GREEN : r === 'Medio' ? C_YELLOW : '#f87171'

  return (
    <div style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 16, padding: '18px 20px' }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>
        🏆 Top 5 Apuestas
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {p.top5_apuestas.map((ap, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: '#fbbf24', width: 18, flexShrink: 0 }}>{i + 1}.</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#dfe3e8' }}>{ap.mercado}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: '#f3f5f7' }}>{ap.probabilidad}%</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: riskColor(ap.riesgo) + '22', color: riskColor(ap.riesgo) }}>
                    {ap.riesgo}
                  </span>
                </div>
              </div>
              <div style={{ height: 5, background: '#1c2127', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, width: `${ap.probabilidad}%`, background: riskColor(ap.riesgo), transition: 'width .7s ease' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
