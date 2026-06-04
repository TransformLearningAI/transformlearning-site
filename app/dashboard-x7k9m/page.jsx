'use client'
import { useState, useEffect } from 'react'

const SITES = [
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

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [locations, setLocations] = useState(null)
  const [pages, setPages] = useState(null)
  const [campusData, setCampusData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [period, setPeriod] = useState('7d')
  const [selectedSite, setSelectedSite] = useState(null) // null = all sites

  async function fetchData(p) {
    setLoading(true)
    try {
      const siteParam = selectedSite ? `&site=${encodeURIComponent(selectedSite)}` : ''
      const res = await fetch(`/api/dashboard-stats?period=${p || period}${siteParam}`)
      const d = await res.json()
      setData(d.sites)
      setLocations(d.locations)
      setPages(d.pages)
      setCampusData(d.campus)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchData(period)
    const interval = setInterval(() => fetchData(period), 60000)
    return () => clearInterval(interval)
  }, [period, selectedSite])

  function switchPeriod(p) {
    setPeriod(p)
  }

  function clickSite(name) {
    setSelectedSite(selectedSite === name ? null : name)
  }

  const totalViews = data ? Object.values(data).reduce((s, d) => s + (d.views || 0), 0) : 0
  const totalVisitors = data ? Object.values(data).reduce((s, d) => s + (d.visitors || 0), 0) : 0
  const totalActive = data ? Object.values(data).reduce((s, d) => s + (d.active || 0), 0) : 0
  const periodLabel = period === '24h' ? 'Last 24 Hours' : period === '7d' ? 'Last 7 Days' : 'Last 30 Days'

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Transform Learning — Live Dashboard</h1>
            <p className="text-sm text-gray-500">
              {periodLabel} · {selectedSite ? selectedSite : 'All sites'} · Refreshes every 60s
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-800">
              {[
                { key: '24h', label: '24h' },
                { key: '7d', label: '7 days' },
                { key: '30d', label: '30 days' },
              ].map(opt => (
                <button key={opt.key} onClick={() => switchPeriod(opt.key)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          period === opt.key ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-gray-300'
                        }`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-400">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{totalVisitors.toLocaleString()} visitors</p>
              {totalActive > 0 && (
                <p className="text-xs text-green-400 mt-0.5 flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {totalActive} active (5m)
                </p>
              )}
              {lastUpdated && <p className="text-[10px] text-gray-600">Updated {lastUpdated}</p>}
            </div>
          </div>
        </div>

        {loading && !data && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Loading stats...</p>
          </div>
        )}

        {data && (
          <>
            {/* Site Cards — clickable */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {SITES.map(site => {
                const d = data[site.name] || { views: 0, visitors: 0, active: 0 }
                const pct = totalViews > 0 ? Math.round(d.views / totalViews * 100) : 0
                const isSelected = selectedSite === site.name
                return (
                  <button key={site.name} onClick={() => clickSite(site.name)}
                          className={`text-left bg-gray-900 rounded-xl p-4 border transition-all ${
                            isSelected ? 'border-cyan-500 ring-1 ring-cyan-500/30' : 'border-gray-800 hover:border-gray-700'
                          }`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-500 truncate">{site.name}</p>
                      {d.active > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-green-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          {d.active}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-white">{(d.views || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                    <p className="text-xs text-gray-600">{(d.visitors || 0).toLocaleString()} visitors · {pct}%</p>
                    <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-500" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                )
              })}
              {/* All sites button */}
              {selectedSite && (
                <button onClick={() => setSelectedSite(null)}
                        className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 flex items-center justify-center">
                  <p className="text-xs text-gray-500">Show all sites ×</p>
                </button>
              )}
            </div>

            {/* Locations + Pages — filtered by selected site */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Top Locations (Today){selectedSite ? ` — ${selectedSite}` : ''}
                </h2>
                <div className="space-y-2">
                  {locations && locations.length > 0 ? locations.slice(0, 15).map(([loc, count], i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{loc}</span>
                      <span className="text-sm text-cyan-400 font-mono">{count}</span>
                    </div>
                  )) : <p className="text-sm text-gray-600">No location data today</p>}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Top Pages (Today){selectedSite ? ` — ${selectedSite}` : ''}
                </h2>
                <div className="space-y-2">
                  {pages && pages.length > 0 ? pages.slice(0, 15).map(([page, count], i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 truncate mr-4">{page}</span>
                      <span className="text-sm text-cyan-400 font-mono shrink-0">{count}</span>
                    </div>
                  )) : <p className="text-sm text-gray-600">No page data today</p>}
                </div>
              </div>
            </div>

            {/* Campus Transformation — always show */}
            {campusData && campusData.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-8">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Campus Transformation Pages ({periodLabel})</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {campusData.map(([page, count], i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 truncate mr-4">{page}</span>
                      <span className="text-sm text-cyan-400 font-mono shrink-0">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Links</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Vercel Analytics', url: 'https://vercel.com/jeff-7385s-projects' },
                  { label: 'Supabase', url: 'https://supabase.com/dashboard/project/ujohihxjavfjungdlomj' },
                  { label: 'Campus Transformation', url: '/campus-transformation' },
                  { label: 'CivicFeed', url: 'https://civicfeed.net' },
                  { label: 'FindMyWay', url: 'https://findmyway.today' },
                  { label: 'Resend', url: 'https://resend.com/emails' },
                ].map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                     className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    {link.label} →
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
