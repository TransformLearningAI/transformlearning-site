'use client';

import Link from 'next/link';

/* ── Brand tokens ─────────────────────────────────────────────── */
const navy  = '#0C1F3F';
const teal  = '#00A8A8';
const green = '#4F8A5B';
const plum  = '#5A3E6B';
const coral = '#FF6B4A';
const amber = '#D4952A';

/* ── Mock data ────────────────────────────────────────────────── */
const kpis = [
  { label: 'Overall Retention', value: '84.2%', sub: '+1.8 pp vs. last year', color: teal },
  { label: 'Avg DFW Rate', value: '19.6%', sub: 'Down from 23.1% prior year', color: green },
  { label: 'Student Satisfaction', value: '4.1 / 5', sub: 'End-of-course survey avg', color: plum },
  { label: 'Accreditation Score', value: '92 / 100', sub: 'Last review cycle', color: navy },
  { label: 'First-Year Persistence', value: '79%', sub: 'Fall-to-spring continuation', color: coral },
];

const departments = [
  { name: 'Mathematics', dfw: 22, retention: 81, proficiency: 61, trend: 'improving', risk: 'watch' },
  { name: 'Biology', dfw: 18, retention: 86, proficiency: 67, trend: 'stable', risk: 'healthy' },
  { name: 'Chemistry', dfw: 26, retention: 78, proficiency: 56, trend: 'declining', risk: 'concern' },
  { name: 'English', dfw: 12, retention: 91, proficiency: 74, trend: 'improving', risk: 'healthy' },
  { name: 'Psychology', dfw: 15, retention: 88, proficiency: 70, trend: 'stable', risk: 'healthy' },
  { name: 'History', dfw: 20, retention: 83, proficiency: 63, trend: 'declining', risk: 'watch' },
];

const funnel = [
  { stage: 'Enrolled', count: 3200, pct: 100 },
  { stage: 'Midterm Retained', count: 3020, pct: 94.4 },
  { stage: 'End-of-Term Projected', count: 2890, pct: 90.3 },
  { stage: 'Next Semester Projected', count: 2688, pct: 84.0 },
];

const programReview = [
  {
    program: 'B.S. Chemistry',
    reason: 'DFW rate exceeds 25% for third consecutive term',
    data: 'General Chemistry I DFW at 31%; Organic Chemistry at 28%. Combined student impact: 340 students.',
    action: 'Initiate curricular review committee; explore co-requisite remediation model piloted at peer institutions.',
  },
  {
    program: 'B.A. History',
    reason: 'Enrollment decline of 18% over two years',
    data: 'Majors dropped from 142 to 116. Intro course fill rate at 64%. Two faculty lines unfilled.',
    action: 'Assess demand for new concentrations (e.g., Data & Society); consider cross-listed courses with Political Science.',
  },
  {
    program: 'B.S. Mathematics',
    reason: 'First-year persistence below college average',
    data: 'Only 71% of first-year math majors returned for spring (college avg 79%). Exit surveys cite Calc II difficulty.',
    action: 'Deploy early-alert system for Calc II; add peer mentoring programme for first-year cohort.',
  },
];

const accreditationStandards = [
  { standard: 'Mission & Governance', pct: 98 },
  { standard: 'Curriculum & Instruction', pct: 91 },
  { standard: 'Student Learning Outcomes', pct: 88 },
  { standard: 'Faculty Qualifications', pct: 95 },
  { standard: 'Student Support Services', pct: 82 },
  { standard: 'Assessment & Improvement', pct: 76 },
  { standard: 'Financial Resources', pct: 94 },
  { standard: 'Institutional Effectiveness', pct: 85 },
];

/* ── Helpers ──────────────────────────────────────────────────── */
function riskStyle(risk) {
  if (risk === 'healthy') return { bg: '#E8F5E9', text: green, label: 'Healthy' };
  if (risk === 'watch')   return { bg: '#FFF3E0', text: amber, label: 'Watch' };
  return { bg: '#FFEBEE', text: coral, label: 'Concern' };
}

function trendLabel(t) {
  if (t === 'improving') return { icon: '▲', color: green, text: 'Improving' };
  if (t === 'declining') return { icon: '▼', color: coral, text: 'Declining' };
  return { icon: '—', color: '#9CA3AF', text: 'Stable' };
}

