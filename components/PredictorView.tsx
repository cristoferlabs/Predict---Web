'use client'
import { useState, useMemo } from 'react'
import type { Prediction } from '@/types'

// ─── helpers ────────────────────────────────────────────────────────────────

const n = (v: number | null | undefined, d = 1) => (v ?? 0).toFixed(d)

// Extract a section from analisis_completo by searching for keyword(s) in headers
function getSection(text: string | null, ...keys: string[]): string | null {
  if (!text) return null
  for (const key of keys) {
    const idx = text.indexOf(key)
    if (idx === -1) continue
    const start = text.indexOf('\n', idx) + 1
    const rest = text.slice(start)
    const nextSection = rest.search(/\n[📊⚽🤝📋📜⚔️⭐📰🏆🎯]/u)
    const content = nextSection === -1 ? rest : rest.slice(0, nextSection)
    if (content.trim()) return content.trim()
  }
  return null
}

function confStyle(level: string) {
  if (level === 'Alta')  return { color: '#34d399', bg: 'rgba(52,211,153,.12)',  label: 'Confianza Alta' }
  if (level === 'Media') return { color: '#fbbf24', bg: 'rgba(251,191,36,.12)',  label: 'Confianza Media' }
  return                        { color: '#8b93a0', bg: 'rgba(139,147,160,.14)', label: 'Confianza Baja' }
}

function getWinner(p: Prediction) {
  const e1 = p.prob_equipo1 ?? 0, em = p.prob_empate ?? 0, e2 = p.prob_equipo2 ?? 0
  if (e1 >= em && e1 >= e2) return 'equipo1'
  if (e2 >= em && e2 >= e1) return 'equipo2'
  return 'empate'
}

function getPickLabel(p: Prediction) {
  const w = getWinner(p)
  if (w === 'equipo1') return `${p.equipo1} gana`
  if (w === 'equipo2') return `${p.equipo2} gana`
  return 'Empate'
}

function getPickColor(p: Prediction) {
  const w = getWinner(p)
  return w === 'empate' ? '#9aa1ab' : w === 'equipo1' ? '#4f95d6' : '#f0a868'
}

function getLeadPct(p: Prediction) {
  return Math.max(p.prob_equipo1 ?? 0, p.prob_empate ?? 0, p.prob_equipo2 ?? 0)
}

function getWinnerOdd(p: Prediction): number {
  const w = getWinner(p)
  if (w === 'equipo1') return p.cuota1     ?? (100 / Math.max(p.prob_equipo1 ?? 1, 1))
  if (w === 'equipo2') return p.cuota2     ?? (100 / Math.max(p.prob_equipo2 ?? 1, 1))
  return                      p.cuota_empate ?? (100 / Math.max(p.prob_empate  ?? 1, 1))
}

// ─── sub-components ─────────────────────────────────────────────────────────

