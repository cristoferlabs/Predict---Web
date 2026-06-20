'use client'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { Prediction } from '@/types'

const n = (v: number | null | undefined, d = 2) => (v ?? 0).toFixed(d)

function TeamAvatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center border border-white/10 shadow-inner text-3xl font-bold uppercase tracking-tight"
      style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)`, color }}
    >
      {name.slice(0, 2)}
    </div>
  )
}

interface HeroPredictionProps {
  prediction: Prediction
}

export default function HeroPrediction({ prediction: p }: HeroPredictionProps) {
  const winProb = Math.max(p.prob_equipo1 ?? 0, p.prob_empate ?? 0, p.prob_equipo2 ?? 0)
  const chartData = [
    { name: 'Win', value: winProb },
    { name: 'Rest', value: Math.max(0, 100 - winProb) },
  ]

  // First non-header, non-empty line from analisis_completo as subtitle
  const analisisFirstLine = p.analisis_completo
    ?.split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('📊') && !l.startsWith('→') && l.length > 20)
    [0] ?? null

  const eloDiff = (p.elo1 ?? 0) - (p.elo2 ?? 0)
  const hasLambda = p.lambda1 != null && p.lambda2 != null && (p.lambda1 > 0 || p.lambda2 > 0)
  const hasOdds   = p.cuota1 != null && p.cuota1 > 0

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Predicción destacada</h2>
        <span className={`px-3 py-1 glass rounded-full text-[10px] font-medium uppercase tracking-wider ${
          p.confianza === 'Alta'  ? 'border-brand-gold/20 text-brand-gold' :
          p.confianza === 'Media' ? 'border-brand-blue/20 text-brand-blue' :
                                    'border-white/10 text-white/40'
        }`}>
          Confianza {p.confianza}
        </span>
      </div>

      <div className="glass rounded-[32px] p-10 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden group">
        <div className="flex-1 space-y-8 relative z-10">
          {/* Teams */}
          <div className="flex items-center gap-12">
            <div className="text-center space-y-3">
              <TeamAvatar name={p.equipo1} color="#4f95d6" />
              <h3 className="font-bold text-2xl tracking-tight uppercase">{p.equipo1}</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-white/30 font-mono">VS</span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <div className="text-center space-y-3">
              <TeamAvatar name={p.equipo2} color="#f0a868" />
              <h3 className="font-bold text-2xl tracking-tight uppercase">{p.equipo2}</h3>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              {analisisFirstLine ?? (
                <>
                  Predicción: <strong style={{ color: '#4f95d6' }}>{p.resultado_predicho}</strong>.
                  {eloDiff !== 0 && ` Diferencia Elo: ${Math.abs(eloDiff)} pts.`}
                </>
              )}
            </p>

            <div className="flex gap-4 flex-wrap">
              {/* Expected xG — only if lambda values exist */}
              {hasLambda && (
                <div className="glass px-4 py-2 rounded-xl">
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Expected xG</p>
                  <p className="font-mono text-lg">{n(p.lambda1)} <span className="text-white/20 text-xs">vs</span> {n(p.lambda2)}</p>
                </div>
              )}
              {/* Market Odds — only if available */}
              {hasOdds && (
                <div className="glass px-4 py-2 rounded-xl">
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Market Odds</p>
                  <p className="font-mono text-lg text-brand-blue">{n(p.cuota1)}</p>
                </div>
              )}
              {/* Match info */}
              <div className="glass px-4 py-2 rounded-xl">
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Partido</p>
                <p className="font-mono text-sm text-white/70">{p.hora} · {p.fecha}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Donut chart */}
        <div className="flex items-center gap-12 relative z-10">
          <div className="relative w-[240px] h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={100}
                  startAngle={225}
                  endAngle={-45}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  <Cell fill="var(--brand-blue)" />
                  <Cell fill="rgba(255,255,255,0.05)" stroke="none" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-mono tracking-tighter">
                {winProb.toFixed(0)}<span className="text-xl">%</span>
              </span>
              <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold">Win Prob</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
