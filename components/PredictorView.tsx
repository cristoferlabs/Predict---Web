'use client'
import { useState, useMemo } from 'react'
import type { Prediction } from '@/types'
import { Activity, Search } from 'lucide-react'
import HeroPrediction from './Dashboard/HeroPrediction'
import FixtureCarousel from './Dashboard/FixtureCarousel'
import { HitRateAccuracy, ModelVsMarketAlpha } from './Dashboard/GlassCharts'
import AlternativeMarkets from './Dashboard/AlternativeMarkets'

interface Props {
  predictions: Prediction[]
  dateDefault: string
}

export default function PredictorView({ predictions, dateDefault }: Props) {
  const sortedByConfidence = useMemo(() => {
    const order = { 'Alta': 3, 'Media': 2, 'Baja': 1 } as any
    return [...predictions].sort((a, b) => (order[b.confianza] || 0) - (order[a.confianza] || 0))
  }, [predictions])

  const [selectedId, setSelectedId] = useState(sortedByConfidence[0]?.id ?? '')

  const selectedMatch = useMemo(() => {
    return predictions.find(p => p.id === selectedId) || sortedByConfidence[0]
  }, [predictions, sortedByConfidence, selectedId])

  return (
    <main className="relative min-h-screen px-6 lg:px-12 py-8 overflow-y-auto">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center border-brand-blue/30 shadow-[0_0_20px_rgba(79,149,214,0.2)]">
            <Activity className="text-brand-blue w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">PREDICT<span className="text-brand-blue">WEB</span></h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Quantum Analytics Engine</p>
          </div>
        </div>

        <div className="glass px-5 py-2.5 rounded-full flex items-center gap-3 border-white/5 w-full md:w-auto min-w-[320px] transition-all focus-within:border-brand-blue/30 focus-within:shadow-[0_0_20px_rgba(79,149,214,0.1)]">
          <Search className="text-white/40 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search matches or teams..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/20 text-white/80"
          />
        </div>
      </header>

      {/* Main Content Content */}
      <div className="max-w-7xl mx-auto space-y-16 pb-32">
        
        {/* Featured Prediction */}
        {selectedMatch && <HeroPrediction prediction={selectedMatch} />}

        {/* Upcoming Fixtures Carousel */}
        <FixtureCarousel 
          predictions={predictions} 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />

        {/* Charts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <HitRateAccuracy />
          <ModelVsMarketAlpha />
          <AlternativeMarkets prediction={selectedMatch} />
        </section>
      </div>
    </main>
  )
}
