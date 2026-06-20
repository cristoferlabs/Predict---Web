import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalize } from '@/lib/normalize'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const fecha     = searchParams.get('fecha')
  const upcoming  = searchParams.get('upcoming') === 'true'
  const withOdds  = searchParams.get('withOdds') === 'true'
  const played    = searchParams.get('played') === 'true'

  try {
    if (played) {
      const { data, error } = await supabase
        .from('predicciones')
        .select('*')
        .not('resultado_1x2', 'is', null)
        .order('fecha', { ascending: false })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json((data ?? []).map(normalize))
    }

    if (withOdds) {
      const { data, error } = await supabase
        .from('predicciones')
        .select('*')
        .not('odd_local', 'is', null)
        .order('fecha', { ascending: true })
        .limit(50)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json((data ?? []).map(normalize))
    }

    if (upcoming) {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('predicciones')
        .select('*')
        .gte('fecha', today)
        .order('fecha', { ascending: true })
        .order('hora',  { ascending: true })
        .limit(20)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json((data ?? []).map(normalize))
    }

    // Default: by fecha (or today)
    const targetDate = fecha ?? new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('predicciones')
      .select('*')
      .eq('fecha', targetDate)
      .order('hora', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // If no predictions for targetDate, return all (latest first, limit 10)
    if ((data ?? []).length === 0 && !fecha) {
      const { data: all, error: allErr } = await supabase
        .from('predicciones')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(10)
      if (allErr) return NextResponse.json([])
      return NextResponse.json((all ?? []).map(normalize))
    }

    return NextResponse.json((data ?? []).map(normalize))
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
