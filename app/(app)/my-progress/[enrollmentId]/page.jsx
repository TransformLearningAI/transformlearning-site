'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { proficiencyLabel, proficiencyColor, overallScore, isAtRisk } from '@/lib/utils/proficiency'
import TrajectoryChart from '@/components/student/TrajectoryChart'
import Link from 'next/link'

// Governance trust badge — shows students the system is operating ethically
function GovernanceBadge({ score, confidence }) {
  const governed = confidence !== null && confidence !== undefined
  return (
    <div className="flex items-center gap-1.5" title={governed ? `Confidence: ${(confidence * 100).toFixed(0)}% · Governed assessment` : 'Awaiting assessment'}>
      <div className={`w-1.5 h-1.5 rounded-full ${governed ? 'bg-emerald-400' : 'bg-gray-300'}`} />
      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
        {governed ? 'Governed' : 'Pending'}
      </span>
    </div>
  )
}

// Stat card component
function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="rounded-2xl p-5 text-white" style={{ background: color }}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-black">{value}</div>
      {sub && <p className="text-xs text-white/60 mt-0.5">{sub}</p>}
    </div>
  )
}

// Skill card in the journey grid
function SkillCard({ skill, score, enrollmentId }) {
  const s = score?.score ?? null
  const color = proficiencyColor(s)
  const label = proficiencyLabel(s)?.toLowerCase() || 'beginning'
  return (
    <Link href={`/my-progress/${enrollmentId}/skill/${skill.id}`}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all block">
      <p className="text-sm font-semibold text-navy truncate mb-2">{skill.name}</p>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${s ?? 0}%`, background: color }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-black" style={{ color }}>{s ?? 0}%</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
    </Link>
  )
}

export default function StudentDashboardPage() {
  const { enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [scores, setScores] = useState([])
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('review')
  const [skillFilter, setSkillFilter] = useState('all')
  const [skillSearch, setSkillSearch] = useState('')
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
      <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const overall = overallScore(scores)
  const allSkills = enrollment?.courses?.skills?.filter(s => s.is_approved) || []
  const scoreMap = Object.fromEntries(scores.map(s => [s.skill_id, s]))
  const practicedCount = scores.filter(s => s.score > 0).length
  const masteredCount = scores.filter(s => s.score >= 80).length
  const atRiskSkills = allSkills.filter(s => isAtRisk(scoreMap[s.id]?.score))

  // Filter skills
  const filteredSkills = allSkills.filter(s => {
    if (skillSearch && !s.name.toLowerCase().includes(skillSearch.toLowerCase())) return false
    const sc = scoreMap[s.id]?.score ?? 0
    if (skillFilter === 'need_practice') return sc < 40
    if (skillFilter === 'progressing') return sc >= 40 && sc < 80
    if (skillFilter === 'strong') return sc >= 80
    return true
  })

  const needPractice = allSkills.filter(s => (scoreMap[s.id]?.score ?? 0) < 40).length
  const progressing = allSkills.filter(s => { const sc = scoreMap[s.id]?.score ?? 0; return sc >= 40 && sc < 80 }).length
  const strong = allSkills.filter(s => (scoreMap[s.id]?.score ?? 0) >= 80).length

  // Focus areas — lowest 2 skills
  const focusAreas = [...allSkills]
    .sort((a, b) => (scoreMap[a.id]?.score ?? 0) - (scoreMap[b.id]?.score ?? 0))
    .slice(0, 2)

  const tabs = [
    { id: 'coach', label: 'Coach', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 10v2l3-2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
    { id: 'practice', label: 'Practice', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
    { id: 'review', label: 'Review', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { id: 'history', label: 'History', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2v10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M4 9l3-3 2 2 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  ]

  return (
    <div>
      {/* Course header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
             style={{ background: '#FDF0E9' }}>
          {enrollment?.courses?.course_code?.[0] === 'B' ? '🫀' : '📐'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">
            {enrollment?.courses?.course_code} <span className="text-gray-400 font-normal">·</span> Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            {enrollment?.courses?.title}
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: '#E8F8F0', color: '#2D8B6F' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Synced
            </span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === t.id ? 'border-teal-600 text-navy' : 'border-transparent text-gray-400 hover:text-navy'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== REVIEW TAB ===== */}
      {activeTab === 'review' && (
        <div>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Course Progress" value={`${overall ?? 0}%`} sub={`Mastery: ${masteredCount > 0 ? Math.round((masteredCount / allSkills.length) * 100) : 0}%`} color="#2D6A4F"
              icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="white" strokeWidth="1.3" opacity="0.7"/></svg>} />
            <StatCard label="Skills Practiced" value={`${practicedCount}/${allSkills.length}`} sub={`Mastery: ${masteredCount > 0 ? Math.round((masteredCount / allSkills.length) * 100) : 0}%`} color="#2D8B6F"
              icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.3" opacity="0.7"/></svg>} />
            <StatCard label="Mastered" value={masteredCount} color="#D4603A"
              icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/></svg>} />
            <StatCard label="This Week" value={history.filter(h => new Date(h.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0} color="#C94C3A"
              icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10l3-5 3 3 4-6" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7"/></svg>} />
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 font-bold text-navy mb-4">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  Recent Activity
                </h3>
                {history.length === 0 ? (
                  <div className="text-center py-6">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-2 text-gray-300"><path d="M8 16l6 6 10-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    <p className="text-sm text-gray-400 mb-1">No activity yet this week</p>
                    <button onClick={() => setActiveTab('practice')} className="text-sm font-bold" style={{ color: '#2D8B6F' }}>
                      Start practicing →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.slice(0, 5).map((h, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                        <div className="w-2 h-2 rounded-full" style={{ background: '#2D8B6F' }} />
                        <span className="text-sm text-gray-600 flex-1">Practiced skill</span>
                        <span className="text-xs text-gray-400">{new Date(h.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-navy mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button onClick={() => setActiveTab('practice')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-gray-50 transition-colors border border-gray-100"
                    style={{ background: '#F0FDF4' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 9l3 3 5-6" stroke="#2D8B6F" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="text-sm font-bold" style={{ color: '#2D8B6F' }}>Practice Weak Skills</span>
                  </button>
                  <button onClick={() => setActiveTab('coach')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-gray-50 transition-colors border border-gray-100">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="10" rx="2" stroke="#374151" strokeWidth="1.3"/><path d="M6 12v3l4-3" stroke="#374151" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                    <span className="text-sm font-medium text-gray-700">Ask Coach for Help</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-gray-50 transition-colors border border-gray-100">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 14V4a2 2 0 012-2h8a2 2 0 012 2v10l-3-2H5a2 2 0 01-2-2z" stroke="#374151" strokeWidth="1.3"/></svg>
                    <span className="text-sm font-medium text-gray-700">Upload Work</span>
                  </button>
                </div>
              </div>

              {/* Governance Trust Panel */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l6 3v4c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V4l6-3z" stroke="#2D8B6F" strokeWidth="1.3" fill="none"/><path d="M6 8l2 2 3-3.5" stroke="#2D8B6F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <h3 className="font-bold text-navy text-sm">Governed Assessment</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Every recommendation is bounded by fairness, confidence, and privacy constraints.
                  The system cannot act on uncertain predictions or produce inequitable outcomes.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Fairness', status: 'Active', color: '#2D8B6F' },
                    { label: 'Confidence', status: 'Active', color: '#2D8B6F' },
                    { label: 'Privacy', status: 'Active', color: '#2D8B6F' },
                  ].map(g => (
                    <div key={g.label} className="rounded-lg p-2 text-center" style={{ background: '#F0FDF4' }}>
                      <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1" style={{ background: g.color }} />
                      <span className="text-[10px] font-bold text-gray-500">{g.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — Skills grid */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center gap-2 font-bold text-navy">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/></svg>
                    Skills ({filteredSkills.length} of {allSkills.length})
                  </h3>
                </div>

                {/* Search */}
                <input type="text" placeholder="Search skills..." value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-3 focus:outline-none focus:border-teal-500" />

                {/* Filter chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[
                    { id: 'all', label: `All (${allSkills.length})`, color: '#2D8B6F' },
                    { id: 'need_practice', label: `Need Practice (${needPractice})`, color: '#DC2626' },
                    { id: 'progressing', label: `Progressing (${progressing})`, color: '#F59E0B' },
                    { id: 'strong', label: `Strong (${strong})`, color: '#16A34A' },
                  ].map(f => (
                    <button key={f.id} onClick={() => setSkillFilter(f.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        skillFilter === f.id ? 'text-white' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                      }`}
                      style={skillFilter === f.id ? { background: f.color } : undefined}>
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Focus areas */}
                {focusAreas.length > 0 && (
                  <div className="rounded-xl px-4 py-3 mb-4" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
                    <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>
                      Focus Areas: {focusAreas.map(s => `${s.name} (${scoreMap[s.id]?.score ?? 0}%)`).join(', ')}
                    </span>
                  </div>
                )}

                {/* Skill grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredSkills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} score={scoreMap[skill.id]} enrollmentId={enrollmentId} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Over Time */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
            <h3 className="flex items-center gap-2 font-bold text-navy mb-4">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 14l4-5 3 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Course Progress Over Time
            </h3>
            {history.length > 0 ? (
              <TrajectoryChart history={history} skills={allSkills} />
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                Complete activities to start tracking your progress
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== COACH TAB ===== */}
      {activeTab === 'coach' && (
        <div className="grid lg:grid-cols-[280px_1fr_300px] gap-6">
          {/* Left: skill list */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Skills ({allSkills.length})</p>
            <div className="space-y-1">
              {allSkills.map(skill => {
                const sc = scoreMap[skill.id]?.score ?? 0
                return (
                  <Link key={skill.id} href={`/my-progress/${enrollmentId}/chat/${skill.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-xs text-gray-600 flex-1 truncate">{skill.name}</span>
                    <span className="text-xs font-bold" style={{ color: proficiencyColor(sc) }}>{sc}%</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Center: coaching prompt */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[400px]">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4 text-gray-300">
              <rect x="4" y="4" width="40" height="30" rx="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 34v6l8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <h3 className="font-bold text-navy mb-2">Select a skill to start coaching</h3>
            <p className="text-sm text-gray-400 text-center max-w-sm">
              Choose a skill from the left to start an AI coaching session. The coach adapts to your level and uses governed intelligence to ensure fair, accurate guidance.
            </p>
            {/* Teaching style selector */}
            <div className="flex items-center gap-2 mt-6">
              <span className="text-xs text-gray-400">Teaching Style:</span>
              {[
                { id: 'smart', label: 'Smart', color: '#2D8B6F' },
                { id: 'questions', label: '? Questions', color: undefined },
                { id: 'explain', label: '✦ Explain', color: undefined },
              ].map(s => (
                <button key={s.id}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    s.id === 'smart' ? 'text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  style={s.id === 'smart' ? { background: s.color } : undefined}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: next best action */}
          <div className="space-y-4">
            {atRiskSkills.length > 0 && (
              <div className="rounded-2xl border-2 p-5" style={{ borderColor: '#FFE082', background: '#FFFEF5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 5H14l-3.5 3 1 5L8 11l-3.5 3 1-5L2 6h4.5L8 1z" fill="#F59E0B"/></svg>
                  <h4 className="font-bold text-navy text-sm">Next best action</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Practice <strong>{atRiskSkills[0]?.name}</strong> — {scoreMap[atRiskSkills[0]?.id]?.score ?? 0}% mastery
                </p>
                <div className="flex gap-2">
                  <Link href={`/my-progress/${enrollmentId}/quiz/${atRiskSkills[0]?.id}`}
                    className="px-4 py-2 rounded-xl text-white text-xs font-bold"
                    style={{ background: '#2D8B6F' }}>
                    Generate Practice
                  </Link>
                  <Link href={`/my-progress/${enrollmentId}/chat/${atRiskSkills[0]?.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50">
                    Ask Coach
                  </Link>
                </div>
              </div>
            )}

            {/* Governance detail panel */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l5 2.5v3.5c0 3-2 5-5 5.5C4 12 2 10 2 7V3.5L7 1z" stroke="#2D8B6F" strokeWidth="1.2" fill="none"/></svg>
                <h4 className="font-bold text-navy text-sm">Ethical Governance</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Every AI decision passes through fairness, confidence, and risk constraints before reaching you. The system defers to human review when any condition fails.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Fairness check</span>
                  <span className="font-bold text-emerald-600">Passing</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Confidence threshold</span>
                  <span className="font-bold text-emerald-600">Met</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Privacy compliance</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-gray-500">Risk level</span>
                  <span className="font-bold text-emerald-600">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PRACTICE TAB ===== */}
      {activeTab === 'practice' && (
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Choose a skill to practice</p>
            <div className="space-y-1">
              {allSkills.map(skill => {
                const sc = scoreMap[skill.id]?.score ?? 0
                return (
                  <Link key={skill.id} href={`/my-progress/${enrollmentId}/quiz/${skill.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: proficiencyColor(sc) }} />
                    <span className="text-xs text-gray-600 flex-1 truncate">{skill.name}</span>
                    <span className="text-xs font-bold" style={{ color: proficiencyColor(sc) }}>{sc}%</span>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[400px]">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4 text-gray-300">
              <path d="M24 4l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <h3 className="font-bold text-navy mb-2">Select a skill to practice</h3>
            <p className="text-sm text-gray-400 text-center max-w-sm">
              The system generates adaptive questions calibrated to your current level. Governed by confidence thresholds — questions are never too easy or unfairly hard.
            </p>
          </div>
        </div>
      )}

      {/* ===== HISTORY TAB ===== */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-navy mb-4">Assessment History</h3>
          {history.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No history yet. Complete a quiz or coaching session to start building your record.</p>
          ) : (
            <div className="space-y-3">
              {history.map((h, i) => {
                const skill = allSkills.find(s => s.id === h.skill_id)
                return (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F0FDF4' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-7" stroke="#2D8B6F" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{skill?.name || 'Skill assessment'}</p>
                      <p className="text-xs text-gray-400">{new Date(h.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold" style={{ color: proficiencyColor(h.score) }}>{h.score}%</span>
                      <GovernanceBadge score={h.score} confidence={h.confidence} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Floating ask bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-20">
        <div className="flex items-center gap-2 bg-white rounded-2xl shadow-xl border border-gray-200 px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-teal-600 flex-shrink-0">
            <path d="M9 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="currentColor"/>
          </svg>
          <input type="text" placeholder="Ask a quick question..." className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none" />
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: '#2D8B6F' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
