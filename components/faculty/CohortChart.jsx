'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { proficiencyColor } from '@/lib/utils/proficiency'

export default function CohortChart({ skills, scores }) {
  const data = skills.map(skill => {
    const skillScores = scores.filter(s => s.skill_id === skill.id)
    const avg = skillScores.length
      ? Math.round(skillScores.reduce((sum, s) => sum + s.score, 0) / skillScores.length)
      : null
    return { name: skill.name.length > 20 ? skill.name.slice(0, 18) + '…' : skill.name, avg, type: skill.skill_type }
  }).filter(d => d.avg !== null)

  if (!data.length) return <p className="text-sm text-gray-400 py-4">No proficiency data yet.</p>

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 40, left: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} angle={-30} textAnchor="end" interval={0} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} />
        <Tooltip formatter={(v) => [`${v}%`, 'Avg. proficiency']} />
        <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={proficiencyColor(entry.avg)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
