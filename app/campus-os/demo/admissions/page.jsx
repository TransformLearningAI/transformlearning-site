'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ───────────────────────── Mock Data ───────────────────────── */

const funnel = [
  { stage: 'Inquiries',    count: 14200 },
  { stage: 'Applications', count: 4850  },
  { stage: 'Admitted',     count: 3420  },
  { stage: 'Deposited',    count: 1890  },
  { stage: 'Enrolled',     count: 1720, projected: true },
];

const yieldMetrics = [
  { label: 'Overall Yield',       value: 35.4, prior: 33.8, color: '#0C1F3F' },
  { label: 'Merit Scholar Yield', value: 48.0, prior: 45.2, color: '#5A3E6B' },
  { label: 'First-Gen Yield',     value: 31.0, prior: 29.5, color: '#00A8A8' },
  { label: 'Transfer Yield',      value: 42.0, prior: 39.8, color: '#4F8A5B' },
];

const geoDistribution = [
  { state: 'Pennsylvania',  count: 654, pct: 38 },
  { state: 'Ohio',          count: 206, pct: 12 },
  { state: 'New York',      count: 189, pct: 11 },
  { state: 'New Jersey',    count: 155, pct: 9  },
  { state: 'Maryland',      count: 121, pct: 7  },
  { state: 'Virginia',      count: 103, pct: 6  },
  { state: 'Connecticut',   count: 69,  pct: 4  },
  { state: 'Massachusetts', count: 52,  pct: 3  },
  { state: 'Delaware',      count: 43,  pct: 2.5 },
  { state: 'Other',         count: 128, pct: 7.5 },
];

const enrollmentForecast = [
  { month: 'Jan',  target: 1800, actual: 320,  projected: false },
  { month: 'Feb',  target: 1800, actual: 580,  projected: false },
  { month: 'Mar',  target: 1800, actual: 890,  projected: false },
  { month: 'Apr',  target: 1800, actual: 1240, projected: false },
  { month: 'May',  target: 1800, actual: 1520, projected: false },
  { month: 'Jun',  target: 1800, actual: 1640, projected: true  },
  { month: 'Jul',  target: 1800, actual: 1710, projected: true  },
  { month: 'Aug',  target: 1800, actual: 1720, projected: true  },
];

const meltSegments = [
  {
    risk: 'High Melt Risk',
    count: 220,
    color: '#FF6B4A',
    bgColor: '#FF6B4A14',
    characteristics: [
      'No campus visit completed',
      'Financial aid gap > $5,000',
      'Low engagement with emails (< 2 opens)',
      'Applied to 6+ other institutions',
    ],
    actions: [
      'Personal phone call from admissions counselor',
      'Invite to exclusive admitted student event',
      'Financial aid review and package adjustment',
      'Connect with current student ambassador',
    ],
  },
  {
    risk: 'Moderate Risk',
    count: 340,
    color: '#F59E0B',
    bgColor: '#F59E0B14',
    characteristics: [
      'Campus visit completed but no deposit',
      'Financial aid partially met',
      'Moderate email engagement (2-5 opens)',
      'Undecided on major',
    ],
    actions: [
      'Department-specific outreach from faculty',
      'Send program highlight video',
      'Peer mentor matching invitation',
      'Scholarship deadline reminder',
    ],
  },
  {
    risk: 'Low Risk',
    count: 890,
    color: '#00A8A8',
    bgColor: '#00A8A814',
    characteristics: [
      'Campus visit + follow-up engagement',
      'Financial aid within $2K of expectation',
      'Regular email/portal engagement',
      'Attended virtual or in-person event',
    ],
    actions: [
      'Housing selection nudge',
      'Orientation registration reminder',
      'Welcome series with class schedule preview',
      'Student org interest survey',
    ],
  },
  {
    risk: 'Committed',
    count: 440,
    color: '#4F8A5B',
    bgColor: '#4F8A5B14',
    characteristics: [
      'Deposit submitted',
      'Housing application complete',
      'Orientation registered',
      'Engaged with pre-enrollment content',
    ],
    actions: [
      'Welcome package and swag shipment',
      'Roommate matching survey',
      'Academic advising appointment scheduling',
      'Summer bridge program invitation (if eligible)',
    ],
  },
];