function AccordionSection({ icon, title, open, onToggle, alert, children }: {
  icon: string; title: string; open: boolean; onToggle: () => void
  alert?: boolean; children?: React.ReactNode
}) {
  return (
    <div style={{ borderBottom: '1px solid #1c2127' }}>
      <div
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '15px 2px', cursor: 'pointer' }}
      >
        <span style={{ fontSize: 15, width: 22, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: '#dfe3e8' }}>{title}</span>
        {alert && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f87171', flexShrink: 0, display: 'inline-block' }} />}
        <span style={{ fontSize: 11, color: '#6b727c', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .2s', flexShrink: 0 }}>▼</span>
      </div>
      {open && <div style={{ padding: '2px 2px 16px' }}>{children}</div>}
    </div>
  )
}

function AnalysisText({ text, fallback = 'Sin datos disponibles.' }: { text: string | undefined; fallback?: string }) {
  if (!text) return (
    <div style={{ fontSize: 13, color: '#9aa1ab', fontWeight: 500, padding: '10px 14px', background: '#101318', border: '1px solid #232830', borderRadius: 10 }}>
      {fallback}
    </div>
  )
  return (
    <div style={{ fontSize: 13, color: '#c4cad2', lineHeight: 1.7, fontWeight: 500, padding: '12px 16px', background: '#101318', border: '1px solid #232830', borderRadius: 10, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
      {text}
    </div>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#101318', border: '1px solid #232830', borderRadius: 10, padding: '10px 14px', minWidth: 115 }}>
      <div style={{ fontSize: 11, color: '#6b727c', fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 15, fontWeight: 600, color: '#f3f5f7', marginTop: 2 }}>{value}</div>
    </div>
  )
}

// ─── match list card ─────────────────────────────────────────────────────────

function MatchCard({ p, selected, onClick }: { p: Prediction; selected: boolean; onClick: () => void }) {
  const cs = confStyle(p.confianza)
  const pct = getLeadPct(p)
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? '#181c22' : '#14171c',
        border: `1px solid ${selected ? cs.color : '#232830'}`,
        borderRadius: 14, padding: '15px 16px', cursor: 'pointer',
        transition: 'border-color .15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, color: '#6b727c' }}>
          {p.hora} · {p.grupo ? `Grupo ${p.grupo}` : p.ronda}
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: cs.color, background: cs.bg, padding: '3px 9px', borderRadius: 20 }}>
          {cs.label}
        </span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#f3f5f7', letterSpacing: '-.2px' }}>{p.partido}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#9aa1ab' }}>Predicción:</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: getPickColor(p) }}>{getPickLabel(p)}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, color: '#f3f5f7' }}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{ height: 5, background: '#1c2127', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
        <div style={{ height: '100%', borderRadius: 4, width: `${pct.toFixed(0)}%`, background: cs.color }} />
      </div>
    </div>
  )
}

// ─── detail panel ────────────────────────────────────────────────────────────

