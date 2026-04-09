'use client';

import { useState } from 'react';

/* ───────────────────────────────────────── mock data ── */

const leaderboard = [
  {
    rank: 1,
    program: 'English Comp — AI Coaching',
    students: 220,
    proficiencyGain: 14.6,
    dfwReduction: 9.8,
    costPerStudent: 40,
    budget: 12000,
    impactScore: 97,
    tier: 'high',
  },
  {
    rank: 2,
    program: 'Peer Coaching Marketplace',
    students: 200,
    proficiencyGain: 13.2,
    dfwReduction: 8.4,
    costPerStudent: 0,
    budget: 0,
    impactScore: 95,
    tier: 'high',
  },
  {
    rank: 3,
    program: 'Bio 201 Study Groups',
    students: 150,
    proficiencyGain: 10.1,
    dfwReduction: 6.3,
    costPerStudent: 53,
    budget: 8000,
    impactScore: 84,
    tier: 'high',
  },
  {
    rank: 4,
    program: 'Calculus I Supplemental Instruction',
    students: 130,
    proficiencyGain: 8.7,
    dfwReduction: 5.9,
    costPerStudent: 85,
    budget: 11000,
    impactScore: 72,
    tier: 'moderate',
  },
  {
    rank: 5,
    program: 'Psychology Writing Lab',
    students: 95,
    proficiencyGain: 7.4,
    dfwReduction: 4.1,
    costPerStudent: 126,
    budget: 12000,
    impactScore: 61,
    tier: 'moderate',
  },
  {
    rank: 6,
    program: 'Chemistry Tutoring Center',
    students: 80,
    proficiencyGain: 5.8,
    dfwReduction: 3.2,
    costPerStudent: 312,
    budget: 25000,
    impactScore: 44,
    tier: 'moderate',
  },
  {
    rank: 7,
    program: 'History Lecture Series',
    students: 60,
    proficiencyGain: 4.2,
    dfwReduction: 2.1,
    costPerStudent: 750,
    budget: 45000,
    impactScore: 28,
    tier: 'low',
  },
  {
    rank: 8,
    program: 'Intro to Business — Large Lecture',
    students: 340,
    proficiencyGain: 1.9,
    dfwReduction: 0.4,
    costPerStudent: 324,
    budget: 110000,
    impactScore: 12,
    tier: 'low',
  },
];

const budgetSources = [
  { name: 'Tuition Revenue', amount: 620, color: 'brand-teal' },
  { name: 'State Funding', amount: 280, color: 'brand-green' },
  { name: 'Grants', amount: 95, color: 'brand-purple' },
  { name: 'Endowment', amount: 45, color: 'brand-coral' },
];

const destinations = [
  { name: 'Peer coaching program', amount: 180, impact: 'high', recommended: '+$180K' },
  { name: 'AI coaching integration', amount: 145, impact: 'high', recommended: '+$60K' },
  { name: 'Faculty development', amount: 120, impact: 'high', recommended: null },
  { name: 'Lab equipment', amount: 195, impact: 'moderate', recommended: null },
  { name: 'Traditional tutoring', amount: 160, impact: 'low', recommended: '-$180K' },
  { name: 'Administrative overhead', amount: 240, impact: 'low', recommended: null },
];

const interventions = [
  {
    name: 'Full-time tutor',
    annualCost: '$45K/year',
    studentsServed: 60,
    costPerStudent: '$750',
    avgImprovement: '4.2 pts',
    efficiency: 'low',
  },
  {
    name: 'AI coaching',
    annualCost: '$12K/year',
    studentsServed: 300,
    costPerStudent: '$40',
    avgImprovement: '6.8 pts',
    efficiency: 'high',
  },
  {
    name: 'Peer marketplace',
    annualCost: '$0/year',
    studentsServed: 200,
    costPerStudent: '$0',
    avgImprovement: '6.4 pts',
    efficiency: 'high',
  },
  {
    name: 'Study group facilitation',
    annualCost: '$8K/year',
    studentsServed: 150,
    costPerStudent: '$53',
    avgImprovement: '5.1 pts',
    efficiency: 'moderate',
  },
];

/* ──────────────────────────────── helpers ── */
const tierColor = {
  high: { bg: 'bg-brand-green/15', text: 'text-brand-green', border: 'border-brand-green/30', dot: 'bg-brand-green' },
  moderate: { bg: 'bg-brand-teal/15', text: 'text-brand-teal', border: 'border-brand-teal/30', dot: 'bg-brand-teal' },
  low: { bg: 'bg-brand-coral/15', text: 'text-brand-coral', border: 'border-brand-coral/30', dot: 'bg-brand-coral' },
};

const impactDestColor = {
  high: 'text-brand-green',
  moderate: 'text-brand-teal',
  low: 'text-brand-coral',
};

