'use client';

import { useState, useEffect } from 'react';

/* ───────────────────────────────────────── mock data ── */

const vitalSigns = [
  {
    label: 'Students Active Right Now',
    value: 1247,
    context: 'of 8,420',
    sparkline: [820, 640, 380, 290, 310, 580, 890, 1050, 1180, 1247],
    color: 'brand-teal',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    label: 'Learning Events Today',
    value: 3891,
    context: 'quizzes, coaching, uploads, peer sessions',
    sparkline: [120, 340, 680, 1200, 1890, 2400, 2980, 3340, 3650, 3891],
    color: 'brand-green',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    label: 'Signals Detected',
    value: 47,
    context: 'trajectory changes requiring attention',
    sparkline: [2, 5, 8, 14, 19, 24, 30, 36, 42, 47],
    color: 'brand-coral',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    label: 'Decisions Routed',
    value: 14,
    context: '8 resolved \u00b7 3 pending \u00b7 3 auto-handled',
    sparkline: [1, 2, 3, 5, 6, 8, 9, 11, 12, 14],
    color: 'brand-purple',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    label: 'Interventions Active',
    value: 89,
    context: 'coaching, peer matches, study groups',
    sparkline: [12, 24, 33, 41, 50, 58, 66, 74, 82, 89],
    color: 'brand-teal',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    label: 'Institutional Proficiency',
    value: 64.2,
    context: '\u2191 0.3 from yesterday',
    sparkline: [61.4, 61.8, 62.0, 62.3, 62.7, 63.0, 63.4, 63.6, 63.9, 64.2],
    color: 'brand-green',
    suffix: '%',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
];

const signalFeed = [
  { time: '10:42 AM', text: 'Elena Vasquez completed peer coaching session. Integration +8pts. Signal: trajectory improving.', type: 'learning' },
  { time: '10:38 AM', text: 'AI detected: 3 students in Psych 101 Section 2 struggling with statistical inference. Routed to outcome steward.', type: 'alert' },
  { time: '10:35 AM', text: 'Peer match created: Priya \u2192 Marcus (Derivatives). Match score: 91%.', type: 'ai' },
  { time: '10:31 AM', text: 'Decision resolved: Dr. Kim approved Section 3 instructional review. Time: 22 minutes.', type: 'resolution' },
  { time: '10:28 AM', text: 'Financial aid alert: 2 students flagged for emergency fund eligibility. Routed.', type: 'alert' },
  { time: '10:24 AM', text: 'Study group formed: Calculus I Integration. 4 students. Wed 3pm.', type: 'learning' },
  { time: '10:19 AM', text: 'AI governance check: Fairness audit passed for Bio 201 intervention recommendations.', type: 'ai' },
  { time: '10:15 AM', text: 'Prof. Martinez updated Chem 101 mastery thresholds. 3 students reclassified.', type: 'resolution' },
  { time: '10:11 AM', text: 'Signal: 5 students in English 102 showing declining engagement patterns over 7 days.', type: 'alert' },
  { time: '10:07 AM', text: 'Peer coaching session completed: Jake M. helped 2 students with membrane transport. Both +6pts.', type: 'learning' },
  { time: '10:03 AM', text: 'Auto-intervention: Personalized review materials sent to 12 students ahead of Psych midterm.', type: 'ai' },
  { time: '9:58 AM', text: 'Decision routed: Nursing program requesting additional simulation lab hours. Sent to Dean of Health Sciences.', type: 'resolution' },
];

const feedTypeStyles = {
  learning: { dot: 'bg-brand-teal', text: 'text-brand-teal', label: 'Learning' },
  alert: { dot: 'bg-brand-coral', text: 'text-brand-coral', label: 'Alert' },
  resolution: { dot: 'bg-brand-green', text: 'text-brand-green', label: 'Resolved' },
  ai: { dot: 'bg-brand-purple', text: 'text-brand-purple', label: 'AI Action' },
};

/* 6x5 course grid */
const courseGrid = [
  { code: 'BIO 201-1', name: 'Biology I', proficiency: 71, trend: 'up', health: 'healthy' },
  { code: 'ENG 102-1', name: 'English Comp', proficiency: 68, trend: 'up', health: 'healthy' },
  { code: 'MATH 151-1', name: 'Calculus I', proficiency: 52, trend: 'down', health: 'concern' },
  { code: 'PSY 101-1', name: 'Intro Psych', proficiency: 65, trend: 'stable', health: 'healthy' },
  { code: 'CHEM 101-1', name: 'Gen Chemistry', proficiency: 58, trend: 'down', health: 'watch' },
  { code: 'HIS 201-1', name: 'US History', proficiency: 72, trend: 'up', health: 'healthy' },
  { code: 'BIO 201-2', name: 'Biology I', proficiency: 63, trend: 'stable', health: 'healthy' },
  { code: 'ENG 102-2', name: 'English Comp', proficiency: 74, trend: 'up', health: 'healthy' },
  { code: 'MATH 151-2', name: 'Calculus I', proficiency: 49, trend: 'down', health: 'concern' },
  { code: 'PSY 101-2', name: 'Intro Psych', proficiency: 54, trend: 'down', health: 'watch' },
  { code: 'CHEM 101-2', name: 'Gen Chemistry', proficiency: 61, trend: 'stable', health: 'healthy' },
  { code: 'NUR 301-1', name: 'Nursing III', proficiency: 77, trend: 'up', health: 'healthy' },
  { code: 'BIO 201-3', name: 'Biology I', proficiency: 44, trend: 'down', health: 'concern' },
  { code: 'ENG 102-3', name: 'English Comp', proficiency: 66, trend: 'stable', health: 'healthy' },
  { code: 'MATH 151-3', name: 'Calculus I', proficiency: 57, trend: 'stable', health: 'watch' },
  { code: 'BUS 101-1', name: 'Intro Business', proficiency: 62, trend: 'stable', health: 'healthy' },
  { code: 'SOC 101-1', name: 'Intro Sociology', proficiency: 69, trend: 'up', health: 'healthy' },
  { code: 'CS 201-1', name: 'Data Structures', proficiency: 55, trend: 'down', health: 'watch' },
  { code: 'BIO 301-1', name: 'Genetics', proficiency: 73, trend: 'up', health: 'healthy' },
  { code: 'ENG 201-1', name: 'British Lit', proficiency: 70, trend: 'stable', health: 'healthy' },
  { code: 'MATH 251-1', name: 'Linear Algebra', proficiency: 46, trend: 'down', health: 'concern' },
  { code: 'PHIL 101-1', name: 'Intro Philosophy', proficiency: 67, trend: 'stable', health: 'healthy' },
  { code: 'ART 101-1', name: 'Intro Art', proficiency: 78, trend: 'up', health: 'healthy' },
  { code: 'ECON 201-1', name: 'Microeconomics', proficiency: 59, trend: 'down', health: 'watch' },
  { code: 'PSY 201-1', name: 'Abnormal Psych', proficiency: 71, trend: 'up', health: 'healthy' },
  { code: 'CHEM 201-1', name: 'Organic Chem', proficiency: 42, trend: 'down', health: 'concern' },
  { code: 'SPAN 101-1', name: 'Spanish I', proficiency: 64, trend: 'stable', health: 'healthy' },
  { code: 'PHYS 101-1', name: 'Physics I', proficiency: 56, trend: 'down', health: 'watch' },
  { code: 'MUS 101-1', name: 'Music Theory', proficiency: 75, trend: 'up', health: 'healthy' },
  { code: 'STAT 201-1', name: 'Statistics', proficiency: 53, trend: 'down', health: 'watch' },
];

const healthColors = {
  healthy: { bg: 'bg-brand-green/70', border: 'border-brand-green/40', label: 'Healthy' },
  watch: { bg: 'bg-yellow-500/70', border: 'border-yellow-500/40', label: 'Watch' },
  concern: { bg: 'bg-brand-coral/70', border: 'border-brand-coral/40', label: 'Concern' },
};

const trendArrow = { up: '\u2191', down: '\u2193', stable: '\u2192' };

/* ──────────────────────────────────── page ── */
export default function LivePulsePage() {
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState(null);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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

      {/* ── header ── */}
      <header className="text-center pt-10 pb-2 px-4 relative">
        <p className="text-brand-teal text-xs uppercase tracking-[0.25em] mb-2 font-semibold">Campus OS Demo</p>
        <div className="relative inline-block">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 leading-tight">Live Pulse</h1>
          {/* pulsing dot beside the title */}
          <span className="absolute -right-5 top-2 w-3 h-3 rounded-full bg-brand-coral animate-ping opacity-75" />
          <span className="absolute -right-5 top-2 w-3 h-3 rounded-full bg-brand-coral" />
        </div>
        <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base">
          The institution&rsquo;s heartbeat. Right now.
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/40">
          <span>Regional State University</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="font-mono tabular-nums">{mounted ? currentTime : '--:--:-- --'}</span>
        </div>
      </header>

      {/* ── 1. Vital Signs ── */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vitalSigns.map((v, idx) => {
            const maxVal = Math.max(...v.sparkline);
            return (
              <div
                key={v.label}
                className="relative border border-white/10 bg-white/[0.02] rounded-2xl p-5 overflow-hidden group hover:border-white/20 transition-colors"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* subtle pulse overlay */}
                <div
                  className={`absolute inset-0 bg-${v.color}/5 rounded-2xl`}
                  style={{ animation: 'vital-pulse 3s ease-in-out infinite', animationDelay: `${idx * 0.5}s` }}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg bg-${v.color}/15 border border-${v.color}/30 flex items-center justify-center text-${v.color}`}>
                      {v.icon}
                    </div>
                    {/* sparkline */}
                    <svg className="w-20 h-8" viewBox="0 0 80 32" fill="none">
                      <polyline
                        points={v.sparkline.map((val, i) => `${(i / (v.sparkline.length - 1)) * 80},${32 - (val / maxVal) * 28}`).join(' ')}
                        className={`stroke-${v.color}`}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      {/* area fill */}
                      <polygon
                        points={`0,32 ${v.sparkline.map((val, i) => `${(i / (v.sparkline.length - 1)) * 80},${32 - (val / maxVal) * 28}`).join(' ')} 80,32`}
                        className={`fill-${v.color}/10`}
                      />
                    </svg>
                  </div>
                  <p className={`text-3xl font-bold font-serif text-${v.color}`}>
                    {typeof v.value === 'number' && v.value > 100 ? v.value.toLocaleString() : v.value}{v.suffix || ''}
                  </p>
                  <p className="text-sm font-semibold text-white/80 mt-0.5">{v.label}</p>
                  <p className="text-xs text-white/40 mt-1">{v.context}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 2. Live Signal Feed ── */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-white/[0.03] px-5 py-3 border-b border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-coral animate-pulse" />
            <h2 className="font-serif text-lg font-semibold">Live Signal Feed</h2>
            <span className="text-[10px] text-white/30 ml-auto font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-coral animate-ping" />
              LIVE
            </span>
          </div>

          <div className="divide-y divide-white/[0.04] max-h-[480px] overflow-y-auto">
            {signalFeed.map((entry, i) => {
              const style = feedTypeStyles[entry.type];
              return (
                <div
                  key={i}
                  className="px-5 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors"
                  style={{ animation: mounted ? `feed-in 0.4s ease-out ${i * 0.08}s both` : 'none' }}
                >
                  <span className="text-xs text-white/30 font-mono shrink-0 pt-0.5 w-16 tabular-nums">{entry.time}</span>
                  <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0 mt-1.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 leading-relaxed">{entry.text}</p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${style.dot}/15 ${style.text} bg-white/[0.05] border border-white/[0.06]`}>
                    {style.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Course Health Heat Map ── */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-white/[0.03] px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl md:text-2xl font-bold">Course Health Map</h2>
              <p className="text-white/40 text-sm mt-0.5">All active sections — color-coded by learning health</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-green/70" /> Healthy</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-500/70" /> Watch</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-coral/70" /> Concern</span>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 md:gap-3">
              {courseGrid.map((course, i) => {
                const hc = healthColors[course.health];
                const isConcern = course.health === 'concern';
                const isHovered = hoveredCourse === i;
                return (
                  <div
                    key={i}
                    className={`
                      relative rounded-lg border ${hc.border} ${hc.bg} p-2 md:p-3
                      cursor-default transition-all duration-200
                      ${isConcern ? 'animate-pulse-slow' : ''}
                      ${isHovered ? 'scale-110 z-20 shadow-xl' : 'hover:scale-105'}
                    `}
                    onMouseEnter={() => setHoveredCourse(i)}
                    onMouseLeave={() => setHoveredCourse(null)}
                  >
                    <p className="text-[9px] md:text-[10px] font-bold text-white/90 leading-tight truncate">{course.code}</p>
                    <p className="text-[8px] md:text-[9px] text-white/50 truncate">{course.name}</p>
                    {(isConcern || isHovered) && (
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[10px] font-bold text-white/80">{course.proficiency}%</span>
                        <span className={`text-[9px] ${course.trend === 'up' ? 'text-brand-green' : course.trend === 'down' ? 'text-brand-coral' : 'text-white/40'}`}>
                          {trendArrow[course.trend]}
                        </span>
                      </div>
                    )}
                    {/* tooltip on hover */}
                    {isHovered && !isConcern && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full z-30 bg-navy-light border border-white/20 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap text-[10px]">
                        <p className="font-semibold text-white/90">{course.code} — {course.name}</p>
                        <p className="text-white/50 mt-0.5">Proficiency: {course.proficiency}% {trendArrow[course.trend]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Comparison Box — The Devastating Contrast ── */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="relative border border-brand-coral/30 bg-brand-coral/[0.06] rounded-2xl p-6 md:p-8">
          <div className="absolute -top-3 left-6 bg-navy px-3 py-0.5 text-[10px] uppercase tracking-widest text-brand-coral font-semibold rounded-full border border-brand-coral/30">
            The Old Model
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-coral mb-4">
            What you&rsquo;d see right now in the old model:
          </h3>
          <p className="text-4xl md:text-5xl font-bold font-serif text-brand-coral/60 mb-6 leading-tight">
            Nothing.
          </p>
          <div className="space-y-3 text-sm text-white/60 leading-relaxed">
            <p className="flex gap-2">
              <span className="text-brand-coral shrink-0">&times;</span>
              The registrar&rsquo;s mid-semester grade report comes out in <span className="text-white font-semibold">3 weeks</span>.
            </p>
            <p className="flex gap-2">
              <span className="text-brand-coral shrink-0">&times;</span>
              The retention office won&rsquo;t see withdrawal data until <span className="text-white font-semibold">Week 12</span>.
            </p>
            <p className="flex gap-2">
              <span className="text-brand-coral shrink-0">&times;</span>
              The provost gets a summary in <span className="text-white font-semibold">January</span>.
            </p>
            <p className="flex gap-2">
              <span className="text-brand-coral shrink-0">&times;</span>
              By then, <span className="text-white font-bold text-base">340 students have already left</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. System Health Footer Strip ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="border border-white/[0.08] bg-white/[0.02] rounded-xl px-5 py-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="font-semibold text-white/60">AI Governance:</span> All systems operational
            </span>
            <span className="hidden sm:inline-block w-px h-3 bg-white/10" />
            <span>Fairness checks: <span className="text-brand-green font-semibold">847/847 passed</span></span>
            <span className="hidden sm:inline-block w-px h-3 bg-white/10" />
            <span>Confidence threshold: <span className="text-white/60 font-semibold">91% avg</span></span>
            <span className="hidden sm:inline-block w-px h-3 bg-white/10" />
            <span>Human overrides today: <span className="text-white/60 font-semibold">2</span></span>
            <span className="hidden sm:inline-block w-px h-3 bg-white/10" />
            <span>Last anomaly: <span className="text-white/60">8 hours ago (resolved)</span></span>
          </div>
        </div>
      </section>

      {/* ── animations ── */}
      <style jsx global>{`
        @keyframes vital-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes feed-in {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
