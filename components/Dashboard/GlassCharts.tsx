'use client'
import { AreaChart, Area, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Activity } from 'lucide-react'
import type { Prediction } from '@/types'

interface ChartProps {
  predictions: Prediction[]
}

export function HitRateAccuracy({ predictions }: ChartProps) {
  // Each cell = one prediction; color by acierto field
  const cells = predictions.length > 0 ? predictions : []
  const total    = cells.length
  const aciertos = cells.filter(p => p.acierto === true).length
  const pct      = total > 0 ? Math.round((aciertos / total) * 100) : 0

  const cellColor = (p: Prediction) => {
    if (p.acierto === true)  return 'rgba(52,211,153,0.7)'   // green
    if (p.acierto === false) return 'rgba(248,113,113,0.4)'  // red
    return 'rgba(255,255,255,0.07)'                          // pending
  }

  return (
    <div className="glass rounded-[24px] p-8 space-y-6 col-span-1">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Hit Rate Accuracy</h3>
        <Activity className="text-brand-blue w-4 h-4" />
      </div>

      {total === 0 ? (
        <p className="text-white/20 text-xs text-center py-8">Sin predicciones</p>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-2">
            {cells.slice(0, 28).map((p, i) => (
              <div
                key={p.id + i}
                className="aspect-square rounded-sm transition-opacity hover:opacity-100"
                style={{ background: cellColor(p) }}
                title={`${p.partido}: ${p.acierto === true ? '✓' : p.acierto === false ? '✗' : '?'}`}
              />
            ))}
            {/* Pad to full 28 cells */}
            {Array.from({ length: Math.max(0, 28 - cells.slice(0, 28).length) }).map((_, i) => (
              <div key={'pad' + i} className="aspect-square rounded-sm" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">
              {aciertos}/{total} aciertos
            </span>
            <span className="text-[10px] font-mono font-bold" style={{ color: pct >= 60 ? '#34d399' : pct >= 40 ? '#fbbf24' : '#f87171' }}>
              {pct}%
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export function ModelVsMarketAlpha({ predictions }: ChartProps) {
  const data = predictions
    .filter(p => p.cuota1 != null && (p.prob_equipo1 ?? 0) > 0)
    .map(p => ({
      fecha:   p.fecha?.slice(5) ?? p.hora,
      modelo:  +(p.prob_equipo1 ?? 0).toFixed(1),
      mercado: +(p.prob_impl1   ?? 0).toFixed(1),
      partido: p.partido,
    }))

  return (
    <div className="glass rounded-[24px] p-8 space-y-6 col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Model vs Market Alpha</h3>
        <div className="flex gap-4 text-[9px] font-mono uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-blue" /> Modelo</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white/20" /> Mercado</div>
        </div>
      </div>

      {data.length < 2 ? (
        <p className="text-white/20 text-xs text-center py-16">
          Sin suficientes datos para el gráfico
        </p>
      ) : (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorModelo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--brand-blue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--brand-blue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="fecha" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#14171c', border: '1px solid #232830', borderRadius: 10, fontSize: 11 }}
                labelStyle={{ color: '#9aa1ab' }}
                formatter={(val: number, key: string) => [`${val}%`, key === 'modelo' ? 'Modelo' : 'Mercado']}
              />
              <Area
                type="monotone"
                dataKey="modelo"
                stroke="var(--brand-blue)"
                fillOpacity={1}
                fill="url(#colorModelo)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="mercado"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
