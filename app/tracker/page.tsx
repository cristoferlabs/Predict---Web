import { getPredictions } from '@/lib/supabase'
import type { Prediction } from '@/types'
import clsx from 'clsx'

export const revalidate = 300

async function fetchHistory(): Promise<Prediction[]> {
  try {
    const all = await getPredictions()
    return all.filter((p) => p.resultado_real !== null)
  } catch {
    return []
  }
}

export default async function TrackerPage() {
  const history = await fetchHistory()
  const total = history.length
  const aciertos = history.filter((p) => p.acierto).length
  const pct = total > 0 ? Math.round((aciertos / total) * 100) : 0

  const byConfianza = { Alta: { t: 0, a: 0 }, Media: { t: 0, a: 0 }, Baja: { t: 0, a: 0 } }
  for (const p of history) {
    const c = p.confianza as keyof typeof byConfianza
    if (byConfianza[c]) {
      byConfianza[c].t++
      if (p.acierto) byConfianza[c].a++
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-white mb-2">📈 Tracker de Precisión</h1>
      <p className="text-slate-400 mb-8">Historial de predicciones vs resultados reales</p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-surface-700 border border-surface-500 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-brand-gold">{pct}%</p>
          <p className="text-xs text-slate-500 mt-1">Precisión global</p>
        </div>
        <div className="bg-surface-700 border border-surface-500 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-white">{total}</p>
          <p className="text-xs text-slate-500 mt-1">Partidos evaluados</p>
        </div>
        <div className="bg-surface-700 border border-surface-500 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-green-400">{aciertos}</p>
          <p className="text-xs text-slate-500 mt-1">Aciertos</p>
        </div>
        <div className="bg-surface-700 border border-surface-500 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-red-400">{total - aciertos}</p>
          <p className="text-xs text-slate-500 mt-1">Errores</p>
        </div>
      </div>

      {/* By confidence */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {(Object.entries(byConfianza) as [string, { t: number; a: number }][]).map(([level, { t, a }]) => {
          const p = t > 0 ? Math.round((a / t) * 100) : 0
          return (
            <div key={level} className="bg-surface-700 border border-surface-500 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={clsx(
                  'text-xs font-bold px-2 py-0.5 rounded-full uppercase',
                  level === 'Alta' ? 'bg-green-900/60 text-green-400' :
                  level === 'Media' ? 'bg-yellow-900/60 text-yellow-400' :
                  'bg-red-900/60 text-red-400'
                )}>{level}</span>
                <span className="text-lg font-black text-white">{p}%</span>
              </div>
              <p className="text-xs text-slate-500">{a}/{t} aciertos</p>
              <div className="mt-2 h-1.5 bg-surface-600 rounded-full">
                <div className="h-full bg-brand-gold rounded-full" style={{ width: `${p}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* History table */}
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Historial</h2>
      {history.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">⚽</p>
          <p>Aún no hay partidos con resultado real registrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 bg-surface-700 border border-surface-500 rounded-xl px-4 py-3"
            >
              <span className={clsx('text-lg', p.acierto ? '✅' : '❌')}>
                {p.acierto ? '✅' : '❌'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{p.partido}</p>
                <p className="text-xs text-slate-500">{p.fecha} · {p.ronda}</p>
              </div>
              <div className="text-center hidden sm:block">
                <p className="text-xs text-slate-500">Predicción</p>
                <p className="text-sm font-bold text-brand-gold">{p.resultado_predicho}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Real</p>
                <p className="text-sm font-bold text-white">
                  {p.goles_equipo1} - {p.goles_equipo2}
                </p>
              </div>
              <span className={clsx(
                'text-xs font-bold px-2 py-0.5 rounded-full',
                p.confianza === 'Alta' ? 'bg-green-900/60 text-green-400' :
                p.confianza === 'Media' ? 'bg-yellow-900/60 text-yellow-400' :
                'bg-red-900/60 text-red-400'
              )}>{p.confianza}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
