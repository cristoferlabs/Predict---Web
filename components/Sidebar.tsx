'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',             label: 'Predicciones' },
  { href: '/tracker',      label: 'Fixtures del día' },
  { href: '/analytics',    label: 'Backtesting' },
  { href: '/como-funciona', label: 'Modelos' },
  { href: '/combinadas',   label: 'Combinadas' },
  { href: '/ajustes',      label: 'Ajustes' },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside style={{
      width: 230, flexShrink: 0,
      background: '#0d1015', borderRight: '1px solid #1c2127',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '22px 20px 24px' }}>
        <div style={{
          width: 34, height: 34, flexShrink: 0, borderRadius: 9,
          background: 'linear-gradient(135deg,#3aa0ff,#1170c4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: '#fff', fontSize: 17,
        }}>P</div>
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', letterSpacing: '-.2px' }}>PitchIQ</div>
          <div style={{ fontSize: 11, color: '#5b636e', fontWeight: 500 }}>Prediction Agent</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px', flex: 1 }}>
        {NAV.map(({ href, label }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 13px', borderRadius: 9,
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                color: active ? '#fff' : '#7c8492',
                background: active ? 'rgba(255,255,255,.06)' : 'transparent',
                textDecoration: 'none',
                transition: 'background .15s, color .15s',
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
      </nav>

      {/* Agent footer */}
      <div style={{ padding: '15px', borderTop: '1px solid #1c2127', margin: '0 12px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#16b8a6,#0a8f80)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13,
        }}>AM</div>
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#e6eef8' }}>Analytics Model</div>
          <div style={{ fontSize: 11, color: '#4f95d6', fontWeight: 500 }}>Agente · en vivo</div>
        </div>
      </div>
    </aside>
  )
}
