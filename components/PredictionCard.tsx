import Link from 'next/link'
import clsx from 'clsx'
import type { Prediction } from '@/types'

function confStyle(level: string) {
  if (level === 'Alta')  return { color: '#34d399', bg: 'rgba(52,211,153,.12)',  cls: 'badge-alta' }
  if (level === 'Media') return { color: '#fbbf24', bg: 'rgba(251,191,36,.12)',  cls: 'badge-media' }
  return                        { color: '#8b93a0', bg: 'rgba(139,147,160,.14)', cls: 'badge-baja' }
}

function ProbBar({ label, value, color }: { label: string; value: number | null | undefined; color: string }) {
  const pct = value ?? 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#9aa1ab' }} className="truncate max-w-[90px]">{label}</span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: '#f3f5f7' }}>{pct.toFixed(1)}%</span>
      </div>
      <div style={{ height: 6, background: '#1c2127', borderRadius: 4, overflow: 'hidden' }}>
        <div
          className="prob-bar"
          style={{ height: '100%', borderRadius: 4, background: color, '--target-width': `${pct}%`, width: `${pct}%` } as React.CSSProperties}
        />
      </div>
    </div>
  )
}

export default function PredictionCard({ p }: { p: Prediction }) {
  const winner =
    (p.prob_equipo1 ?? 0) > (p.prob_empate ?? 0) && (p.prob_equipo1 ?? 0) > (p.prob_equipo2 ?? 0)
      ? 'equipo1'
      : (p.prob_equipo2 ?? 0) > (p.prob_empate ?? 0) && (p.prob_equipo2 ?? 0) > (p.prob_equipo1 ?? 0)
      ? 'equipo2'
      : 'empate'

  const cs = confStyle(p.confianza)
  const pickLabel  = winner === 'equipo1' ? p.equipo1 : winner === 'equipo2' ? p.equipo2 : 'Empate'
  const pickColor  = winner === 'empate'  ? '#9aa1ab' : winner === 'equipo1' ? '#4f95d6'  : '#f0a868'
  const leadingPct = Math.max(p.prob_equipo1 ?? 0, p.prob_empate ?? 0, p.prob_equipo2 ?? 0)

  return (
    <Link href={`/partido/${p.id}`}>
      <div
        className="prediction-card cursor-pointer"
        style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 14, padding: '15px 16px' }}
      >
        {/* Top row: time/group + badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, color: '#6b727c' }}>
            {p.hora} · {p.grupo ? `Grupo ${p.grupo.replace(/^(Group|Grupo)\s+/i, '')}` : p.ronda}
          </span>
          <span
            className={cs.cls}
            style={{ fontSize: 10.5, fontWeight: 700, color: cs.color, background: cs.bg, padding: '3px 9px', borderRadius: 20 }}
          >
            {p.confianza}
          </span>
        </div>

        {/* Match title */}
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f3f5f7', letterSpacing: '-.2px' }}>
          {p.equipo1} <span style={{ color: '#39414c', fontWeight: 400 }}>vs</span> {p.equipo2}
        </div>

        {/* Prediction row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#9aa1ab' }}>Predicción:</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: pickColor }}>{pickLabel}</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, color: '#f3f5f7' }}>
            {leadingPct.toFixed(1)}%
          </span>
        </div>

        {/* Confidence bar */}
        <div style={{ height: 5, background: '#1c2127', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
          <div style={{ height: '100%', borderRadius: 4, width: `${leadingPct.toFixed(0)}%`, background: cs.color }} />
        </div>

        {/* Probability bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14 }}>
          <ProbBar label={p.equipo1}  value={p.prob_equipo1} color="#4f95d6" />
          <ProbBar label="Empate"     value={p.prob_empate}  color="#5b636e" />
          <ProbBar label={p.equipo2}  value={p.prob_equipo2} color="#f0a868" />
        </div>

        {/* Footer stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 13, paddingTop: 12, borderTop: '1px solid #1c2127' }}>
          {[
            { label: 'Over 2.5', value: `${(p.prob_over25 ?? 0).toFixed(0)}%` },
            { label: 'BTTS',     value: `${(p.prob_btts   ?? 0).toFixed(0)}%` },
            { label: 'λ1 / λ2', value: `${p.lambda1 ?? 0} / ${p.lambda2 ?? 0}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10.5, color: '#6b727c', fontWeight: 600 }}>{label}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, color: '#f3f5f7', marginTop: 2 }}>{value}</div>
            </div>
          ))}
          {p.resultado_real !== null && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10.5, color: '#6b727c', fontWeight: 600 }}>Resultado</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, marginTop: 2, color: p.acierto ? '#34d399' : '#f87171' }}>
                {p.goles_equipo1} - {p.goles_equipo2}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
