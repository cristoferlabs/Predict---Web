'use client'
import type { Prediction } from '@/types'

const n = (v: number | null | undefined, d = 1) => (v ?? 0).toFixed(d)

interface AlternativeMarketsProps {
  prediction: Prediction | null | undefined
}

export default function AlternativeMarkets({ prediction: p }: AlternativeMarketsProps) {
  if (!p) return null

  const confColor = p.confianza === 'Alta' ? 'bg-brand-blue/10 text-brand-blue'
                  : p.confianza === 'Media' ? 'bg-brand-gold/10 text-brand-gold'
                  :                           'bg-white/5 text-white/40'

  const markets = [
    {
      label: 'OVER 2.5 GOLES',
      sub:   p.pred_over25 ?? 'Over 2.5',
      prob:  p.prob_over25 ?? 0,
      odd:   null as number | null,
      show:  (p.prob_over25 ?? 0) > 0,
    },
    {
      label: 'BTTS',
      sub:   p.pred_btts ?? 'Sí',
      prob:  p.prob_btts ?? 0,
      odd:   null as number | null,
      show:  (p.prob_btts ?? 0) > 0,
    },
    {
      label: `${p.equipo1 || 'LOCAL'} GANA`,
      sub:   p.resultado_predicho || p.equipo1,
      prob:  p.prob_equipo1 ?? 0,
      odd:   p.cuota1,
      show:  (p.prob_equipo1 ?? 0) > 0,
    },
  ]

  const visible = markets.filter(m => m.show)

  return (
    <section className="glass rounded-[24px] p-8 space-y-6 col-span-1 lg:col-span-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          Quantum Strategy · Mercados Alternativos
        </h3>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest ${confColor}`}>
          {p.confianza}
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="text-white/20 text-xs text-center py-6">Sin datos de mercado disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-5 glass rounded-2xl border-white/5 group cursor-pointer hover:border-brand-blue/30 transition-all active:scale-[0.98]"
            >
              <div className="space-y-1">
                <p className="text-[11px] font-bold tracking-tight text-white/90 uppercase">{m.label}</p>
                <p className="text-[10px] text-white/40 font-medium tracking-wide">{m.sub}</p>
                <p className="text-[10px] text-white/30 font-mono">Prob: {n(m.prob)}%</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold tracking-widest ${confColor}`}>
                  {p.confianza}
                </span>
                {m.odd != null && (
                  <p className="font-mono text-sm mt-1 font-bold text-white">{n(m.odd, 2)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
