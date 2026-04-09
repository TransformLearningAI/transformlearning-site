'use client';

import { useState } from 'react';

/* ───────────────────────────────────────────── mock data ── */
const studentData = {
  name: 'Marcus Thompson',
  course: 'Calculus I',
  week: 7,
  totalWeeks: 15,
  proficiency: 64,
};

const skills = [
  { name: 'Limits', short: 'LIM', proficiency: 82, trend: 'stable', color: 'brand-teal' },
  { name: 'Derivatives', short: 'DER', proficiency: 58, trend: 'improving', color: 'brand-green' },
  { name: 'Integration', short: 'INT', proficiency: 34, trend: 'declining', color: 'brand-coral' },
  { name: 'Problem Decomposition', short: 'DEC', proficiency: 47, trend: 'stable', color: 'brand-coral' },
  { name: 'Mathematical Reasoning', short: 'REA', proficiency: 71, trend: 'improving', color: 'brand-teal' },
  { name: 'Proof Writing', short: 'PRF', proficiency: 39, trend: 'declining', color: 'brand-coral' },
];

const resources = [
  {
    type: 'Peer Coaches',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    label: '3 peer coaches available',
    detail: [
      { name: 'Aisha Patel', mastery: 91, available: 'Now' },
      { name: 'Carlos Ruiz', mastery: 87, available: 'In 2 hrs' },
      { name: 'Mei Lin', mastery: 84, available: 'Tomorrow' },
    ],
    accent: 'brand-teal',
  },
  {
    type: 'AI Coaching',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    label: 'AI coaching session ready',
    sub: 'Estimated 12 min to address core integration gap',
    accent: 'brand-purple',
  },
  {
    type: 'Practice',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    label: '8 problems calibrated to your level',
    sub: 'Practice set targeting fundamental theorem connections',
    accent: 'brand-green',
  },
  {
    type: 'Study Group',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    label: 'Study group forming: Wed 3pm',
    sub: '4 students, same gap area',
    accent: 'brand-teal',
  },
  {
    type: 'Office Hours',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    label: 'Prof. Chen office hours: Thu 2\u20134pm',
    sub: 'Current wait: 0 students',
    accent: 'brand-green',
  },
];

const peerConnections = {
  canHelp: [
    { name: 'Sofia K.', skill: 'Limits', theirProf: 51 },
    { name: 'David R.', skill: 'Limits', theirProf: 44 },
  ],
  canHelpYou: [
    { name: 'Aisha P.', skill: 'Integration', theirProf: 91 },
    { name: 'Carlos R.', skill: 'Integration', theirProf: 87 },
    { name: 'Mei L.', skill: 'Proof Writing', theirProf: 84 },
  ],
};

const projections = [
  { label: 'Current pace', proficiency: 52, color: 'brand-coral', desc: 'No changes' },
  { label: '+ 3 coaching sessions + peer practice', proficiency: 68, color: 'brand-teal', desc: 'Moderate effort' },
  { label: '+ daily practice sets', proficiency: 74, color: 'brand-green', desc: 'High effort' },
];

const agencyStats = {
  decisions: [
    { action: '4 practice sets chosen', icon: '{}' },
    { action: '1 peer session initiated', icon: '{}' },
    { action: '2 coaching conversations', icon: '{}' },
  ],
  impact: '+8 points across 3 skills',
};

/* ────────────────────────── accent color CSS class maps ── */
const accentBg = { 'brand-teal': 'bg-brand-teal', 'brand-green': 'bg-brand-green', 'brand-coral': 'bg-brand-coral', 'brand-purple': 'bg-brand-purple' };
const accentBgSoft = { 'brand-teal': 'bg-brand-teal/15', 'brand-green': 'bg-brand-green/15', 'brand-coral': 'bg-brand-coral/15', 'brand-purple': 'bg-brand-purple/15' };
const accentBorder = { 'brand-teal': 'border-brand-teal/30', 'brand-green': 'border-brand-green/30', 'brand-coral': 'border-brand-coral/30', 'brand-purple': 'border-brand-purple/30' };
const accentText = { 'brand-teal': 'text-brand-teal', 'brand-green': 'text-brand-green', 'brand-coral': 'text-brand-coral', 'brand-purple': 'text-brand-purple' };

/* ─────────────────── helper: trend arrow ── */
function TrendArrow({ trend }) {
  if (trend === 'improving') return <span className="text-brand-green text-xs">&uarr;</span>;
  if (trend === 'declining') return <span className="text-brand-coral text-xs">&darr;</span>;
  return <span className="text-white/30 text-xs">&rarr;</span>;
}