function DetailPanel({ p }: { p: Prediction }) {
  const cs = confStyle(p.confianza)
  const [exp, setExp] = useState<Record<string, boolean>>({})
  const tg = (k: string) => setExp(e => ({ ...e, [k]: !e[k] }))

  const ana = p.analisis_completo ?? null
  const winner = getWinner(p)
  const p1x2 = [
    { label: p.equipo1, pct: p.prob_equipo1 ?? 0, isWinner: winner === 'equipo1', color: '#34d399' },
    { label: 'Empate',  pct: p.prob_empate  ?? 0, isWinner: winner === 'empate',  color: '#9aa1ab' },
    { label: p.equipo2, pct: p.prob_equipo2 ?? 0, isWinner: winner === 'equipo2', color: '#f0a868' },
  ]
  const ouPick   = p.pred_over25 ?? ((p.prob_over25 ?? 0) >= 50 ? 'Over 2.5' : 'Under 2.5')
  const bttsPick = p.pred_btts   ?? ((p.prob_btts   ?? 0) >= 50 ? 'Sí' : 'No')
  const hasAlerts = p.tiene_lesiones || p.tiene_suspension || p.hay_noticias_impacto

  return (
    <div style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 16, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '20px 22px', borderBottom: '1px solid #1c2127' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, color: '#6b727c', marginBottom: 5 }}>
              ⚽ {p.ronda}{p.grupo ? ` · Grupo ${p.grupo}` : ''}
            </div>
            <div style={{ fontSize: 23, fontWeight: 800, color: '#f3f5f7', letterSpacing: '-.5px' }}>{p.partido}</div>
            <div style={{ fontSize: 12.5, color: '#7c8492', fontWeight: 500, marginTop: 4 }}>
              📅 {p.fecha} {p.hora} UTC-7 &nbsp;·&nbsp; 🗓 {p.ronda}{p.grupo ? ` | Grupo ${p.grupo}` : ''}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: cs.color, background: cs.bg, padding: '4px 12px', borderRadius: 20, display: 'inline-block' }}>
              {cs.label}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 30, fontWeight: 600, color: '#f3f5f7', letterSpacing: '-1px', marginTop: 6, lineHeight: 1 }}>
              {getLeadPct(p).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Prediction hero */}
      <div style={{ padding: '20px 22px', borderBottom: '1px solid #1c2127', background: '#101318' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22 }}>
          {/* 1X2 bars */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5b636e', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 13 }}>
              🎯 Resultado 1X2
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {p1x2.map(({ label, pct, isWinner, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, marginBottom: 5 }}>
                    <span style={{ color: isWinner ? color : '#9aa1ab' }}>{label}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: isWinner ? color : '#9aa1ab' }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 8, background: '#1c2127', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 5, width: `${pct}%`, background: isWinner ? color : '#39414c' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Picks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: '#14171c', border: `1px solid ${cs.color}`, borderRadius: 12, padding: '13px 15px' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.4px' }}>Recomendado</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: cs.color, marginTop: 3 }}>{getPickLabel(p)}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, background: '#14171c', border: '1px solid #232830', borderRadius: 12, padding: '11px 13px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.4px' }}>Goles</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 700, color: '#dfe3e8', marginTop: 2 }}>{ouPick}</div>
              </div>
              <div style={{ flex: 1, background: '#14171c', border: '1px solid #232830', borderRadius: 12, padding: '11px 13px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#6b727c', textTransform: 'uppercase', letterSpacing: '.4px' }}>BTTS</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 700, color: '#dfe3e8', marginTop: 2 }}>{bttsPick}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div style={{ padding: '6px 22px 10px' }}>
        <AccordionSection icon="📐" title="Modelo Matemático" open={!!exp.model} onToggle={() => tg('model')}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <StatChip label={`${p.equipo1} gana`} value={`${n(p.prob_equipo1)}%`} />
            <StatChip label="Empate"               value={`${n(p.prob_empate)}%`} />
            <StatChip label={`${p.equipo2} gana`}  value={`${n(p.prob_equipo2)}%`} />
            <StatChip label="Over 2.5"             value={`${n(p.prob_over25)}%`} />
            <StatChip label="BTTS"                 value={`${n(p.prob_btts)}%`} />
            {p.lambda1 ? <StatChip label={`λ ${p.equipo1}`} value={n(p.lambda1)} /> : null}
            {p.lambda2 ? <StatChip label={`λ ${p.equipo2}`} value={n(p.lambda2)} /> : null}
            {p.elo1    ? <StatChip label={`Elo ${p.equipo1}`} value={String(p.elo1)} /> : null}
            {p.elo2    ? <StatChip label={`Elo ${p.equipo2}`} value={String(p.elo2)} /> : null}
          </div>
        </AccordionSection>

        <AccordionSection icon="📊" title="Forma Actual · WC 2026" open={!!exp.form} onToggle={() => tg('form')}>
          {getSection(ana, 'FORMA ACTUAL', 'WC2026') ? (
            <AnalysisText text={getSection(ana, 'FORMA ACTUAL', 'WC2026')!} />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {p.corners_avg   != null && <StatChip label="Corners avg"   value={n(p.corners_avg)} />}
              {p.amarillas_avg != null && <StatChip label="Amarillas avg" value={n(p.amarillas_avg)} />}
              {p.tiros_avg     != null && <StatChip label="Tiros avg"     value={n(p.tiros_avg)} />}
              {!p.corners_avg && !p.amarillas_avg && !p.tiros_avg && (
                <AnalysisText text={undefined} fallback="Sin datos de forma disponibles." />
              )}
            </div>
          )}
        </AccordionSection>

        <AccordionSection icon="📜" title="Histórico · 2018 y 2022" open={!!exp.hist} onToggle={() => tg('hist')}>
          <AnalysisText
            text={getSection(ana, 'HISTÓRICO', 'HISTORICO', '2018') ?? undefined}
            fallback="Sin datos históricos disponibles para este partido."
          />
        </AccordionSection>

        <AccordionSection icon="⚔️" title="H2H · Mundiales anteriores" open={!!exp.h2h} onToggle={() => tg('h2h')}>
          <AnalysisText
            text={getSection(ana, 'H2H', 'HEAD TO HEAD') ?? undefined}
            fallback="Sin datos H2H disponibles para este partido."
          />
        </AccordionSection>

        <AccordionSection icon="⭐" title="Jugadores Clave · 2026" open={!!exp.players} onToggle={() => tg('players')}>
          <AnalysisText
            text={getSection(ana, 'JUGADORES', 'GOLEADORES') ?? undefined}
            fallback="Sin datos de jugadores disponibles."
          />
        </AccordionSection>

        {(p.cuota1 || p.cuota_empate || p.cuota2) && (
          <AccordionSection icon="💰" title="Cuotas de Mercado" open={!!exp.odds} onToggle={() => tg('odds')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: p.equipo1, cuota: p.cuota1,       impl: p.prob_impl1 },
                { label: 'Empate',  cuota: p.cuota_empate, impl: p.prob_impl_empate },
                { label: p.equipo2, cuota: p.cuota2,       impl: p.prob_impl2 },
              ].map(({ label, cuota, impl }) => (
                <div key={label} style={{ background: '#101318', border: '1px solid #232830', borderRadius: 10, padding: '10px 14px', minWidth: 110 }}>
                  <div style={{ fontSize: 11, color: '#6b727c', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 20, fontWeight: 600, color: '#f3f5f7', marginTop: 2, lineHeight: 1.1 }}>
                    {n(cuota, 2)}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#7c8492', fontWeight: 600, marginTop: 3 }}>impl. {n(impl, 1)}%</div>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        <AccordionSection icon="📰" title="Noticias y Alertas" open={!!exp.news} onToggle={() => tg('news')} alert={!!hasAlerts}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {hasAlerts && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                {p.tiene_lesiones       && <span style={{ fontSize: 11.5, fontWeight: 700, color: '#f87171', background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 20, padding: '3px 10px' }}>🚑 Lesiones</span>}
                {p.tiene_suspension     && <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fbbf24', background: 'rgba(251,191,36,.12)',  border: '1px solid rgba(251,191,36,.25)',  borderRadius: 20, padding: '3px 10px' }}>🟨 Suspensiones</span>}
                {p.hay_noticias_impacto && <span style={{ fontSize: 11.5, fontWeight: 700, color: '#f0a868', background: 'rgba(240,168,104,.12)', border: '1px solid rgba(240,168,104,.25)', borderRadius: 20, padding: '3px 10px' }}>📰 Noticias</span>}
              </div>
            )}
            <AnalysisText
              text={getSection(ana, 'NOTICIAS', 'LESIONES', 'ALERTAS') ?? undefined}
              fallback="Sin alertas relevantes en este momento."
            />
          </div>
        </AccordionSection>

        <AccordionSection icon="🏆" title="Mercados alternativos · TOP 5" open={!!exp.pred} onToggle={() => tg('pred')}>
          <AnalysisText
            text={getSection(ana, 'MERCADOS', 'TOP 5', 'ALTERNATIV') ?? undefined}
            fallback="Sin predicciones detalladas disponibles."
          />
        </AccordionSection>

        <AccordionSection icon="🎯" title="Conclusión del modelo" open={!!exp.concl} onToggle={() => tg('concl')}>
          {getSection(ana, 'CONCLUSIÓN', 'CONCLUSION') ? (
            <AnalysisText text={getSection(ana, 'CONCLUSIÓN', 'CONCLUSION')!} />
          ) : (
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: '#c4cad2', fontWeight: 500, padding: '14px 16px', background: '#101318', border: '1px solid #232830', borderRadius: 12 }}>
              El modelo XGBoost+Poisson predice {getPickLabel(p)} con {confStyle(p.confianza).label.toLowerCase()}
              ({getLeadPct(p).toFixed(0)}%). {ouPick} · BTTS {bttsPick}.
              {p.elo1 ? ` Elo ${p.equipo1}: ${p.elo1} vs ${p.equipo2}: ${p.elo2}.` : ''}
            </div>
          )}
        </AccordionSection>
      </div>
    </div>
  )
}

