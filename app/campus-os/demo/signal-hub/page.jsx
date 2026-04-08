'use client';

import { useState } from 'react';

/* ───────────────────────────────────────────── mock data ── */
const student = {
  name: 'Elena Vasquez',
  course: 'Biology 201',
  proficiency: 42,
  previousProficiency: 58,
  trend: 'declining',
  flaggedSkills: ['Membrane Transport', 'Cell Signaling', 'Osmotic Regulation'],
};

const recipients = [
  {
    id: 'professor',
    role: 'Professor',
    name: 'Dr. Okafor',
    color: 'brand-teal',
    ring: 1,
    angle: 0,
    signal:
      'Elena\u2019s cell biology comprehension dropped 16pts in 2 weeks. Recommended: targeted coaching on membrane transport.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
  },
  {
    id: 'advisor',
    role: 'Advisor',
    name: 'Maria Santos',
    color: 'brand-green',
    ring: 1,
    angle: 60,
    signal:
      'Elena\u2019s trajectory suggests mid-semester withdrawal risk. Schedule check-in before Week 9.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3a49.5 49.5 0 0 1-4.02-.163 2.115 2.115 0 0 1-1.825-2.193V10.61a2.098 2.098 0 0 1 1.825-2.098 49.414 49.414 0 0 1 8.52 0ZM3.75 15.75v3.091l3-3c1.336.062 2.681.088 4.02.078a2.115 2.115 0 0 0 1.825-2.193V9.34a2.098 2.098 0 0 0-1.825-2.098 49.414 49.414 0 0 0-8.52 0A2.098 2.098 0 0 0 .75 9.34v4.286c0 1.136.847 2.1 1.98 2.193.34.027.68.052 1.02.072Z" />
      </svg>
    ),
  },
  {
    id: 'financial',
    role: 'Financial Aid',
    name: 'Office',
    color: 'brand-coral',
    ring: 1,
    angle: 120,
    signal:
      'If Elena withdraws, $18,400 in remaining tuition is at risk. Retention intervention cost: $420.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    id: 'peer',
    role: 'Peer Match',
    name: 'Jake Morrison',
    color: 'brand-teal',
    ring: 2,
    angle: 180,
    signal:
      'Jake Morrison mastered membrane transport 3 weeks ago. 94% match. Auto-suggest peer session.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    id: 'chair',
    role: 'Dept. Chair',
    name: 'Biology',
    color: 'brand-purple',
    ring: 2,
    angle: 240,
    signal:
      'Elena is the 4th student this week with membrane transport gaps. Possible instructional alignment issue in Section 3.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    id: 'dean',
    role: 'Dean',
    name: 'Academic Affairs',
    color: 'brand-coral',
    ring: 2,
    angle: 300,
    signal:
      'Bio 201 Section 3 has 6 students trending below intervention threshold. Pattern emerging.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
];

const decisionLog = [
  {
    id: 1,
    time: '2:34 PM',
    text: 'Signal detected: proficiency drop >15pts in 14 days',
    confidence: 0.91,
    routed: 'Professor, Advisor, Financial Aid',
    status: 'delivered',
  },
  {
    id: 2,
    time: '2:34 PM',
    text: 'Peer match identified: Jake Morrison',
    confidence: 0.94,
    routed: 'Auto-suggested to both students',
    status: 'delivered',
  },
  {
    id: 3,
    time: '2:35 PM',
    text: 'Pattern detected: Section 3 membrane transport cluster',
    confidence: 0.87,
    routed: 'Dept. Chair',
    status: 'delivered',
  },
  {
    id: 4,
    time: '2:35 PM',
    text: 'Governance check: All signals passed fairness and confidence thresholds',
    confidence: 1.0,
    routed: 'System log',
    status: 'verified',
  },
];

