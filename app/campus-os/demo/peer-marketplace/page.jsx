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

/* ── Mock data ────────────────────────────────────────────── */
const stats = [
  { label: 'Peer sessions this week', value: '142' },
  { label: 'Avg proficiency gain / session', value: '+6.4 pts' },
  { label: 'Prefer peer coaching to notes', value: '89%' },
];

const matches = [
  {
    coach: { name: 'Jake Morrison', skill: 'Membrane Transport', mastery: 94, ago: '3 weeks ago' },
    learner: { name: 'Elena Vasquez', skill: 'Membrane Transport', proficiency: 42 },
    matchScore: 96,
    reason: 'Jake struggled with the same misconception Elena has (confusing active vs passive transport). His breakthrough was recent and relatable.',
    status: 'Scheduled',
    statusDetail: 'Wed 2 pm',
    statusColor: TEAL,
    predicted: '+12 pts',
  },
  {
    coach: { name: 'Priya Sharma', skill: 'Derivatives', mastery: 88, ago: '2 weeks ago' },
    learner: { name: 'Marcus Thompson', skill: 'Derivatives', proficiency: 58 },
    matchScore: 91,
    reason: 'Both visual learners. Priya\'s approach using graphical intuition aligns with Marcus\'s learning style.',
    status: 'In Progress',
    statusDetail: 'Live now',
    statusColor: GREEN,
    predicted: '+9 pts',
  },
  {
    coach: { name: 'David Chen', skill: 'Organic Chemistry — Nomenclature', mastery: 91, ago: '1 week ago' },
    learner: { name: 'Amara Okafor', skill: 'Organic Chemistry — Nomenclature', proficiency: 35 },
    matchScore: 88,
    reason: 'David mastered IUPAC naming through mnemonic devices — Amara\'s verbal learning style is a strong match.',
    status: 'Scheduled',
    statusDetail: 'Thu 10 am',
    statusColor: TEAL,
    predicted: '+14 pts',
  },
  {
    coach: { name: 'Lily Tran', skill: 'Statistical Inference', mastery: 86, ago: '4 weeks ago' },
    learner: { name: 'Jordan Blake', skill: 'Statistical Inference', proficiency: 49 },
    matchScore: 84,
    reason: 'Lily overcame the same p-value misconception Jordan currently holds. Both prefer step-by-step worked examples.',
    status: 'Completed',
    statusDetail: 'Mon — 45 min session',
    statusColor: '#6B7280',
    predicted: '+8 pts (actual: +11)',
  },
  {
    coach: { name: 'Sam Rodriguez', skill: 'Essay Argumentation', mastery: 92, ago: '2 weeks ago' },
    learner: { name: 'Nina Petrov', skill: 'Essay Argumentation', proficiency: 55 },
    matchScore: 79,
    reason: 'Sam\'s first language is also not English — understands the specific phrasing challenges Nina faces in constructing thesis statements.',
    status: 'Pending Acceptance',
    statusDetail: 'Awaiting Nina\'s confirmation',
    statusColor: PLUM,
    predicted: '+7 pts',
  },
];

const algorithmFactors = [
  { label: 'Recency of mastery', weight: 35, desc: 'Recent masters remember the struggle.', color: TEAL },
  { label: 'Shared misconception history', weight: 25, desc: 'Did the coach have the same gap?', color: CORAL },
  { label: 'Learning style alignment', weight: 20, desc: 'Visual / verbal / kinesthetic compatibility.', color: GREEN },
  { label: 'Schedule compatibility', weight: 10, desc: 'Can they actually meet?', color: PLUM },
  { label: 'Social comfort', weight: 10, desc: 'Have they interacted before?', color: NAVY },
];

const impactMetrics = [
  { stat: '2.3x faster', desc: 'Peer-coached students improve 2.3x faster than self-study.' },
  { stat: '40% longer', desc: 'Coaches retain mastery 40% longer — teaching deepens understanding.' },
  { stat: '89%', desc: 'Satisfaction rate vs 71% for traditional tutoring.' },
  { stat: '$0', desc: 'Cost per session vs $35/hr for institutional tutoring.' },
];

