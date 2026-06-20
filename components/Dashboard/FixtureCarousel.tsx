'use client'
import type { Prediction } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

interface FixtureCarouselProps {
  predictions: Prediction[]
  onSelect: (id: string) => void
  selectedId: string
}

export default function FixtureCarousel({ predictions, onSelect, selectedId }: FixtureCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Upcoming Fixtures</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-8 h-8 glass rounded-full flex items-center justify-center text-xs text-white/40 hover:text-white transition-colors hover:border-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-8 h-8 glass rounded-full flex items-center justify-center text-xs text-white/40 hover:text-white transition-colors hover:border-white/20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto carousel-hide-scrollbar pb-4 -mx-4 px-4 scroll-smooth"
      >
        {predictions.map((p) => {
          const isSelected = p.id === selectedId
          return (
            <div 
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`min-w-[300px] glass p-6 rounded-[24px] space-y-6 glass-hover cursor-pointer group shrink-0 ${
                isSelected ? 'border-brand-blue/50 ring-1 ring-brand-blue/20 bg-white/[0.04]' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-white/30 font-mono tracking-wider uppercase">{p.hora} • {p.fecha?.slice(5)}</span>
                <span className={`w-2 h-2 rounded-full ${
                  p.confianza === 'Alta' ? 'bg-brand-gold shadow-[0_0_10px_#fbbf24]' : 'bg-white/10'
                }`} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-2xl border-white/5 shadow-sm">
                    {p.equipo1?.[0]}
                  </div>
                  <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-2xl border-white/5 shadow-sm">
                    {p.equipo2?.[0]}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate uppercase tracking-tight text-white/90">{p.equipo1} vs {p.equipo2}</p>
                  <p className="text-[10px] text-white/40 font-medium tracking-wide">{p.ronda} • {p.grupo ? `Grupo ${p.grupo}` : 'Fase Final'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-white/40 mb-1">
                  <span>{p.prob_equipo1?.toFixed(0)}%</span>
                  <span>{p.prob_empate?.toFixed(0)}%</span>
                  <span>{p.prob_equipo2?.toFixed(0)}%</span>
                </div>
                <div className="flex w-full gap-1">
                  <div className="h-1 bg-brand-blue rounded-full shadow-[0_0_8px_rgba(79,149,214,0.3)] transition-all" style={{ width: `${p.prob_equipo1}%` }} />
                  <div className="h-1 bg-white/10 rounded-full transition-all" style={{ width: `${p.prob_empate}%` }} />
                  <div className="h-1 bg-white/5 rounded-full transition-all" style={{ width: `${p.prob_equipo2}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
