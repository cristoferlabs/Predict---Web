import { NextResponse } from 'next/server'
import { supabase } from '@/lib/normalize'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabase
    .from('predicciones')
    .select('acierto_1x2, pred_1x2_confianza')
    .not('acierto_1x2', 'is', null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const total    = data.length
  const aciertos = data.filter(d => d.acierto_1x2).length
  const byConfianza = {
    Alta:  { total: 0, aciertos: 0 },
    Media: { total: 0, aciertos: 0 },
    Baja:  { total: 0, aciertos: 0 },
  }

  for (const d of data) {
    const c = d.pred_1x2_confianza as 'Alta' | 'Media' | 'Baja'
    if (byConfianza[c]) {
      byConfianza[c].total++
      if (d.acierto_1x2) byConfianza[c].aciertos++
    }
  }

  return NextResponse.json({
    total,
    aciertos,
    pct: total > 0 ? Math.round((aciertos / total) * 100) : 0,
    byConfianza,
  })
}
