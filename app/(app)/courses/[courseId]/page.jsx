import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import InviteStudentModal from '@/components/faculty/InviteStudentModal'

export default async function CourseDetailPage({ params }) {
  const { courseId } = await params
  const supabase = await createClient()
  const service = await createServiceClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: course } = await service
    .from('courses')
    .select(`*, skills(*), enrollments(id, onboarding_status, profiles(full_name, email, xp))`)
    .eq('id', courseId)
    .eq('faculty_id', user.id)
    .single()

  if (!course) redirect('/courses')

  const enrollmentIds = course.enrollments?.map(e => e.id) || []
  const { data: scores } = enrollmentIds.length ? await service
    .from('proficiency_scores')
    .select('enrollment_id, skill_id, score, confidence, scored_at')
    .in('enrollment_id', enrollmentIds) : { data: [] }

  const { data: history } = enrollmentIds.length ? await service
    .from('proficiency_history')
    .select('enrollment_id, skill_id, score, source, created_at')
    .in('enrollment_id', enrollmentIds)
    .order('created_at', { ascending: false })
    .limit(500) : { data: [] }

  const approvedSkills = course.skills?.filter(s => s.is_approved) || []
  const foundationalSkills = approvedSkills.filter(s => s.skill_type === 'explicit')
  const transferableSkills = approvedSkills.filter(s => s.skill_type === 'implicit')

  // Per-skill analytics
  const skillStats = approvedSkills.map(skill => {
    const ss = (scores || []).filter(s => s.skill_id === skill.id)
    const avg = ss.length > 0 ? Math.round(ss.reduce((a, s) => a + s.score, 0) / ss.length) : 0
    const min = ss.length > 0 ? Math.min(...ss.map(s => s.score)) : 0
    const max = ss.length > 0 ? Math.max(...ss.map(s => s.score)) : 0
    const mastered = ss.filter(s => s.score >= 80).length
    const atRisk = ss.filter(s => s.score < 40 && s.score > 0).length
    const developing = ss.filter(s => s.score >= 40 && s.score < 80).length
    return { ...skill, avg, min, max, mastered, atRisk, developing, assessed: ss.length }
  }).sort((a, b) => a.avg - b.avg)

  // Student analytics
  const studentData = (course.enrollments || []).map(e => {
    const ss = (scores || []).filter(s => s.enrollment_id === e.id)
    const avg = ss.length > 0 ? Math.round(ss.reduce((a, s) => a + s.score, 0) / ss.length) : null
    const mastered = ss.filter(s => s.score >= 80).length
    const atRisk = ss.filter(s => s.score < 40 && s.score > 0).length
    const studentHistory = (history || []).filter(h => h.enrollment_id === e.id)
    const quizzes = studentHistory.filter(h => h.source === 'quiz').length
    const assessments = studentHistory.filter(h => h.source === 'assessment').length
    return { ...e, avg, mastered, atRisk, assessed: ss.length, quizzes, assessments, totalActivity: quizzes + assessments }
  }).sort((a, b) => (b.avg ?? -1) - (a.avg ?? -1))

  // Aggregate stats
  const totalStudents = course.enrollments?.length || 0
  const activeStudents = studentData.filter(s => s.assessed > 0).length
  const avgOverall = studentData.filter(s => s.avg !== null).length > 0
    ? Math.round(studentData.filter(s => s.avg !== null).reduce((a, s) => a + s.avg, 0) / studentData.filter(s => s.avg !== null).length) : 0
  const totalMastered = studentData.reduce((a, s) => a + s.mastered, 0)
  const atRiskCount = studentData.filter(s => s.avg !== null && s.avg < 40).length
  const totalQuizzes = (history || []).filter(h => h.source === 'quiz').length
  const totalAssessments = (history || []).filter(h => h.source === 'assessment').length
  const totalEngagements = (history || []).length

  // Distribution buckets
  const dist = { mastered: 0, developing: 0, emerging: 0, uncharted: 0 }
  studentData.forEach(s => {
    if (s.avg === null) dist.uncharted++
    else if (s.avg >= 80) dist.mastered++
    else if (s.avg >= 40) dist.developing++
    else dist.emerging++
  })

  // Top/bottom performers
  const topPerformers = studentData.filter(s => s.avg !== null).slice(0, 5)
  const needsSupport = studentData.filter(s => s.avg !== null && s.avg < 40)

  return (
    <div className="-m-6 lg:-m-8 min-h-screen text-white px-8 py-8" style={{ background: '#020617' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: '5%', right: '10%', background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: '10%', left: '20%', background: 'radial-gradient(circle, rgba(0,206,209,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link href="/courses" className="text-xs text-white/20 hover:text-white/40 mb-3 block">← All Courses</Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">{course.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              {course.course_code && <span className="text-xs font-bold text-white/30 uppercase tracking-wider">{course.course_code}</span>}
              {course.term && <span className="text-xs text-white/20">{course.term}</span>}
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}>
                {approvedSkills.length} skills
              </span>
            </div>
          </div>
          <InviteStudentModal courseId={courseId} />
        </div>

        {/* ═══ HEADLINE STATS ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'Students', value: totalStudents, sub: `${activeStudents} active`, color: '#00CED1' },
            { label: 'Avg Proficiency', value: `${avgOverall}%`, sub: 'across cohort', color: avgOverall >= 60 ? '#4ADE80' : avgOverall >= 40 ? '#FBBF24' : '#FB7185' },
            { label: 'Skills Mastered', value: totalMastered, sub: 'student×skill', color: '#4ADE80' },
            { label: 'At Risk', value: atRiskCount, sub: 'below 40%', color: atRiskCount > 0 ? '#FB7185' : '#4ADE80' },
            { label: 'Engagements', value: totalEngagements, sub: `${totalQuizzes} quiz · ${totalAssessments} assess`, color: '#A78BFA' },
            { label: 'Avg per Student', value: totalStudents > 0 ? Math.round(totalEngagements / totalStudents) : 0, sub: 'engagement units', color: '#00CED1' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/20 mb-1">{s.label}</p>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-white/15 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ═══ DISTRIBUTION + TOP PERFORMERS ═══ */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 mb-8">
          {/* Student Distribution */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-lg font-bold text-white mb-4">Student Distribution</h2>
            <div className="flex items-end gap-2 h-32 mb-4">
              {[
                { label: 'Mastered', count: dist.mastered, color: '#4ADE80', pct: totalStudents > 0 ? dist.mastered / totalStudents : 0 },
                { label: 'Developing', count: dist.developing, color: '#00CED1', pct: totalStudents > 0 ? dist.developing / totalStudents : 0 },
                { label: 'Emerging', count: dist.emerging, color: '#A78BFA', pct: totalStudents > 0 ? dist.emerging / totalStudents : 0 },
                { label: 'No Data', count: dist.uncharted, color: '#334155', pct: totalStudents > 0 ? dist.uncharted / totalStudents : 0 },
              ].map(b => (
                <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg transition-all" style={{ height: `${Math.max(4, b.pct * 100)}%`, background: b.color, minHeight: b.count > 0 ? '8px' : '2px' }} />
                  <span className="text-lg font-black" style={{ color: b.color }}>{b.count}</span>
                  <span className="text-[9px] text-white/20">{b.label}</span>
                </div>
              ))}
            </div>
            <div className="h-1 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {dist.mastered > 0 && <div style={{ width: `${(dist.mastered / totalStudents) * 100}%`, background: '#4ADE80' }} />}
              {dist.developing > 0 && <div style={{ width: `${(dist.developing / totalStudents) * 100}%`, background: '#00CED1' }} />}
              {dist.emerging > 0 && <div style={{ width: `${(dist.emerging / totalStudents) * 100}%`, background: '#A78BFA' }} />}
              {dist.uncharted > 0 && <div style={{ width: `${(dist.uncharted / totalStudents) * 100}%`, background: '#334155' }} />}
            </div>
          </div>

          {/* Top Performers + Needs Support */}
          <div className="grid grid-rows-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)' }}>
              <h3 className="text-sm font-bold text-emerald-300 mb-3">Top Performers</h3>
              <div className="space-y-2">
                {topPerformers.slice(0, 3).map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/20 w-4">{i + 1}.</span>
                      <span className="text-sm text-white truncate">{s.profiles?.full_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/20">{s.mastered} mastered</span>
                      <span className="text-sm font-black text-emerald-400">{s.avg}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-5" style={{ background: needsSupport.length > 0 ? 'rgba(251,113,133,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${needsSupport.length > 0 ? 'rgba(251,113,133,0.1)' : 'rgba(255,255,255,0.04)'}` }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: needsSupport.length > 0 ? '#FB7185' : '#4ADE80' }}>
                {needsSupport.length > 0 ? `Needs Support (${needsSupport.length})` : 'No At-Risk Students'}
              </h3>
              <div className="space-y-2">
                {needsSupport.slice(0, 3).map(s => (
                  <div key={s.id} className="flex items-center justify-between">
                    <span className="text-sm text-white truncate">{s.profiles?.full_name}</span>
                    <span className="text-sm font-black text-rose-400">{s.avg}%</span>
                  </div>
                ))}
                {needsSupport.length === 0 && <p className="text-xs text-white/20">All students above 40% threshold.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SKILL PROFICIENCY BREAKDOWN ═══ */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Skill Proficiency Range</h2>
            <div className="flex items-center gap-4 text-[10px] text-white/20">
              <span>{foundationalSkills.length} foundational</span>
              <span>{transferableSkills.length} core</span>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {skillStats.map(skill => {
              const barColor = skill.avg >= 80 ? '#4ADE80' : skill.avg >= 40 ? '#00CED1' : skill.avg > 0 ? '#A78BFA' : '#334155'
              return (
                <div key={skill.id} className="px-6 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{skill.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: skill.skill_type === 'implicit' ? 'rgba(167,139,250,0.12)' : 'rgba(0,206,209,0.12)',
                                 color: skill.skill_type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
                        {skill.skill_type === 'implicit' ? 'core' : 'foundational'}
                      </span>
                    </div>
                    <div className="mt-2 relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {skill.assessed > 0 && (
                        <div className="absolute h-full rounded-full" style={{ left: `${skill.min}%`, width: `${Math.max(2, skill.max - skill.min)}%`, background: `${barColor}25` }} />
                      )}
                      <div className="absolute h-full rounded-full" style={{ width: `${skill.avg}%`, background: barColor }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 w-16">
                    <span className="text-sm font-black" style={{ color: barColor }}>{skill.avg}%</span>
                    <span className="text-[10px] text-white/15 block">{skill.min}–{skill.max}</span>
                  </div>
                  <div className="flex-shrink-0 w-24 text-right text-[10px]">
                    <span className="text-emerald-400">{skill.mastered}✦</span>
                    <span className="text-cyan-300 ml-2">{skill.developing}↑</span>
                    {skill.atRisk > 0 && <span className="text-rose-400 ml-2">{skill.atRisk}⚠</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ═══ FULL STUDENT ROSTER ═══ */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">All Students ({totalStudents})</h2>
            <div className="flex items-center gap-4 text-[10px] text-white/20">
              <span>Sorted by proficiency</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[10px] font-bold text-white/20 uppercase tracking-wider px-6 py-3">Student</th>
                  <th className="text-center text-[10px] font-bold text-white/20 uppercase tracking-wider px-3 py-3">Avg</th>
                  <th className="text-center text-[10px] font-bold text-white/20 uppercase tracking-wider px-3 py-3">Mastered</th>
                  <th className="text-center text-[10px] font-bold text-white/20 uppercase tracking-wider px-3 py-3">At Risk</th>
                  <th className="text-center text-[10px] font-bold text-white/20 uppercase tracking-wider px-3 py-3">Quizzes</th>
                  <th className="text-center text-[10px] font-bold text-white/20 uppercase tracking-wider px-3 py-3">Assess</th>
                  <th className="text-center text-[10px] font-bold text-white/20 uppercase tracking-wider px-3 py-3">XP</th>
                  <th className="text-right text-[10px] font-bold text-white/20 uppercase tracking-wider px-6 py-3">Proficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {studentData.map(s => {
                  const color = s.avg !== null ? (s.avg >= 80 ? '#4ADE80' : s.avg >= 40 ? '#00CED1' : s.avg > 0 ? '#A78BFA' : '#334155') : '#334155'
                  return (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${color}20`, color }}>
                            {s.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{s.profiles?.full_name || s.profiles?.email}</p>
                            <p className="text-[10px] text-white/15">{s.profiles?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center px-3 py-3">
                        <span className="text-sm font-black" style={{ color }}>{s.avg !== null ? `${s.avg}%` : '—'}</span>
                      </td>
                      <td className="text-center px-3 py-3">
                        <span className="text-sm text-emerald-400 font-bold">{s.mastered}</span>
                      </td>
                      <td className="text-center px-3 py-3">
                        {s.atRisk > 0 ? <span className="text-sm text-rose-400 font-bold">{s.atRisk}</span> : <span className="text-white/10">0</span>}
                      </td>
                      <td className="text-center px-3 py-3"><span className="text-sm text-white/40">{s.quizzes}</span></td>
                      <td className="text-center px-3 py-3"><span className="text-sm text-white/40">{s.assessments}</span></td>
                      <td className="text-center px-3 py-3"><span className="text-sm text-cyan-300/60">{s.profiles?.xp || 0}</span></td>
                      <td className="text-right px-6 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full" style={{ width: `${s.avg || 0}%`, background: color }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ INSIGHTS + GOVERNANCE ═══ */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(0,206,209,0.06), rgba(167,139,250,0.06))', border: '1px solid rgba(0,206,209,0.1)' }}>
            <h3 className="text-lg font-bold text-white mb-4">Insights</h3>
            <div className="space-y-3 text-sm text-white/50 leading-relaxed">
              {skillStats.length > 0 && skillStats[0].avg < 40 && (
                <p>⚠ <span className="text-rose-400 font-bold">{skillStats[0].name}</span> is the weakest skill at {skillStats[0].avg}% avg — {skillStats[0].atRisk} students at risk. Consider additional instruction or resources.</p>
              )}
              {skillStats.length > 0 && (
                <p>✦ <span className="text-emerald-400 font-bold">{skillStats[skillStats.length - 1].name}</span> is the strongest at {skillStats[skillStats.length - 1].avg}% avg — {skillStats[skillStats.length - 1].mastered} students at mastery.</p>
              )}
              <p>📊 Students average <span className="text-cyan-300 font-bold">{totalStudents > 0 ? Math.round(totalEngagements / totalStudents) : 0} engagement units</span> each ({Math.round(totalQuizzes / Math.max(1, totalStudents))} quizzes, {Math.round(totalAssessments / Math.max(1, totalStudents))} assessments).</p>
              {transferableSkills.length > 0 && (
                <p>◇ <span className="text-purple-300 font-bold">{transferableSkills.length} core skills</span> mapped — critical thinking, communication, and collaboration measured alongside domain knowledge.</p>
              )}
              {totalMastered > 0 && (
                <p>🏆 <span className="text-emerald-400 font-bold">{totalMastered} skill mastery events</span> across the cohort. {topPerformers[0]?.profiles?.full_name} leads with {topPerformers[0]?.mastered} skills mastered.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-bold text-white mb-3">Feature Usage</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Quizzes', value: totalQuizzes, icon: '⚡', color: '#00CED1' },
                  { label: 'Assessments', value: totalAssessments, icon: '📊', color: '#A78BFA' },
                  { label: 'Total EU', value: totalEngagements, icon: '✦', color: '#4ADE80' },
                ].map(a => (
                  <div key={a.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-lg mb-0.5">{a.icon}</div>
                    <div className="text-xl font-black" style={{ color: a.color }}>{a.value}</div>
                    <div className="text-[9px] text-white/15">{a.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Link href={`/courses/${courseId}/skills`}
              className="block rounded-2xl p-5 transition hover:bg-white/[0.04]"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-bold text-white">Edit Skill Framework →</h3>
              <p className="text-[10px] text-white/20 mt-1">{foundationalSkills.length} foundational + {transferableSkills.length} core skills</p>
            </Link>

            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Governed</span>
              </div>
              <p className="text-[10px] text-white/15 leading-5">All assessments governed by fairness, confidence, and privacy constraints. No student data shared between students.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
