'use client'
import { useState, useEffect } from 'react'

const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to transformlearning',
    body: 'Your proficiency engine. See where you actually stand — not where grades say you are. This quick tour shows you how everything works — takes about 60 seconds.',
    emoji: '🔬',
    position: 'center',
  },
  {
    id: 'sidebar',
    title: 'Your Home Base',
    body: 'The sidebar is your navigation hub. See your level, track your courses, and access everything from Skill Mapping to Study Planner.',
    emoji: '🏠',
    position: 'left',
    highlight: 'sidebar',
  },
  {
    id: 'skill-mapping',
    title: 'Skill Mapping',
    body: 'Every course syllabus is mapped into foundational skills (subject knowledge) and core skills (critical thinking, communication, etc). This is your learning DNA.',
    emoji: '🧬',
    position: 'center',
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    body: 'Four tabs give you full control: Coach for AI tutoring, Practice for adaptive quizzes, Review for your stats and skill grid, and History for your assessment record.',
    emoji: '📊',
    position: 'center',
  },
  {
    id: 'coach',
    title: 'AI Coaching',
    body: 'Select any skill and start a conversation. The coach adapts to your level using three teaching styles: Smart (balanced), Questions (Socratic), or Explain (detailed). The coach is grounded, never elevated above you. Certain, without needing to prove it. Every response is governed by fairness and confidence constraints.',
    emoji: '💬',
    position: 'center',
  },
  {
    id: 'practice',
    title: 'Adaptive Practice',
    body: 'The system generates questions calibrated to your current proficiency. Too easy? It scales up. Struggling? It finds the gap. Your scores update in real time.',
    emoji: '⚡',
    position: 'center',
  },
  {
    id: 'governance',
    title: 'Governed Intelligence',
    body: 'Every AI decision passes through an ethical orchestration layer — fairness checks, confidence thresholds, and privacy constraints. Ethics is not something checked after the system acts. It is something the system has to satisfy before it is allowed to act. If any condition fails, it defers to human review.',
    emoji: '🛡️',
    position: 'center',
  },
  {
    id: 'levels',
    title: 'Level Up!',
    body: 'Every interaction earns XP. Complete quizzes, coaching sessions, and study activities to level up from Novice to Luminary. Your level reflects engagement, not just grades.',
    emoji: '🏆',
    position: 'left',
  },
  {
    id: 'study-planner',
    title: 'Study Planner',
    body: 'AI generates a weekly study plan based on your skill gaps, pace, and upcoming deadlines. It adapts as you progress — governed by confidence bounds so it never pushes you unfairly.',
    emoji: '📅',
    position: 'center',
  },
  {
    id: 'next-best-action',
    title: 'Next Best Action',
    body: 'The system shows you the single most impactful thing you can do next. No guessing, no overwhelm — just the right tension at the right moment.',
    emoji: '🎯',
    position: 'center',
  },
  {
    id: 'done',
    title: 'You\'re ready.',
    body: 'Start by exploring your skill map or jump into a coaching session. Now you can see clearly.',
    emoji: '✨',
    position: 'center',
  },
]

export default function Tour({ onComplete }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  function next() {
    if (step === TOUR_STEPS.length - 1) {
      finish()
    } else {
      setExiting(true)
      setTimeout(() => {
        setStep(s => s + 1)
        setExiting(false)
      }, 200)
    }
  }

  function prev() {
    if (step > 0) {
      setExiting(true)
      setTimeout(() => {
        setStep(s => s - 1)
        setExiting(false)
      }, 200)
    }
  }

  function finish() {
    setVisible(false)
    setTimeout(() => onComplete?.(), 300)
  }

  const current = TOUR_STEPS[step]
  const progress = ((step + 1) / TOUR_STEPS.length) * 100

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={finish} />

      {/* Card */}
      <div className={`absolute transition-all duration-300 ${
        current.position === 'left'
          ? 'left-72 top-1/2 -translate-y-1/2'
          : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      } ${exiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
            <div className="h-full transition-all duration-500 rounded-full"
                 style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2D8B6F, #00A8A8)' }} />
          </div>

          {/* Step counter */}
          <div className="flex items-center justify-between mb-4 mt-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Step {step + 1} of {TOUR_STEPS.length}
            </span>
            <button onClick={finish} className="text-xs text-gray-400 hover:text-gray-600 font-medium">
              Skip tour
            </button>
          </div>

          {/* Emoji */}
          <div className="text-5xl mb-4">{current.emoji}</div>

          {/* Content */}
          <h2 className="text-xl font-bold text-navy mb-2">{current.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{current.body}</p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prev}
              disabled={step === 0}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
              }`}>
              ← Back
            </button>

            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === step ? 'bg-teal-500 w-4' : i < step ? 'bg-teal-300' : 'bg-gray-200'
                }`} />
              ))}
            </div>

            <button
              onClick={next}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: '#2D8B6F' }}>
              {step === TOUR_STEPS.length - 1 ? 'Get Started →' : 'Next →'}
            </button>
          </div>

          {/* Keyboard hint */}
          <p className="text-[10px] text-gray-300 text-center mt-4">
            Use ← → arrow keys or click to navigate
          </p>
        </div>
      </div>
    </div>
  )
}
