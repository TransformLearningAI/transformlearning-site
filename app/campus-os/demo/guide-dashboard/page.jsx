'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAVY = '#0C1F3F'
const TEAL = '#00A8A8'
const GREEN = '#4F8A5B'
const PLUM = '#5A3E6B'
const CORAL = '#FF6B4A'
const AMBER = '#D4A017'
const WARM_BG = '#FAF8F5'
const WARM_BORDER = '#EBE6E0'
const MUTED = '#6b635a'
const BODY = '#3a3530'
const serif = 'Georgia, serif'

const stats = [
  { label: 'Active students', value: '24', color: TEAL },
  { label: 'Flagged today', value: '3', color: CORAL },
  { label: 'Field sessions this month', value: '12', color: GREEN },
  { label: 'Student satisfaction', value: '89%', color: PLUM },
]

const urgentQueue = [
  {
    id: 1,
    student: 'Elena Vasquez',
    urgency: 'urgent',
    urgColor: CORAL,
    summary: '3 failed attempts on watershed sampling methodology. AI confidence: 12%. Requesting human demonstration.',
    time: '23 min ago',
    actions: ['Schedule Field Session', 'Send Message'],
    detail: 'Knowledge graph shows Elena mastered theoretical water chemistry (92%) but cannot apply concepts to field samples (34%). The theory-practice gap has widened over 3 sessions. AI agent switched from Socratic to Direct Instructor mode — still below threshold.',
  },
  {
    id: 2,
    student: 'Marcus Williams',
    urgency: 'urgent',
    urgColor: CORAL,
    summary: 'Engagement dropped 74% over 4 days. Login pattern shifted to 2–4am. Behavioral flags suggest distress.',
    time: '2 hrs ago',
    actions: ['Route to Resilience Mentor', 'Reach Out Directly'],
    detail: 'Assessment performance stable but engagement metrics declining sharply. Marcus has not accessed peer marketplace or study guides in 96 hours. Pattern matches previous distress cases.',
  },
  {
    id: 3,
    student: 'Jordan Park',
    urgency: 'attention',
    urgColor: AMBER,
    summary: 'Completed water chemistry module (92%) but field application score: 34%. Theory-practice gap detected.',
    time: 'Today',
    actions: ['Add to Thursday Field Group', 'Design Custom Exercise'],
    detail: 'Jordan excels at conceptual questions and can explain dissolved oxygen chemistry verbally. Cannot calibrate instruments or interpret real-world variance in measurements. Needs hands-on calibration session.',
  },
  {
    id: 4,
    student: 'Nina Torres',
    urgency: 'positive',
    urgColor: GREEN,
    summary: 'Mastered dissolved oxygen + pH analysis. Ready for independent field project. Recommend advancement.',
    time: 'Today',
    actions: ['Approve Independent Study', 'Assign Peer Mentee'],
    detail: 'Nina has demonstrated mastery across all water chemistry skills with 94% proficiency. She has also completed 6 peer coaching sessions this month with high satisfaction ratings. Ready to transition from learner to peer coach on these topics.',
  },
]

const monitoringStudents = [
  { name: 'Aisha Patel', proficiency: 78, trend: 'up' },
  { name: 'Carlos Ruiz', proficiency: 71, trend: 'stable' },
  { name: 'David Kim', proficiency: 68, trend: 'up' },
  { name: 'Fatima Al-Hassan', proficiency: 82, trend: 'stable' },
  { name: 'Grace Chen', proficiency: 75, trend: 'up' },
  { name: 'James Wright', proficiency: 64, trend: 'stable' },
  { name: 'Kenji Tanaka', proficiency: 86, trend: 'up' },
  { name: 'Lisa Moreno', proficiency: 72, trend: 'stable' },
]

const schedule = [
  { day: 'Mon', activity: 'Field session (Watershed A)', students: 8, color: TEAL },
  { day: 'Tue', activity: 'Virtual office hours (drop-in)', students: null, color: PLUM },
  { day: 'Wed', activity: 'Field session (Forest plot)', students: 6, color: GREEN },
  { day: 'Thu', activity: 'Lab practicum', students: 12, color: CORAL },
  { day: 'Fri', activity: 'Integration project reviews', students: 4, color: NAVY },
]

const aiLog = [
  { text: 'AI identified 3 students with identical misconception in soil pH buffering. Recommended group field session.', action: 'Accepted — scheduled for Thursday', color: TEAL },
  { text: 'AI detected Nina Torres ready for peer coaching role. Recommended pairing with Elena Vasquez on watershed skills.', action: 'Approved match', color: GREEN },
  { text: 'AI assessment flagged Jordan Park\'s lab report as technically correct but missing field observation integration.', action: 'Scheduled 1:1 review', color: AMBER },
]

