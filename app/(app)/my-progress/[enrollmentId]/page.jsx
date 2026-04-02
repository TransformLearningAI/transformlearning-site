'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { proficiencyColor, proficiencyLabel, isAtRisk } from '@/lib/utils/proficiency'
import Link from 'next/link'

export default function StudentDashboard() {
  const { enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [scores, setScores] = useState([])
  const [history, setHistory] = useState([])
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
    }).catch(() => setLoading(false))
  }, [enrollmentId])

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const allSkills = enrollment?.courses?.skills?.filter(s => s.is_approved) || []
  const scoreMap = Object.fromEntries(scores.map(s => [s.skill_id, s]))
  const practicedCount = scores.filter(s => s.score > 0).length
  const masteredCount = scores.filter(s => s.score >= 80).length
  const overall = allSkills.length > 0 ? Math.round(scores.reduce((a, s) => a + (s.score || 0), 0) / allSkills.length) : 0
  const masteryPct = allSkills.length > 0 ? Math.round(scores.filter(s => s.score > 0).reduce((a, s) => a + (s.score || 0), 0) / Math.max(1, practicedCount)) : 0

  // Find weakest skill for next best action
  const sorted = [...allSkills].sort((a, b) => (scoreMap[a.id]?.score ?? -1) - (scoreMap[b.id]?.score ?? -1))
  const weakest = sorted[0]

  return (
    <div>
      {/* Course Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
             style={{ background: '#FDF0E9' }}>
          🫀
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy">
            {enrollment?.courses?.course_code} <span className="text-gray-300 font-light">•</span> Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{enrollment?.courses?.title}</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: '#E8F8F0', color: '#2D8B6F' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Synced
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 mb-1">Progression</p>
          <p className="text-3xl font-black" style={{ color: '#00A8A8' }}>{overall}%</p>
          <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${overall}%`, background: '#00A8A8' }} />
          </div>
          <p className="text-[10px] text-gray-300 mt-1.5">{practicedCount}/{allSkills.length} skills</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 mb-1">Mastery</p>
          <p className="text-3xl font-black" style={{ color: '#4F8A5B' }}>{masteryPct}%</p>
          <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${masteryPct}%`, background: '#4F8A5B' }} />
          </div>
          <p className="text-[10px] text-gray-300 mt-1.5">On practiced skills</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#9CA3AF" strokeWidth="1.2"/><path d="M6 3v3l2 1" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <p className="text-xs text-gray-400">Time on task</p>
          </div>
          <p className="text-3xl font-black text-navy">0h</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 mb-1">Skills Improved</p>
          <p className="text-3xl font-black text-navy">{practicedCount} <span className="text-lg font-normal text-gray-300">/ {allSkills.length}</span></p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left: Skill Journey */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-navy">Skill Journey</h2>
            <span className="text-sm text-gray-400">{allSkills.length} skills</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {allSkills.map(skill => {
              const ps = scoreMap[skill.id]
              const score = ps?.score ?? 0
              const label = score >= 80 ? 'proficient' : score >= 40 ? 'developing' : 'beginning'

              return (
                <Link key={skill.id}
                  href={`/my-progress/${enrollmentId}/skill/${skill.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all block">
                  <p className="text-sm font-semibold text-navy truncate mb-3">{skill.name}</p>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${score}%`, background: score >= 80 ? '#4F8A5B' : '#00A8A8' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black" style={{ color: proficiencyColor(score) }}>{score}%</span>
                    <span className="text-[10px] text-gray-400">{label}</span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Course Progress Over Time */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#9CA3AF" strokeWidth="1.3"/><path d="M9 5v4l2.5 1.5" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <h2 className="text-xl font-bold text-navy">Course Progress Over Time</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-400">Progress Over Time</span>
                <span className="text-xs font-bold" style={{ color: '#2D8B6F' }}>↗ +3%</span>
              </div>
              <div className="relative h-36">
                {/* Y axis labels */}
                <div className="absolute inset-0 flex flex-col justify-between pr-4">
                  {[100, 75, 50, 25, 0].map(v => (
                    <div key={v} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-300 w-6 text-right">{v}</span>
                      <div className="flex-1 border-t border-dashed border-gray-100" />
                    </div>
                  ))}
                </div>
                {/* Line */}
                <div className="absolute bottom-0 left-8 right-0 h-full flex items-end">
                  <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M0,115 C80,112 160,108 240,105 S360,98 400,95" fill="none" stroke="#2D8B6F" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="0" cy="115" r="4" fill="#2D8B6F" />
                    <circle cx="400" cy="95" r="4" fill="#2D8B6F" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between mt-2 px-8">
                <span className="text-[10px] text-gray-300">Jan 16</span>
                <span className="text-[10px] text-gray-300">Jan 17</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Next best action */}
          {weakest && (
            <div className="rounded-2xl border-2 p-5" style={{ borderColor: '#FFE082', background: '#FFFEF5' }}>
              <div className="flex items-center gap-2 mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l2.5 5H17l-4 3.5 1.5 5L10 13l-4.5 2.5 1.5-5L3 7h4.5z" fill="#F59E0B"/>
                </svg>
                <h3 className="font-bold text-navy">Next best action</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Practice <strong className="text-navy">{weakest.name}</strong> – {scoreMap[weakest.id]?.score ?? 0}% mastery
              </p>
              <div className="flex gap-2">
                <Link href={`/my-progress/${enrollmentId}/quiz/${weakest.id}`}
                  className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-bold text-center"
                  style={{ background: '#2D8B6F' }}>
                  Generate Practice
                </Link>
                <Link href={`/my-progress/${enrollmentId}/chat/${weakest.id}`}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 text-center">
                  Ask Coach
                </Link>
              </div>
            </div>
          )}

          {/* Sources */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-navy mb-3">Sources</h3>
            <a href="#" className="text-sm font-medium hover:underline block mb-2" style={{ color: '#2D8B6F' }}>
              {enrollment?.courses?.course_code}-{enrollment?.courses?.term?.replace(/\s/g, '-')}-Syllabus.pdf
            </a>
            <button className="text-sm text-gray-400 hover:text-gray-600">+ Add source</button>
          </div>

          {/* Governance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l6 3v4c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V4l6-3z" stroke="#2D8B6F" strokeWidth="1.3" fill="none"/><path d="M6 8l2 2 3-3.5" stroke="#2D8B6F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h3 className="font-bold text-navy text-sm">Governed</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every assessment passes through fairness, confidence, and privacy constraints before reaching you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
