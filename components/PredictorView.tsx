'use client'
import { useState, useMemo } from 'react'
import type { Prediction } from '@/types'
import SummaryGrid from './Dashboard/SummaryGrid'
import PredictionsTable from './Dashboard/PredictionsTable'
import DeepAnalysis from './Dashboard/DeepAnalysis'

// ─── Combinations Logic ─────────────────────────────────────────────────────

function buildCombos(predictions: Prediction[]) {
  const alta  = predictions.filter(p => p.confianza === 'Alta')
  const media = predictions.filter(p => p.confianza === 'Media')

  const getWinnerLabel = (p: Prediction) => {
    const e1 = p.prob_equipo1 ?? 0, em = p.prob_empate ?? 0, e2 = p.prob_equipo2 ?? 0
    if (e1 >= em && e1 >= e2) return `${p.equipo1} gana`
    if (e2 >= em && e2 >= e1) return `${p.equipo2} gana`
    return 'Empate'
  }

  const getWinnerOdd = (p: Prediction) => {
    const e1 = p.prob_equipo1 ?? 0, em = p.prob_empate ?? 0, e2 = p.prob_equipo2 ?? 0
    if (e1 >= em && e1 >= e2) return p.cuota1 ?? 1.8
    if (e2 >= em && e2 >= e1) return p.cuota2 ?? 2.1
    return p.cuota_empate ?? 3.2
  }

  const mkCombo = (
    title: string, sub: string, tag: string,
    tagColor: string, tagBg: string,
    legs: { match: string; pick: string; odd: number }[]
  ) => {
    if (!legs.length) return null
    const totalOdd = legs.reduce((acc, l) => acc * l.odd, 1)
    const prob = 100 / totalOdd
    return {
      title, sub, tag, tagColor, tagBg, legs: legs.map(l => ({ ...l, odd: l.odd.toFixed(2) })),
      totalOdd: totalOdd.toFixed(2),
      prob: prob.toFixed(1) + '%',
      probColor: prob > 40 ? 'text-terminal-green' : prob > 25 ? 'text-terminal-yellow' : 'text-terminal-text-secondary',
    }
  }

  const toLegs = (ps: Prediction[]) =>
    ps.slice(0, 3).map(p => ({ match: p.partido, pick: getWinnerLabel(p), odd: getWinnerOdd(p) }))

  return [
    mkCombo('Combinada Segura', '3 picks · confianza alta', 'SEGURA', 'text-terminal-green', 'bg-terminal-green/10', toLegs(alta)),
    mkCombo('Combinada Valor', '3 picks · confianza media-alta', 'VALOR', 'text-terminal-yellow', 'bg-terminal-yellow/10', toLegs([...alta.slice(0, 1), ...media.slice(0, 2)])),
  ].filter(Boolean)
}

// ─── Main View ─────────────────────────────────────────────────────────────

interface Props {
  predictions: Prediction[]
  dateDefault: string
}

export default function PredictorView({ predictions, dateDefault }: Props) {
  const [selectedId, setSelectedId] = useState(predictions[0]?.id ?? '')
  const [activeTab, setActiveTab] = useState('todas')
  const [activeDate, setActiveDate] = useState('Today')

  const combos = useMemo(() => buildCombos(predictions), [predictions])

  const filtered = useMemo(() => {
    let list = predictions
    if (activeTab === 'seguras') list = list.filter(p => p.confianza === 'Alta')
    if (activeTab === 'medias')  list = list.filter(p => p.confianza === 'Media')
    return list
  }, [predictions, activeTab])

  const selectedMatch = useMemo(() => {
    return filtered.find(p => p.id === selectedId) || filtered[0] || predictions[0]
  }, [filtered, predictions, selectedId])

  const showCombos = activeTab === 'combinaciones'

  const tabs = [
    { id: 'todas',         label: 'Todas',         count: predictions.length, color: 'border-terminal-blue' },
    { id: 'seguras',       label: 'Seguras',        count: predictions.filter(p => p.confianza === 'Alta').length, color: 'border-terminal-green' },
    { id: 'medias',        label: 'Medias',         count: predictions.filter(p => p.confianza === 'Media').length, color: 'border-terminal-yellow' },
    { id: 'combinaciones', label: 'Combinaciones',  count: combos.length, color: 'border-terminal-blue' },
  ]

  return (
    <main className="p-6 max-w-[1600px] mx-auto w-full flex flex-col min-h-screen relative z-10">
      <SummaryGrid />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-[11px] uppercase font-bold tracking-[0.25em] text-terminal-text-secondary flex items-center space-x-2">
              <span className="w-1 h-3 bg-terminal-blue shadow-[0_0_8px_var(--accent-blue)]" />
              <span>Market Intelligence & Analysis</span>
            </h2>
            
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all rounded-sm border whitespace-nowrap ${
                    activeTab === t.id 
                      ? `${t.color} bg-terminal-card text-terminal-text-primary shadow-[0_0_10px_rgba(58,160,255,0.05)]` 
                      : 'border-terminal-border text-terminal-text-secondary hover:border-terminal-border/80'
                  }`}
                >
                  {t.label} <span className="ml-1 opacity-50">{t.count}</span>
                </button>
              ))}
            </div>
          </div>

          {showCombos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {combos.map((cb: any, i) => (
                <div key={i} className="bg-terminal-card border border-terminal-border rounded-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-terminal-border flex justify-between items-center bg-black/20">
                    <div>
                      <h3 className="text-xs font-bold text-terminal-text-primary uppercase tracking-wider">{cb.title}</h3>
                      <p className="text-[10px] text-terminal-text-secondary mt-1">{cb.sub}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-sm text-[9px] font-bold ${cb.tagColor} ${cb.tagBg}`}>{cb.tag}</span>
                  </div>
                  <div className="p-4 flex-grow space-y-3">
                    {cb.legs.map((lg: any, j: number) => (
                      <div key={j} className="flex justify-between items-center border-b border-terminal-border/30 pb-2 last:border-0 last:pb-0">
                        <div className="min-w-0 flex-grow pr-4">
                          <p className="text-[11px] font-bold text-terminal-text-primary truncate uppercase">{lg.match}</p>
                          <p className="text-[10px] text-terminal-blue font-medium mt-0.5">{lg.pick}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-terminal-green">{lg.odd}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-terminal-alt border-t border-terminal-border flex justify-between items-end">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-terminal-text-secondary mb-1">Total Odds</p>
                      <p className="text-2xl font-mono font-bold text-terminal-text-primary tracking-tighter">{cb.totalOdd}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-bold text-terminal-text-secondary mb-1">Model Prob</p>
                      <p className={`text-sm font-mono font-bold ${cb.probColor}`}>{cb.prob}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PredictionsTable 
              predictions={filtered} 
              selectedId={selectedId} 
              onSelect={setSelectedId} 
            />
          )}
        </div>

        {!showCombos && (
          <div className="w-full lg:w-96 shrink-0">
            {selectedMatch ? (
              <DeepAnalysis prediction={selectedMatch} />
            ) : (
              <div className="bg-terminal-card border border-terminal-border p-12 text-center rounded-sm">
                <span className="text-terminal-text-secondary text-[11px] uppercase tracking-widest font-mono">
                  Select a match for deep analysis
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer className="mt-12 py-8 border-t border-terminal-border flex justify-between items-center opacity-30 pointer-events-none">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em]">PitchIQ Terminal v1.1.0</span>
        <span className="text-[9px] font-mono uppercase tracking-[0.3em]">© 2026 PRO_SYSTEMS_INTL</span>
      </footer>
    </main>
  )
}