// ─── combinaciones view ──────────────────────────────────────────────────────

function buildCombos(predictions: Prediction[]) {
  const alta  = predictions.filter(p => p.confianza === 'Alta')
  const media = predictions.filter(p => p.confianza === 'Media')

  const mkCombo = (
    title: string, sub: string, tag: string,
    tagColor: string, tagBg: string,
    legs: { match: string; pick: string; odd: number }[]
  ) => {
    if (!legs.length) return null
    const totalOdd = legs.reduce((acc, l) => acc * l.odd, 1)
    const prob = 100 / totalOdd
    return {
      title, sub, tag, tagColor, tagBg, legs: legs.map(l => ({ ...l, odd: l.odd.toFixed(2) })),
      totalOdd: totalOdd.toFixed(2),
      prob: prob.toFixed(1) + '%',
      probColor: prob > 40 ? '#34d399' : prob > 25 ? '#fbbf24' : '#8b93a0',
    }
  }

  const toLegs = (ps: Prediction[]) =>
    ps.slice(0, 3).map(p => ({ match: p.partido, pick: getPickLabel(p), odd: getWinnerOdd(p) }))

  const goLegs = predictions.slice(0, 3).map(p => ({
    match: p.partido,
    pick: (p.prob_over25 ?? 0) >= 50 ? 'Over 2.5' : 'Under 2.5',
    odd: (p.prob_over25 ?? 0) >= 50
      ? (100 / Math.max(p.prob_over25 ?? 50, 1))
      : (100 / Math.max(100 - (p.prob_over25 ?? 50), 1)),
  }))

  return [
    mkCombo('Combinada Segura', '3 picks · solo confianza alta', 'SEGURA', '#34d399', 'rgba(52,211,153,.12)', toLegs(alta)),
    mkCombo('Combinada Valor', '3 picks · confianza media-alta', 'VALOR', '#fbbf24', 'rgba(251,191,36,.12)', toLegs([...alta.slice(0, 1), ...media.slice(0, 2)])),
    mkCombo('Combinada Goles', '3 picks · mercados O/U + BTTS', 'GOLES', '#4f95d6', 'rgba(79,149,214,.14)', goLegs),
  ].filter(Boolean)
}