/* ────────────────────────────────── color lookup helpers ── */
const colorMap = {
  'brand-teal': { bg: 'bg-brand-teal/15', border: 'border-brand-teal/40', text: 'text-brand-teal', dot: 'bg-brand-teal', glow: 'shadow-brand-teal/20' },
  'brand-green': { bg: 'bg-brand-green/15', border: 'border-brand-green/40', text: 'text-brand-green', dot: 'bg-brand-green', glow: 'shadow-brand-green/20' },
  'brand-coral': { bg: 'bg-brand-coral/15', border: 'border-brand-coral/40', text: 'text-brand-coral', dot: 'bg-brand-coral', glow: 'shadow-brand-coral/20' },
  'brand-purple': { bg: 'bg-brand-purple/15', border: 'border-brand-purple/40', text: 'text-brand-purple', dot: 'bg-brand-purple', glow: 'shadow-brand-purple/20' },
};

/* ──────────────────────────────────────── page component ── */
export default function SignalHubPage() {
  const [activeRecipient, setActiveRecipient] = useState(null);

  return (
    <div className="min-h-screen bg-navy text-white font-sans">
      {/* ── nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <span className="text-lg font-semibold tracking-tight">
          <span className="text-brand-teal">arrival</span>
          <span className="text-white/80">.ai</span>
        </span>
        <a href="/campus-os/demo" className="text-sm text-white/60 hover:text-white transition-colors">
          &larr; All Demos
        </a>
      </nav>

      {/* ── page title ── */}
      <header className="text-center pt-10 pb-2 px-4">
        <p className="text-brand-teal text-xs uppercase tracking-[0.25em] mb-2 font-semibold">Campus OS Demo</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 leading-tight">The Signal Hub</h1>
        <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base">
          One student&rsquo;s learning signal radiates outward to every stakeholder who can act &mdash; simultaneously, with no hierarchy.
        </p>
      </header>

      {/* ── radial hub ── */}
      <section className="relative max-w-6xl mx-auto px-4 py-8">
        {/* concentric ring background */}
        <div className="relative mx-auto" style={{ maxWidth: 820, aspectRatio: '1/1' }}>
          {/* rings */}
          {[1, 2, 3, 4].map((r) => (
            <div
              key={r}
              className="absolute rounded-full border border-white/[0.06]"
              style={{
                width: `${r * 25}%`,
                height: `${r * 25}%`,
                top: `${50 - r * 12.5}%`,
                left: `${50 - r * 12.5}%`,
              }}
            />
          ))}

          {/* animated pulse rings */}
          {[1, 2, 3].map((r) => (
            <div
              key={`pulse-${r}`}
              className="absolute rounded-full border border-brand-coral/20"
              style={{
                width: `${r * 30}%`,
                height: `${r * 30}%`,
                top: `${50 - r * 15}%`,
                left: `${50 - r * 15}%`,
                animation: `pulse-ring ${2 + r * 0.5}s ease-out infinite`,
                animationDelay: `${r * 0.6}s`,
              }}
            />
          ))}

          {/* ── center student node ── */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-44 md:w-52 bg-navy-light border-2 border-brand-coral/60 rounded-2xl p-4 shadow-lg shadow-brand-coral/10 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-coral/20 border border-brand-coral/40 flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-brand-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3 className="font-serif text-base font-bold leading-snug">{student.name}</h3>
              <p className="text-white/50 text-xs mt-0.5">{student.course}</p>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <span className="text-2xl font-bold text-brand-coral">{student.proficiency}%</span>
                <span className="text-xs text-white/40 leading-tight">
                  was {student.previousProficiency}%
                  <br />
                  <span className="text-brand-coral">&darr; {student.trend}</span>
                </span>
              </div>
              <p className="text-[10px] text-white/40 mt-1.5">{student.flaggedSkills.length} skills flagged</p>
            </div>
          </div>

          {/* ── recipient nodes ── */}
          {recipients.map((r) => {
            const c = colorMap[r.color];
            const radius = r.ring === 1 ? 36 : 46;
            const angleRad = (r.angle * Math.PI) / 180;
            const top = 50 - radius * Math.cos(angleRad);
            const left = 50 + radius * Math.sin(angleRad);
            const isActive = activeRecipient === r.id;

            return (
              <button
                key={r.id}
                onClick={() => setActiveRecipient(isActive ? null : r.id)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ top: `${top}%`, left: `${left}%` }}
              >
                {/* connector line to center */}
                <svg
                  className="absolute pointer-events-none"
                  style={{
                    width: '200%',
                    height: '200%',
                    top: '-50%',
                    left: '-50%',
                    zIndex: -1,
                    opacity: 0.15,
                  }}
                >
                  {/* intentionally blank — the rings themselves convey connection */}
                </svg>

                {/* node */}
                <div
                  className={`
                    w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex flex-col items-center justify-center
                    transition-all duration-300
                    ${isActive ? `${c.bg} ${c.border} scale-110 shadow-lg ${c.glow}` : `bg-navy-light/80 border-white/10 hover:${c.border} hover:scale-105`}
                  `}
                >
                  <div className={`${isActive ? c.text : 'text-white/60 group-hover:text-white/80'} transition-colors`}>
                    {r.icon}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-semibold mt-0.5 leading-none text-center whitespace-nowrap">
                    {r.role}
                  </span>
                </div>

                {/* tooltip / signal card */}
                {isActive && (
                  <div
                    className={`
                      absolute z-30 w-64 md:w-72 ${c.bg} border ${c.border} rounded-xl p-4 text-left
                      shadow-xl backdrop-blur-sm
                    `}
                    style={{
                      top: top < 30 ? '110%' : top > 70 ? 'auto' : '50%',
                      bottom: top > 70 ? '110%' : 'auto',
                      left: left > 60 ? 'auto' : left < 40 ? '0' : '50%',
                      right: left > 60 ? '0' : 'auto',
                      transform: left >= 40 && left <= 60 ? 'translateX(-50%)' : 'none',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="text-[10px] text-white/40 ml-auto">{r.role}</span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">{r.signal}</p>
                    <p className="text-[10px] text-white/40 mt-2 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
                      Delivered simultaneously
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ── recipient signal cards (mobile-friendly list below radial) ── */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
          {recipients.map((r) => {
            const c = colorMap[r.color];
            return (
              <div
                key={r.id}
                className={`${c.bg} border ${c.border} rounded-xl p-4 transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full ${c.bg} border ${c.border} flex items-center justify-center ${c.text}`}>
                    {r.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-[10px] text-white/40">{r.role}</p>
                  </div>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{r.signal}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── AI decision log ── */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-white/[0.03] px-5 py-3 border-b border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
            <h2 className="font-serif text-lg font-semibold">AI Decision Log</h2>
            <span className="text-[10px] text-white/30 ml-auto font-mono">LIVE</span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {decisionLog.map((entry, i) => (
              <div
                key={entry.id}
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <span className="text-xs text-white/30 font-mono shrink-0 pt-0.5">{entry.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80">{entry.text}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-[10px] text-white/40">
                      Confidence: <span className="text-brand-teal font-semibold">{entry.confidence.toFixed(2)}</span>
                    </span>
                    <span className="text-[10px] text-white/40">
                      Routed to: <span className="text-white/60">{entry.routed}</span>
                    </span>
                  </div>
                </div>
                <span
                  className={`
                    shrink-0 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full
                    ${entry.status === 'delivered' ? 'bg-brand-teal/15 text-brand-teal' : 'bg-brand-green/15 text-brand-green'}
                  `}
                >
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── key insight ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="relative border border-brand-purple/30 bg-brand-purple/[0.07] rounded-2xl p-6 md:p-8">
          <div className="absolute -top-3 left-6 bg-navy px-3 py-0.5 text-[10px] uppercase tracking-widest text-brand-purple font-semibold rounded-full border border-brand-purple/30">
            Key Insight
          </div>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            In the old model, this information would take <span className="text-white font-semibold">3 weeks</span> to reach the dean &mdash; via a grade report, aggregated by the registrar, summarized by IR, presented at a committee meeting.
          </p>
          <p className="text-brand-teal font-semibold mt-3 text-sm md:text-base">
            In Campus OS, everyone sees it now.
          </p>
        </div>
      </section>

      {/* ── pulse animation keyframes ── */}
      <style jsx global>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          80% {
            opacity: 0;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