export default function GuideDashboardPage() {
  const [expandedCard, setExpandedCard] = useState(null)
  const [showMonitoring, setShowMonitoring] = useState(false)

  return (
    <div className="min-h-screen" style={{ backgroundColor: WARM_BG }}>
      <nav className="border-b bg-white" style={{ borderColor: WARM_BORDER }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: NAVY }}>
            transform<span style={{ color: TEAL }}>learning</span>
          </Link>
          <Link href="/campus-os/demo" className="text-sm font-medium hover:underline" style={{ color: NAVY }}>&larr; All Demos</Link>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: WARM_BORDER }}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2" style={{ color: GREEN }}>Guide Dashboard</p>
          <h1 className="text-2xl font-bold mb-1" style={{ color: NAVY }}>Dr. Sarah Chen</h1>
          <p className="text-sm" style={{ color: MUTED }}>Practitioner-in-Residence — Environmental Science</p>
          <div className="flex flex-wrap gap-4 mt-4">
            {stats.map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-xl font-bold" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs" style={{ color: MUTED }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column — Intervention Queue */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: NAVY }}>Intervention Queue</h2>
            <div className="space-y-3">
              {urgentQueue.map(item => {
                const isOpen = expandedCard === item.id
                return (
                  <div key={item.id} className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: WARM_BORDER, borderLeftWidth: 4, borderLeftColor: item.urgColor }}>
                    <button onClick={() => setExpandedCard(isOpen ? null : item.id)} className="w-full p-5 text-left">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: item.urgColor + '15', color: item.urgColor }}>{item.urgency}</span>
                            <span className="font-bold text-sm" style={{ color: NAVY }}>{item.student}</span>
                          </div>
                          <p className="text-sm" style={{ color: BODY }}>{item.summary}</p>
                        </div>
                        <span className="text-xs flex-shrink-0" style={{ color: MUTED }}>{item.time}</span>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t" style={{ borderColor: WARM_BORDER }}>
                        <p className="text-sm leading-relaxed mt-3 mb-4" style={{ color: BODY }}>{item.detail}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.actions.map(action => (
                            <button key={action} className="text-xs font-semibold px-4 py-2 rounded-lg border transition-colors hover:opacity-80" style={{ borderColor: item.urgColor + '40', color: item.urgColor }}>
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Monitoring */}
            <div className="mt-6">
              <button onClick={() => setShowMonitoring(!showMonitoring)} className="flex items-center gap-2 text-sm font-bold" style={{ color: GREEN }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GREEN }} />
                {monitoringStudents.length} students on track — no intervention needed
                <svg className={`w-4 h-4 transition-transform ${showMonitoring ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {showMonitoring && (
                <div className="mt-3 rounded-xl border bg-white p-4" style={{ borderColor: WARM_BORDER }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {monitoringStudents.map(s => (
                      <div key={s.name} className="text-center p-3 rounded-lg" style={{ backgroundColor: WARM_BG }}>
                        <p className="text-xs font-medium" style={{ color: NAVY }}>{s.name}</p>
                        <p className="text-lg font-bold" style={{ color: GREEN }}>{s.proficiency}%</p>
                        <p className="text-xs" style={{ color: MUTED }}>{s.trend === 'up' ? '↑ improving' : '→ stable'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Collaboration Log */}
            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: NAVY }}>AI Collaboration Log</h2>
              <div className="space-y-3">
                {aiLog.map((entry, i) => (
                  <div key={i} className="rounded-lg border bg-white p-4" style={{ borderColor: WARM_BORDER }}>
                    <p className="text-sm mb-2" style={{ color: BODY }}>{entry.text}</p>
                    <p className="text-xs font-semibold" style={{ color: entry.color }}>→ {entry.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Weekly Schedule */}
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: NAVY }}>This Week</h2>
            <div className="rounded-xl border bg-white overflow-hidden mb-8" style={{ borderColor: WARM_BORDER }}>
              {schedule.map(day => (
                <div key={day.day} className="flex items-center gap-3 p-4 border-b last:border-b-0" style={{ borderColor: WARM_BORDER }}>
                  <span className="text-xs font-bold w-8" style={{ color: day.color }}>{day.day}</span>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: NAVY }}>{day.activity}</p>
                    {day.students && <p className="text-xs" style={{ color: MUTED }}>{day.students} students</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Impact Metrics */}
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: NAVY }}>Impact</h2>
            <div className="rounded-xl border bg-white p-5" style={{ borderColor: WARM_BORDER }}>
              {[
                { label: 'Students coached this semester', value: '24' },
                { label: 'Avg proficiency gain after intervention', value: '+18 pts' },
                { label: 'Resolved without escalation', value: '91%' },
                { label: '"Guide made the difference"', value: '84%' },
                { label: 'Cost per intervention', value: '$45' },
              ].map(m => (
                <div key={m.label} className="flex justify-between py-2 border-b last:border-b-0" style={{ borderColor: WARM_BORDER }}>
                  <span className="text-xs" style={{ color: MUTED }}>{m.label}</span>
                  <span className="text-sm font-bold" style={{ color: TEAL }}>{m.value}</span>
                </div>
              ))}
              <p className="text-xs mt-3" style={{ color: MUTED }}>vs. $320 for traditional office hours + grading cycle</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer insight */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: NAVY }}>
          <p className="text-sm text-white/60">The AI sees everything. The guide decides what matters. No grading. No lectures. No committee meetings. Just the work that only a human can do.</p>
        </div>
      </div>
    </div>
  )
}
