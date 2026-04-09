'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ── Brand tokens ─────────────────────────────────────────── */
const NAVY  = '#0C1F3F';
const TEAL  = '#00A8A8';
const GREEN = '#4F8A5B';
const PLUM  = '#5A3E6B';
const CORAL = '#FF6B4A';
const serif = 'Georgia, serif';

/* ── Journey stages ───────────────────────────────────────── */
const stages = [
  {
    id: 'prospect',
    label: 'Prospect',
    color: NAVY,
    period: 'June 2025',
    story:
      'Sofia clicked a Facebook ad. Visited the biology page 4 times. Downloaded the pre-med guide.',
    ai: 'High intent signal. Pre-med interest. Match score with institutional strengths: 87%.',
    action:
      'Personalized email sent highlighting research opportunities and pre-med advising.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
    ),
  },
  {
    id: 'applicant',
    label: 'Applicant',
    color: TEAL,
    period: 'Oct 2025',
    story:
      'Applied Oct 15. Essay mentioned first-gen status. SAT Math: 620.',
    ai: 'Predicted gateway course risk: Calculus I (62% probability of DFW based on similar profiles). Predicted retention risk: moderate.',
    action:
      'Flag for enhanced orientation. Pre-assign math readiness coaching.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    id: 'enrolled',
    label: 'Enrolled',
    color: GREEN,
    period: 'Aug 2026',
    story:
      'Enrolled Aug 20. Assigned to Bio 201, Chem 101, Calc I, English 101.',
    ai: 'Math readiness coaching activated before classes start. Peer mentor matched: Maria (similar background, now a junior).',
    action:
      'Proactive support in place before Day 1. Not waiting for the midterm to discover a problem.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 10 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: 'mid-semester',
    label: 'Mid-Semester',
    color: CORAL,
    period: 'Oct 2026',
    story:
      'Week 6: Calc I proficiency dropped to 38%. Bio and Chem stable.',
    ai: 'Signal radiated to: professor, advisor, financial aid (tuition at risk), peer marketplace (3 coaches available).',
    action:
      'Coordinated intervention: peer coaching + targeted practice. Not a single email from an advisor saying "how are your classes going?"',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: 'end-of-year',
    label: 'End of Year',
    color: GREEN,
    period: 'May 2027',
    story:
      'Calc I: passed with C+. All others: B or higher. Retained for Year 2.',
    ai: 'Risk resolved. Quantitative reasoning still developing. Summer bridge recommendation generated.',
    action:
      'Retention achieved. Not luck — orchestrated.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    id: 'alumni',
    label: 'Alumni',
    color: NAVY,
    period: '2029',
    story:
      'Graduated 2029. Pre-med. Skill portfolio transferred to medical school application.',
    ai: 'Lifelong skill record. Not a transcript — a verified competency map.',
    action:
      'The thread continues. Reunion, mentoring, giving — all informed by the same data.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
  },
];

/* ── Handoff items ────────────────────────────────────────── */
const handoffs = [
  'Marketing',
  'Admissions',
  'Orientation',
  'Advising',
  'Registrar',
  'Retention',
  'Career Services',
];

/* ── Institutional Impact ─────────────────────────────────── */
const impact = [
  { stat: '+8 pp', label: 'First-year retention' },
  { stat: '-0.3', label: 'Semesters to degree' },
  { stat: '+22%', label: 'Student satisfaction' },
  { stat: '+340%', label: 'Advising efficiency' },
];

