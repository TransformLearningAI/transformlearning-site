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
const overview = [
  { label: 'Dept Avg Proficiency', value: '61%', sub: 'Up from 54% last year', color: teal },
  { label: 'DFW Rate', value: '22%', sub: 'Down from 29% last year', color: green },
  { label: 'Student Engagement', value: '78%', sub: 'Weekly active learners', color: plum },
  { label: 'Faculty Adoption', value: '4 / 6', sub: 'Instructors active on platform', color: navy },
];

const courses = [
  { name: 'Calculus I', instructor: 'Dr. Sarah Chen', sections: 4, enrollment: 312, proficiency: 58, dfw: 27, trend: 'up' },
  { name: 'Calculus II', instructor: 'Dr. James Osei', sections: 3, enrollment: 198, proficiency: 55, dfw: 31, trend: 'down' },
  { name: 'Statistics', instructor: 'Prof. Maria Lopez', sections: 3, enrollment: 224, proficiency: 68, dfw: 14, trend: 'up' },
  { name: 'Linear Algebra', instructor: 'Dr. Alan Marsh', sections: 2, enrollment: 113, proficiency: 64, dfw: 18, trend: 'flat' },
];

const faculty = [
  { name: 'Dr. Sarah Chen', courses: 'Calc I', students: 156, proficiency: 58, interventionRate: '12%', lastActive: '2 hours ago', lowEngagement: false },
  { name: 'Dr. James Osei', courses: 'Calc II', students: 132, proficiency: 55, interventionRate: '8%', lastActive: '1 day ago', lowEngagement: false },
  { name: 'Prof. Maria Lopez', courses: 'Statistics', students: 149, proficiency: 68, interventionRate: '15%', lastActive: '3 hours ago', lowEngagement: false },
  { name: 'Dr. Alan Marsh', courses: 'Linear Algebra', students: 113, proficiency: 64, interventionRate: '10%', lastActive: '5 hours ago', lowEngagement: false },
  { name: 'Dr. Emily Tran', courses: 'Calc I, Stats', students: 180, proficiency: 61, interventionRate: '3%', lastActive: '12 days ago', lowEngagement: true },
  { name: 'Prof. David Ruiz', courses: 'Calc II', students: 117, proficiency: 52, interventionRate: '2%', lastActive: '18 days ago', lowEngagement: true },
];

const atRiskSections = [
  {
    section: 'MATH 151 — Sec 003',
    instructor: 'Prof. David Ruiz',
    proficiency: '46% (↓ 9 pts since midterm)',
    dfw: '38% and rising',
    action: 'Schedule faculty check-in; deploy targeted review modules for integration topics',
  },
  {
    section: 'MATH 152 — Sec 002',
    instructor: 'Dr. James Osei',
    proficiency: '51% (↓ 6 pts since midterm)',
    dfw: '33% and rising',
    action: 'Activate supplemental instruction sessions; pair with peer tutoring programme',
  },
  {
    section: 'MATH 151 — Sec 004',
    instructor: 'Dr. Emily Tran',
    proficiency: '53% (↓ 4 pts since midterm)',
    dfw: '29% and rising',
    action: 'Review assignment difficulty curve; recommend office-hour attendance nudges',
  },
];

const milestones = [
  { label: 'Pilot Started', date: 'Aug 26', pct: 0, done: true },
  { label: 'Midterm Data', date: 'Oct 14', pct: 38, done: true },
  { label: 'Current', date: 'Nov 4', pct: 55, done: false, current: true },
  { label: 'End-of-Term Goal', date: 'Dec 13', pct: 100, done: false },
];

/* ── Helpers ──────────────────────────────────────────────────── */
function dfwColor(rate) {
  if (rate < 15) return green;
  if (rate <= 25) return amber;
  return coral;
}

