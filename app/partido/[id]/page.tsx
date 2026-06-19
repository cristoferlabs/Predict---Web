import { getPredictionById, getPredictions } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { ModelVsMarketChart, TeamRadarChart, AlternativeMarketsChart } from '@/components/MatchCharts'
import ExportButton from '@/components/ExportButton'
import clsx from 'clsx'

export async function generateStaticParams() {
  try {
    const preds = await getPredictions()
    return preds.map((p) => ({ id: p.id }))
  } catch {
    return []
  }
}

export default async function PartidoPage({ params }: { params: { id: string } }) {
  let prediction = null
  try {
    prediction = await getPredictionById(params.id)
  } catch {}

  if (!prediction) notFound()
  const p = prediction

  const leader =
    p.prob_equipo1 >= p.prob_empate && p.prob_equipo1 >= p.prob_equipo2
      ? p.equipo1
      : p.prob_equipo2 >= p.prob_empate && p.prob_equipo2 >= p.prob_equipo1
      ? p.equipo2
      : 'Empate'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Export button */}
      <div className="flex justify-end mb-4">
        <ExportButton targetId="partido-detail" filename={`prediccion-${p.partido}`} />
      </div>

      <div id="partido-detail" className="space-y-6">
        {/* Match header */}
        <div className="bg-surface-700 border border-surface-500 rounded-2xl p-6">
          <div className="text-center mb-6">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
              {p.ronda} · {p.fecha} {p.hora}
            </p>
            <div className="flex items-center justify-center gap-6 mt-3">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{p.equipo1}</p>
                <p className="text-sm text-slate-400">λ = {p.lambda1}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-surface-500">VS</p>
                {p.resultado_real !== null && (
                  <p className="text-xl font-bold text-brand-gold mt-1">
                    {p.goles_equipo1} - {p.goles_equipo2}
                  </p>
                )}
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{p.equipo2}</p>
                <p className="text-sm text-slate-400">λ = {p.lambda2}</p>
              </div>
            </div>
          </div>

          {/* 1X2 probabilities */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: p.equipo1, prob: p.prob_equipo1, isLeader: leader === p.equipo1 },
              { label: 'Empate', prob: p.prob_empate, isLeader: leader === 'Empate' },
              { label: p.equipo2, prob: p.prob_equipo2, isLeader: leader === p.equipo2 },
            ].map(({ label, prob, isLeader }) => (
              <div
                key={label}
                className={clsx(
                  'rounded-xl p-4 text-center border',
                  isLeader
                    ? 'bg-brand-gold/10 border-brand-gold/50'
                    : 'bg-surface-600 border-surface-500'
                )}
              >
                <p className={clsx('text-3xl font-black', isLeader ? 'text-brand-gold' : 'text-white')}>
                  {prob.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400 mt-1 truncate">{label}</p>
                {isLeader && <p className="text-xs text-brand-gold font-semibold mt-1">★ Predicción</p>}
              </div>
            ))}
          </div>

          {/* Confidence + Over/BTTS */}
          <div className="flex flex-wrap gap-3 mt-4">
            <span className={clsx(
              'px-3 py-1 rounded-full text-sm font-bold',
              p.confianza === 'Alta' ? 'bg-green-900/60 text-green-400' :
              p.confianza === 'Media' ? 'bg-yellow-900/60 text-yellow-400' :
              'bg-red-900/60 text-red-400'
            )}>
              Confianza {p.confianza}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-surface-600 text-slate-300">
              Over 2.5: {p.prob_over25.toFixed(0)}%
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-surface-600 text-slate-300">
              BTTS: {p.prob_btts.toFixed(0)}%
            </span>
            {p.elo1 && (
              <span className="px-3 py-1 rounded-full text-sm bg-surface-600 text-slate-300">
                Elo: {p.elo1} vs {p.elo2}
              </span>
            )}
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ModelVsMarketChart p={p} />
          <TeamRadarChart p={p} />
        </div>

        {/* Alternative markets */}
        <AlternativeMarketsChart p={p} />

        {/* Cuotas de mercado detail */}
        {p.cuota1 && (
          <div className="bg-surface-700 border border-surface-500 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
              💰 Cuotas de Mercado
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: p.equipo1, cuota: p.cuota1, impl: p.prob_impl1 },
                { label: 'Empate', cuota: p.cuota_empate, impl: p.prob_impl_empate },
                { label: p.equipo2, cuota: p.cuota2, impl: p.prob_impl2 },
              ].map(({ label, cuota, impl }) => (
                <div key={label} className="bg-surface-600 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 truncate">{label}</p>
                  <p className="text-2xl font-black text-white">{cuota?.toFixed(2)}</p>
                  <p className="text-xs text-brand-blue mt-1">{impl?.toFixed(1)}% impl.</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
