'use client'
import type { Prediction } from '@/types'

interface AlternativeMarketsProps {
  prediction: Prediction
}

export default function AlternativeMarkets({ prediction }: AlternativeMarketsProps) {
  const markets = [
    { label: 'OVER 2.5 GOALS', prob: prediction.prob_over25, odd: 1.85, risk: 'ALTA' },
    { label: 'BTTS - YES', prob: prediction.prob_btts, odd: 1.95, risk: 'MEDIA' },
    { label: 'TEAM 1 TO WIN', prob: prediction.prob_equipo1, odd: 2.10, risk: 'ALTA' },
  ]

  return (
    <section className="glass rounded-[24px] p-8 space-y-6 col-span-1 lg:col-span-3">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Quantum Strategy: Alternative Markets</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {markets.map((m, i) => (
          <div key={i} className="flex items-center justify-between p-5 glass rounded-2xl border-white/5 group cursor-pointer hover:border-brand-blue/30 transition-all active:scale-[0.98]">
            <div className="space-y-1">
              <p className="text-[11px] font-bold tracking-tight text-white/90 uppercase">{m.label}</p>
              <p className="text-[10px] text-white/40 font-medium tracking-wide">Probability: {m.prob?.toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold tracking-widest ${
                m.risk === 'ALTA' ? 'bg-brand-blue/10 text-brand-blue' : 'bg-white/5 text-white/40'
              }`}>
                {m.risk}
              </span>
              <p className="font-mono text-sm mt-1 font-bold text-white">{m.odd.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
