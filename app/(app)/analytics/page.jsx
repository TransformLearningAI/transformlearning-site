'use client'
import { useState, useEffect } from 'react'

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [hours, setHours] = useState(24)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics?hours=${hours}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [hours])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Site Analytics</h1>
          <p className="text-sm text-brand-gray mt-1">Visitor locations and page views</p>
        </div>
        <div className="flex gap-2">
          {[6, 24, 48, 168].map(h => (
            <button key={h} onClick={() => setHours(h)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${hours === h ? 'bg-navy text-white' : 'bg-brand-soft border border-brand-border text-brand-gray hover:bg-brand-mist'}`}>
              {h < 24 ? `${h}h` : `${h / 24}d`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !data || data.error ? (
        <div className="text-center py-20 text-brand-gray">
          <p className="font-medium">No data yet</p>
          <p className="text-sm mt-1">Analytics will appear once visitors start hitting the site after deploy.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">Total Views</div>
              <div className="text-3xl font-black text-navy">{data.totalViews}</div>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">Locations</div>
              <div className="text-3xl font-black text-navy">{data.byLocation?.length || 0}</div>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">Pages Hit</div>
              <div className="text-3xl font-black text-navy">{data.byPath?.length || 0}</div>
            </div>
          </div>

          {/* Locations table */}
          <div className="rounded-2xl border border-brand-border bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-border">
              <h2 className="font-bold text-navy">Visitor Locations</h2>
            </div>
            <div className="divide-y divide-brand-border">
              {data.byLocation?.length > 0 ? data.byLocation.map((loc, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-soft flex items-center justify-center text-[10px] font-bold text-brand-gray">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-navy">
                        {[loc.city, loc.region, loc.country].filter(Boolean).join(', ') || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 rounded-full bg-brand-soft overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (loc.views / (data.byLocation[0]?.views || 1)) * 100)}%`,
                          background: '#00A8A8'
                        }} />
                    </div>
                    <span className="text-sm font-bold text-navy w-10 text-right">{loc.views}</span>
                  </div>
                </div>
              )) : (
                <div className="px-5 py-8 text-center text-sm text-brand-gray">
                  No location data yet — geo resolves only on Vercel production edge.
                </div>
              )}
            </div>
          </div>

          {/* Pages table */}
          <div className="rounded-2xl border border-brand-border bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-border">
              <h2 className="font-bold text-navy">Pages</h2>
            </div>
            <div className="divide-y divide-brand-border">
              {data.byPath?.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-soft flex items-center justify-center text-[10px] font-bold text-brand-gray">
                      {i + 1}
                    </div>
                    <span className="text-sm font-mono text-navy">{p.path}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 rounded-full bg-brand-soft overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (p.views / (data.byPath[0]?.views || 1)) * 100)}%`,
                          background: '#0C1F3F'
                        }} />
                    </div>
                    <span className="text-sm font-bold text-navy w-10 text-right">{p.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
