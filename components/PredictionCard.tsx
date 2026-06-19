import Link from 'next/link'
import clsx from 'clsx'
import type { Prediction } from '@/types'

function ConfidenceBadge({ level }: { level: string }) {
  return (
    <span
      className={clsx(
        'text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
        level === 'Alta' && 'bg-green-900/60 text-green-400 badge-alta',
        level === 'Media' && 'bg-yellow-900/60 text-yellow-400 badge-media',
        level === 'Baja' && 'bg-red-900/60 text-red-400 badge-baja'
      )}
    >
      {level}
    </span>
  )
}

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span className="truncate max-w-[80px]">{label}</span>
        <span className="font-bold text-white">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full prob-bar', color)}
          style={{ '--target-width': `${value}%`, width: `${value}%` } as React.CSSProperties}
        />
      </div>
    </div>
  )
}

export default function PredictionCard({ p }: { p: Prediction }) {
  const winner =
    p.prob_equipo1 > p.prob_empate && p.prob_equipo1 > p.prob_equipo2
      ? 'equipo1'
      : p.prob_equipo2 > p.prob_empate && p.prob_equipo2 > p.prob_equipo1
      ? 'equipo2'
      : 'empate'

  return (
    <Link href={`/partido/${p.id}`}>
      <div className="prediction-card bg-surface-700 border border-surface-500 rounded-2xl p-5 cursor-pointer">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            {p.ronda} {p.grupo && `· Grupo ${p.grupo}`}
          </span>
          <ConfidenceBadge level={p.confianza} />
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-5">
          <div className={clsx('text-center flex-1', winner === 'equipo1' && 'text-brand-gold')}>
            <p className="font-bold text-lg leading-tight">{p.equipo1}</p>
            {winner === 'equipo1' && <span className="text-xs text-brand-gold">Favorito ★</span>}
          </div>

          <div className="text-center px-4">
            <p className="text-2xl font-black text-slate-600">VS</p>
            <p className="text-xs text-slate-500 mt-1">{p.hora}</p>
          </div>

          <div className={clsx('text-center flex-1', winner === 'equipo2' && 'text-brand-gold')}>
            <p className="font-bold text-lg leading-tight">{p.equipo2}</p>
            {winner === 'equipo2' && <span className="text-xs text-brand-gold">Favorito ★</span>}
          </div>
        </div>

        {/* Probability bars */}
        <div className="space-y-2 mb-4">
          <ProbBar label={p.equipo1} value={p.prob_equipo1} color="bg-brand-blue" />
          <ProbBar label="Empate" value={p.prob_empate} color="bg-slate-400" />
          <ProbBar label={p.equipo2} value={p.prob_equipo2} color="bg-brand-gold" />
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-500">
          <div className="text-center">
            <p className="text-xs text-slate-500">Over 2.5</p>
            <p className="text-sm font-bold text-white">{p.prob_over25.toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">BTTS</p>
            <p className="text-sm font-bold text-white">{p.prob_btts.toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">λ1 / λ2</p>
            <p className="text-sm font-bold text-white">{p.lambda1} / {p.lambda2}</p>
          </div>
          {p.resultado_real !== null && (
            <div className="text-center">
              <p className="text-xs text-slate-500">Resultado</p>
              <p className={clsx('text-sm font-bold', p.acierto ? 'text-green-400' : 'text-red-400')}>
                {p.goles_equipo1} - {p.goles_equipo2}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