/* ── Main page ────────────────────────────────────────────── */
export default function ContinuousJourneyPage() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Nav ─── */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: NAVY }}>
            transformlearning.ai
          </Link>
          <Link
            href="/campus-os/demo"
            className="text-sm font-medium hover:underline"
            style={{ color: NAVY }}
          >
            &larr; All Demos
          </Link>
        </div>
      </nav>

      {/* ─── 1. Header ─── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: TEAL }}>
          Campus OS &middot; Continuous Journey
        </p>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: serif, color: NAVY }}
        >
          The Continuous Journey
        </h1>
        <p className="mt-5 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          One thread. First click to last reunion. No gaps. No handoffs.
        </p>
      </section>

      {/* ─── 2. Journey Timeline ─── */}
      <section className="py-16" style={{ backgroundColor: '#F8FAFB' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: TEAL }}
            >
              SR
            </div>
            <div>
              <p className="font-semibold" style={{ color: NAVY }}>Sofia Ramirez</p>
              <p className="text-sm text-gray-500">First-gen &middot; Pre-med &middot; Biology interest</p>
            </div>
          </div>

          {/* Horizontal stage selector */}
          <div className="relative mb-10">
            {/* Connecting line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 hidden sm:block" />
            <div className="flex flex-wrap sm:flex-nowrap justify-between gap-2 relative">
              {stages.map((s, i) => {
                const isActive = i === activeStage;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStage(i)}
                    className="flex flex-col items-center gap-2 group z-10"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2"
                      style={{
                        backgroundColor: isActive ? s.color : 'white',
                        borderColor: s.color,
                        color: isActive ? 'white' : s.color,
                      }}
                    >
                      {s.icon}
                    </div>
                    <span
                      className="text-xs font-semibold transition-colors duration-200"
                      style={{ color: isActive ? s.color : '#9CA3AF' }}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active stage detail card */}
          {(() => {
            const s = stages[activeStage];
            return (
              <div
                className="rounded-2xl border-2 bg-white overflow-hidden transition-all duration-300"
                style={{ borderColor: s.color + '40' }}
              >
                {/* Stage header */}
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ backgroundColor: s.color + '0A' }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.icon}
                    </span>
                    <span className="font-bold text-lg" style={{ color: s.color }}>{s.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-400">{s.period}</span>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Story */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      What happened
                    </p>
                    <p className="text-base leading-relaxed" style={{ color: NAVY }}>{s.story}</p>
                  </div>

                  {/* AI intelligence */}
                  <div className="rounded-lg p-5" style={{ backgroundColor: s.color + '08', borderLeft: `3px solid ${s.color}` }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: s.color }}>
                      AI intelligence
                    </p>
                    <p className="text-sm leading-relaxed text-gray-700">{s.ai}</p>
                  </div>

                  {/* Action */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Action taken
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600">{s.action}</p>
                  </div>
                </div>

                {/* Navigation arrows */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveStage(Math.max(0, activeStage - 1))}
                    disabled={activeStage === 0}
                    className="text-sm font-medium disabled:text-gray-300 transition-colors"
                    style={{ color: activeStage === 0 ? undefined : NAVY }}
                  >
                    &larr; Previous
                  </button>
                  <span className="text-xs text-gray-400">
                    {activeStage + 1} / {stages.length}
                  </span>
                  <button
                    onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))}
                    disabled={activeStage === stages.length - 1}
                    className="text-sm font-medium disabled:text-gray-300 transition-colors"
                    style={{ color: activeStage === stages.length - 1 ? undefined : NAVY }}
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ─── 3. The Handoff Problem ─── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: serif, color: NAVY }}>
            The Handoff Problem
          </h2>
          <p className="text-gray-500 mb-12 max-w-2xl">
            In the old model, Sofia was handed off <strong className="text-gray-700">7 times</strong>.
            Each handoff lost context. Each new person started from zero.
          </p>

          {/* Handoff chain visualisation */}
          <div className="relative">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-0">
              {handoffs.map((h, i) => (
                <div key={h} className="flex items-center">
                  <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50 px-4 py-3 text-center min-w-[110px]">
                    <p className="text-sm font-semibold text-red-400">{h}</p>
                  </div>
                  {i < handoffs.length - 1 && (
                    <div className="hidden md:flex items-center mx-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className="w-5 h-5 opacity-40">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Break annotations */}
            <div className="flex justify-center mt-6 gap-8 flex-wrap">
              <span className="text-xs text-red-400 font-medium">Context lost</span>
              <span className="text-xs text-red-400 font-medium">Started from zero</span>
              <span className="text-xs text-red-400 font-medium">No shared data</span>
              <span className="text-xs text-red-400 font-medium">Duplicated questions</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. AI Continuity ─── */}
      <section className="py-20" style={{ backgroundColor: NAVY }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white" style={{ fontFamily: serif }}>
            AI Continuity
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-gray-300 max-w-3xl mx-auto">
            In Campus OS, there are no handoffs. The AI carries Sofia&apos;s complete signal history from
            first click to graduation. Every person who works with Sofia sees her{' '}
            <span className="font-semibold text-white">full story</span>, not a fragment.
          </p>

          {/* Continuous thread visual */}
          <div className="mt-14 relative">
            <div className="flex items-center justify-between">
              {stages.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center z-10">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 border-white/30 text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.icon}
                  </div>
                  <span className="mt-2 text-[10px] md:text-xs text-gray-400 font-medium hidden sm:block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            {/* Continuous line behind */}
            <div className="absolute top-5 md:top-6 left-6 right-6 h-0.5 -z-0" style={{ background: `linear-gradient(to right, ${NAVY}, ${TEAL}, ${GREEN}, ${CORAL}, ${GREEN}, ${NAVY})` }} />
          </div>

          <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2">
            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: TEAL }} />
            <span className="text-sm text-gray-300">One thread. Zero handoffs. Complete context.</span>
          </div>
        </div>
      </section>

      {/* ─── 5. Institutional Impact ─── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: serif, color: NAVY }}>
            When You Eliminate Handoffs
          </h2>
          <p className="text-gray-500 mb-14 max-w-xl mx-auto">
            Continuity isn&apos;t a feature. It&apos;s the architecture that makes everything else work.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impact.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-gray-200 bg-white px-6 py-8 hover:shadow-lg transition-shadow"
              >
                <p className="text-3xl md:text-4xl font-bold" style={{ color: TEAL }}>{m.stat}</p>
                <p className="mt-3 text-sm text-gray-500">{m.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Because the advisor already knows. Because the professor sees what admissions saw. Because
            financial aid knows retention is at risk before the student does.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-gray-400">
          <span>&copy; 2026 transformlearning.ai</span>
          <span>Mock data &middot; No real students</span>
        </div>
      </footer>
    </div>
  );
}
