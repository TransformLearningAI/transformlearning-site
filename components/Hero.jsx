'use client'
import { useEffect, useState } from 'react'

// Student-facing progress dashboard
function StudentDashboard() {
  const skills = [
    { name: 'Limits & Continuity',       prog: 82, status: 'Strong',      color: '#4F8A5B', tag: 'Foundational' },
    { name: 'Derivatives',               prog: 58, status: 'Progressing', color: '#00A8A8', tag: 'Foundational' },
    { name: 'Integration Techniques',    prog: 34, status: 'Needs focus', color: '#FF6B4A', tag: 'Foundational' },
    { name: 'Problem Decomposition',     prog: 47, status: 'Needs focus', color: '#FF6B4A', tag: 'Core' },
    { name: 'Mathematical Reasoning',    prog: 71, status: 'On track',    color: '#4F8A5B', tag: 'Core' },
  ]

  const weekData = [28, 38, 35, 50, 47, 60, 55, 65, 62, 70, 68, 74]

  return (
    <div className="relative rounded-sm overflow-hidden border border-white/10 text-left"
         style={{ background: '#0A0A0A' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#00A8A8' }} />
          <span className="text-xs font-bold text-white/60 uppercase tracking-[0.1em]">Your Progress -- Calculus I</span>
        </div>
      </div>

      {/* Student greeting */}
      <div className="px-5 py-4 border-b border-white/8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-white/40 mb-0.5">Week 7 of 15</p>
            <p className="text-sm font-bold text-white">2 skills need attention.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: '#00A8A8' }}>64%</div>
            <div className="text-[10px] text-white/35 uppercase tracking-[0.1em]">Overall</div>
          </div>
        </div>
        <div className="h-1 bg-white/10 overflow-hidden">
          <div className="h-full" style={{ width: '64%', background: '#00A8A8' }} />
        </div>
      </div>

      {/* Skill list */}
      <div className="px-5 py-3 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] text-white/35 uppercase tracking-[0.1em]">Skill Progression</div>
        </div>
        {skills.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-white/70 flex-1 truncate">{s.name}</span>
            <div className="w-20 h-1 bg-white/10 overflow-hidden flex-shrink-0">
              <div className="h-full" style={{ width: `${s.prog}%`, background: s.color }} />
            </div>
            <span className="text-[10px] font-bold w-6 text-right" style={{ color: s.color }}>{s.prog}%</span>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div className="px-5 pb-3 pt-1">
        <div className="text-[10px] text-white/30 uppercase tracking-[0.1em] mb-2">Trajectory -- 12 weeks</div>
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
      <div className="mx-5 mb-3 rounded-sm px-4 py-2.5 flex items-center gap-3"
           style={{ background: 'rgba(255,107,74,0.1)', border: '1px solid rgba(255,107,74,0.15)' }}>
        <div className="w-2 h-2 rounded-full bg-brand-coral flex-shrink-0" />
        <span className="text-xs text-white/65">
          <strong className="text-brand-coral">Priority:</strong> Integration Techniques -- exam in 2 weeks
        </span>
      </div>

      {/* Coaching action strip */}
      <div className="mx-5 mb-4 rounded-sm px-4 py-3" style={{ background: 'rgba(0,168,168,0.06)', border: '1px solid rgba(0,168,168,0.12)' }}>
        <div className="text-[9px] text-white/35 uppercase tracking-[0.1em] mb-2">Address this gap now</div>
        <div className="flex gap-2 flex-wrap">
          {['Practice Quiz', 'Coaching Session', 'Study Guide', 'Upload My Work'].map((action) => (
            <button key={action} className="text-[10px] font-bold px-2.5 py-1 rounded-sm cursor-pointer"
                  style={{ background: 'rgba(0,168,168,0.15)', color: '#00A8A8', border: '1px solid rgba(0,168,168,0.2)' }}>
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  return (
    <section className="relative overflow-hidden min-h-[100vh] flex flex-col" style={{ background: '#0A0A0A' }}>

      <div className="relative flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-16 grid lg:grid-cols-[1fr_420px] gap-16 items-center">

        {/* Left */}
        <div>
          <div className={`transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="font-sans font-extrabold text-white leading-[0.92] mb-6"
                style={{ fontSize: 'clamp(56px, 9vw, 112px)', letterSpacing: '-0.04em' }}>
              <span className="block">What grades</span>
              <span className="block">hide.</span>
            </h1>
          </div>

          <div className={`transition-opacity duration-700 delay-100 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="font-sans font-semibold text-2xl sm:text-3xl mb-8"
               style={{ color: '#00A8A8', letterSpacing: '-0.02em' }}>
              Measured.
            </p>
          </div>

          <p className={`text-lg text-white/60 max-w-md mb-14 leading-relaxed transition-opacity duration-700 delay-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            AI that shows students and faculty what grades compress into a letter. Every skill, every gap, every gain — visible.
          </p>

          <div className={`flex items-center gap-6 transition-opacity duration-700 delay-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <a href="#pilot"
               className="text-white px-8 py-4 rounded-md font-bold text-sm hover:opacity-90 transition-opacity"
               style={{ background: '#00A8A8' }}>
              Start a Pilot
            </a>
            <a href="#how-it-works"
               className="text-white/60 font-medium text-sm hover:text-white transition-colors">
              See how it works &rarr;
            </a>
          </div>
        </div>

        {/* Right: Student dashboard */}
        <div className={`hidden lg:block transition-opacity duration-1000 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <StudentDashboard />
        </div>

      </div>

      {/* Student coaching banner */}
      <div className="border-t border-white/8" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <p className="text-sm text-white/50 text-center">
            <span className="font-semibold text-white/80">Students:</span> Skill tracking is free.
            AI coaching is <strong style={{ color: '#00A8A8' }}>$10/month</strong> when you need it.
          </p>
          <a href="/students"
             className="text-xs font-bold px-5 py-2 rounded-md whitespace-nowrap transition-opacity hover:opacity-90"
             style={{ background: '#00A8A8', color: '#fff' }}>
            Learn More
          </a>
        </div>
      </div>
    </section>
  )
}
