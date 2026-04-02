'use client'
import { useState } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const MOCK_PLAN = [
  { day: 'Monday', blocks: [
    { time: '9:00 AM', skill: 'Integration Techniques', type: 'practice', duration: '25 min', color: '#DC2626' },
    { time: '2:00 PM', skill: 'Problem Decomposition', type: 'coaching', duration: '15 min', color: '#F59E0B' },
  ]},
  { day: 'Tuesday', blocks: [
    { time: '10:00 AM', skill: 'Limits & Continuity', type: 'review', duration: '20 min', color: '#16A34A' },
  ]},
  { day: 'Wednesday', blocks: [
    { time: '9:00 AM', skill: 'Integration Techniques', type: 'quiz', duration: '30 min', color: '#DC2626' },
    { time: '3:00 PM', skill: 'Mathematical Reasoning', type: 'coaching', duration: '15 min', color: '#F59E0B' },
  ]},
  { day: 'Thursday', blocks: [
    { time: '11:00 AM', skill: 'Derivatives', type: 'practice', duration: '25 min', color: '#2D8B6F' },
  ]},
  { day: 'Friday', blocks: [
    { time: '9:00 AM', skill: 'Integration Techniques', type: 'coaching', duration: '20 min', color: '#DC2626' },
    { time: '1:00 PM', skill: 'Problem Decomposition', type: 'quiz', duration: '25 min', color: '#F59E0B' },
  ]},
  { day: 'Saturday', blocks: [] },
  { day: 'Sunday', blocks: [
    { time: '4:00 PM', skill: 'Weekly review', type: 'review', duration: '30 min', color: '#6B7280' },
  ]},
]

const TYPE_ICONS = {
  practice: '⚡',
  coaching: '💬',
  quiz: '📝',
  review: '📊',
}

export default function StudyPlannerPage() {
  const [generating, setGenerating] = useState(false)
  const [plan, setPlan] = useState(MOCK_PLAN)
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)

  function formatDate(dayIndex) {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + dayIndex)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const todayName = today.toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy">Study Planner</h1>
          <p className="text-sm text-gray-400">AI-generated weekly plan based on your skill gaps and pace</p>
        </div>
        <button
          onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 2000) }}
          className="px-4 py-2 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
          style={{ background: '#2D8B6F' }}>
          {generating ? 'Generating...' : '✨ Regenerate Plan'}
        </button>
      </div>

      {/* Week nav */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
          ←
        </button>
        <span className="text-sm font-bold text-navy">
          Week of {startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
        <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
          →
        </button>
        {weekOffset !== 0 && (
          <button onClick={() => setWeekOffset(0)} className="text-xs text-teal-600 font-bold hover:underline">Today</button>
        )}
      </div>

      {/* Weekly grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {DAYS.map((day, i) => {
          const dayPlan = plan.find(p => p.day === day)
          const isToday = day === todayName && weekOffset === 0
          return (
            <div key={day}
              className={`bg-white rounded-2xl border p-4 min-h-[180px] ${isToday ? 'border-teal-500 ring-1 ring-teal-200' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-teal-600' : 'text-gray-400'}`}>
                    {day}
                  </p>
                  <p className="text-[10px] text-gray-300">{formatDate(i)}</p>
                </div>
                {isToday && <span className="w-2 h-2 rounded-full bg-teal-500" />}
              </div>

              {dayPlan?.blocks.length > 0 ? (
                <div className="space-y-2">
                  {dayPlan.blocks.map((block, j) => (
                    <div key={j} className="rounded-lg p-2.5 border-l-3"
                         style={{ background: block.color + '08', borderLeft: `3px solid ${block.color}` }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-xs">{TYPE_ICONS[block.type]}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{block.type}</span>
                      </div>
                      <p className="text-xs font-medium text-navy leading-tight">{block.skill}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{block.time} · {block.duration}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-300 text-center mt-8">Rest day</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Sessions This Week', value: plan.reduce((a, d) => a + d.blocks.length, 0), color: '#2D8B6F' },
          { label: 'Practice Time', value: '2.5 hrs', color: '#2D6A4F' },
          { label: 'Skills Targeted', value: 5, color: '#D4603A' },
          { label: 'Priority Skill', value: 'Integration', color: '#C94C3A' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-lg font-black text-navy">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Governance note */}
      <div className="mt-6 rounded-2xl p-5 flex items-start gap-3" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 flex-shrink-0">
          <path d="M9 2l6 3v4c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V5l6-3z" stroke="#2D8B6F" strokeWidth="1.3" fill="none"/>
          <path d="M7 9l2 2 3-3.5" stroke="#2D8B6F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <p className="text-sm font-bold text-navy mb-1">Governed Study Plan</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            This plan is generated by Arrival's ethical orchestration layer. It adapts to your pace without pushing
            you beyond governed thresholds. The system cannot recommend study that exceeds confidence bounds or
            creates unfair pressure relative to your cohort.
          </p>
        </div>
      </div>
    </div>
  )
}
