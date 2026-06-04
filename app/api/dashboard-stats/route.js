import { NextResponse } from 'next/server'

const TOKEN = process.env.VERCEL_ANALYTICS_TOKEN

const ALL_SITES = [
  { name: 'transformlearning.ai', id: 'prj_4YJwjZtwghfrcdIzozNbsV7qW3RA' },
  { name: 'study.transformlearning.ai', id: 'prj_xnhdEJBWtChEJNjYNNsJqa0oWqB6' },
  { name: 'findmyway.today', id: 'prj_RAZkBwtoig7LRzfLKtKvLtOwkr52' },
  { name: 'soltas.ai', id: 'prj_iCaS6Pwpl8fhbplNP98mcnVBtcdS' },
  { name: 'holdfast.today', id: 'prj_IvFItqf0djjoh1oJMZ3rKo8nNUnS' },
  { name: 'kateborgerjazz.com', id: 'prj_jDOGckx5Q6t3NLCL40qXaKux8Vzo' },
  { name: 'civicfeed.net', id: 'prj_SDfchE8diu9Vs6JXX8ZJekdq2vzu' },
  { name: 'findmyway-brasil', id: 'prj_Ffg9QsbFS1LiVib0L21qGWgiDEMu' },
  { name: 'findmyway-ph', id: 'prj_owsfl13I62bB2tMjsNqtTRK6kt3j' },
  { name: 'findmyway-ua', id: 'prj_VrFWndkqjDvGpGZ8EAqEAaIGozkk' },
  { name: 'hampshire-memories', id: 'prj_RzH54o6okGREVFA47FYGsTJUWTdy' },
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '7d'
  const filterSite = searchParams.get('site') || null

  const now = new Date()
  const daysBack = period === '24h' ? 1 : period === '30d' ? 30 : 7
  const fromDate = new Date(now - daysBack * 86400000).toISOString()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  // Vercel analytics for all sites (always fetch all for the cards)
  const sites = {}
  await Promise.all(ALL_SITES.map(async (site) => {
    try {
      const res = await fetch(
        `https://vercel.com/api/web-analytics/timeseries?projectId=${site.id}&from=${fromDate}&to=${now.toISOString()}`,
        { headers: { Authorization: `Bearer ${TOKEN}` }, next: { revalidate: 60 } }
      )
      const data = await res.json()
      const groups = data?.data?.groups?.all || []
      sites[site.name] = {
        views: groups.reduce((s, g) => s + g.total, 0),
        visitors: groups.reduce((s, g) => s + g.devices, 0),
        active: 0,
      }
    } catch {
      sites[site.name] = { views: 0, visitors: 0, active: 0 }
    }
  }))

  let locations = []
  let pages = []
  let campus = []

  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ujohihxjavfjungdlomj.supabase.co'
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (SUPABASE_KEY) {
      // Active in last 5 minutes (all sites)
      const fiveMinAgo = new Date(now - 5 * 60000).toISOString()
      const activeRes = await fetch(
        `${SUPABASE_URL}/rest/v1/page_views?select=site&created_at=gte.${fiveMinAgo}&order=created_at.desc&limit=500`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 0 } }
      )
      const activeRaw = await activeRes.json()
      for (const d of activeRaw) {
        const site = d.site || 'transformlearning.ai'
        if (sites[site]) sites[site].active = (sites[site].active || 0) + 1
      }

      // Locations + Pages (today, filtered by site if selected)
      const siteFilter = filterSite ? `&site=eq.${encodeURIComponent(filterSite)}` : ''
      const locRes = await fetch(
        `${SUPABASE_URL}/rest/v1/page_views?select=site,path,city,region,country&created_at=gte.${todayStart}${siteFilter}&order=created_at.desc&limit=500`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 60 } }
      )
      const locData = await locRes.json()

      const cityCounts = {}
      const pageCounts = {}
      for (const d of locData) {
        // Locations
        const city = d.city || 'Unknown'
        const region = d.region || ''
        const country = d.country || ''
        const key = `${city}, ${region} ${country}`.trim().replace(/,\s*$/, '')
        cityCounts[key] = (cityCounts[key] || 0) + 1

        // Pages
        const path = d.path || '/'
        pageCounts[path] = (pageCounts[path] || 0) + 1
      }
      locations = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])
      pages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])

      // Campus pages (period-matched, always unfiltered)
      const campusRes = await fetch(
        `${SUPABASE_URL}/rest/v1/page_views?select=path&path=like./campus-transformation*&created_at=gte.${fromDate}&order=created_at.desc&limit=500`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 60 } }
      )
      const campusRaw = await campusRes.json()
      const campusCounts = {}
      for (const d of campusRaw) {
        campusCounts[d.path] = (campusCounts[d.path] || 0) + 1
      }
      campus = Object.entries(campusCounts).sort((a, b) => b[1] - a[1])
    }
  } catch {}

  return NextResponse.json({ sites, locations, pages, campus, period })
}
