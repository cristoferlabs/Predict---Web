export const dynamic = 'force-dynamic'

import { getPredictionById } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { ModelVsMarketChart, TeamRadarChart, AlternativeMarketsChart } from '@/components/MatchCharts'
import ExportButton from '@/components/ExportButton'

const n = (v: number | null | undefined, d = 1) => (v ?? 0).toFixed(d)

function confStyle(level: string) {
  if (level === 'Alta')  return { color: '#34d399', bg: 'rgba(52,211,153,.12)',  label: 'Confianza Alta' }
  if (level === 'Media') return { color: '#fbbf24', bg: 'rgba(251,191,36,.12)',  label: 'Confianza Media' }
  return                        { color: '#8b93a0', bg: 'rgba(139,147,160,.14)', label: 'Confianza Baja' }
}

function Accordion({ icon, title, alert, children }: { icon: string; title: string; alert?: boolean; children: React.ReactNode }) {
  return (
    <details style={{ borderBottom: '1px solid #1c2127' }}>
      <summary style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '15px 2px', cursor: 'pointer', listStyle: 'none', userSelect: 'none' }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: '#dfe3e8' }}>{title}</span>
        {alert && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f87171', display: 'inline-block' }} />}
        <span style={{ fontSize: 11, color: '#6b727c' }}>▼</span>
      </summary>
      <div style={{ padding: '2px 2px 16px' }}>{children}</div>
    </details>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#101318', border: '1px solid #232830', borderRadius: 10, padding: '10px 14px', minWidth: 120 }}>
      <div style={{ fontSize: 11, color: '#6b727c', fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, fontWeight: 600, color: '#f3f5f7', marginTop: 2 }}>{value}</div>
    </div>
  )
}

