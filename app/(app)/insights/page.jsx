'use client'
import { useState, useEffect } from 'react'

export default function InsightsPage() {
  const [hours, setHours] = useState(24)
  const [tlData, setTlData] = useState(null)
  const [vercelTL, setVercelTL] = useState(null)
  const [vercelFMW, setVercelFMW] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    // Fetch Transform Learning geo analytics
    fetch(`/api/analytics?hours=${hours}`)
      .then(r => r.json())
      .then(d => setTlData(d))
      .catch(() => {})

    // Fetch Vercel Web Analytics for both sites
    const from = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
    const to = new Date().toISOString()

    // Transform Learning
    Promise.all([
      fetch(`/api/insights-proxy?site=transformlearning&type=path&from=${from}&to=${to}`).then(r => r.json()).catch(() => null),
      fetch(`/api/insights-proxy?site=transformlearning&type=referrer_hostname&from=${from}&to=${to}`).then(r => r.json()).catch(() => null),
      fetch(`/api/insights-proxy?site=transformlearning&type=country&from=${from}&to=${to}`).then(r => r.json()).catch(() => null),
      fetch(`/api/insights-proxy?site=transformlearning&type=device_type&from=${from}&to=${to}`).then(r => r.json()).catch(() => null),
    ]).then(([paths, referrers, countries, devices]) => {
      setVercelTL({ paths: paths?.data, referrers: referrers?.data, countries: countries?.data, devices: devices?.data })
    })

    // Find My Way
    Promise.all([
      fetch(`/api/insights-proxy?site=findmyway&type=path&from=${from}&to=${to}`).then(r => r.json()).catch(() => null),
      fetch(`/api/insights-proxy?site=findmyway&type=referrer_hostname&from=${from}&to=${to}`).then(r => r.json()).catch(() => null),
      fetch(`/api/insights-proxy?site=findmyway&type=country&from=${from}&to=${to}`).then(r => r.json()).catch(() => null),
      fetch(`/api/insights-proxy?site=findmyway&type=device_type&from=${from}&to=${to}`).then(r => r.json()).catch(() => null),
    ]).then(([paths, referrers, countries, devices]) => {
      setVercelFMW({ paths: paths?.data, referrers: referrers?.data, countries: countries?.data, devices: devices?.data })
    })

    setTimeout(() => setLoading(false), 2000)
  }, [hours])

  function totalViews(data) {
    return data?.reduce((sum, d) => sum + (d.total || 0), 0) || 0
  }

  function totalDevices(data) {
    return data?.reduce((sum, d) => sum + (d.devices || 0), 0) || 0
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Insights</h1>
          <p className="text-sm text-brand-gray mt-1">Both sites. One view.</p>
        </div>
        <div className="flex gap-2">
          {[6, 24, 48, 168, 720].map(h => (
            <button key={h} onClick={() => setHours(h)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${hours === h ? 'bg-navy text-white' : 'bg-brand-soft border border-brand-border text-brand-gray hover:bg-brand-mist'}`}>
              {h < 24 ? `${h}h` : h < 168 ? `${h / 24}d` : h === 168 ? '7d' : '30d'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Transform Learning summary */}
        <div className="rounded-2xl border border-brand-border bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ background: '#00A8A8' }} />
            <h2 className="font-bold text-navy">transformlearning.ai</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-black text-navy">{totalViews(vercelTL?.paths)}</div>
              <div className="text-[10px] text-brand-gray uppercase tracking-wider">Page views</div>
            </div>
            <div>
              <div className="text-2xl font-black text-navy">{totalDevices(vercelTL?.devices)}</div>
              <div className="text-[10px] text-brand-gray uppercase tracking-wider">Visitors</div>
            </div>
            <div>
              <div className="text-2xl font-black text-navy">{vercelTL?.paths?.length || 0}</div>
              <div className="text-[10px] text-brand-gray uppercase tracking-wider">Pages hit</div>
            </div>
          </div>
        </div>

        {/* Find My Way summary */}
        <div className="rounded-2xl border border-brand-border bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ background: '#4F8A5B' }} />
            <h2 className="font-bold text-navy">findmyway.today</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-black text-navy">{totalViews(vercelFMW?.paths)}</div>
              <div className="text-[10px] text-brand-gray uppercase tracking-wider">Page views</div>
            </div>
            <div>
              <div className="text-2xl font-black text-navy">{totalDevices(vercelFMW?.devices)}</div>
              <div className="text-[10px] text-brand-gray uppercase tracking-wider">Visitors</div>
            </div>
            <div>
              <div className="text-2xl font-black text-navy">{vercelFMW?.paths?.length || 0}</div>
              <div className="text-[10px] text-brand-gray uppercase tracking-wider">Pages hit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail panels side by side */}
      <div className="grid grid-cols-2 gap-6">
        {/* TL Detail */}
        <div className="space-y-6">
          {/* Pages */}
          <SitePanel title="Pages" color="#00A8A8" data={vercelTL?.paths} labelKey="key" />

          {/* Locations (from geo middleware) */}
          {tlData?.byLocation?.length > 0 && (
            <div className="rounded-2xl border border-brand-border bg-white overflow-hidden">
              <div className="px-5 py-3 border-b border-brand-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#00A8A8' }} />
                <h3 className="font-bold text-navy text-sm">Visitor Locations</h3>
              </div>
              <div className="divide-y divide-brand-border max-h-64 overflow-y-auto">
                {tlData.byLocation.map((loc, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-2.5">
                    <span className="text-sm text-navy">
                      {[loc.city, loc.region, loc.country].filter(Boolean).join(', ') || 'Unknown'}
                    </span>
                    <span className="text-sm font-bold text-navy">{loc.views}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referrers */}
          <SitePanel title="Referrers" color="#00A8A8" data={vercelTL?.referrers} labelKey="key" />

          {/* Devices */}
          <SitePanel title="Devices" color="#00A8A8" data={vercelTL?.devices} labelKey="key" />

          {/* Countries */}
          <SitePanel title="Countries" color="#00A8A8" data={vercelTL?.countries} labelKey="key" />
        </div>

        {/* FMW Detail */}
        <div className="space-y-6">
          <SitePanel title="Pages" color="#4F8A5B" data={vercelFMW?.paths} labelKey="key" />
          <SitePanel title="Referrers" color="#4F8A5B" data={vercelFMW?.referrers} labelKey="key" />
          <SitePanel title="Devices" color="#4F8A5B" data={vercelFMW?.devices} labelKey="key" />
          <SitePanel title="Countries" color="#4F8A5B" data={vercelFMW?.countries} labelKey="key" />
        </div>
      </div>
    </div>
  )
}

function SitePanel({ title, color, data, labelKey }) {
  if (!data?.length) return null
  const max = data[0]?.total || 1
  return (
    <div className="rounded-2xl border border-brand-border bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-brand-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <h3 className="font-bold text-navy text-sm">{title}</h3>
      </div>
      <div className="divide-y divide-brand-border max-h-64 overflow-y-auto">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-2.5 gap-3">
            <span className="text-sm text-navy truncate flex-1">{d[labelKey] || '(direct)'}</span>
            <div className="flex items-center gap-3">
              <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(d.total / max) * 100}%`, background: color }} />
              </div>
              <span className="text-sm font-bold text-navy w-8 text-right">{d.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
