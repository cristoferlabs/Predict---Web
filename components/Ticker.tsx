'use client'

const LIVE_MATCHES = [
  { league: 'PL', match: 'ARS 2 - 1 CHE', time: "72'", status: 'live' },
  { league: 'LL', match: 'RMA 0 - 0 BAR', time: "15'", status: 'live' },
  { league: 'SA', match: 'INT 3 - 0 JUV', time: 'FT', status: 'finished' },
  { league: 'BUN', match: 'BAY 1 - 1 DOR', time: 'HT', status: 'live' },
  { league: 'PL', match: 'LIV 1 - 0 MCI', time: "55'", status: 'live' },
  { league: 'L1', match: 'PSG 2 - 2 MAR', time: "88'", status: 'live' },
]

export default function Ticker() {
  const matches = [...LIVE_MATCHES, ...LIVE_MATCHES] // Duplicate for infinite scroll

  return (
    <div className="w-full bg-black/80 border-b border-terminal-border h-8 flex items-center overflow-hidden z-50 sticky top-0 backdrop-blur-sm">
      <div className="animate-ticker flex whitespace-nowrap">
        {matches.map((m, i) => (
          <div key={i} className="flex items-center space-x-2 px-6 font-mono text-[10px] uppercase tracking-wider">
            <span className={`w-1.5 h-1.5 rounded-full ${
              m.status === 'live' ? 'bg-terminal-green animate-pulse shadow-[0_0_8px_var(--accent-green)]' : 'bg-terminal-red'
            }`} />
            <span className="text-terminal-text-secondary">{m.league}:</span>
            <span className="text-terminal-text-primary">{m.match}</span>
            <span className="text-terminal-blue">{m.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
