'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { proficiencyLabel, proficiencyColor, proficiencyBg, overallScore, isAtRisk } from '@/lib/utils/proficiency'
import TrajectoryChart from '@/components/student/TrajectoryChart'
import Link from 'next/link'

export default function StudentDashboardPage() {
  const { enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [scores, setScores] = useState([])
  const [history, setHistory] = useState([])
  const [tab, setTab] = useState('map')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/enrollments/${enrollmentId}`).then(r => r.json()),
      fetch(`/api/proficiency?enrollmentId=${enrollmentId}`).then(r => r.json()),
    ]).then(([e, p]) => {
      setEnrollment(e)
      setScores(p.scores || [])
      setHistory(p.history || [])
      setLoading(false)
    })
  }, [enrollmentId])

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const overall = overallScore(scores)
  const allSkills = enrollment?.courses?.skills?.filter(s => s.is_approved) || []
  const explicit = allSkills.filter(s => s.skill_type === 'explicit')
  const implicit = allSkills.filter(s => s.skill_type === 'implicit')
  const scoreMap = Object.fromEntries(scores.map(s => [s.skill_id, s]))
  const atRiskSkills = allSkills.filter(s => isAtRisk(scoreMap[s.id]?.score))

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-1">{enrollment?.courses?.course_code && `${enrollment.courses.course_code} · `}{enrollment?.courses?.term}</p>
        <div className="flex items-start justify-between">
          <h1 className="font-serif font-light text-navy" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>
            {enrollment?.courses?.title}
          </h1>
          <div className="text-right">
            <div className="text-4xl font-black" style={{ color: proficiencyColor(overall) }}>{overall ?? '—'}%</div>
            <div className="text-xs text-gray-400">Overall proficiency</div>
          </div>
        </div>
      </div>

      {/* At-risk alert */}
      {atRiskSkills.length > 0 && (
        <div className="rounded-2xl px-5 py-4 mb-6 flex items-start gap-3"
          style={{ background: 'rgba(255,107,74,0.07)', border: '1px solid rgba(255,107,74,0.2)' }}>
          <div className="relative mt-1 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-brand-coral" />
          </div>
          <div>
            <p className="text-sm font-bold text-navy mb-1">
              {atRiskSkills.length} skill{atRiskSkills.length > 1 ? 's' : ''} need attention
            </p>
            <div className="flex flex-wrap gap-2">
              {atRiskSkills.map(s => (
                <Link key={s.id}
                  href={`/my-progress/${enrollmentId}/skill/${s.id}`}
                  className="text-xs font-medium px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                  style={{ background: 'rgba(255,107,74,0.12)', color: '#FF6B4A' }}>
                  {s.name} — {scoreMap[s.id]?.score ?? 0}%
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[
          { id: 'map', label: 'Skill Map' },
          { id: 'progress', label: 'Progress Over Time' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-brand-teal text-navy' : 'border-transparent text-gray-400 hover:text-navy'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'map' && (
        <div className="space-y-8">
          {[
            { skills: explicit, label: 'Explicit Skills', desc: 'Subject-matter knowledge and procedures', color: '#00A8A8' },
            { skills: implicit, label: 'Implicit Skills', desc: 'Reasoning, communication, and professional capabilities', color: '#5A3E6B' },
          ].map(group => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-navy">{group.label}</h2>
                <span className="text-xs text-gray-400">{group.desc}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.skills.map(skill => {
                  const ps = scoreMap[skill.id]
                  const score = ps?.score ?? null
                  const color = proficiencyColor(score)
                  return (
                    <Link key={skill.id}
                      href={`/my-progress/${enrollmentId}/skill/${skill.id}`}
                      className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all block">
                      <div className="flex items-start justify-between mb-3">
                        <p className="font-semibold text-navy text-sm leading-tight flex-1 pr-2">{skill.name}</p>
                        {score !== null && (
                          <span className="text-lg font-black flex-shrink-0" style={{ color }}>{score}%</span>
                        )}
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${score ?? 0}%`, background: color }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color }}>{proficiencyLabel(score)}</span>
                        <div className="flex gap-1.5">
                          {['Chat', 'Quiz', 'Guide'].map(action => (
                            <span key={action} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: group.color + '12', color: group.color }}>
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'progress' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-navy mb-4">Proficiency Over Time</h2>
          <TrajectoryChart history={history} skills={allSkills} />
        </div>
      )}
    </div>
  )
}
