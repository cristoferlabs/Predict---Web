'use client'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { Prediction } from '@/types'

interface HeroPredictionProps {
  prediction: Prediction
}

export default function HeroPrediction({ prediction }: HeroPredictionProps) {
  const winProb = Math.max(prediction.prob_equipo1 ?? 0, prediction.prob_empate ?? 0, prediction.prob_equipo2 ?? 0)
  const data = [
    { name: 'Win', value: winProb },
    { name: 'Remaining', value: 100 - winProb },
  ]

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Prediction of the Week</h2>
        <span className="px-3 py-1 glass rounded-full text-[10px] border-brand-gold/20 text-brand-gold font-medium uppercase tracking-wider">
          {prediction.confianza} Confidence
        </span>
      </div>
      
      <div className="glass rounded-[32px] p-10 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden group">
        {/* Background Pattern */}
        <img 
          src="https://cdn.jsdelivr.net/npm/game-icons-transparent@latest/svgs/delapouite/nested-hexagons.svg" 
          className="absolute -left-20 -top-20 w-80 h-80 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700 pointer-events-none invert"
          alt=""
        />

        <div className="flex-1 space-y-8 relative z-10">
          <div className="flex items-center gap-12">
            <div className="text-center space-y-3">
              <div className="w-24 h-24 glass rounded-full flex items-center justify-center border-white/10 group-hover:border-brand-blue/30 transition-colors shadow-inner">
                <span className="text-4xl">🏴󠁧󠁢󠁳󠁣󠁴󠁿</span>
              </div>
              <h3 className="font-bold text-2xl tracking-tight uppercase">{prediction.equipo1}</h3>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-white/30 font-mono">VS</span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <div className="text-center space-y-3">
              <div className="w-24 h-24 glass rounded-full flex items-center justify-center border-white/10 group-hover:border-brand-blue/30 transition-colors shadow-inner">
                <span className="text-4xl">🇲🇦</span>
              </div>
              <h3 className="font-bold text-2xl tracking-tight uppercase">{prediction.equipo2}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              High-confidence model signals advantage for {prediction.resultado_predicho} playing today. 
              Elo disparity of {( (prediction.elo1 ?? 0) - (prediction.elo2 ?? 0) )} points and recent market shifts indicate significant value.
            </p>
            <div className="flex gap-4">
              <div className="glass px-4 py-2 rounded-xl">
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Expected xG</p>
                <p className="font-mono text-lg">{prediction.lambda1?.toFixed(2)} <span className="text-white/20 text-xs">vs</span> {prediction.lambda2?.toFixed(2)}</p>
              </div>
              <div className="glass px-4 py-2 rounded-xl">
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Market Odds</p>
                <p className="font-mono text-lg text-brand-blue">{prediction.cuota1?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12 relative z-10">
          <div className="relative w-[240px] h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
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
              <span className="text-4xl font-bold font-mono tracking-tighter">{winProb.toFixed(0)}<span className="text-xl">%</span></span>
              <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold">Win Prob</span>
            </div>
          </div>
          
          <button className="glass px-8 py-4 rounded-2xl border-brand-blue/40 text-brand-blue font-bold tracking-widest text-xs hover:bg-brand-blue hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(79,149,214,0.1)] active:scale-95 uppercase">
            View Analytics
          </button>
        </div>
      </div>
    </section>
  )
}
