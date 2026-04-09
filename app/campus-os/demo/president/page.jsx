'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/* ─── Brand Tokens ─── */
const NAVY = '#0C1F3F';
const TEAL = '#00A8A8';
const GREEN = '#4F8A5B';
const PLUM = '#5A3E6B';
const CORAL = '#FF6B4A';

/* ─── Mock Data ─── */
const pulseMetrics = [
  { label: 'Total Enrollment', value: '8,420', delta: '↑ 2.1%', deltaColor: GREEN },
  { label: 'Retention Rate', value: '81.3%', delta: '↑ 3.2 pp', deltaColor: GREEN },
  { label: '4-Year Graduation Rate', value: '42.1%', delta: null, deltaColor: null },
  { label: 'Operating Margin', value: '+1.8%', delta: null, deltaColor: null },
  { label: 'Student–Faculty Ratio', value: '18 : 1', delta: null, deltaColor: null },
  { label: 'Endowment', value: '$34.2M', delta: null, deltaColor: null },
];

const strategicGoals = [
  {
    goal: 'Close equity gaps in gateway courses',
    progress: 67,
    status: 'On Track',
    statusColor: GREEN,
  },
  {
    goal: 'Increase 1st-year retention to 85%',
    progress: 82,
    status: 'On Track',
    statusColor: GREEN,
  },
  {
    goal: 'Grow enrollment 5% over 3 years',
    progress: 44,
    status: 'At Risk',
    statusColor: CORAL,
  },
  {
    goal: 'Achieve 95% accreditation readiness',
    progress: 91,
    status: 'On Track',
    statusColor: GREEN,
  },
];

const enrollmentTrend = [
  { year: 'Fall 2022', enrollment: 8100 },
  { year: 'Fall 2023', enrollment: 7950 },
  { year: 'Fall 2024', enrollment: 7820 },
  { year: 'Fall 2025', enrollment: 8180 },
  { year: 'Fall 2026', enrollment: 8420 },
];

const colleges = [
  {
    name: 'Arts & Sciences',
    enrollment: 3240,
    retention: '79.5%',
    dfwAvg: '19.2%',
    health: 'Stable',
    healthColor: GREEN,
  },
  {
    name: 'Business',
    enrollment: 2180,
    retention: '83.1%',
    dfwAvg: '14.7%',
    health: 'Strong',
    healthColor: TEAL,
  },
  {
    name: 'Education',
    enrollment: 1410,
    retention: '85.2%',
    dfwAvg: '11.3%',
    health: 'Strong',
    healthColor: TEAL,
  },
  {
    name: 'Health Sciences',
    enrollment: 1590,
    retention: '78.6%',
    dfwAvg: '21.8%',
    health: 'Watch',
    healthColor: CORAL,
  },
];

const boardTalkingPoints = [
  'Enrollment has rebounded 7.7% since the Fall 2024 trough, driven by new Health Sciences programs and improved first-year retention.',
  'Equity gap interventions in gateway courses are showing measurable results — DFW disparities narrowed by 4.1 percentage points year-over-year.',
  'Accreditation readiness stands at 91%, positioning the institution well ahead of the Spring 2027 site visit timeline.',
];

/* ─── Helpers ─── */
function barColor(entry, index) {
  if (index === enrollmentTrend.length - 1) return TEAL;
  if (entry.enrollment < 8000) return CORAL;
  return NAVY;
}

/* ─── Components ─── */
function SectionHeading({ children }) {
  return (
    <h2
      className="text-xl font-bold tracking-tight mb-4"
      style={{ fontFamily: 'Georgia, serif', color: NAVY }}
    >
      {children}
    </h2>
  );
}

function MetricCard({ label, value, delta, deltaColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <div className="mt-2 flex items-end gap-2">
        <span
          className="text-3xl font-bold tracking-tight"
          style={{ color: NAVY, fontFamily: 'Georgia, serif' }}
        >
          {value}
        </span>
        {delta && (
          <span className="text-sm font-semibold mb-1" style={{ color: deltaColor }}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusTag({ text, color }) {
  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: color + '18', color }}
    >
      {text}
    </span>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 text-sm">
      <p className="font-semibold" style={{ color: NAVY }}>
        {label}
      </p>
      <p className="text-gray-600">
        Enrollment:{' '}
        <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
      </p>
    </div>
  );
}

/* ─── Page ─── */
export default function PresidentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* ── Nav ── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
            style={{ color: NAVY }}
          >
            transformlearning.ai
          </Link>
          <div className="flex items-center gap-6">
            <span
              className="hidden sm:inline text-sm font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: NAVY + '0C', color: NAVY }}
            >
              President
            </span>
            <Link
              href="/campus-os/demo"
              className="text-sm font-medium hover:underline"
              style={{ color: NAVY }}
            >
              &larr; All Dashboards
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* ── 1. Header ── */}
        <header>
          <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
            Institutional Command View &middot; Fall 2026
          </p>
          <h1
            className="mt-1 text-3xl md:text-4xl font-bold tracking-tight"
            style={{ fontFamily: 'Georgia, serif', color: NAVY }}
          >
            Dr. James Mitchell
          </h1>
          <p className="mt-1 text-gray-500">Regional State University</p>
        </header>

        {/* ── 2. Institutional Pulse ── */}
        <section>
          <SectionHeading>Institutional Pulse</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pulseMetrics.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>
        </section>

        {/* ── 3. Strategic Plan Progress ── */}
        <section>
          <SectionHeading>Strategic Plan Progress</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategicGoals.map((g) => (
              <div
                key={g.goal}
                className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold" style={{ color: NAVY }}>
                    {g.goal}
                  </p>
                  <StatusTag text={g.status} color={g.statusColor} />
                </div>
                <ProgressBar value={g.progress} color={g.statusColor} />
                <p className="text-xs text-gray-400 text-right font-medium">
                  {g.progress}% complete
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Enrollment Trends ── */}
        <section>
          <SectionHeading>Enrollment Trends</SectionHeading>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={enrollmentTrend}
                margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[7400, 8800]}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="enrollment" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {enrollmentTrend.map((entry, idx) => (
                    <Cell key={entry.year} fill={barColor(entry, idx)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: NAVY }}
                />
                ≥ 8,000
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: CORAL }}
                />
                &lt; 8,000
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: TEAL }}
                />
                Current
              </span>
            </div>
          </div>
        </section>

        {/* ── 5. College Performance ── */}
        <section>
          <SectionHeading>College Performance</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colleges.map((c) => (
              <div
                key={c.name}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-base font-bold"
                    style={{ fontFamily: 'Georgia, serif', color: NAVY }}
                  >
                    {c.name}
                  </h3>
                  <StatusTag text={c.health} color={c.healthColor} />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Enrollment</p>
                    <p className="text-lg font-bold" style={{ color: NAVY }}>
                      {c.enrollment.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Retention</p>
                    <p className="text-lg font-bold" style={{ color: NAVY }}>
                      {c.retention}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">DFW Avg</p>
                    <p
                      className="text-lg font-bold"
                      style={{
                        color: parseFloat(c.dfwAvg) > 18 ? CORAL : NAVY,
                      }}
                    >
                      {c.dfwAvg}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Board Readiness ── */}
        <section className="pb-8">
          <SectionHeading>Board Readiness</SectionHeading>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: PLUM + '14', color: PLUM }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Next board meeting: Oct 15, 2026
              </span>
            </div>
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: NAVY }}
            >
              Suggested Talking Points
            </h3>
            <ol className="space-y-3">
              {boardTalkingPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    style={{ backgroundColor: NAVY }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">{pt}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}
