'use client'
import { useState } from 'react'

const SUPERVISORS = [
  { name: 'Bruce Hezlep', role: 'Chairman', party: 'R', since: 2013, termExpires: 2031, note: 'Reelected Nov 2025 — beat Brandon Dukes 50.6% to 49.3%' },
  { name: 'John Skorupan', role: 'Supervisor', party: 'R', since: 1999, termExpires: 2029, note: 'Longest-tenured supervisor — 27 years' },
  { name: 'Karen Newpol', role: 'Supervisor', party: 'R', since: 2022, termExpires: 2027, note: 'Appointed 2022 replacing deceased Dick Hadley; elected 2023' },
  { name: 'Anthony Bertolino', role: 'Supervisor', party: '—', since: 2025, termExpires: 2027, note: 'Appointed Dec 2025 replacing retired Mike Manipole' },
]

const BUDGET = {
  total: 109533744,
  generalFund: 29900000,
  enterprise: 41100000,
  specialRevenue: 7600000,
  capital: 30900000,
  millage: 15.75,
  prevMillage: 13.25,
  creditRating: 'Aaa',
}

const MILLAGE = [
  { label: 'General Purposes', mills: 8.03 },
  { label: 'Fire Services', mills: 2.37 },
  { label: 'Recreational Investment (NEW)', mills: 2.50, isNew: true },
  { label: 'Public Buildings', mills: 1.00 },
  { label: 'Road Equipment', mills: 0.85 },
  { label: 'Library', mills: 1.00 },
]

const RECENT_ACTIONS = [
  { date: 'Apr 2, 2026', action: 'Approved road & infrastructure maintenance projects for summer', type: 'infrastructure', votes: '5-0' },
  { date: 'Feb 12, 2026', action: 'Regular board meeting — routine business', type: 'meeting', votes: '—' },
  { date: 'Feb 5, 2026', action: 'Approved 5 vehicle/equipment purchases: $80K trash carts, $152K Ford F-600, $46K Ford Explorer', type: 'spending', votes: '5-0' },
  { date: 'Feb 5, 2026', action: 'Authorized bids for Route 19 signal replacement and 2026 paving program', type: 'infrastructure', votes: '5-0' },
  { date: 'Jan 5, 2026', action: 'Reorganization: Hezlep reelected chairman; Kenneth Ruckel sworn in as Police Chief', type: 'governance', votes: 'Unanimous' },
  { date: 'Dec 12, 2025', action: 'Approved 2026 budget ($109.5M) with 2.5-mill tax increase for recreation', type: 'budget', votes: '5-0' },
  { date: 'Dec 12, 2025', action: 'Appointed Anthony Bertolino to fill Manipole vacancy', type: 'governance', votes: 'Unanimous' },
  { date: 'Nov 2025', action: 'Adopted ordinance making Township Manager position optional (was mandatory since 2014)', type: 'ordinance', votes: 'Unanimous' },
]

const PROJECTS = [
  { name: 'Franklin Road Corridor Safety', cost: '$19.1M', timeline: 'Apr 2024 – Nov 2027', status: 'active', desc: 'Shoulder widening, rumble strips, drainage, new water/gas lines. PennDOT-funded.' },
  { name: 'Route 19 Signal Replacement', cost: 'TBD', timeline: 'Bids authorized Feb 2026', status: 'planning', desc: 'Full signal replacement at Route 19 / Short Street plus sidewalk and ADA ramps.' },
  { name: '2026 Paving Program', cost: 'TBD', timeline: 'Bids due Mar 19, 2026', status: 'planning', desc: '100K SY pavement rejuvenation, 4,900 tons resurfacing, 110K SY chip seal.' },
  { name: 'Recreation Fields (NEW levy)', cost: 'Funded by 2.5-mill levy', timeline: '2026', status: 'active', desc: 'Baseball/soccer turf, Powell Farm upgrades, solar lighting at Graham Park, 2 new fields at Community Park North.' },
  { name: 'Brush Creek Water Facility', cost: 'Capital budget', timeline: '2026', status: 'active', desc: 'Solids handling upgrades at water pollution control facility.' },
  { name: 'Coal Run Watershed Study', cost: 'TBD', timeline: '2026', status: 'planning', desc: 'Environmental study of Coal Run watershed.' },
  { name: 'Missing Links Sidewalk Program', cost: 'Annual', timeline: 'Ongoing', status: 'active', desc: 'Filling gaps in pedestrian infrastructure.' },
]

