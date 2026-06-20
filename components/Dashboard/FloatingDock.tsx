'use client'
import { LayoutDashboard, Globe, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Leagues', icon: Globe },
  { href: '/tracker', label: 'Fixtures', icon: Calendar },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function FloatingDock() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-full border-white/5 shadow-2xl flex items-center gap-12 z-50">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = path === href
        return (
          <Link 
            key={href}
            href={href} 
            className={`flex flex-col items-center gap-1 transition-colors ${
              active ? 'text-brand-blue' : 'text-white/30 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
