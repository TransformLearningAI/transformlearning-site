import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = await createServiceClient()

  const { searchParams } = new URL(request.url)
  const hours = parseInt(searchParams.get('hours') || '24', 10)
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

  // City/region/country breakdown
  const { data: views, error } = await supabase
    .from('page_views')
    .select('city, region, country, path, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Aggregate by location
  const locations = {}
  for (const v of views) {
    const key = [v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown'
    if (!locations[key]) locations[key] = { city: v.city, region: v.region, country: v.country, views: 0 }
    locations[key].views++
  }

  const byLocation = Object.values(locations).sort((a, b) => b.views - a.views)

  // Aggregate by path
  const paths = {}
  for (const v of views) {
    paths[v.path] = (paths[v.path] || 0) + 1
  }
  const byPath = Object.entries(paths).sort((a, b) => b[1] - a[1]).map(([path, views]) => ({ path, views }))

  return NextResponse.json({
    period: `Last ${hours} hours`,
    totalViews: views.length,
    byLocation,
    byPath,
  })
}