const efficiencyStyle = {
  high: 'bg-brand-green/15 text-brand-green',
  moderate: 'bg-brand-teal/15 text-brand-teal',
  low: 'bg-brand-coral/15 text-brand-coral',
};

function formatCurrency(n) {
  if (n === 0) return '$0';
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

/* ──────────────────────────────────── page ── */
export default function ImpactAllocationPage() {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="min-h-screen bg-navy text-white font-sans">
      {/* ── nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <span className="text-lg font-semibold tracking-tight">
          <span className="text-brand-teal">transform</span>
          <span className="text-white/80">learning</span>
        </span>
        <a href="/campus-os/demo" className="text-sm text-white/60 hover:text-white transition-colors">
          &larr; All Demos
        </a>
      </nav>

      {/* ── header ── */}
      <header className="text-center pt-10 pb-2 px-4">
        <p className="text-brand-teal text-xs uppercase tracking-[0.25em] mb-2 font-semibold">Campus OS Demo</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 leading-tight">Impact Allocation</h1>
        <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base">
          Resources flow to where learning gaps are closing. Not to whoever argued loudest at the budget meeting.
        </p>
      </header>

      {/* ── provocative stat ── */}
      <section className="max-w-4xl mx-auto px-4 pt-6 pb-10">
        <div className="border border-brand-coral/30 bg-brand-coral/[0.06] rounded-2xl p-6 md:p-8 text-center">
          <p className="text-white/60 text-sm mb-4 uppercase tracking-wider font-semibold">Current model at most institutions</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-brand-coral font-serif">73%</p>
              <p className="text-white/50 text-sm mt-1">of budget allocated by<br />historical precedent</p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-white/10" />
            <div>
              <p className="text-4xl md:text-5xl font-bold text-brand-coral font-serif">0%</p>
              <p className="text-white/50 text-sm mt-1">allocated by measured<br />learning impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 1. Impact Leaderboard ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-white/[0.03] px-5 py-4 border-b border-white/10">
            <h2 className="font-serif text-xl md:text-2xl font-bold">Impact Leaderboard</h2>
            <p className="text-white/40 text-sm mt-1">Programs ranked by measured learning impact — not budget size</p>
          </div>

          {/* table header */}
          <div className="hidden lg:grid grid-cols-[2.5rem_1fr_5.5rem_6rem_5.5rem_6rem_5.5rem] gap-3 px-5 py-3 text-[10px] uppercase tracking-wider text-white/30 border-b border-white/[0.06]">
            <span>#</span>
            <span>Program</span>
            <span className="text-right">Students</span>
            <span className="text-right">Proficiency &uarr;</span>
            <span className="text-right">DFW &darr;</span>
            <span className="text-right">Cost / Student</span>
            <span className="text-right">Impact Score</span>
          </div>

          {/* rows */}
          <div className="divide-y divide-white/[0.04]">
            {leaderboard.map((row) => {
              const tc = tierColor[row.tier];
              const isFirst = row.rank === 1;
              const isLast = row.rank === 8;
              return (
                <div
                  key={row.rank}
                  className={`
                    px-5 py-4 transition-colors
                    ${hoveredRow === row.rank ? 'bg-white/[0.04]' : ''}
                    ${isFirst ? 'border-l-4 border-l-brand-green' : isLast ? 'border-l-4 border-l-brand-coral' : 'border-l-4 border-l-transparent'}
                  `}
                  onMouseEnter={() => setHoveredRow(row.rank)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* mobile layout */}
                  <div className="lg:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full ${tc.bg} ${tc.text} flex items-center justify-center text-xs font-bold`}>{row.rank}</span>
                        <span className="font-semibold text-sm">{row.program}</span>
                      </div>
                      <span className={`text-lg font-bold ${tc.text}`}>{row.impactScore}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-white/50 ml-10">
                      <span>{row.students} students</span>
                      <span>+{row.proficiencyGain}pts</span>
                      <span>DFW &minus;{row.dfwReduction}%</span>
                      <span>{formatCurrency(row.costPerStudent)}/student</span>
                    </div>
                    {isFirst && (
                      <p className="mt-2 ml-10 text-xs text-brand-green/80 italic">Smallest budget ({formatCurrency(row.budget)}). Highest impact.</p>
                    )}
                    {isLast && (
                      <p className="mt-2 ml-10 text-xs text-brand-coral/80 italic">Largest budget ({formatCurrency(row.budget)}). Lowest impact.</p>
                    )}
                  </div>

                  {/* desktop layout */}
                  <div className="hidden lg:grid grid-cols-[2.5rem_1fr_5.5rem_6rem_5.5rem_6rem_5.5rem] gap-3 items-center">
                    <span className={`w-7 h-7 rounded-full ${tc.bg} ${tc.text} flex items-center justify-center text-xs font-bold`}>{row.rank}</span>
                    <div>
                      <span className="font-semibold text-sm">{row.program}</span>
                      {isFirst && <span className="ml-2 text-[10px] text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">Smallest budget. Highest impact.</span>}
                      {isLast && <span className="ml-2 text-[10px] text-brand-coral bg-brand-coral/10 px-2 py-0.5 rounded-full">Largest budget. Lowest impact.</span>}
                    </div>
                    <span className="text-right text-sm text-white/70">{row.students}</span>
                    <span className="text-right text-sm text-white/70">+{row.proficiencyGain} pts</span>
                    <span className="text-right text-sm text-white/70">&minus;{row.dfwReduction}%</span>
                    <span className="text-right text-sm text-white/70">{formatCurrency(row.costPerStudent)}</span>
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className={`h-full rounded-full ${tc.dot}`} style={{ width: `${row.impactScore}%` }} />
                      </div>
                      <span className={`text-sm font-bold ${tc.text}`}>{row.impactScore}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. Resource Flow Visualization ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-white/[0.03] px-5 py-4 border-b border-white/10">
            <h2 className="font-serif text-xl md:text-2xl font-bold">Resource Flow</h2>
            <p className="text-white/40 text-sm mt-1">How money should move when impact drives allocation</p>
          </div>

          <div className="p-5 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 md:gap-0 items-start">
              {/* LEFT — Budget Sources */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">Budget Sources</p>
                {budgetSources.map((s) => (
                  <div key={s.name} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3">
                    <span className={`w-3 h-3 rounded-full bg-${s.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{s.name}</p>
                      <p className="text-xs text-white/40">${s.amount}K</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Arrow left */}
              <div className="hidden md:flex items-center justify-center px-3 pt-20">
                <div className="flex flex-col items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-0.5 h-3 bg-brand-teal/40 rounded-full" style={{ animationDelay: `${i * 0.2}s`, animation: 'pulse 2s ease-in-out infinite' }} />
                  ))}
                  <svg className="w-4 h-4 text-brand-teal/60 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>

              {/* CENTER — AI Impact Engine */}
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">AI Impact Engine</p>
                <div className="relative w-full max-w-[220px] aspect-square">
                  {/* pulsing rings */}
                  {[1, 2, 3].map((r) => (
                    <div
                      key={r}
                      className="absolute inset-0 rounded-full border border-brand-teal/20"
                      style={{
                        margin: `${r * 12}px`,
                        animation: `pulse-ring-impact ${2 + r * 0.5}s ease-out infinite`,
                        animationDelay: `${r * 0.4}s`,
                      }}
                    />
                  ))}
                  {/* core */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-brand-teal/10 border-2 border-brand-teal/40 flex flex-col items-center justify-center text-center shadow-lg shadow-brand-teal/10">
                      <svg className="w-8 h-8 text-brand-teal mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                      </svg>
                      <p className="text-[10px] text-brand-teal font-bold leading-tight">Evaluates<br />impact per<br />dollar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow right */}
              <div className="hidden md:flex items-center justify-center px-3 pt-20">
                <div className="flex flex-col items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-0.5 h-3 bg-brand-teal/40 rounded-full" style={{ animationDelay: `${i * 0.2}s`, animation: 'pulse 2s ease-in-out infinite' }} />
                  ))}
                  <svg className="w-4 h-4 text-brand-teal/60 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>

              {/* RIGHT — Destinations */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">Destinations (by impact)</p>
                {destinations.map((d) => (
                  <div key={d.name} className={`flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 ${d.recommended ? 'ring-1 ring-brand-teal/30' : ''}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${d.impact === 'high' ? 'bg-brand-green' : d.impact === 'moderate' ? 'bg-brand-teal' : 'bg-brand-coral'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${impactDestColor[d.impact]}`}>{d.name}</p>
                      <p className="text-xs text-white/40">${d.amount}K current</p>
                    </div>
                    {d.recommended && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${d.recommended.startsWith('+') ? 'bg-brand-green/15 text-brand-green' : 'bg-brand-coral/15 text-brand-coral'}`}>
                        {d.recommended}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* reallocation callout */}
            <div className="mt-8 bg-brand-teal/[0.08] border border-brand-teal/25 rounded-xl p-4 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 shrink-0 animate-pulse" />
              <p className="text-sm text-white/80">
                <span className="text-brand-teal font-semibold">AI Recommendation:</span>{' '}
                Reallocate $180K from low-impact traditional tutoring to high-impact peer coaching. Projected result: 3.2x more students served at 18x lower cost per student improved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ROI Comparison Table ── */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-white/[0.03] px-5 py-4 border-b border-white/10">
            <h2 className="font-serif text-xl md:text-2xl font-bold">ROI Comparison</h2>
            <p className="text-white/40 text-sm mt-1">Cost per student improved, side by side</p>
          </div>

          {/* header row */}
          <div className="hidden md:grid grid-cols-[1fr_6rem_6rem_6rem_6rem_5.5rem] gap-3 px-5 py-3 text-[10px] uppercase tracking-wider text-white/30 border-b border-white/[0.06]">
            <span>Intervention</span>
            <span className="text-right">Annual Cost</span>
            <span className="text-right">Students</span>
            <span className="text-right">Cost / Student</span>
            <span className="text-right">Avg Improvement</span>
            <span className="text-center">Efficiency</span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {interventions.map((row) => (
              <div key={row.name} className="px-5 py-4">
                {/* mobile */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{row.name}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${efficiencyStyle[row.efficiency]}`}>{row.efficiency}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                    <span>Cost: {row.annualCost}</span>
                    <span>Students: {row.studentsServed}</span>
                    <span>Per student: {row.costPerStudent}</span>
                    <span>Improvement: {row.avgImprovement}</span>
                  </div>
                </div>
                {/* desktop */}
                <div className="hidden md:grid grid-cols-[1fr_6rem_6rem_6rem_6rem_5.5rem] gap-3 items-center">
                  <span className="font-semibold text-sm">{row.name}</span>
                  <span className="text-right text-sm text-white/70">{row.annualCost}</span>
                  <span className="text-right text-sm text-white/70">{row.studentsServed}</span>
                  <span className={`text-right text-sm font-semibold ${row.efficiency === 'high' ? 'text-brand-green' : row.efficiency === 'low' ? 'text-brand-coral' : 'text-brand-teal'}`}>{row.costPerStudent}</span>
                  <span className="text-right text-sm text-white/70">{row.avgImprovement}</span>
                  <div className="flex justify-center">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${efficiencyStyle[row.efficiency]}`}>{row.efficiency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Old Way vs. New Way ── */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-6">The Old Way vs. The New Way</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* OLD */}
          <div className="border border-brand-coral/30 bg-brand-coral/[0.05] rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-brand-coral" />
              <h3 className="font-serif text-lg font-bold text-brand-coral">The Old Way</h3>
            </div>
            <ul className="space-y-3 text-sm text-white/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-brand-coral shrink-0 mt-0.5">&times;</span>
                <span>Budget committee meets in March.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-coral shrink-0 mt-0.5">&times;</span>
                <span>Departments submit requests. Politics determine allocation.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-coral shrink-0 mt-0.5">&times;</span>
                <span>Nobody measures impact until the annual report.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-coral shrink-0 mt-0.5">&times;</span>
                <span className="italic text-white/40">Which nobody reads.</span>
              </li>
            </ul>
          </div>

          {/* NEW */}
          <div className="border border-brand-green/30 bg-brand-green/[0.05] rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-brand-green" />
              <h3 className="font-serif text-lg font-bold text-brand-green">The New Way</h3>
            </div>
            <ul className="space-y-3 text-sm text-white/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-brand-green shrink-0 mt-0.5">&check;</span>
                <span>AI continuously measures learning impact per dollar.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green shrink-0 mt-0.5">&check;</span>
                <span>Resources shift in real time toward what&rsquo;s working.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green shrink-0 mt-0.5">&check;</span>
                <span>Every dollar has a measured return.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green shrink-0 mt-0.5">&check;</span>
                <span className="font-semibold text-brand-green">Every reallocation is evidence-based.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5. Projected Savings ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="relative border border-brand-teal/30 bg-brand-teal/[0.06] rounded-2xl p-6 md:p-8">
          <div className="absolute -top-3 left-6 bg-navy px-3 py-0.5 text-[10px] uppercase tracking-widest text-brand-teal font-semibold rounded-full border border-brand-teal/30">
            Projected Impact
          </div>
          <p className="text-white/60 text-sm mb-5">
            If this institution reallocated just <span className="text-white font-semibold">15% of its instructional budget</span> based on measured impact:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-brand-green font-serif">+84</p>
              <p className="text-sm text-white/50 mt-1">additional students retained</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-brand-teal font-serif">$1.2M</p>
              <p className="text-sm text-white/50 mt-1">additional tuition revenue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-brand-green font-serif">&minus;6.2%</p>
              <p className="text-sm text-white/50 mt-1">DFW rate reduction</p>
            </div>
          </div>
          <p className="text-center text-white/30 text-xs mt-6 italic">
            Money follows learning. Learning improves outcomes. Outcomes generate revenue. It&rsquo;s not complicated &mdash; it&rsquo;s just never been measured.
          </p>
        </div>
      </section>

      {/* ── animation keyframes ── */}
      <style jsx global>{`
        @keyframes pulse-ring-impact {
          0% {
            transform: scale(0.85);
            opacity: 0.5;
          }
          80% {
            opacity: 0;
          }
          100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
