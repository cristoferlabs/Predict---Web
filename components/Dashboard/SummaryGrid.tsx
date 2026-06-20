'use client'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'
import { Activity } from 'lucide-react'

interface SparklineProps {
  data: number[]
  color: string
}

function Sparkline({ data, color }: SparklineProps) {
  const chartData = data.map((v, i) => ({ value: v, id: i }))
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2} 
          dot={false} 
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface CardProps {
  label: string
  value: string
  trend: string
  trendColor: string
  glowClass: string
  data: number[]
  color: string
}

function SummaryCard({ label, value, trend, trendColor, glowClass, data, color }: CardProps) {
  return (
    <div className="bg-terminal-card border border-terminal-border p-4 relative overflow-hidden group hover:border-terminal-blue transition-all">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-terminal-text-secondary">{label}</span>
        <span className={`text-[10px] font-mono font-bold ${trendColor}`}>{trend}</span>
      </div>
      <div className={`text-2xl font-mono font-bold ${glowClass}`}>{value}</div>
      <div className="h-10 mt-2 opacity-60">
        <Sparkline data={data} color={color} />
      </div>
    </div>
  )
}

export default function SummaryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 relative z-10">
      <SummaryCard 
        label="Model Accuracy"
        value="78.4%"
        trend="+2.4%"
        trendColor="text-terminal-green"
        glowClass="glow-green"
        data={[72, 75, 73, 76, 78, 77, 78.4]}
        color="#34d399"
      />
      <SummaryCard 
        label="Global ROI"
        value="14.2%"
        trend="+12.8%"
        trendColor="text-terminal-green"
        glowClass="glow-green"
        data={[10, 12, 11, 14, 15, 13, 14.2]}
        color="#34d399"
      />
      <SummaryCard 
        label="Confidence Hit"
        value="92.1%"
        trend="-0.5%"
        trendColor="text-terminal-yellow"
        glowClass="glow-yellow"
        data={[94, 93, 95, 94, 93, 92, 92.1]}
        color="#fbbf24"
      />
      <div className="bg-terminal-card border border-terminal-border p-4 relative overflow-hidden group hover:border-terminal-blue transition-all">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-terminal-text-secondary">Active Signals</span>
          <Activity className="text-terminal-blue w-3 h-3" />
        </div>
        <div className="text-2xl font-mono font-bold glow-blue text-terminal-blue">14</div>
        <div className="h-10 mt-2 opacity-60">
          <Sparkline data={[8, 10, 9, 12, 14, 13, 14]} color="#3aa0ff" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1a202c] to-[#0a0c0f] border border-terminal-blue p-4 relative overflow-hidden shadow-[0_0_20px_rgba(58,160,255,0.1)]">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-terminal-blue/5 rounded-full blur-2xl" />
        <div className="flex justify-between items-start mb-1">
          <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-terminal-blue">Match of the Day</span>
          <span className="bg-terminal-blue text-black text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase">Top Value</span>
        </div>
        <div className="text-xs font-bold mb-1 truncate text-terminal-text-primary">MAN CITY vs LIVERPOOL</div>
        <div className="flex items-end justify-between">
          <div className="text-lg font-mono font-bold text-terminal-green">1 (1.85)</div>
          <div className="text-[9px] font-mono text-terminal-text-secondary">CONF: 94%</div>
        </div>
      </div>
    </div>
  )
}
