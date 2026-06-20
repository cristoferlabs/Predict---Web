'use client'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Activity } from 'lucide-react'

export function HitRateAccuracy() {
  // Mock data for the heatmap grid
  const cells = Array.from({ length: 28 }, (_, i) => Math.random())

  return (
    <div className="glass rounded-[24px] p-8 space-y-6 col-span-1">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Hit Rate Accuracy</h3>
        <Activity className="text-brand-blue w-4 h-4" />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((val, i) => (
          <div 
            key={i} 
            className="aspect-square rounded-sm glass transition-opacity hover:opacity-100" 
            style={{ background: `rgba(79,149,214, ${val * 0.8})`, opacity: 0.6 + (val * 0.4) }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-white/20 uppercase font-bold tracking-widest">
        <span>Week 01</span>
        <span>Week 04</span>
      </div>
    </div>
  )
}

export function ModelVsMarketAlpha() {
  const data = [
    { name: 'Mon', model: 65, market: 60 },
    { name: 'Tue', model: 78, market: 65 },
    { name: 'Wed', model: 72, market: 70 },
    { name: 'Thu', model: 85, market: 75 },
    { name: 'Fri', model: 82, market: 72 },
    { name: 'Sat', model: 90, market: 78 },
    { name: 'Sun', model: 88, market: 80 },
  ]

  return (
    <div className="glass rounded-[24px] p-8 space-y-6 col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Model vs Market Alpha</h3>
        <div className="flex gap-4 text-[9px] font-mono uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-blue" /> Model</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white/20" /> Market</div>
        </div>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorModel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand-blue)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--brand-blue)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Area 
              type="monotone" 
              dataKey="model" 
              stroke="var(--brand-blue)" 
              fillOpacity={1} 
              fill="url(#colorModel)" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="market" 
              stroke="rgba(255,255,255,0.2)" 
              strokeWidth={1} 
              strokeDasharray="5 5" 
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
