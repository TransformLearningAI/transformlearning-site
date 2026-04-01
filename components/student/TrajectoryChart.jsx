'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { proficiencyColor } from '@/lib/utils/proficiency'

export default function TrajectoryChart({ history, skills }) {
  if (!history.length) return (
    <div className="py-12 text-center">
      <p className="text-gray-400 text-sm">No history yet. Complete more assessments and quizzes to see your progress over time.</p>
    </div>
  )

  // Build time-series data per skill
  const skillMap = Object.fromEntries(skills.map(s => [s.id, s]))
  const dates = [...new Set(history.map(h => h.scored_at.slice(0, 10)))].sort()

  const data = dates.map(date => {
    const row = { date }
    history.filter(h => h.scored_at.slice(0, 10) === date).forEach(h => {
      if (skillMap[h.skill_id]) row[skillMap[h.skill_id].name] = h.score
    })
    return row
  })

  const skillLines = skills.slice(0, 6) // limit to 6 for readability

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} />
        <Tooltip formatter={(v) => [`${v}%`]} />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        {skillLines.map((skill, i) => (
          <Line key={skill.id} type="monotone" dataKey={skill.name}
            stroke={proficiencyColor(70)} strokeWidth={2} dot={false}
            strokeDasharray={skill.skill_type === 'implicit' ? '4 2' : undefined} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