export default async function PartidoPage({ params }: { params: { id: string } }) {
  let prediction = null
  try { prediction = await getPredictionById(params.id) } catch {}
  if (!prediction) notFound()
  const p = prediction

  const cs = confStyle(p.confianza)
  const leader =
    (p.prob_equipo1 ?? 0) >= (p.prob_empate ?? 0) && (p.prob_equipo1 ?? 0) >= (p.prob_equipo2 ?? 0) ? p.equipo1
    : (p.prob_equipo2 ?? 0) >= (p.prob_empate ?? 0) && (p.prob_equipo2 ?? 0) >= (p.prob_equipo1 ?? 0) ? p.equipo2
    : 'Empate'

  const p1x2 = [
    { label: p.equipo1, pct: p.prob_equipo1 ?? 0, isLeader: leader === p.equipo1, color: '#4f95d6' },
    { label: 'Empate',  pct: p.prob_empate  ?? 0, isLeader: leader === 'Empate',  color: '#5b636e' },
    { label: p.equipo2, pct: p.prob_equipo2 ?? 0, isLeader: leader === p.equipo2, color: '#f0a868' },
  ]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 56px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <ExportButton targetId="partido-detail" filename={`prediccion-${p.partido}`} />
      </div>

      <div id="partido-detail" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Match header ──────────────────────────────────── */}
        <div style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, color: '#6b727c', marginBottom: 5 }}>
                ⚽ {p.ronda}
              </div>
              <div style={{ fontSize: 23, fontWeight: 800, color: '#f3f5f7', letterSpacing: '-.5px' }}>{p.partido}</div>
              <div style={{ fontSize: 12.5, color: '#7c8492', fontWeight: 500, marginTop: 5 }}>
                📅 {p.fecha} {p.hora}
                {p.elo1 && (
                  <span style={{ marginLeft: 14 }}>
                    Elo: <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: '#9aa1ab' }}>{p.elo1}</span>
                    {' vs '}
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: '#9aa1ab' }}>{p.elo2}</span>
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: cs.color, background: cs.bg, padding: '4px 12px', borderRadius: 20, display: 'inline-block' }}>
                {cs.label}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 30, fontWeight: 600, color: '#f3f5f7', letterSpacing: '-1px', marginTop: 6, lineHeight: 1 }}>
                {n(Math.max(p.prob_equipo1 ?? 0, p.prob_empate ?? 0, p.prob_equipo2 ?? 0), 1)}%
              </div>
            </div>
          </div>

          {p.resultado_real !== null && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: '#101318', border: '1px solid #232830', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.4px' }}>Resultado real</span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 18, fontWeight: 700, color: p.acierto ? '#34d399' : '#f87171' }}>
                {p.goles_equipo1} – {p.goles_equipo2}
              </span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: p.acierto ? '#34d399' : '#f87171' }}>
                {p.acierto ? '✓ Acertado' : '✗ Fallado'}
              </span>
            </div>
          )}
        </div>

        {/* ── Prediction hero ───────────────────────────────── */}
        <div style={{ background: '#101318', border: '1px solid #232830', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22 }}>

            {/* 1X2 bars */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#5b636e', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 13 }}>
                🎯 Resultado 1X2
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {p1x2.map(({ label, pct, isLeader, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, marginBottom: 5 }}>
                      <span style={{ color: isLeader ? color : '#9aa1ab' }}>{label}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: isLeader ? color : '#9aa1ab' }}>{n(pct)}%</span>
                    </div>
                    <div style={{ height: 8, background: '#1c2127', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 5, width: `${pct}%`, background: isLeader ? color : '#39414c' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Picks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#14171c', border: `1px solid ${cs.color}`, borderRadius: 12, padding: '13px 15px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.4px' }}>Recomendado</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: cs.color, marginTop: 3 }}>{leader}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, background: '#14171c', border: '1px solid #232830', borderRadius: 12, padding: '11px 13px' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.4px' }}>Over 2.5</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 700, color: '#dfe3e8', marginTop: 2 }}>
                    {n(p.prob_over25, 0)}%
                  </div>
                </div>
                <div style={{ flex: 1, background: '#14171c', border: '1px solid #232830', borderRadius: 12, padding: '11px 13px' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.4px' }}>BTTS</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 700, color: '#dfe3e8', marginTop: 2 }}>
                    {n(p.prob_btts, 0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Accordion sections ────────────────────────────── */}
        <div style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 16, padding: '6px 22px 10px' }}>

          <Accordion icon="📐" title="Modelo Matemático">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <StatChip label={`${p.equipo1} gana`} value={`${n(p.prob_equipo1)}%`} />
              <StatChip label="Empate"               value={`${n(p.prob_empate)}%`} />
              <StatChip label={`${p.equipo2} gana`}  value={`${n(p.prob_equipo2)}%`} />
              <StatChip label="Over 2.5"             value={`${n(p.prob_over25)}%`} />
              <StatChip label="BTTS"                 value={`${n(p.prob_btts)}%`} />
              <StatChip label={`λ ${p.equipo1}`}     value={n(p.lambda1)} />
              <StatChip label={`λ ${p.equipo2}`}     value={n(p.lambda2)} />
              {p.elo1 && <StatChip label={`Elo ${p.equipo1}`} value={String(p.elo1)} />}
              {p.elo2 && <StatChip label={`Elo ${p.equipo2}`} value={String(p.elo2)} />}
              {p.corners_avg   != null && <StatChip label="Corners avg"  value={n(p.corners_avg)} />}
              {p.amarillas_avg != null && <StatChip label="Amarillas avg" value={n(p.amarillas_avg)} />}
              {p.tiros_avg     != null && <StatChip label="Tiros avg"     value={n(p.tiros_avg)} />}
            </div>
          </Accordion>

          {/* Charts inside accordion-style section */}
          <Accordion icon="📊" title="Gráficos del modelo">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ModelVsMarketChart p={p} />
              <TeamRadarChart p={p} />
            </div>
          </Accordion>

          {p.top5_apuestas?.length ? (
            <Accordion icon="🏆" title="Top 5 Apuestas recomendadas">
              <AlternativeMarketsChart p={p} />
            </Accordion>
          ) : null}

          {p.cuota1 && (
            <Accordion icon="💰" title="Cuotas de Mercado">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { label: p.equipo1,  cuota: p.cuota1,       impl: p.prob_impl1 },
                  { label: 'Empate',   cuota: p.cuota_empate, impl: p.prob_impl_empate },
                  { label: p.equipo2,  cuota: p.cuota2,       impl: p.prob_impl2 },
                ].map(({ label, cuota, impl }) => (
                  <div key={label} style={{ background: '#101318', border: '1px solid #232830', borderRadius: 10, padding: '10px 14px', minWidth: 110 }}>
                    <div style={{ fontSize: 11, color: '#6b727c', fontWeight: 600 }}>{label}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 22, fontWeight: 600, color: '#f3f5f7', marginTop: 2, lineHeight: 1.1 }}>
                      {n(cuota, 2)}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#7c8492', fontWeight: 600, marginTop: 3 }}>
                      impl. {n(impl, 1)}%
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>
          )}

        </div>

      </div>
    </div>
  )
}
