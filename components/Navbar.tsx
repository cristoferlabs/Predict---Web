'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, BarChart3, LayoutDashboard, Database, Globe } from 'lucide-react'

const NAV_LINKS = [
  { href: '/',             label: 'Predictions', icon: LayoutDashboard },
  { href: '/analytics',    label: 'Analytics',   icon: BarChart3 },
  { href: '/como-funciona', label: 'Models',      icon: Database },
  { href: '/leagues',      label: 'Leagues',     icon: Globe },
]

export default function Navbar() {
  const path = usePathname()

  return (
    <nav className="bg-terminal-bg border-b border-terminal-border px-6 py-3 flex items-center justify-between sticky top-8 z-40 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-terminal-blue to-blue-700 flex items-center justify-center rounded-sm">
            <BarChart3 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight glow-blue uppercase">
            Match<span className="font-light text-terminal-blue">Predictor</span>
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center space-x-6 text-[11px] font-bold uppercase tracking-[0.15em]">
          {NAV_LINKS.map(({ href, label }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                className={`transition-colors pb-1 border-b-2 ${
                  active 
                    ? 'text-terminal-text-primary border-terminal-blue' 
                    : 'text-terminal-text-secondary border-transparent hover:text-terminal-text-primary'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-text-secondary w-3.5 h-3.5 group-focus-within:text-terminal-blue transition-colors" />
          <input 
            type="text" 
            placeholder="FIND MATCH OR TEAM..." 
            className="bg-terminal-alt border border-terminal-border pl-10 pr-4 py-1.5 text-[10px] font-mono rounded-sm focus:outline-none focus:border-terminal-blue transition-all w-64 placeholder:opacity-50 text-terminal-text-primary"
          />
        </div>
        <button className="bg-terminal-blue hover:bg-blue-600 text-black px-4 py-1.5 rounded-sm text-[10px] font-bold transition-all uppercase tracking-tighter shadow-[0_0_15px_rgba(58,160,255,0.2)]">
          Live Monitor
        </button>
      </div>
    </nav>
  )
}
