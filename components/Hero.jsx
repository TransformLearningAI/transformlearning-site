'use client'
import { useEffect, useRef, useState } from 'react'

// Student-facing progress dashboard
function StudentDashboard() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000)
    return () => clearInterval(id)
  }, [])

  const skills = [
    { name: 'Limits & Continuity',       prog: 82, status: 'Strong',      color: '#4F8A5B', tag: 'Explicit' },
    { name: 'Derivatives',               prog: 58, status: 'Progressing', color: '#00A8A8', tag: 'Explicit' },
    { name: 'Integration Techniques',    prog: 34, status: 'Needs focus', color: '#FF6B4A', tag: 'Explicit' },
    { name: 'Problem Decomposition',     prog: 47, status: 'Needs focus', color: '#FF6B4A', tag: 'Implicit' },
    { name: 'Mathematical Reasoning',    prog: 71, status: 'On track',    color: '#4F8A5B', tag: 'Implicit' },
  ]

  const weekData = [28, 38, 35, 50, 47, 60, 55, 65, 62, 70, 68, 74]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 text-left"
         style={{ background: 'rgba(7,20,41,0.96)', backdropFilter: 'blur(20px)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#00A8A8', boxShadow: '0 0 6px #00A8A8' }} />
          <span className="text-xs font-bold text-white/60 uppercase tracking-[0.1em]">Your Progress · Calculus I</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
      </div>

      {/* Student greeting */}
      <div className="px-5 py-4 border-b border-white/8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-white/40 mb-0.5">Week 7 of 15</p>
            <p className="text-sm font-bold text-white">You're making progress — 2 skills need attention.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: '#00A8A8' }}>64%</div>
            <div className="text-[10px] text-white/35 uppercase tracking-[0.1em]">Overall</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
               style={{ width: '64%', background: 'linear-gradient(90deg, #00A8A8, #4F8A5B)' }} />
        </div>
      </div>

      {/* Skill list */}
      <div className="px-5 py-3 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] text-white/35 uppercase tracking-[0.1em]">Skill Progression</div>
          <div className="flex gap-2">
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,168,168,0.15)', color: '#00A8A8' }}>Explicit</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(79,138,91,0.15)', color: '#4F8A5B' }}>Implicit</span>
          </div>
        </div>
        {skills.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3"
               style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-white/55 flex-1 truncate">{s.name}</span>
            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
              <div className="h-full rounded-full" style={{ width: `${s.prog}%`, background: s.color }} />
            </div>
            <span className="text-[10px] font-bold w-6 text-right" style={{ color: s.color }}>{s.prog}%</span>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div className="px-5 pb-3 pt-1">
        <div className="text-[10px] text-white/30 uppercase tracking-[0.1em] mb-2">Your trajectory — 12 weeks</div>
        <div className="flex items-end gap-1 h-10">
          {weekData.map((h, i) => (
            <div key={i} className="flex-1 rounded-sm signal-bar"
                 style={{
                   height: `${h}%`,
                   background: i < 10 ? 'rgba(0,168,168,0.5)' : '#00A8A8',
                   animationDelay: `${i * 0.05}s`,
                 }} />
          ))}
        </div>
      </div>

      {/* Nudge */}
      <div className="mx-5 mb-3 rounded-xl px-4 py-2.5 flex items-center gap-3"
           style={{ background: 'rgba(255,107,74,0.1)', border: '1px solid rgba(255,107,74,0.2)' }}>
        <div className="relative flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-brand-coral" />
          <div className="absolute inset-0 rounded-full bg-brand-coral pulse-ring" />
        </div>
        <span className="text-xs text-white/65">
          <strong className="text-brand-coral">Priority gap:</strong> Integration Techniques — exam in 2 weeks
        </span>
      </div>

      {/* Coaching action strip */}
      <div className="mx-5 mb-4 rounded-xl px-4 py-3" style={{ background: 'rgba(0,168,168,0.08)', border: '1px solid rgba(0,168,168,0.15)' }}>
        <div className="text-[9px] text-white/35 uppercase tracking-[0.1em] mb-2">Address this gap now</div>
        <div className="flex gap-2 flex-wrap">
          {['Practice Quiz', 'Coaching Session', 'Study Guide', 'Upload My Work'].map((action) => (
            <span key={action} className="text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer"
                  style={{ background: 'rgba(0,168,168,0.18)', color: '#00A8A8', border: '1px solid rgba(0,168,168,0.25)' }}>
              {action}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const STATS = [
  { label: 'Faculty Setup',       value: 'Submit a syllabus' },
  { label: 'Skills Mapped',       value: 'Explicit + Implicit' },
  { label: 'Gap Remediation',     value: 'Coaching, quizzes & practice' },
  { label: 'Proficiency Check',   value: 'Upload work or take assessment' },
]

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  return (
    <section className="bg-navy relative overflow-hidden min-h-[92vh] flex flex-col">

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,168,168,0.12) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(79,138,91,0.08) 0%, transparent 70%)' }} />

      <div className="relative flex-1 max-w-6xl mx-auto w-full px-6 pt-16 pb-8 grid lg:grid-cols-[1fr_440px] gap-12 items-center">

        {/* Left */}
        <div>
          <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/[0.05] mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal flex-shrink-0" style={{ boxShadow: '0 0 6px #00A8A8' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
              Adaptive Learning Operating System · Higher Education
            </span>
          </div>

          <div className={`transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="font-serif font-light text-white leading-[0.95] mb-2"
                style={{ fontSize: 'clamp(52px, 8vw, 96px)', letterSpacing: '-0.03em' }}>
              The path
            </h1>
            <h1 className="font-serif italic text-white leading-[0.95] mb-2"
                style={{ fontSize: 'clamp(52px, 8vw, 96px)', letterSpacing: '-0.03em', opacity: 0.85 }}>
              forward.
            </h1>
            <h1 className="font-serif font-light leading-[0.95] mb-8"
                style={{ fontSize: 'clamp(52px, 8vw, 96px)', letterSpacing: '-0.03em' }}>
              <span className="teal-gradient-text">Revealed.</span>
            </h1>
          </div>

          <p className={`text-lg font-semibold text-white mb-3 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Faculty submit a syllabus. Students see their gaps — and close them.
          </p>
          <p className={`text-base text-white/55 leading-relaxed max-w-lg mb-10 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Transform Learning is a wayfinding system for learning. It reads signals, recognizes patterns, and helps each student see a path forward — not by removing challenge, but by introducing the right tension at the right moment. Faculty submit a syllabus. The system maps every skill, surfaces true proficiency, and closes gaps through coaching, quizzes, and targeted practice.
          </p>

          <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-[400ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <a href="#pilot"
               className="group relative text-white px-8 py-4 rounded-xl font-bold text-sm overflow-hidden"
               style={{ background: '#00A8A8', boxShadow: '0 0 30px rgba(0,168,168,0.3)' }}>
              <span className="relative z-10">Become a Pilot Partner →</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ background: 'linear-gradient(135deg, #00A8A8, #4F8A5B)' }} />
            </a>
            <a href="#how-it-works"
               className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
              See How It Works
            </a>
          </div>

          <div className={`flex flex-wrap gap-6 mt-10 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {['Explicit & implicit skills mapped', 'Coaching + quizzes to close gaps', 'FERPA Compliant'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L5.5 10.5L12 3.5" stroke="#00A8A8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs text-white/45 font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Student dashboard */}
        <div className={`hidden lg:block transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <StudentDashboard />
        </div>

      </div>

      {/* Stats strip */}
      <div className="border-t border-white/8 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-brand-border">
          {STATS.map(s => (
            <div key={s.label} className="px-6 py-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">{s.label}</div>
              <div className="text-sm font-bold text-navy">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
