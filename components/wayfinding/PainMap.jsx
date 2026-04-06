'use client'
import Link from 'next/link'
import { proficiencyColor } from '@/lib/utils/proficiency'

export default function PainMap({ painPoints = [], enrollmentId }) {
  if (painPoints.length === 0) return null

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ background: '#FF6B4A' }} />
        <h2 className="text-lg font-bold text-navy">Where it hurts</h2>
        <span className="text-xs text-gray-400 ml-1">Your 3 biggest gaps</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {painPoints.map(({ skill, score, evidenceSummary }) => {
          const isImplicit = skill.skill_type === 'implicit'
          const borderColor = isImplicit ? '#5A3E6B' : '#00A8A8'

          return (
            <div key={skill.id} className="rounded-2xl p-5 relative overflow-hidden"
                 style={{ background: 'white', border: `1px solid rgba(12,31,63,0.08)`, borderLeft: `4px solid ${borderColor}` }}>
              {/* Score badge */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: borderColor }}>
                    {isImplicit ? 'core' : 'foundational'}
                  </span>
                  <h3 className="font-bold text-navy text-sm leading-tight">{skill.name}</h3>
                </div>
                <div className="text-2xl font-black" style={{ color: proficiencyColor(score) }}>
                  {score}%
                </div>
              </div>

              {/* Evidence */}
              <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                {evidenceSummary || 'No assessment data yet. This skill needs your attention.'}
              </p>

              {/* Action */}
              <Link href={`/my-progress/${enrollmentId}/quiz/${skill.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold hover:opacity-80 transition-opacity"
                style={{ color: borderColor }}>
                Fix this →
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
