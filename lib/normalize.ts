import { createClient } from '@supabase/supabase-js'
import type { Prediction } from '@/types'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function maybeNum(v: unknown): number | null {
  if (v == null) return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

function impliedProb(odd: unknown): number | null {
  const o = maybeNum(odd)
  if (o == null || o <= 0) return null
  return Math.round((1 / o) * 1000) / 10
}

// Handles both 0-1 decimals and 0-100 scale from DB
function toPercent(v: unknown): number {
  const n = Number(v)
  if (isNaN(n) || n === 0) return 0
  return n > 1 ? +n.toFixed(1) : +(n * 100).toFixed(1)
}

function parseAnalisis(txt: string) {
  if (!txt) return {
    prob1: null, probD: null, prob2: null, probO25: null, probBTTS: null,
    lambda1: null, lambda2: null, confianza: null as 'Alta' | 'Media' | 'Baja' | null,
    forma: null, historico: null, h2h: null, jugadores: null,
    noticias: null, mercados: null, conclusion: null,
  }

  const numFn = (re: RegExp): number | null => {
    const m = txt.match(re)
    return m ? +m[1] : null
  }

  // Extract section content: find header, grab text until next emoji/box-drawing line
  const secFn = (re: RegExp): string | null => {
    const m = txt.match(re)
    if (!m) return null
    const start = txt.indexOf('\n', m.index!) + 1
    const rest = txt.slice(start)
    const lines = rest.split('\n')
    let end = rest.length
    let pos = 0
    for (let i = 1; i < lines.length; i++) {
      pos += lines[i - 1].length + 1
      const cp = lines[i].trimStart().codePointAt(0)
      if (cp != null && cp > 0x2500) { end = pos; break }
    }
    return rest.slice(0, end).trim() || null
  }

  return {
    prob1:     numFn(/local[:\s]+(\d+\.?\d*)%/i) ?? numFn(/(\d+\.?\d*)\s*%.*?gana/i),
    probD:     numFn(/empate[:\s]+(\d+\.?\d*)%/i),
    prob2:     numFn(/visita[:\s]+(\d+\.?\d*)%/i) ?? numFn(/gana[^%\n]*?(\d+\.?\d*)\s*%/i),
    probO25:   numFn(/over\s*2\.5[:\s]+(\d+\.?\d*)%/i),
    probBTTS:  numFn(/btts[:\s]+(?:si|sí)\s+(\d+\.?\d*)%/i),
    lambda1:   numFn(/λ[=\s]+(\d+\.?\d*)/),
    lambda2:   numFn(/λ\d*[=\s]+\d+\.?\d*[\s\S]*?λ\d*[=\s]+(\d+\.?\d*)/),
    confianza: (txt.match(/confianza[:\s]+(Alta|Media|Baja)/i)?.[1] ?? null) as 'Alta' | 'Media' | 'Baja' | null,
    forma:      secFn(/FORMA\s+ACTUAL/i),
    historico:  secFn(/HISTOR[ÍI]CO/i),
    h2h:        secFn(/H2H|HEAD[\s-]TO[\s-]HEAD/i),
    jugadores:  secFn(/JUGADORES|LESION/i),
    noticias:   secFn(/NOTICIAS/i),
    mercados:   secFn(/CUOTAS|MERCADOS/i),
    conclusion: secFn(/PREDICCI[OÓ]N|CONCLUSI[OÓ]N/i),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalize(row: Record<string, any>): Prediction {
  const txt = (row.analisis_completo as string) || ''
  const ana = parseAnalisis(txt)

  const prob1 = toPercent(row.prob_local)   || ana.prob1  || 0
  const probD = toPercent(row.prob_empate)  || ana.probD  || 0
  const prob2 = toPercent(row.prob_visita)  || ana.prob2  || 0
  const probO = toPercent(row.pred_prob_over25)    || ana.probO25  || 0
  const probB = toPercent(row.pred_prob_btts_si)   || ana.probBTTS || 0

  // pred_1x2 stores "equipo1"/"equipo2"/"empate" literals → map to real names
  const raw1x2 = (row.pred_1x2 as string) ?? ''
  const raw1x2Mapped =
    raw1x2 === 'equipo1' ? String(row.equipo1 ?? '') :
    raw1x2 === 'equipo2' ? String(row.equipo2 ?? '') :
    raw1x2 === 'empate'  ? 'Empate' : raw1x2

  // Compute winner from probabilities (most reliable)
  const resultado_predicho =
    prob1 > probD && prob1 > prob2 ? String(row.equipo1 ?? '') :
    prob2 > probD && prob2 > prob1 ? String(row.equipo2 ?? '') :
    prob1 > 0 || probD > 0 || prob2 > 0 ? 'Empate' :
    raw1x2Mapped

  return {
    id:      String(row.id ?? ''),
    equipo1: String(row.equipo1 ?? ''),
    equipo2: String(row.equipo2 ?? ''),
    partido: `${row.equipo1 ?? ''} vs ${row.equipo2 ?? ''}`,
    fecha:   String(row.fecha ?? ''),
    hora:    (row.hora as string)?.slice(0, 5) ?? '',
    ronda:   String(row.ronda ?? ''),
    grupo:   (row.grupo as string)?.replace(/^(Group|Grupo)\s*/i, '') ?? '',

    prob_equipo1: prob1,
    prob_empate:  probD,
    prob_equipo2: prob2,
    prob_over25:  probO,
    prob_btts:    probB,

    resultado_predicho,
    confianza: ((row.pred_1x2_confianza as string) || ana.confianza || 'Baja') as 'Alta' | 'Media' | 'Baja',

    pred_over25: (row.pred_over25 as string | null) ?? null,
    pred_btts:   (row.pred_btts   as string | null) ?? null,

    lambda1: Number(row.lambda1) || null,
    lambda2: Number(row.lambda2) || null,
    elo1:    Number(row.elo1)    || null,
    elo2:    Number(row.elo2)    || null,

    cuota1:       maybeNum(row.odd_local),
    cuota_empate: maybeNum(row.odd_empate),
    cuota2:       maybeNum(row.odd_visita),
    prob_impl1:       impliedProb(row.odd_local),
    prob_impl_empate: impliedProb(row.odd_empate),
    prob_impl2:       impliedProb(row.odd_visita),

    corners_avg:   maybeNum(row.corners_avg),
    amarillas_avg: maybeNum(row.amarillas_avg),
    tiros_avg:     maybeNum(row.tiros_avg),

    resultado_real: (row.resultado_1x2 as string | null) ?? null,
    goles_equipo1:  maybeNum(row.resultado_goles1),
    goles_equipo2:  maybeNum(row.resultado_goles2),
    acierto:        (row.acierto_1x2 as boolean | null) ?? null,

    secciones: {
      forma:      ana.forma      ?? null,
      historico:  ana.historico  ?? null,
      h2h:        ana.h2h        ?? null,
      jugadores:  ana.jugadores  ?? null,
      noticias:   ana.noticias   ?? null,
      mercados:   ana.mercados   ?? null,
      conclusion: ana.conclusion ?? null,
      completo:   txt || null,
    },
  }
}
