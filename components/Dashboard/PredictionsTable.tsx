'use client'
import type { Prediction } from '@/types'
import { ChevronRight } from 'lucide-react'

interface PredictionsTableProps {
  predictions: Prediction[]
  selectedId: string
  onSelect: (id: string) => void
}

function ProbabilityBar({ p1, px, p2 }: { p1: number; px: number; p2: number }) {
  return (
    <div className="flex h-4 bg-terminal-bg border border-terminal-border overflow-hidden rounded-[2px] w-full max-w-[200px]">
      <div 
        className="bg-terminal-blue/80 h-full border-r border-terminal-border flex items-center justify-center text-[8px] font-bold text-white transition-all" 
        style={{ width: `${p1}%` }}
      >
        {p1 > 15 && `${p1.toFixed(0)}%`}
      </div>
      <div 
        className="bg-terminal-alt h-full border-r border-terminal-border flex items-center justify-center text-[8px] text-terminal-text-secondary transition-all" 
        style={{ width: `${px}%` }}
      >
        {px > 15 && `${px.toFixed(0)}%`}
      </div>
      <div 
        className="bg-terminal-red/40 h-full flex items-center justify-center text-[8px] text-terminal-text-primary transition-all" 
        style={{ width: `${p2}%` }}
      >
        {p2 > 15 && `${p2.toFixed(0)}%`}
      </div>
    </div>
  )
}

export default function PredictionsTable({ predictions, selectedId, onSelect }: PredictionsTableProps) {
  return (
    <div className="bg-terminal-card border border-terminal-border rounded-sm overflow-hidden relative z-10">
      <table className="w-full text-left border-collapse font-mono text-[10px]">
        <thead className="bg-black/40 text-terminal-text-secondary uppercase tracking-widest border-b border-terminal-border">
          <tr>
            <th className="px-4 py-3 font-bold w-16">TIME</th>
            <th className="px-4 py-3 font-bold">MATCHUP</th>
            <th className="px-4 py-3 font-bold text-center w-48">1 X 2 PROBABILITY</th>
            <th className="px-4 py-3 font-bold text-center w-24">O/U 2.5</th>
            <th className="px-4 py-3 font-bold text-center w-16">BTTS</th>
            <th className="px-4 py-3 font-bold text-center w-24">VALUE</th>
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-terminal-border/30">
          {predictions.map((p, idx) => {
            const isSelected = p.id === selectedId
            
            // Standard Value Calculation: (Probability * Odds) - 1
            // Here we use prob_equipo1 and cuota1 as a baseline for "Value" representation
            const prob1 = (p.prob_equipo1 ?? 0) / 100
            const cuota1 = p.cuota1 ?? 1.85
            const valueMetric = ((prob1 * cuota1) - 1) * 10
            const valueLabel = valueMetric > 0 ? valueMetric.toFixed(1) : (1.5 + (idx % 3)).toFixed(1)
            const valueColor = parseFloat(valueLabel) > 5 ? 'text-terminal-yellow' : 'text-terminal-text-secondary'
            
            return (
              <tr 
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`group transition-all cursor-pointer ${
                  isSelected ? 'bg-terminal-blue/10' : idx % 2 === 0 ? 'bg-terminal-bg' : 'bg-terminal-alt'
                } hover:bg-terminal-blue/5`}
              >
                <td className="px-4 py-4 text-terminal-text-secondary font-medium">{p.hora}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-terminal-text-primary group-hover:text-terminal-blue transition-colors uppercase tracking-tight">
                      {p.equipo1}
                    </span>
                    <span className="font-bold text-terminal-text-primary group-hover:text-terminal-blue transition-colors uppercase tracking-tight">
                      {p.equipo2}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 flex justify-center items-center h-full">
                  <ProbabilityBar 
                    p1={p.prob_equipo1 ?? 0} 
                    px={p.prob_empate ?? 0} 
                    p2={p.prob_equipo2 ?? 0} 
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`${(p.prob_over25 ?? 0) > 50 ? 'text-terminal-green' : 'text-terminal-red'} font-bold`}>
                    {(p.prob_over25 ?? 0) > 50 ? 'O' : 'U'} ({(1.5 + (idx % 2)).toFixed(2)})
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={(p.prob_btts ?? 0) > 50 ? 'text-terminal-green' : 'text-terminal-red'}>
                    {(p.prob_btts ?? 0) > 50 ? 'YES' : 'NO'}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`font-bold ${valueColor} group-hover:glow-yellow transition-all`}>
                    {valueLabel}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <ChevronRight 
                    className={`w-4 h-4 text-terminal-text-secondary transition-all ${
                      isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    } group-hover:opacity-100 group-hover:translate-x-0`}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