const recognition = [
  { icon: '★', label: 'XP', detail: '25 XP per session, bonus for repeat impact' },
  { icon: '🛡', label: 'Coaching Badges', detail: 'Bronze → Silver → Gold based on hours and impact' },
  { icon: '📜', label: 'Transcript Notation', detail: '"Peer Learning Coach — Membrane Transport (12 sessions)"' },
  { icon: '✉', label: 'Recommendation Letters', detail: 'Auto-generated from coaching data, verified by faculty' },
];

/* ── Peer network nodes (mock) ────────────────────────────── */
const youCanCoach = [
  { name: 'Elena V.', skill: 'Membrane Transport' },
  { name: 'Jordan B.', skill: 'Statistical Inference' },
  { name: 'Nina P.', skill: 'Essay Argumentation' },
];
const canCoachYou = [
  { name: 'Priya S.', skill: 'Derivatives' },
  { name: 'David C.', skill: 'Org Chem Nomenclature' },
  { name: 'Lily T.', skill: 'Statistical Inference' },
  { name: 'Sam R.', skill: 'Essay Argumentation' },
];

/* ── Helper: proficiency bar ──────────────────────────────── */
function ProfBar({ value, color }) {
  return (
    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function PeerMarketplacePage() {
  const [expandedMatch, setExpandedMatch] = useState(null);

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
          Campus OS &middot; Peer Marketplace
        </p>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: serif, color: NAVY }}
        >
          The Peer Marketplace
        </h1>
        <p className="mt-5 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Mastery meets struggle. AI matches them.
        </p>

        {/* Stats strip */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-200 px-6 py-5">
              <p className="text-3xl font-bold" style={{ color: NAVY }}>{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 2. Live Matches ─── */}
      <section className="py-16" style={{ backgroundColor: '#F8FAFB' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: serif, color: NAVY }}>
            Live Matches
          </h2>
          <p className="text-gray-500 mb-10">Current AI-generated peer coaching pairs.</p>

          <div className="space-y-5">
            {matches.map((m, i) => {
              const isExpanded = expandedMatch === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-shadow duration-200 hover:shadow-lg cursor-pointer"
                  onClick={() => setExpandedMatch(isExpanded ? null : i)}
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-bold"
                        style={{ backgroundColor: TEAL }}
                      >
                        {m.matchScore}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: NAVY }}>
                        Match Score
                      </span>
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: m.statusColor + '18', color: m.statusColor }}
                    >
                      {m.status} &middot; {m.statusDetail}
                    </span>
                  </div>

                  {/* Coach / Learner row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {/* Coach */}
                    <div className="px-6 py-5">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: GREEN }}>
                        Coach
                      </p>
                      <p className="font-semibold" style={{ color: NAVY }}>{m.coach.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Mastered <span className="font-medium text-gray-700">{m.coach.skill}</span> {m.coach.ago}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <ProfBar value={m.coach.mastery} color={GREEN} />
                        <span className="text-xs font-bold" style={{ color: GREEN }}>{m.coach.mastery}%</span>
                      </div>
                    </div>
                    {/* Learner */}
                    <div className="px-6 py-5">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CORAL }}>
                        Learner
                      </p>
                      <p className="font-semibold" style={{ color: NAVY }}>{m.learner.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Struggling with <span className="font-medium text-gray-700">{m.learner.skill}</span>
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <ProfBar value={m.learner.proficiency} color={CORAL} />
                        <span className="text-xs font-bold" style={{ color: CORAL }}>{m.learner.proficiency}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50">
                      <p className="text-sm leading-relaxed text-gray-600">
                        <span className="font-semibold" style={{ color: NAVY }}>AI Rationale:</span> {m.reason}
                      </p>
                      {m.predicted && (
                        <p className="mt-3 text-sm">
                          <span className="font-semibold" style={{ color: NAVY }}>Predicted impact:</span>{' '}
                          <span className="font-bold" style={{ color: GREEN }}>{m.predicted}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-gray-400 text-center">Click any match to see the AI rationale.</p>
        </div>
      </section>

      {/* ─── 3. How AI Matches ─── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: serif, color: NAVY }}>
            How AI Matches
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl">
            Five signals, weighted by impact. The algorithm optimizes for learning gain, not scheduling convenience.
          </p>

          <div className="space-y-6">
            {algorithmFactors.map((f) => (
              <div key={f.label} className="flex items-start gap-5">
                {/* Weight circle */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: f.color }}
                >
                  {f.weight}%
                </div>
                {/* Text */}
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: NAVY }}>{f.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
                  {/* Bar */}
                  <div className="mt-2 w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${f.weight}%`, backgroundColor: f.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Impact Dashboard ─── */}
      <section className="py-20" style={{ backgroundColor: NAVY }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white" style={{ fontFamily: serif }}>
            Impact Dashboard
          </h2>
          <p className="text-gray-400 mb-14 max-w-xl mx-auto">
            Peer coaching isn&apos;t a nice-to-have. It&apos;s the highest-ROI intervention on campus.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((m) => (
              <div
                key={m.stat}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-6 py-8"
              >
                <p className="text-3xl md:text-4xl font-bold" style={{ color: TEAL }}>{m.stat}</p>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Your Network ─── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: serif, color: NAVY }}>
            Your Peer Network
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl">
            You can coach 3 students. 4 students can coach you. Mastery flows both ways.
          </p>

          {/* Network visualisation (simplified) */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
            {/* Can coach you */}
            <div className="flex flex-col items-center gap-4 md:mr-16">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: TEAL }}>
                Can coach you
              </p>
              {canCoachYou.map((n) => (
                <div
                  key={n.name}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 w-56"
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: TEAL }}
                  >
                    {n.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: NAVY }}>{n.name}</p>
                    <p className="text-xs text-gray-400">{n.skill}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* You (center) */}
            <div className="relative flex-shrink-0">
              {/* Connection lines (decorative) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 hidden md:block" style={{ overflow: 'visible' }}>
                {/* Left lines */}
                {canCoachYou.map((_, i) => (
                  <line
                    key={`l-${i}`}
                    x1="-80" y1={`${-48 + i * 56}`}
                    x2="0" y2="0"
                    stroke={TEAL}
                    strokeWidth="1"
                    opacity="0.25"
                    strokeDasharray="4 4"
                  />
                ))}
                {/* Right lines */}
                {youCanCoach.map((_, i) => (
                  <line
                    key={`r-${i}`}
                    x1="80" y1={`${-28 + i * 56}`}
                    x2="0" y2="0"
                    stroke={GREEN}
                    strokeWidth="1"
                    opacity="0.25"
                    strokeDasharray="4 4"
                  />
                ))}
              </svg>
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl"
                style={{ backgroundColor: NAVY }}
              >
                You
              </div>
            </div>

            {/* You can coach */}
            <div className="flex flex-col items-center gap-4 md:ml-16">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: GREEN }}>
                You can coach
              </p>
              {youCanCoach.map((n) => (
                <div
                  key={n.name}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 w-56"
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: GREEN }}
                  >
                    {n.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: NAVY }}>{n.name}</p>
                    <p className="text-xs text-gray-400">{n.skill}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Recognition ─── */}
      <section className="py-20" style={{ backgroundColor: '#F8FAFB' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: serif, color: NAVY }}>
            Recognition
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl">
            Coaching isn&apos;t charity. It&apos;s a credential.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recognition.map((r) => (
              <div
                key={r.label}
                className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{r.icon}</span>
                <p className="mt-4 font-semibold" style={{ color: NAVY }}>{r.label}</p>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </div>
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
