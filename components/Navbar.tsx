'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, BarChart2, BookOpen, Home } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/tracker', label: 'Precisión', icon: BarChart2 },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/como-funciona', label: 'Cómo funciona', icon: BookOpen },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-800/90 backdrop-blur-md border-b border-surface-600">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span className="font-bold text-lg">
            <span className="text-gradient">Predict</span>
            <span className="text-slate-400 font-normal text-sm ml-1">WC 2026</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                path === href
                  ? 'bg-brand-gold text-surface-900'
                  : 'text-slate-400 hover:text-white hover:bg-surface-600'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-3">
          {links.map(({ href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'p-2 rounded-lg transition-all',
                path === href ? 'text-brand-gold' : 'text-slate-500 hover:text-white'
              )}
            >
              <Icon size={18} />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