function barColor(pct) {
  if (pct >= 90) return green;
  if (pct >= 80) return teal;
  if (pct >= 70) return amber;
  return coral;
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function DeanDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: navy }}>
            arrival.ai
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-xs font-medium tracking-wide uppercase" style={{ color: plum }}>
              Dean
            </span>
            <Link href="/campus-os/demo" className="text-sm font-medium hover:underline" style={{ color: navy }}>
              &larr; All Dashboards
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* ── 1. Header ──────────────────────────────────────── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif', color: navy }}>
                Dr. Patricia Okafor
              </h1>
              <p className="mt-1 text-gray-500 text-sm">
                College of Arts &amp; Sciences &middot; Dean
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div>
                <span className="block text-xs uppercase tracking-wide text-gray-400">Term</span>
                <span className="font-semibold" style={{ color: navy }}>Fall 2026</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-gray-400">Departments</span>
                <span className="font-semibold" style={{ color: navy }}>6</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-gray-400">Students</span>
                <span className="font-semibold" style={{ color: navy }}>3,200</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. College KPIs ────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            College KPIs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{k.label}</p>
                <p className="mt-2 text-3xl font-bold" style={{ color: k.color }}>{k.value}</p>
                <p className="mt-1 text-xs text-gray-500">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Department Health ───────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            Department Health
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((d) => {
              const rs = riskStyle(d.risk);
              const tr = trendLabel(d.trend);
              return (
                <div
                  key={d.name}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold" style={{ color: navy }}>{d.name}</h3>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: rs.bg, color: rs.text }}
                    >
                      {rs.label}
                    </span>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">DFW</p>
                      <p className="text-lg font-bold mt-0.5" style={{ color: d.dfw > 25 ? coral : d.dfw > 15 ? amber : green }}>
                        {d.dfw}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Retention</p>
                      <p className="text-lg font-bold mt-0.5" style={{ color: teal }}>{d.retention}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Proficiency</p>
                      <p className="text-lg font-bold mt-0.5" style={{ color: plum }}>{d.proficiency}%</p>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs font-semibold" style={{ color: tr.color }}>
                    <span>{tr.icon}</span>
                    <span>{tr.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. Retention Funnel ────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            Retention Funnel
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="space-y-4">
              {funnel.map((f, i) => {
                const dropOff = i > 0 ? funnel[i - 1].count - f.count : 0;
                const dropPct = i > 0 ? ((dropOff / funnel[i - 1].count) * 100).toFixed(1) : 0;
                return (
                  <div key={f.stage}>
                    {/* Drop-off label between bars */}
                    {i > 0 && (
                      <div className="flex items-center gap-2 mb-2 ml-4">
                        <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 12 12">
                          <path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-xs text-gray-400">
                          {dropOff.toLocaleString()} students lost ({dropPct}%)
                        </span>
                      </div>
                    )}
                    {/* Bar */}
                    <div className="flex items-center gap-4">
                      <div className="w-52 shrink-0 text-right">
                        <p className="text-sm font-semibold" style={{ color: navy }}>{f.stage}</p>
                      </div>
                      <div className="flex-1 relative">
                        <div className="h-9 rounded-lg bg-gray-100 w-full" />
                        <div
                          className="absolute top-0 left-0 h-9 rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
                          style={{
                            width: `${f.pct}%`,
                            backgroundColor: i === 0 ? teal : i === 1 ? '#2BB8B8' : i === 2 ? '#60C8C8' : plum,
                          }}
                        >
                          <span className="text-xs font-bold text-white">
                            {f.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-14 shrink-0 text-right">
                        <span className="text-sm font-bold" style={{ color: navy }}>{f.pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. Program Review ──────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            Programs Flagged for Review
          </h2>
          <div className="space-y-5">
            {programReview.map((p) => (
              <div
                key={p.program}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <h3 className="font-bold text-base" style={{ color: navy }}>{p.program}</h3>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: '#FFEBEE', color: coral }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: coral }} />
                    Flagged
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-1">Reason</p>
                    <p className="text-gray-700 leading-relaxed">{p.reason}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-1">Supporting Data</p>
                    <p className="text-gray-700 leading-relaxed">{p.data}</p>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: `${teal}08`, borderColor: `${teal}20` }}>
                    <p className="text-[10px] uppercase tracking-wide font-semibold mb-1" style={{ color: teal }}>Recommended Action</p>
                    <p className="text-gray-700 leading-relaxed">{p.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Accreditation Readiness ─────────────────────── */}
        <section className="pb-8">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            Accreditation Readiness
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {accreditationStandards.map((s) => (
                <div key={s.standard}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: navy }}>{s.standard}</span>
                    <span className="text-sm font-bold" style={{ color: barColor(s.pct) }}>{s.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${s.pct}%`, backgroundColor: barColor(s.pct) }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: green }} /> 90%+
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teal }} /> 80-89%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: amber }} /> 70-79%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: coral }} /> &lt;70%
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-gray-400">
          <span>arrival.ai &middot; Campus OS</span>
          <span>Mock data &mdash; for demonstration only</span>
        </div>
      </footer>
    </div>
  );
}
