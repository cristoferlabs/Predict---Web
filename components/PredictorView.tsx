'use client'
import { useState, useMemo } from 'react'
import type { Prediction } from '@/types'
import { Activity, Search } from 'lucide-react'
import HeroPrediction from './Dashboard/HeroPrediction'
import FixtureCarousel from './Dashboard/FixtureCarousel'
import { HitRateAccuracy, ModelVsMarketAlpha } from './Dashboard/GlassCharts'
import AlternativeMarkets from './Dashboard/AlternativeMarkets'

interface Props {
  predictions: Prediction[]          // today — hero, hit-rate, alt-markets
  upcomingPredictions: Prediction[]  // next 7 days — fixture carousel
  predictionsWithOdds: Prediction[]  // all with odds — Model vs Market chart
  dateDefault: string
}

export default function PredictorView({ predictions, upcomingPredictions, predictionsWithOdds }: Props) {
  const [searchQuery, setSearchQuery] = useState('')

  const sortedByConfidence = useMemo(() => {
    const order: Record<string, number> = { Alta: 3, Media: 2, Baja: 1 }
    return [...predictions].sort((a, b) => (order[b.confianza] ?? 0) - (order[a.confianza] ?? 0))
  }, [predictions])

  const [selectedId, setSelectedId] = useState(sortedByConfidence[0]?.id ?? '')

  const selectedMatch = useMemo(
    () => predictions.find(p => p.id === selectedId) ?? sortedByConfidence[0] ?? null,
    [predictions, sortedByConfidence, selectedId]
  )

  const filteredPredictions = useMemo(() => {
    if (!searchQuery.trim()) return predictions
    const q = searchQuery.toLowerCase()
    return predictions.filter(
      p =>
        p.equipo1.toLowerCase().includes(q) ||
        p.equipo2.toLowerCase().includes(q) ||
        p.partido.toLowerCase().includes(q)
    )
  }, [predictions, searchQuery])

  return (
    <main className="relative min-h-screen px-6 lg:px-12 py-8 overflow-y-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center border-brand-blue/30 shadow-[0_0_20px_rgba(79,149,214,0.2)]">
            <Activity className="text-brand-blue w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">
              PREDICT<span className="text-brand-blue">WEB</span>
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
              Quantum Analytics Engine
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="glass px-5 py-2.5 rounded-full flex items-center gap-3 border-white/5 w-full md:w-auto min-w-[320px] transition-all focus-within:border-brand-blue/30 focus-within:shadow-[0_0_20px_rgba(79,149,214,0.1)]">
          <Search className="text-white/40 w-4 h-4 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar equipos o partidos..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/20 text-white/80"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-white/30 hover:text-white/60 text-xs shrink-0">✕</button>
          )}
        </div>
      </header>

      {/* Empty state */}
      {filteredPredictions.length === 0 && (
        <div className="text-center py-32 text-white/20">
          <p className="text-2xl mb-2">⚽</p>
          <p className="text-sm uppercase tracking-widest font-bold">
            {predictions.length === 0 ? 'Sin predicciones disponibles hoy' : 'Sin resultados para tu búsqueda'}
          </p>
        </div>
      )}

      {filteredPredictions.length > 0 && (
        <div className="max-w-7xl mx-auto space-y-16 pb-32">
          {/* Hero — best confidence match from filtered set */}
          {(predictions.find(p => p.id === selectedId) ?? sortedByConfidence[0]) && (
            <HeroPrediction
              prediction={predictions.find(p => p.id === selectedId) ?? sortedByConfidence[0]}
            />
          )}

          {/* Fixture carousel — upcoming 7 days, filtered by search */}
          <FixtureCarousel
            predictions={
              searchQuery.trim()
                ? upcomingPredictions.filter(p => {
                    const q = searchQuery.toLowerCase()
                    return p.equipo1.toLowerCase().includes(q) || p.equipo2.toLowerCase().includes(q)
                  })
                : upcomingPredictions
            }
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {/* Charts + Markets grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HitRateAccuracy predictions={predictions} />
            <ModelVsMarketAlpha predictions={predictionsWithOdds} />
            <AlternativeMarkets prediction={selectedMatch} />
          </section>
        </div>
      )}
    </main>
  )
}