function TrendArrow({ direction }) {
  if (direction === 'up') return <span className="text-green-600 font-semibold text-sm">▲ Improving</span>;
  if (direction === 'down') return <span className="text-red-500 font-semibold text-sm">▼ Declining</span>;
  return <span className="text-gray-400 font-semibold text-sm">— Stable</span>;
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function ChairDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: navy }}>
            transformlearning.ai
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-xs font-medium tracking-wide uppercase" style={{ color: green }}>
              Department Chair
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
                Dr. Robert Kim
              </h1>
              <p className="mt-1 text-gray-500 text-sm">
                Mathematics Department &middot; Department Chair
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div>
                <span className="block text-xs uppercase tracking-wide text-gray-400">Term</span>
                <span className="font-semibold" style={{ color: navy }}>Fall 2026</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-gray-400">Sections</span>
                <span className="font-semibold" style={{ color: navy }}>12</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-gray-400">Students</span>
                <span className="font-semibold" style={{ color: navy }}>847</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Department Overview ─────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            Department Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {overview.map((m) => (
              <div
                key={m.label}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{m.label}</p>
                <p className="mt-2 text-3xl font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="mt-1 text-xs text-gray-500">{m.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Course Comparison ───────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            Course Comparison
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Instructor</th>
                  <th className="px-5 py-3 font-medium text-center">Sections</th>
                  <th className="px-5 py-3 font-medium text-center">Enrollment</th>
                  <th className="px-5 py-3 font-medium text-center">Avg Proficiency</th>
                  <th className="px-5 py-3 font-medium text-center">DFW Rate</th>
                  <th className="px-5 py-3 font-medium text-center">Trend</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={c.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                    <td className="px-5 py-3 font-semibold" style={{ color: navy }}>{c.name}</td>
                    <td className="px-5 py-3 text-gray-600">{c.instructor}</td>
                    <td className="px-5 py-3 text-center text-gray-700">{c.sections}</td>
                    <td className="px-5 py-3 text-center text-gray-700">{c.enrollment}</td>
                    <td className="px-5 py-3 text-center font-semibold" style={{ color: teal }}>{c.proficiency}%</td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: dfwColor(c.dfw) }}
                      >
                        {c.dfw}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <TrendArrow direction={c.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 4. Faculty Activity ────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            Faculty Activity
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-5 py-3 font-medium">Faculty Member</th>
                  <th className="px-5 py-3 font-medium">Courses</th>
                  <th className="px-5 py-3 font-medium text-center">Student Load</th>
                  <th className="px-5 py-3 font-medium text-center">Avg Proficiency</th>
                  <th className="px-5 py-3 font-medium text-center">Intervention Rate</th>
                  <th className="px-5 py-3 font-medium text-center">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((f, i) => (
                  <tr
                    key={f.name}
                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} ${f.lowEngagement ? 'ring-1 ring-inset ring-red-200' : ''}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: navy }}>{f.name}</span>
                        {f.lowEngagement && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: coral }}>
                            Low Engagement
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{f.courses}</td>
                    <td className="px-5 py-3 text-center text-gray-700">{f.students}</td>
                    <td className="px-5 py-3 text-center font-semibold" style={{ color: teal }}>{f.proficiency}%</td>
                    <td className="px-5 py-3 text-center text-gray-700">{f.interventionRate}</td>
                    <td className="px-5 py-3 text-center text-gray-500">{f.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 5. At-Risk Sections ────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            At-Risk Sections
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {atRiskSections.map((s) => (
              <div
                key={s.section}
                className="bg-white rounded-xl border-l-4 border border-gray-200 shadow-sm p-5"
                style={{ borderLeftColor: coral }}
              >
                <h3 className="font-bold text-sm" style={{ color: navy }}>{s.section}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Instructor: {s.instructor}</p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: coral }}>!</span>
                    <span className="text-gray-700">Proficiency: {s.proficiency}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: coral }}>!</span>
                    <span className="text-gray-700">DFW: {s.dfw}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-1">Recommended Action</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{s.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Semester Progress ───────────────────────────── */}
        <section className="pb-8">
          <h2 className="text-lg font-bold mb-6" style={{ fontFamily: 'Georgia, serif', color: navy }}>
            Semester Progress
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {/* Track */}
            <div className="relative">
              {/* Background bar */}
              <div className="h-2 rounded-full bg-gray-100 w-full" />
              {/* Filled bar */}
              <div
                className="absolute top-0 left-0 h-2 rounded-full"
                style={{ width: '55%', backgroundColor: teal }}
              />

              {/* Milestone dots */}
              {milestones.map((m) => (
                <div
                  key={m.label}
                  className="absolute"
                  style={{ left: `${m.pct}%`, top: '-4px', transform: 'translateX(-50%)' }}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-[3px] border-white shadow ${m.current ? 'ring-2' : ''}`}
                    style={{
                      backgroundColor: m.done ? teal : m.current ? teal : '#D1D5DB',
                      ringColor: m.current ? `${teal}40` : 'transparent',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Labels */}
            <div className="relative mt-6 flex justify-between text-xs text-gray-500">
              {milestones.map((m) => (
                <div
                  key={m.label}
                  className="text-center"
                  style={{ width: '25%' }}
                >
                  <p className={`font-semibold ${m.current ? '' : ''}`} style={{ color: m.current ? teal : m.done ? navy : '#9CA3AF' }}>
                    {m.label}
                  </p>
                  <p className="mt-0.5">{m.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-gray-400">
          <span>transformlearning.ai &middot; Campus OS</span>
          <span>Mock data &mdash; for demonstration only</span>
        </div>
      </footer>
    </div>
  );
}
