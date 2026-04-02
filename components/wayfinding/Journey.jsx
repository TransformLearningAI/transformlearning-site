'use client'

const TYPE_CONFIG = {
  quiz: { color: '#00A8A8', label: 'Quiz' },
  assessment: { color: '#00A8A8', label: 'Assessment' },
  coach: { color: '#5A3E6B', label: 'Coaching' },
  upload: { color: '#4F8A5B', label: 'Upload' },
  study: { color: '#FF6B4A', label: 'Study' },
}

function groupByDay(events) {
  const groups = {}
  events.forEach(e => {
    const day = new Date(e.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    if (!groups[day]) groups[day] = []
    groups[day].push(e)
  })
  return Object.entries(groups)
}

export default function Journey({ events = [] }) {
  if (events.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-lg font-bold text-navy mb-4">The Journey</h2>
        <div className="rounded-2xl p-8 text-center" style={{ background: 'white', border: '1px solid rgba(12,31,63,0.06)' }}>
          <p className="text-sm text-gray-400">Your story begins with your first assessment.</p>
          <p className="text-xs text-gray-300 mt-1">Every quiz, coaching session, and upload will appear here.</p>
        </div>
      </div>
    )
  }

  const grouped = groupByDay(events)

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-navy mb-6">The Journey</h2>

      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: 'rgba(12,31,63,0.08)' }} />

        {grouped.map(([day, dayEvents]) => (
          <div key={day} className="mb-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 -ml-8 pl-8">{day}</p>
            <div className="space-y-3">
              {dayEvents.map((event, i) => {
                const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.quiz
                return (
                  <div key={i} className="flex items-start gap-4 relative">
                    {/* Dot on timeline */}
                    <div className="absolute -left-5 mt-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                         style={{ background: config.color }} />
                    {/* Content */}
                    <div className="flex-1 rounded-xl px-4 py-3" style={{ background: 'white', border: '1px solid rgba(12,31,63,0.05)' }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.color }}>{config.label}</span>
                        {event.skillType === 'implicit' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(90,62,107,0.08)', color: '#5A3E6B' }}>implicit</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">
                        {event.type === 'assessment' || event.type === 'quiz'
                          ? `Practiced ${event.skillName}. Scored ${event.score}%.`
                          : `${config.label} session on ${event.skillName}.`}
                      </p>
                      <p className="text-[10px] text-gray-300 mt-1">
                        {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
