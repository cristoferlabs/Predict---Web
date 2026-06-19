export interface Prediction {
  id: string
  created_at: string
  partido: string
  fecha: string
  hora: string
  ronda: string
  grupo: string
  equipo1: string
  equipo2: string
  prob_equipo1: number
  prob_empate: number
  prob_equipo2: number
  resultado_predicho: string
  confianza: 'Alta' | 'Media' | 'Baja'
  prob_over25: number
  prob_btts: number
  lambda1: number
  lambda2: number
  elo1: number
  elo2: number
  // mercado
  cuota1: number | null
  cuota_empate: number | null
  cuota2: number | null
  prob_impl1: number | null
  prob_impl_empate: number | null
  prob_impl2: number | null
  // resultado real (se llena después del partido)
  resultado_real: string | null
  goles_equipo1: number | null
  goles_equipo2: number | null
  acierto: boolean | null
  // mercados alternativos y stats
  corners_avg: number | null
  amarillas_avg: number | null
  tiros_avg: number | null
  top5_apuestas: AlternativeMarket[] | null
  // predicción textual over/btts (del agente)
  pred_over25: string | null     // "Over 2.5" | "Under 2.5"
  pred_btts: string | null       // "Sí" | "No"
  // análisis IA completo
  analisis_completo: string | null
  tiene_lesiones: boolean | null
  tiene_suspension: boolean | null
  hay_noticias_impacto: boolean | null
}

export interface AlternativeMarket {
  mercado: string
  probabilidad: number
  riesgo: 'Bajo' | 'Medio' | 'Alto'
}

export interface TeamStats {
  played: number
  wins: number
  draws: number
  losses: number
  gf: number
  ga: number
}