const HOT_ISSUES = [
  { title: 'Oil & Gas Development Letters', date: 'Aug 2025', severity: 'high', desc: 'Homeowners received letters indicating their properties fall within a potential area of oil/gas development between Butler and Beaver counties. Residents organized meetings. Township, PennEnergy, and PA DEP contacted.' },
  { title: '2.5-Mill Tax Increase', date: 'Dec 2025', severity: 'medium', desc: 'First millage increase in years — from 13.25 to 15.75 mills. New 2.5-mill recreation levy adds ~$60/year per household. Approved 5-0 but generated public debate.' },
  { title: 'Route 19 Mixed-Use Development', date: 'Oct 2025', severity: 'medium', desc: 'Proposed retail, restaurants, gas station, and 32 apartment units along Route 19. Mixed reactions from residents about density and traffic.' },
  { title: 'Rapid Growth & Planning', date: 'Ongoing', severity: 'watch', desc: 'Population surpassed 35,000. Township launched community feedback sessions for future growth, land use, transportation. Planning firm conducting public forums and surveys.' },
]

const POPULATION = [
  { year: 1990, pop: 15000 },
  { year: 2000, pop: 23625 },
  { year: 2010, pop: 28098 },
  { year: 2020, pop: 33185 },
  { year: 2026, pop: 35946 },
]

const typeColors = {
  spending: '#FF6B4A',
  infrastructure: '#00A8A8',
  governance: '#0C1F3F',
  budget: '#FF6B4A',
  ordinance: '#5A3E6B',
  meeting: '#94A3B8',
}

const severityColors = {
  high: '#FF6B4A',
  medium: '#F59E0B',
  watch: '#00A8A8',
}

const statusColors = {
  active: '#4F8A5B',
  planning: '#00A8A8',
}

