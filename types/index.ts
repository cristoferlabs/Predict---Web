export interface PredictionSecciones {
  forma: string | null
  historico: string | null
  h2h: string | null
  jugadores: string | null
  noticias: string | null
  mercados: string | null
  conclusion: string | null
  completo: string | null
}

export interface Prediction {
  id: string
  partido: string
  fecha: string
  hora: string
  ronda: string
  grupo: string
  equipo1: string
  equipo2: string
  // Probabilities (0-100 scale)
  prob_equipo1: number
  prob_empate: number
  prob_equipo2: number
  prob_over25: number
  prob_btts: number
  // Prediction
  resultado_predicho: string
  confianza: 'Alta' | 'Media' | 'Baja'
  pred_over25: string | null
  pred_btts: string | null
  // Mathematical model
  lambda1: number | null
  lambda2: number | null
  elo1: number | null
  elo2: number | null
  // Market odds
  cuota1: number | null
  cuota_empate: number | null
  cuota2: number | null
  prob_impl1: number | null
  prob_impl_empate: number | null
  prob_impl2: number | null
  // Match stats
  corners_avg: number | null
  amarillas_avg: number | null
  tiros_avg: number | null
  // Post-match results
  resultado_real: string | null
  goles_equipo1: number | null
  goles_equipo2: number | null
  acierto: boolean | null
  // Parsed AI analysis sections
  secciones: PredictionSecciones
}

export interface TeamStats {
  played: number
  wins: number
  draws: number
  losses: number
  gf: number
  ga: number
}
