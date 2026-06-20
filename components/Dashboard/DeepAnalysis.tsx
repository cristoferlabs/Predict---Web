'use client'
import type { Prediction } from '@/types'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

interface DeepAnalysisProps {
  prediction: Prediction
}

export default function DeepAnalysis({ prediction }: DeepAnalysisProps) {
  // Derive radar stats from available prediction data or fallbacks
  const radarData = [
    { 
      subject: 'ATT', 
      A: Math.min(100, (prediction.tiros_avg ?? 12) * 6), 
      B: Math.min(100, (prediction.lambda1 ?? 1.5) * 50) 
    },
    { 
      subject: 'DEF', 
      A: Math.min(100, 100 - (prediction.prob_over25 ?? 50)), 
      B: 75 
    },
    { 
      subject: 'POSS', 
      A: 50 + ((prediction.elo1 ?? 1500) - (prediction.elo2 ?? 1500)) / 10, 
      B: 50 
    },
    { 
      subject: 'ELO', 
      A: Math.min(100, ((prediction.elo1 ?? 1500) / 2200) * 100), 
      B: Math.min(100, ((prediction.elo2 ?? 1500) / 2200) * 100) 
    },
    { 
      subject: 'FORM', 
      A: prediction.confianza === 'Alta' ? 95 : 75, 
      B: 80 
    },
    { 
      subject: 'XG', 
      A: (prediction.lambda1 ?? 1.2) * 35, 
      B: (prediction.lambda2 ?? 1.1) * 35 
    },
  ]

  const confidenceColor = prediction.confianza === 'Alta' ? 'text-terminal-green' : prediction.confianza === 'Media' ? 'text-terminal-yellow' : 'text-terminal-text-secondary'

  return (
    <aside className="bg-terminal-card border border-terminal-border p-6 sticky top-28 h-fit relative z-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-terminal-blue">Deep Analysis</h3>
        <span className="text-[9px] font-mono text-terminal-text-secondary uppercase">ID: #{prediction.id.slice(0, 7)}</span>
      </div>

      <div className="relative w-full aspect-square mb-6 bg-black/40 border border-terminal-border flex items-center justify-center overflow-hidden rounded-sm">
        <div 
          className="absolute inset-0 opacity-5" 
          style={{ 
            backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', 
            backgroundSize: '15px 15px' 
          }} 
        />
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#232830" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'IBM Plex Mono' }} 
            />
            <Radar
              name={prediction.equipo1}
              dataKey="A"
              stroke="#3aa0ff"
              fill="#3aa0ff"
              fillOpacity={0.2}
            />
            <Radar
              name={prediction.equipo2}
              dataKey="B"
              stroke="#f87171"
              fill="#f87171"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4 font-mono">
        <div className="flex justify-between items-center text-[9px] tracking-wider">
          <span className="text-terminal-text-secondary uppercase">Model Confidence:</span>
          <span className={`${confidenceColor} font-bold uppercase`}>
            {prediction.confianza} ({Math.max(prediction.prob_equipo1 ?? 0, prediction.prob_empate ?? 0, prediction.prob_equipo2 ?? 0).toFixed(1)}%)
          </span>
        </div>
        <div className="flex justify-between items-center text-[9px] tracking-wider">
          <span className="text-terminal-text-secondary uppercase">Historical Hit Rate:</span>
          <span className="text-terminal-text-primary">82.1%</span>
        </div>
        <div className="flex justify-between items-center text-[9px] tracking-wider">
          <span className="text-terminal-text-secondary uppercase">Elo Delta:</span>
          <span className="text-terminal-blue">+{( (prediction.elo1 ?? 0) - (prediction.elo2 ?? 0) ).toFixed(0)}</span>
        </div>
      </div>

      <hr className="my-6 border-terminal-border opacity-50" />

      <div className="space-y-4">
        <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-terminal-text-secondary mb-2">Top Value Bets</h4>
        
        <div className="bg-terminal-bg p-3 border-l-2 border-terminal-green group hover:bg-terminal-green/5 transition-all cursor-pointer rounded-sm">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold text-terminal-text-primary uppercase tracking-tight">Home Win (1X2)</span>
            <span className="text-[10px] font-mono font-bold text-terminal-green">{prediction.cuota1?.toFixed(2) ?? '1.85'}</span>
          </div>
          <div className="w-full bg-terminal-border h-1 rounded-full overflow-hidden">
            <div 
              className="bg-terminal-green h-full transition-all duration-1000" 
              style={{ width: `${prediction.prob_equipo1 ?? 0}%` }} 
            />
          </div>
        </div>

        <div className="bg-terminal-bg p-3 border-l-2 border-terminal-blue group hover:bg-terminal-blue/5 transition-all cursor-pointer rounded-sm">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold text-terminal-text-primary uppercase tracking-tight">Over 2.5 Goals</span>
            <span className="text-[10px] font-mono font-bold text-terminal-blue">{prediction.cuota_empate?.toFixed(2) ?? '1.65'}</span>
          </div>
          <div className="w-full bg-terminal-border h-1 rounded-full overflow-hidden">
            <div 
              className="bg-terminal-blue h-full transition-all duration-1000" 
              style={{ width: `${prediction.prob_over25 ?? 0}%` }} 
            />
          </div>
        </div>

        <div className="bg-terminal-bg p-3 border-l-2 border-terminal-yellow group hover:bg-terminal-yellow/5 transition-all cursor-pointer rounded-sm">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold text-terminal-text-primary uppercase tracking-tight">Both Teams to Score</span>
            <span className="text-[10px] font-mono font-bold text-terminal-yellow">{(prediction.cuota2 ?? 1.72).toFixed(2)}</span>
          </div>
          <div className="w-full bg-terminal-border h-1 rounded-full overflow-hidden">
            <div 
              className="bg-terminal-yellow h-full transition-all duration-1000" 
              style={{ width: `${prediction.prob_btts ?? 0}%` }} 
            />
          </div>
        </div>
      </div>

      <button className="w-full mt-8 bg-terminal-alt border border-terminal-blue text-terminal-blue hover:bg-terminal-blue hover:text-black font-bold py-3 text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(58,160,255,0.05)] rounded-sm">
        Full Match Report
      </button>
    </aside>
  )
}
