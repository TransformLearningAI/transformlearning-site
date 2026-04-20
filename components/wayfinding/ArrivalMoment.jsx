'use client'
import { useState, useEffect } from 'react'

export default function ArrivalMoment({ milestones = [], onDismiss }) {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    if (milestones.length > 0 && !current) {
      setCurrent(milestones[0])
      setTimeout(() => setVisible(true), 200)
    }
  }, [milestones, current])

  function dismiss() {
    setVisible(false)
    setTimeout(() => {
      setCurrent(null)
      onDismiss?.()
    }, 500)
  }

  if (!current) return null

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         onClick={dismiss}>
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'rgba(12,31,63,0.95)' }} />

      {/* Content */}
      <div className="relative text-center px-8 max-w-lg">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6"
           style={{ color: '#00A8A8', opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.3s' }}>
          Proficiency achieved.
        </p>

        <h1 className="font-serif font-light text-white mb-4"
            style={{ fontSize: 'clamp(36px, 6vw, 56px)', letterSpacing: '-0.02em', lineHeight: 1.05,
                     opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.6s', transform: visible ? 'translateY(0)' : 'translateY(12px)' }}>
          {current.skill.name}
        </h1>

        <div className="w-20 h-px mx-auto mb-4" style={{ background: '#00A8A8', opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.9s' }} />

        <p className="text-lg font-bold mb-8" style={{ color: '#4F8A5B', opacity: visible ? 1 : 0, transition: 'opacity 0.6s 1.2s' }}>
          {current.newScore}% — Proficient
        </p>

        <button onClick={dismiss}
          className="text-sm font-medium text-white/40 hover:text-white/80 transition-colors"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 1.5s' }}>
          Continue →
        </button>
      </div>
    </div>
  )
}
