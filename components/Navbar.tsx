'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',             label: 'Predicciones' },
  { href: '/tracker',      label: 'Backtesting' },
  { href: '/analytics',    label: 'Analytics' },
  { href: '/como-funciona', label: 'Modelos' },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'rgba(13,16,21,.90)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1c2127' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center h-16 gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mr-2 shrink-0">
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg,#3aa0ff,#1170c4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: 17,
          }}>P</div>
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', letterSpacing: '-.2px' }}>PitchIQ</div>
            <div style={{ fontSize: 11, color: '#5b636e', fontWeight: 500 }}>Prediction Agent</div>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  color: active ? '#fff' : '#7c8492',
                  background: active ? 'rgba(255,255,255,.06)' : 'transparent',
                }}
              >
                <div style={{
                  width: 7, height: 7, borderRadius: 2, flexShrink: 0,
                  background: active ? '#4f95d6' : '#2a313b',
                }} />
                {label}
              </Link>
            )
          })}
        </div>

        <div className="flex-1" />

        {/* Agent badge */}
        <div className="hidden md:flex items-center gap-2.5">
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#16b8a6,#0a8f80)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 11,
          }}>AM</div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e6eef8' }}>Analytics Model</div>
            <div style={{ fontSize: 10.5, color: '#4f95d6', fontWeight: 500 }}>Agente · en vivo</div>
          </div>
        </div>

        {/* Mobile links */}
        <div className="flex md:hidden items-center gap-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ color: path === href ? '#4f95d6' : '#5b636e' }}
            >
              {label.slice(0, 3)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