// ─── main export ─────────────────────────────────────────────────────────────

interface Props { predictions: Prediction[]; dateDefault: string }

export default function PredictorView({ predictions, dateDefault }: Props) {
  const [dateQuery,   setDateQuery]   = useState(dateDefault)
  const [selectedComp, setSelectedComp] = useState('Mundial 2026')
  const [minConf,     setMinConf]     = useState('0')
  const [activeTab,   setActiveTab]   = useState('todas')
  const [selectedId,  setSelectedId]  = useState(predictions[0]?.id ?? '')

  const filtered = useMemo(() => {
    const minPct = parseInt(minConf, 10)
    let list = predictions.filter(p => {
      const lead = getLeadPct(p)
      return lead >= minPct
    })
    if (activeTab === 'seguras') list = list.filter(p => p.confianza === 'Alta')
    if (activeTab === 'medias')  list = list.filter(p => p.confianza === 'Media')
    return list
  }, [predictions, minConf, activeTab])

  const selected = filtered.find(p => p.id === selectedId) ?? filtered[0] ?? predictions[0]

  const countAlta  = predictions.filter(p => p.confianza === 'Alta').length
  const countMedia = predictions.filter(p => p.confianza === 'Media').length
  const combos     = useMemo(() => buildCombos(predictions), [predictions])

  const tabs = [
    { id: 'todas',         label: 'Todas',         count: predictions.length, dot: '#4f95d6' },
    { id: 'seguras',       label: 'Seguras',        count: countAlta,          dot: '#34d399' },
    { id: 'medias',        label: 'Medias',         count: countMedia,         dot: '#fbbf24' },
    { id: 'combinaciones', label: 'Combinaciones',  count: combos.length,      dot: '#f0a868' },
  ]

  const showCombos = activeTab === 'combinaciones'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* ── Sticky filter header ───────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(13,16,21,.86)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1c2127', padding: '18px 26px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 13 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.4px', color: '#f3f5f7' }}>Predicciones del día</h1>
            <div style={{ fontSize: 12.5, color: '#6b727c', fontWeight: 500, marginTop: 2 }}>
              Consulta el agente · fixtures + análisis del modelo
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#5b636e', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>Fecha</label>
            <input
              type="date"
              value={dateQuery}
              onChange={e => setDateQuery(e.target.value)}
              style={{ background: '#14171c', border: '1px solid #252b34', borderRadius: 10, padding: '9px 12px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5, fontWeight: 500, color: '#e8eaed', cursor: 'pointer' }}
            />
          </div>

          {/* Competition */}
          <div>
            <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#5b636e', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>Competición</label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedComp}
                onChange={e => setSelectedComp(e.target.value)}
                style={{ appearance: 'none', background: '#14171c', border: '1px solid #252b34', borderRadius: 10, padding: '9px 34px 9px 14px', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, color: '#e8eaed', cursor: 'pointer' }}
              >
                {['Mundial 2026', 'Champions League', 'Premier League', 'La Liga'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b727c', fontSize: 10 }}>▼</div>
            </div>
          </div>

          {/* Confidence min */}
          <div>
            <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#5b636e', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>Confianza mín.</label>
            <div style={{ position: 'relative' }}>
              <select
                value={minConf}
                onChange={e => setMinConf(e.target.value)}
                style={{ appearance: 'none', background: '#14171c', border: '1px solid #252b34', borderRadius: 10, padding: '9px 34px 9px 14px', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, color: '#e8eaed', cursor: 'pointer' }}
              >
                {[{ v: '0', label: 'Todas' }, { v: '50', label: '≥ 50%' }, { v: '65', label: '≥ 65%' }].map(o => (
                  <option key={o.v} value={o.v}>{o.label}</option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b727c', fontSize: 10 }}>▼</div>
            </div>
          </div>

          {/* Search */}
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f3f5f7', color: '#0a0c0f', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: 'inherit', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0a0c0f" strokeWidth="2.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            Buscar
          </button>
        </div>
      </header>

      {/* ── Content area ───────────────────────────────────────── */}
      <div style={{ padding: '20px 26px 44px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflow: 'auto' }}>

        {/* Summary strip + tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b727c' }}>
            Partidos del{' '}
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: '#e8eaed' }}>{dateQuery}</span>
            {' · '}
            <span style={{ color: '#e8eaed' }}>{predictions.length}</span> encontrados
          </div>
          <div style={{ flex: 1 }} />
          {tabs.map(t => {
            const active = activeTab === t.id
            return (
              <div
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 15px', borderRadius: 10,
                  fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                  border: `1px solid ${active ? '#39414c' : '#232830'}`,
                  color: active ? '#f3f5f7' : '#7c8492',
                  background: active ? 'rgba(255,255,255,.07)' : 'transparent',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.dot }} />
                {t.label}
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, opacity: .65 }}>{t.count}</span>
              </div>
            )
          })}
        </div>

        {/* Combinaciones grid */}
        {showCombos && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {combos.map((cb, i) => cb && (
              <div key={i} style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '17px 19px 15px', borderBottom: '1px solid #1c2127' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#f3f5f7', whiteSpace: 'nowrap' }}>{cb.title}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: cb.tagColor, background: cb.tagBg, padding: '3px 9px', borderRadius: 20 }}>{cb.tag}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b727c', fontWeight: 500, marginTop: 3 }}>{cb.sub}</div>
                </div>
                <div style={{ padding: '6px 19px' }}>
                  {cb.legs.map((lg, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: '1px solid #1c2127' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#dfe3e8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lg.match}</div>
                        <div style={{ fontSize: 11.5, color: '#7c8492', fontWeight: 600, marginTop: 1 }}>{lg.pick}</div>
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, color: '#34d399' }}>{lg.odd}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '15px 19px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', background: '#101318' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#6b727c', fontWeight: 600 }}>Cuota combinada</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: '#f3f5f7', letterSpacing: '-1px', lineHeight: 1.1 }}>{cb.totalOdd}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#6b727c', fontWeight: 600 }}>Prob. modelo</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 17, fontWeight: 600, color: cb.probColor }}>{cb.prob}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Master-detail */}
        {!showCombos && (
          <div style={{ display: 'grid', gridTemplateColumns: '362px 1fr', gap: 16, alignItems: 'start' }}>
            {/* Match list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#5b636e', fontSize: 13 }}>
                  No hay partidos para los filtros seleccionados.
                </div>
              ) : filtered.map(p => (
                <MatchCard
                  key={p.id}
                  p={p}
                  selected={p.id === (selected?.id ?? '')}
                  onClick={() => setSelectedId(p.id)}
                />
              ))}
            </div>

            {/* Detail panel */}
            {selected ? (
              <DetailPanel key={selected.id} p={selected} />
            ) : (
              <div style={{ background: '#14171c', border: '1px solid #232830', borderRadius: 16, padding: 40, textAlign: 'center', color: '#5b636e', fontSize: 13 }}>
                Selecciona un partido para ver el análisis.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