/* ─────────────────── helper: proficiency bar color ── */
function profColor(p) {
  if (p >= 70) return 'bg-brand-teal';
  if (p >= 50) return 'bg-brand-green';
  return 'bg-brand-coral';
}

/* ──────────────────────────────────────── page component ── */
export default function StudentControlPage() {
  const [selectedSkill, setSelectedSkill] = useState(2); // Integration by default

  const weekProgress = (studentData.week / studentData.totalWeeks) * 100;

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

      {/* ── command header ── */}
      <header className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-brand-teal text-xs uppercase tracking-[0.25em] mb-1 font-semibold">Campus OS / Student</p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">Your Control Panel</h1>
              <p className="text-white/40 text-sm mt-1">{studentData.name} &middot; {studentData.course}</p>
            </div>

            {/* HUD-style stats */}
            <div className="flex items-end gap-6">
              {/* week indicator */}
              <div className="text-center">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Week</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-brand-teal">{studentData.week}</span>
                  <span className="text-white/30 text-sm">/ {studentData.totalWeeks}</span>
                </div>
                <div className="w-24 h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-brand-teal rounded-full" style={{ width: `${weekProgress}%` }} />
                </div>
              </div>

              {/* proficiency gauge */}
              <div className="text-center">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Proficiency</p>
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none" stroke="#00A8A8" strokeWidth="3"
                      strokeDasharray={`${studentData.proficiency} ${100 - studentData.proficiency}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold font-mono">
                    {studentData.proficiency}
                  </span>
                </div>
              </div>

              {/* status */}
              <div className="text-center pb-1">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Status</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-green/15 border border-brand-green/30 text-brand-green text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ── top row: skill radar + resources ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── SKILL RADAR ── */}
          <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-5">
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Skill Radar
            </h2>

            {/* radar chart (CSS-based hexagonal representation) */}
            <div className="relative mx-auto mb-6" style={{ width: 280, height: 280 }}>
              {/* concentric hexagon guides */}
              {[100, 75, 50, 25].map((level) => (
                <div
                  key={level}
                  className="absolute border border-white/[0.06] rounded-full"
                  style={{
                    width: `${level * 2.6}px`,
                    height: `${level * 2.6}px`,
                    top: `${140 - level * 1.3}px`,
                    left: `${140 - level * 1.3}px`,
                  }}
                />
              ))}
              {/* percentage labels */}
              {[25, 50, 75, 100].map((level) => (
                <span
                  key={`lbl-${level}`}
                  className="absolute text-[9px] text-white/20 font-mono"
                  style={{ top: `${140 - level * 1.3 - 6}px`, left: '144px' }}
                >
                  {level}
                </span>
              ))}

              {/* skill points & connecting shape */}
              <svg viewBox="0 0 280 280" className="absolute inset-0 w-full h-full">
                {/* filled shape connecting all skill points */}
                <polygon
                  points={skills.map((s, i) => {
                    const angle = (i * 60 - 90) * (Math.PI / 180);
                    const r = (s.proficiency / 100) * 120;
                    return `${140 + r * Math.cos(angle)},${140 + r * Math.sin(angle)}`;
                  }).join(' ')}
                  fill="rgba(0,168,168,0.12)"
                  stroke="rgba(0,168,168,0.5)"
                  strokeWidth="1.5"
                />
                {/* axis lines */}
                {skills.map((_, i) => {
                  const angle = (i * 60 - 90) * (Math.PI / 180);
                  return (
                    <line
                      key={i}
                      x1="140" y1="140"
                      x2={140 + 130 * Math.cos(angle)}
                      y2={140 + 130 * Math.sin(angle)}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>

              {/* skill labels around the radar */}
              {skills.map((s, i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const labelR = 135;
                const x = 140 + labelR * Math.cos(angle);
                const y = 140 + labelR * Math.sin(angle);
                const isSelected = selectedSkill === i;

                return (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSkill(i)}
                    className={`
                      absolute -translate-x-1/2 -translate-y-1/2 text-center focus:outline-none transition-all
                      ${isSelected ? 'scale-110' : 'opacity-70 hover:opacity-100'}
                    `}
                    style={{ left: x, top: y }}
                  >
                    <span className={`block text-xs font-bold ${isSelected ? accentText[s.color] : 'text-white/80'}`}>
                      {s.proficiency}%
                    </span>
                    <span className="block text-[10px] text-white/50 leading-tight whitespace-nowrap">
                      {s.short} <TrendArrow trend={s.trend} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* skill detail list */}
            <div className="space-y-2">
              {skills.map((s, i) => {
                const isSelected = selectedSkill === i;
                return (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSkill(i)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all
                      ${isSelected ? `${accentBgSoft[s.color]} border ${accentBorder[s.color]}` : 'hover:bg-white/[0.04] border border-transparent'}
                    `}
                  >
                    <span className="text-sm font-medium flex-1">{s.name}</span>
                    <TrendArrow trend={s.trend} />
                    <span className={`text-sm font-bold font-mono ${isSelected ? accentText[s.color] : 'text-white/60'}`}>
                      {s.proficiency}%
                    </span>
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${profColor(s.proficiency)}`} style={{ width: `${s.proficiency}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RESOURCE NAVIGATOR ── */}
          <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-5">
            <h2 className="font-serif text-xl font-semibold mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
              </svg>
              Resource Navigator
            </h2>
            <p className="text-xs text-white/40 mb-4">
              Resources for <span className="text-brand-coral font-semibold">{skills[selectedSkill].name}</span> ({skills[selectedSkill].proficiency}%)
            </p>

            <div className="space-y-3">
              {resources.map((res) => {
                const a = res.accent;
                return (
                  <div
                    key={res.type}
                    className={`border ${accentBorder[a]} ${accentBgSoft[a]} rounded-xl p-4 hover:scale-[1.01] transition-transform`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 w-9 h-9 rounded-lg ${accentBgSoft[a]} border ${accentBorder[a]} flex items-center justify-center ${accentText[a]}`}>
                        {res.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{res.label}</p>
                        {res.sub && <p className="text-xs text-white/50 mt-0.5">{res.sub}</p>}

                        {/* peer coach detail rows */}
                        {res.detail && (
                          <div className="mt-2 space-y-1.5">
                            {res.detail.map((d) => (
                              <div key={d.name} className="flex items-center gap-2 text-xs">
                                <span className="w-6 h-6 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center text-[10px] font-bold text-brand-teal">
                                  {d.name.charAt(0)}
                                </span>
                                <span className="text-white/70">{d.name}</span>
                                <span className="text-white/30 ml-auto">Mastery {d.mastery}%</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${d.available === 'Now' ? 'bg-brand-green/20 text-brand-green' : 'bg-white/10 text-white/40'}`}>
                                  {d.available}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${accentBg[a]} text-navy hover:opacity-90 transition-opacity`}>
                        Open
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── middle row: peer network + path projections ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── PEER NETWORK ── */}
          <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-5">
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              Peer Network
            </h2>

            {/* mini network graph */}
            <div className="relative mx-auto mb-5" style={{ width: 260, height: 200 }}>
              <svg viewBox="0 0 260 200" className="w-full h-full">
                {/* connection lines: you -> canHelp */}
                <line x1="130" y1="100" x2="55" y2="45" stroke="rgba(0,168,168,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="130" y1="100" x2="55" y2="105" stroke="rgba(0,168,168,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
                {/* connection lines: canHelpYou -> you */}
                <line x1="205" y1="35" x2="130" y2="100" stroke="rgba(90,62,107,0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="205" y1="100" x2="130" y2="100" stroke="rgba(90,62,107,0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="205" y1="165" x2="130" y2="100" stroke="rgba(90,62,107,0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>

              {/* center: You */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-brand-teal/20 border-2 border-brand-teal/50 flex items-center justify-center">
                <span className="text-xs font-bold text-brand-teal">YOU</span>
              </div>

              {/* left: students you can help */}
              {peerConnections.canHelp.map((p, i) => (
                <div
                  key={p.name}
                  className="absolute w-10 h-10 rounded-full bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center"
                  style={{ left: 30, top: i === 0 ? 20 : 80 }}
                >
                  <span className="text-[10px] font-bold text-brand-teal">{p.name.split(' ')[0][0]}{p.name.split(' ')[1]}</span>
                </div>
              ))}

              {/* right: students who can help you */}
              {peerConnections.canHelpYou.map((p, i) => (
                <div
                  key={p.name}
                  className="absolute w-10 h-10 rounded-full bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center"
                  style={{ right: 30, top: i * 65 + 10 }}
                >
                  <span className="text-[10px] font-bold text-brand-purple">{p.name.split(' ')[0][0]}{p.name.split(' ')[1]}</span>
                </div>
              ))}
            </div>

            {/* legend rows */}
            <div className="space-y-3">
              <div className="bg-brand-teal/10 border border-brand-teal/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-brand-teal mb-1">You can help 2 students</p>
                <p className="text-xs text-white/50">Limits &amp; Continuity &mdash; your strength (82%)</p>
                <div className="flex gap-2 mt-2">
                  {peerConnections.canHelp.map((p) => (
                    <span key={p.name} className="text-xs bg-brand-teal/15 border border-brand-teal/30 rounded-full px-2 py-0.5 text-brand-teal">
                      {p.name} ({p.theirProf}%)
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-brand-purple mb-1">3 students can help you</p>
                <p className="text-xs text-white/50">Integration &amp; Proof Writing &mdash; your gaps</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {peerConnections.canHelpYou.map((p) => (
                    <span key={p.name} className="text-xs bg-brand-purple/15 border border-brand-purple/30 rounded-full px-2 py-0.5 text-brand-purple">
                      {p.name} ({p.theirProf}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── PATH PROJECTIONS ── */}
          <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-5">
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
              Path Projections
              <span className="text-[10px] text-white/30 ml-auto font-mono">Integration ({skills[2].proficiency}% &rarr; midterm)</span>
            </h2>

            {/* branching path visualization */}
            <div className="relative pl-8 mb-6">
              {/* vertical trunk */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

              {projections.map((proj, i) => (
                <div key={proj.label} className="relative mb-8 last:mb-0">
                  {/* branch node */}
                  <div className={`absolute left-[-16.5px] top-2 w-3 h-3 rounded-full ${accentBg[proj.color]} ring-2 ring-navy`} />

                  <div className={`ml-4 ${accentBgSoft[proj.color]} border ${accentBorder[proj.color]} rounded-xl p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold">{proj.label}</p>
                      <span className={`text-xl font-bold font-mono ${accentText[proj.color]}`}>{proj.proficiency}%</span>
                    </div>
                    <p className="text-[10px] text-white/40 mb-2">{proj.desc}</p>
                    {/* projected bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${accentBg[proj.color]} transition-all duration-700`}
                        style={{ width: `${proj.proficiency}%` }}
                      />
                    </div>
                    {/* delta from current */}
                    <p className={`text-xs mt-1.5 ${accentText[proj.color]}`}>
                      {proj.proficiency > skills[2].proficiency
                        ? `+${proj.proficiency - skills[2].proficiency} pts from current`
                        : `${proj.proficiency - skills[2].proficiency} pts — needs intervention`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="w-full py-2.5 rounded-xl bg-brand-teal text-navy font-semibold text-sm hover:bg-brand-teal/90 transition-colors">
              Choose Your Path
            </button>
          </div>
        </div>

        {/* ── bottom row: agency stats ── */}
        <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-5">
          <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
            Your Agency This Week
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* individual decision cards */}
            <div className="bg-brand-teal/10 border border-brand-teal/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-teal/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-brand-teal">4</p>
                <p className="text-[10px] text-white/40">Practice sets chosen</p>
              </div>
            </div>

            <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-brand-purple">1</p>
                <p className="text-[10px] text-white/40">Peer session initiated</p>
              </div>
            </div>

            <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-green/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3a49.5 49.5 0 0 1-4.02-.163 2.115 2.115 0 0 1-1.825-2.193V10.61a2.098 2.098 0 0 1 1.825-2.098 49.414 49.414 0 0 1 8.52 0ZM3.75 15.75v3.091l3-3c1.336.062 2.681.088 4.02.078a2.115 2.115 0 0 0 1.825-2.193V9.34a2.098 2.098 0 0 0-1.825-2.098 49.414 49.414 0 0 0-8.52 0A2.098 2.098 0 0 0 .75 9.34v4.286c0 1.136.847 2.1 1.98 2.193.34.027.68.052 1.02.072Z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-brand-green">2</p>
                <p className="text-[10px] text-white/40">Coaching conversations</p>
              </div>
            </div>

            {/* impact summary */}
            <div className="bg-brand-coral/10 border border-brand-coral/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-coral/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-brand-coral">+8 pts</p>
                <p className="text-[10px] text-white/40">Across 3 skills this week</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/30 mt-4 text-center italic">
            Every resource above was chosen by you. You are not a subject being acted upon &mdash; you are the operator.
          </p>
        </div>
      </main>
    </div>
  );
}