/* ───────────────────────── Helpers ───────────────────────── */

function conversionRate(from, to) {
  return ((to / from) * 100).toFixed(1) + '%';
}

/* ───────────────────────── Page ───────────────────────── */

export default function AdmissionsDashboard() {
  const [expandedSegment, setExpandedSegment] = useState(null);

  return (
    <div className="min-h-screen bg-brand-soft font-sans">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-brand-border bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-navy">
            arrival.ai
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-sm font-medium text-brand-gray">Admissions</span>
            <Link
              href="/campus-os/demo"
              className="text-sm font-medium text-navy hover:text-brand-teal transition-colors"
            >
              &larr; All Dashboards
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── 1. Header ── */}
        <section className="bg-navy rounded-2xl px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-green/10" />
          <div className="relative">
            <p className="text-brand-green text-sm font-semibold tracking-wide uppercase">Admissions Dashboard</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight font-serif">
              Rachel Nguyen
            </h1>
            <p className="mt-1 text-white/70 text-base">
              Director of Admissions &nbsp;&middot;&nbsp; Regional State University &nbsp;&middot;&nbsp; Recruitment Cycle 2026-27
            </p>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Applications</p>
              <p className="mt-1 text-3xl font-bold">4,850</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Admit Rate</p>
              <p className="mt-1 text-3xl font-bold">70.5<span className="text-lg text-white/60">%</span></p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Deposits</p>
              <p className="mt-1 text-3xl font-bold">1,890</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Days to Decision</p>
              <p className="mt-1 text-3xl font-bold">142</p>
            </div>
          </div>
        </section>

        {/* ── 2. Pipeline / Funnel ── */}
        <section className="bg-white rounded-xl border border-brand-border p-6">
          <h2 className="text-lg font-bold text-navy font-serif">Pipeline Overview</h2>
          <p className="text-xs text-brand-gray mt-0.5 mb-6">Recruitment funnel with conversion rates between stages</p>

          {/* Funnel visualization */}
          <div className="space-y-3">
            {funnel.map((step, i) => {
              const maxCount = funnel[0].count;
              const widthPct = Math.max((step.count / maxCount) * 100, 18);
              const colors = ['#0C1F3F', '#5A3E6B', '#00A8A8', '#4F8A5B', '#4F8A5B'];
              return (
                <div key={step.stage}>
                  {/* Conversion rate arrow */}
                  {i > 0 && (
                    <div className="flex items-center justify-center my-1">
                      <div className="flex items-center gap-2 text-xs text-brand-gray">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        <span className="font-semibold" style={{ color: colors[i] }}>
                          {conversionRate(funnel[i - 1].count, step.count)}
                        </span>
                        <span>conversion</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-brand-gray w-28 shrink-0 text-right">
                      {step.stage}
                      {step.projected && <span className="text-xs text-brand-teal ml-1">(proj.)</span>}
                    </span>
                    <div className="flex-1">
                      <div
                        className="h-10 rounded-lg flex items-center justify-end px-4 transition-all duration-700 relative"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: colors[i],
                          opacity: step.projected ? 0.75 : 1,
                        }}
                      >
                        <span className="text-white text-sm font-bold">{step.count.toLocaleString()}</span>
                        {step.projected && (
                          <span className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-brand-teal flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-2.5 h-2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall conversion */}
          <div className="mt-6 pt-4 border-t border-brand-border flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-gray">Inquiry → Enrolled:</span>
              <span className="text-sm font-bold text-navy">{conversionRate(14200, 1720)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-gray">Application → Enrolled:</span>
              <span className="text-sm font-bold text-navy">{conversionRate(4850, 1720)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-gray">Admit → Deposited (Yield):</span>
              <span className="text-sm font-bold text-brand-teal">{conversionRate(3420, 1890)}</span>
            </div>
          </div>
        </section>

        {/* ── 3. Yield Metrics ── */}
        <section>
          <h2 className="text-lg font-bold text-navy font-serif mb-4">Yield Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {yieldMetrics.map((m) => {
              const delta = (m.value - m.prior).toFixed(1);
              const positive = parseFloat(delta) > 0;
              return (
                <div
                  key={m.label}
                  className="bg-white rounded-xl border border-brand-border p-5 hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-brand-gray font-medium">{m.label}</p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: m.color }}>
                    {m.value}%
                  </p>
                  <div className="mt-3 pt-3 border-t border-brand-border flex items-center justify-between">
                    <span className="text-xs text-brand-gray">Prior year: {m.prior}%</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${positive ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-coral/10 text-brand-coral'}`}>
                      {positive ? '+' : ''}{delta} pp
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Two-column: Geography + Forecast ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── 4. Geographic Distribution ── */}
          <section className="bg-white rounded-xl border border-brand-border p-6">
            <h2 className="text-lg font-bold text-navy font-serif">Geographic Distribution</h2>
            <p className="text-xs text-brand-gray mt-0.5 mb-5">Top regions by deposited student count</p>
            <div className="space-y-3">
              {geoDistribution.map((g, i) => {
                const barColors = ['#0C1F3F', '#5A3E6B', '#00A8A8', '#4F8A5B', '#FF6B4A', '#0C1F3F', '#5A3E6B', '#00A8A8', '#4F8A5B', '#9CA3AF'];
                return (
                  <div key={g.state} className="flex items-center gap-3">
                    <span className="text-sm text-brand-gray w-28 shrink-0 truncate text-right font-medium">{g.state}</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(g.pct / 38) * 100}%`,
                          backgroundColor: barColors[i],
                          opacity: i === geoDistribution.length - 1 ? 0.5 : 1,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold text-navy w-8 text-right">{g.pct}%</span>
                      <span className="text-xs text-brand-gray w-10 text-right">({g.count})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── 5. Enrollment Forecast ── */}
          <section className="bg-white rounded-xl border border-brand-border p-6">
            <h2 className="text-lg font-bold text-navy font-serif">Enrollment Forecast</h2>
            <p className="text-xs text-brand-gray mt-0.5 mb-5">Cumulative deposits vs. target of 1,800</p>

            {/* Chart-like visualization */}
            <div className="relative">
              {/* Target line */}
              <div className="absolute left-0 right-0" style={{ bottom: `${(1800 / 2000) * 100}%` }}>
                <div className="border-t-2 border-dashed border-brand-coral/40 w-full" />
                <span className="absolute -top-5 right-0 text-xs font-semibold text-brand-coral">Target: 1,800</span>
              </div>

              <div className="flex items-end gap-2 h-64">
                {enrollmentForecast.map((m) => {
                  const heightPct = (m.actual / 2000) * 100;
                  const onTrack = m.actual >= (m.target * (enrollmentForecast.indexOf(m) + 1) / enrollmentForecast.length) * 0.92;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className={`text-xs font-bold ${m.projected ? 'text-brand-teal' : onTrack ? 'text-brand-green' : 'text-brand-coral'}`}>
                        {m.actual.toLocaleString()}
                      </span>
                      <div className="w-full flex justify-center">
                        <div
                          className="w-full max-w-10 rounded-t-md transition-all duration-500"
                          style={{
                            height: `${heightPct}%`,
                            minHeight: '12px',
                            backgroundColor: m.projected ? '#00A8A8' : onTrack ? '#4F8A5B' : '#FF6B4A',
                            opacity: m.projected ? 0.6 : 1,
                          }}
                        />
                      </div>
                      <span className="text-xs text-brand-gray font-medium">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-brand-border">
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded-sm bg-brand-green inline-block" /> On Track
              </span>
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded-sm bg-brand-coral inline-block" /> Behind
              </span>
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded-sm bg-brand-teal/60 inline-block" /> Projected
              </span>
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-6 border-t-2 border-dashed border-brand-coral/40 inline-block" /> Target
              </span>
            </div>

            {/* Summary */}
            <div className="mt-4 bg-brand-mist rounded-lg p-3 flex items-start gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00A8A8" strokeWidth="2" className="w-4 h-4 mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p className="text-xs text-brand-gray">
                Current trajectory projects <span className="font-semibold text-navy">1,720 enrolled students</span>,
                which is 80 students (4.4%) below the target of 1,800. Increased outreach to moderate melt-risk segment
                could close this gap.
              </p>
            </div>
          </section>
        </div>

        {/* ── 6. Predictive Analytics / Melt Risk ── */}
        <section className="bg-white rounded-xl border border-brand-border p-6">
          <h2 className="text-lg font-bold text-navy font-serif">Predictive Analytics — Melt Risk Segments</h2>
          <p className="text-xs text-brand-gray mt-0.5 mb-6">Deposited student segments by predicted enrollment probability with recommended outreach</p>

          {/* Segment summary bar */}
          <div className="flex rounded-xl overflow-hidden h-8 mb-6">
            {meltSegments.map((seg) => {
              const total = meltSegments.reduce((s, x) => s + x.count, 0);
              const widthPct = (seg.count / total) * 100;
              return (
                <div
                  key={seg.risk}
                  className="flex items-center justify-center text-xs font-semibold text-white transition-all"
                  style={{ width: `${widthPct}%`, backgroundColor: seg.color }}
                  title={`${seg.risk}: ${seg.count}`}
                >
                  {widthPct > 12 && seg.count}
                </div>
              );
            })}
          </div>

          {/* Segment cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meltSegments.map((seg) => {
              const isExpanded = expandedSegment === seg.risk;
              return (
                <div
                  key={seg.risk}
                  className="rounded-xl border border-brand-border overflow-hidden transition-all"
                >
                  {/* Top accent */}
                  <div className="h-1" style={{ backgroundColor: seg.color }} />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: seg.color }}
                          />
                          <h3 className="text-sm font-bold text-navy">{seg.risk}</h3>
                        </div>
                        <p className="text-2xl font-bold mt-1" style={{ color: seg.color }}>
                          {seg.count} <span className="text-sm font-medium text-brand-gray">students</span>
                        </p>
                      </div>
                      <button
                        onClick={() => setExpandedSegment(isExpanded ? null : seg.risk)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-brand-border hover:bg-brand-mist transition-colors text-brand-gray"
                      >
                        {isExpanded ? 'Less' : 'Details'}
                      </button>
                    </div>

                    {/* Characteristics */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">Characteristics</p>
                      <ul className="space-y-1.5">
                        {seg.characteristics.slice(0, isExpanded ? undefined : 2).map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-brand-gray">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: seg.color }} />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    {(isExpanded || true) && (
                      <div className="pt-3 border-t border-brand-border">
                        <p className="text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">Recommended Actions</p>
                        <ul className="space-y-1.5">
                          {seg.actions.slice(0, isExpanded ? undefined : 2).map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-navy">
                              <svg viewBox="0 0 24 24" fill="none" stroke={seg.color} strokeWidth="2.5" className="w-3.5 h-3.5 shrink-0 mt-0.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggregate insight */}
          <div className="mt-6 bg-brand-mist rounded-lg p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-coral/15 flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B4A" strokeWidth="2" className="w-4 h-4">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">Priority Action</p>
              <p className="text-sm text-brand-gray mt-0.5">
                <span className="font-semibold text-brand-coral">220 high melt-risk students</span> represent
                $3.8M in potential tuition revenue. Personalized outreach to this segment within the next 14 days
                is projected to convert 35-50 additional students, closing the enrollment gap by up to 62%.
              </p>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center py-8">
          <p className="text-xs text-brand-gray">
            arrival.ai Campus OS &nbsp;&middot;&nbsp; Admissions View &nbsp;&middot;&nbsp; Data refreshed Oct 29, 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