function fmt(n) {
  return n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`
}

export default function CranberryDashboard() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="min-h-screen" style={{ background: '#F4F7FB' }}>
      {/* Header */}
      <header style={{ background: '#0C1F3F' }}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px rgba(74,222,128,0.5)' }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Live Municipal Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Cranberry Township</h1>
              <p className="text-sm text-white/40 mt-1">Butler County, PA — Population 35,946 — Moody's Aaa rated</p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-2xl font-black text-white">{BUDGET.millage} <span className="text-sm font-normal text-white/40">mills</span></div>
              <div className="text-xs text-white/40">2026 property tax rate (↑ from {BUDGET.prevMillage})</div>
              <div className="text-xs text-green-400 mt-1">Aaa credit rating — only one in Western PA</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'money', label: 'Money' },
              { id: 'actions', label: 'Board Actions' },
              { id: 'projects', label: 'Projects' },
              { id: 'issues', label: 'Hot Issues' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition ${tab === t.id ? 'bg-[#F4F7FB] text-[#0C1F3F]' : 'text-white/40 hover:text-white/70'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* ══ OVERVIEW ══ */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '2026 Budget', value: '$109.5M', sub: '↑ from $98M in 2025' },
                { label: 'Population', value: '35,946', sub: '↑ 8.3% since 2020' },
                { label: 'Tax Rate', value: '15.75 mills', sub: '↑ 2.5 mills (recreation)' },
                { label: 'Police Force', value: '31 officers', sub: 'New chief: Kenneth Ruckel' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{s.label}</div>
                  <div className="text-2xl font-black" style={{ color: '#0C1F3F' }}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Board of Supervisors */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-bold" style={{ color: '#0C1F3F' }}>Board of Supervisors</h2>
                <p className="text-xs text-gray-400 mt-0.5">5 members, 6-year terms. Meet 2nd & 4th Thursday. Manager: Dan Santoro</p>
              </div>
              <div className="divide-y divide-gray-100">
                {SUPERVISORS.map(s => (
                  <div key={s.name} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm" style={{ color: '#0C1F3F' }}>{s.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.role === 'Chairman' ? 'rgba(0,168,168,0.1)' : 'rgba(12,31,63,0.06)', color: s.role === 'Chairman' ? '#00A8A8' : '#0C1F3F' }}>
                          {s.role}
                        </span>
                        {s.party !== '—' && <span className="text-[10px] text-gray-400">({s.party})</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{s.note}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Since {s.since}</div>
                      <div className="text-xs text-gray-400">Term expires {s.termExpires}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Population growth */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold mb-4" style={{ color: '#0C1F3F' }}>Population Growth</h2>
              <div className="flex items-end gap-3 h-40">
                {POPULATION.map(p => {
                  const maxPop = 36000
                  const pct = (p.pop / maxPop) * 100
                  return (
                    <div key={p.year} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-bold" style={{ color: '#0C1F3F' }}>{(p.pop / 1000).toFixed(1)}K</span>
                      <div className="w-full rounded-t-lg" style={{ height: `${pct}%`, background: p.year === 2026 ? '#00A8A8' : '#0C1F3F', opacity: p.year === 2026 ? 1 : 0.2 + (p.pop / maxPop) * 0.6 }} />
                      <span className="text-[10px] text-gray-400">{p.year}</span>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Population more than doubled since 1990. One of the fastest-growing communities in the Pittsburgh metro.</p>
            </div>

            {/* Latest actions preview */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-bold" style={{ color: '#0C1F3F' }}>Recent Board Actions</h2>
                <button onClick={() => setTab('actions')} className="text-xs font-bold" style={{ color: '#00A8A8' }}>View all →</button>
              </div>
              <div className="divide-y divide-gray-100">
                {RECENT_ACTIONS.slice(0, 4).map((a, i) => (
                  <div key={i} className="px-6 py-3 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: typeColors[a.type] || '#94A3B8' }} />
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: '#0C1F3F' }}>{a.action}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-gray-400">{a.date}</span>
                        {a.votes !== '—' && <span className="text-[10px] font-bold" style={{ color: '#4F8A5B' }}>Vote: {a.votes}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ MONEY ══ */}
        {tab === 'money' && (
          <div className="space-y-6">
            {/* Budget breakdown */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold mb-1" style={{ color: '#0C1F3F' }}>2026 Budget: {fmt(BUDGET.total)}</h2>
              <p className="text-xs text-gray-400 mb-6">Approved December 11, 2025</p>
              <div className="space-y-3">
                {[
                  { label: 'Enterprise Funds (water, sewer)', amount: BUDGET.enterprise, color: '#00A8A8' },
                  { label: 'Capital Funds', amount: BUDGET.capital, color: '#5A3E6B' },
                  { label: 'General Fund', amount: BUDGET.generalFund, color: '#0C1F3F' },
                  { label: 'Special Revenue Funds', amount: BUDGET.specialRevenue, color: '#4F8A5B' },
                ].map(b => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm" style={{ color: '#0C1F3F' }}>{b.label}</span>
                      <span className="text-sm font-bold" style={{ color: '#0C1F3F' }}>{fmt(b.amount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(b.amount / BUDGET.total) * 100}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Millage breakdown */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold mb-1" style={{ color: '#0C1F3F' }}>Property Tax: {BUDGET.millage} mills</h2>
              <p className="text-xs text-gray-400 mb-6">Up from {BUDGET.prevMillage} mills in 2025 (+{(BUDGET.millage - BUDGET.prevMillage).toFixed(2)} mills)</p>
              <div className="space-y-2">
                {MILLAGE.map(m => (
                  <div key={m.label} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: '#0C1F3F' }}>{m.label}</span>
                      {m.isNew && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,107,74,0.1)', color: '#FF6B4A' }}>NEW</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(m.mills / BUDGET.millage) * 100}%`, background: m.isNew ? '#FF6B4A' : '#0C1F3F' }} />
                      </div>
                      <span className="text-sm font-bold w-16 text-right" style={{ color: '#0C1F3F' }}>{m.mills} mills</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,107,74,0.06)', border: '1px solid rgba(255,107,74,0.15)' }}>
                <p className="text-xs" style={{ color: '#FF6B4A' }}>
                  <strong>The 2.5-mill recreation levy</strong> is the first tax increase in years. It adds ~$60/year per household and funds parks, trails, turf fields, and recreation facilities.
                </p>
              </div>
            </div>

            {/* Other taxes */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold mb-4" style={{ color: '#0C1F3F' }}>Other Local Taxes</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Earned Income Tax</div>
                  <div className="text-xl font-black" style={{ color: '#0C1F3F' }}>1.0%</div>
                  <div className="text-xs text-gray-400">0.5% township + 0.5% Seneca Valley SD</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Local Services Tax</div>
                  <div className="text-xl font-black" style={{ color: '#0C1F3F' }}>$52/yr</div>
                  <div className="text-xs text-gray-400">Anyone employed in township (exempt &lt;$12K)</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Credit Rating</div>
                  <div className="text-xl font-black" style={{ color: '#4F8A5B' }}>Moody's Aaa</div>
                  <div className="text-xs text-gray-400">1 of 14 in PA. Only one in Western PA.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ BOARD ACTIONS ══ */}
        {tab === 'actions' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold" style={{ color: '#0C1F3F' }}>Board Actions & Decisions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Every vote. Every ordinance. Every dollar approved.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {RECENT_ACTIONS.map((a, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: typeColors[a.type] || '#94A3B8' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: '#0C1F3F' }}>{a.action}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-xs text-gray-400">{a.date}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${typeColors[a.type]}15`, color: typeColors[a.type] }}>{a.type}</span>
                      {a.votes !== '—' && <span className="text-xs font-bold" style={{ color: '#4F8A5B' }}>Vote: {a.votes}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">Board meets 2nd Thursday (10:30 AM) and 4th Thursday (7:00 PM) at the Municipal Building</p>
            </div>
          </div>
        )}

        {/* ══ PROJECTS ══ */}
        {tab === 'projects' && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg" style={{ color: '#0C1F3F' }}>Active & Planned Projects</h2>
            {PROJECTS.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold" style={{ color: '#0C1F3F' }}>{p.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${statusColors[p.status]}15`, color: statusColors[p.status] }}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{p.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400">Cost:</span>
                    <span className="text-xs font-bold" style={{ color: '#0C1F3F' }}>{p.cost}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400">Timeline:</span>
                    <span className="text-xs font-bold" style={{ color: '#0C1F3F' }}>{p.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ HOT ISSUES ══ */}
        {tab === 'issues' && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg" style={{ color: '#0C1F3F' }}>Issues Residents Are Watching</h2>
            {HOT_ISSUES.map((issue, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6" style={{ borderLeft: `4px solid ${severityColors[issue.severity]}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold" style={{ color: '#0C1F3F' }}>{issue.title}</h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${severityColors[issue.severity]}18`, color: severityColors[issue.severity] }}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{issue.desc}</p>
                <div className="text-xs text-gray-400 mt-2">{issue.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-400 pb-8">
          <p>Data sourced from cranberrytownship.org, Butler Eagle, PennDOT, and public records.</p>
          <p className="mt-1">This is a concept demo. A production version would pull live data automatically.</p>
        </div>
      </main>
    </div>
  )
}
