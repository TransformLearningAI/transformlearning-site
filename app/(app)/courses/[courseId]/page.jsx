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
    .select(`*, skills(*), enrollments(id, onboarding_status, profiles(full_name, email))`)
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
    .limit(100) : { data: [] }

  const approvedSkills = course.skills?.filter(s => s.is_approved) || []
  const explicitSkills = approvedSkills.filter(s => s.skill_type === 'explicit')
  const implicitSkills = approvedSkills.filter(s => s.skill_type === 'implicit')

  // Compute per-skill stats
  const skillStats = approvedSkills.map(skill => {
    const skillScores = (scores || []).filter(s => s.skill_id === skill.id)
    const avg = skillScores.length > 0 ? Math.round(skillScores.reduce((a, s) => a + s.score, 0) / skillScores.length) : 0
    const min = skillScores.length > 0 ? Math.min(...skillScores.map(s => s.score)) : 0
    const max = skillScores.length > 0 ? Math.max(...skillScores.map(s => s.score)) : 0
    const mastered = skillScores.filter(s => s.score >= 80).length
    const atRisk = skillScores.filter(s => s.score < 40 && s.score > 0).length
    return { ...skill, avg, min, max, mastered, atRisk, assessed: skillScores.length }
  }).sort((a, b) => a.avg - b.avg)

  // Aggregate stats
  const totalStudents = course.enrollments?.length || 0
  const activeStudents = course.enrollments?.filter(e => e.onboarding_status === 'complete').length || 0
  const totalAssessments = (history || []).length
  const avgOverall = skillStats.length > 0 ? Math.round(skillStats.reduce((a, s) => a + s.avg, 0) / skillStats.length) : 0

  // Activity breakdown
  const quizCount = (history || []).filter(h => h.source === 'quiz').length
  const assessmentCount = (history || []).filter(h => h.source === 'assessment').length

  // At-risk students
  const atRiskStudents = enrollmentIds.filter(id => {
    const ss = (scores || []).filter(s => s.enrollment_id === id)
    if (!ss.length) return false
    return ss.reduce((a, s) => a + s.score, 0) / ss.length < 40
  })

  // Student roster with scores
  const studentData = (course.enrollments || []).map(e => {
    const ss = (scores || []).filter(s => s.enrollment_id === e.id)
    const avg = ss.length > 0 ? Math.round(ss.reduce((a, s) => a + s.score, 0) / ss.length) : null
    const mastered = ss.filter(s => s.score >= 80).length
    return { ...e, avg, mastered, assessed: ss.length }
  }).sort((a, b) => (a.avg ?? -1) - (b.avg ?? -1))

  return (
    <div className="-m-6 lg:-m-8 min-h-screen text-white px-8 py-8" style={{ background: '#020617' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: '5%', right: '10%', background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: '10%', left: '20%', background: 'radial-gradient(circle, rgba(0,206,209,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link href="/courses" className="text-xs text-white/20 hover:text-white/40 mb-3 block">← All Courses</Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">{course.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              {course.course_code && <span className="text-xs font-bold text-white/30 uppercase tracking-wider">{course.course_code}</span>}
              {course.term && <span className="text-xs text-white/20">{course.term}</span>}
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}>
                {approvedSkills.length} skills mapped
              </span>
            </div>
          </div>
          <InviteStudentModal courseId={courseId} />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Students', value: totalStudents, sub: `${activeStudents} active`, color: '#00CED1' },
            { label: 'Avg Proficiency', value: `${avgOverall}%`, sub: 'across all skills', color: avgOverall >= 50 ? '#4ADE80' : '#FBBF24' },
            { label: 'Assessments', value: totalAssessments, sub: `${quizCount} quizzes · ${assessmentCount} tests`, color: '#A78BFA' },
            { label: 'Skills Mastered', value: skillStats.reduce((a, s) => a + s.mastered, 0), sub: 'student×skill pairs', color: '#4ADE80' },
            { label: 'At Risk', value: atRiskStudents.length, sub: `of ${totalStudents} students`, color: atRiskStudents.length > 0 ? '#FB7185' : '#4ADE80' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">{s.label}</p>
              <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-white/20 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Left: Skill proficiency breakdown */}
          <div className="space-y-6">
            {/* Skill performance table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Skill Proficiency Range</h2>
                <span className="text-xs text-white/20">{approvedSkills.length} skills · sorted by avg</span>
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
                            {skill.skill_type === 'implicit' ? 'transferable' : 'foundational'}
                          </span>
                        </div>
                        {/* Range bar */}
                        <div className="mt-2 relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          {/* Min-max range */}
                          {skill.assessed > 0 && (
                            <div className="absolute h-full rounded-full" style={{ left: `${skill.min}%`, width: `${Math.max(2, skill.max - skill.min)}%`, background: `${barColor}30` }} />
                          )}
                          {/* Average marker */}
                          <div className="absolute h-full rounded-full" style={{ width: `${skill.avg}%`, background: barColor }} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 w-20">
                        <span className="text-sm font-black" style={{ color: barColor }}>{skill.avg}%</span>
                        <span className="text-[10px] text-white/15 block">
                          {skill.assessed > 0 ? `${skill.min}–${skill.max}` : 'no data'}
                        </span>
                      </div>
                      <div className="flex-shrink-0 w-16 text-right">
                        <span className="text-xs text-white/30">{skill.mastered} ✦</span>
                        {skill.atRisk > 0 && <span className="text-xs text-rose-400 block">{skill.atRisk} ⚠</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Activity breakdown */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-lg font-bold text-white mb-4">Most Common Activities</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Quizzes taken', value: quizCount, icon: '⚡', color: '#00CED1' },
                  { label: 'Assessments', value: assessmentCount, icon: '📊', color: '#A78BFA' },
                  { label: 'Total interactions', value: totalAssessments, icon: '✦', color: '#4ADE80' },
                ].map(a => (
                  <div key={a.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <div className="text-2xl font-black" style={{ color: a.color }}>{a.value}</div>
                    <div className="text-[10px] text-white/20 mt-1">{a.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Student roster */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-5 py-4 border-b border-white/5">
                <h2 className="text-sm font-bold text-white">Students ({totalStudents})</h2>
              </div>
              {!studentData.length ? (
                <p className="text-white/20 text-sm p-5 text-center">No students yet. Send an invite.</p>
              ) : (
                <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                  {studentData.map(s => (
                    <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: s.avg !== null ? (s.avg >= 80 ? 'rgba(74,222,128,0.15)' : s.avg >= 40 ? 'rgba(0,206,209,0.15)' : 'rgba(251,113,133,0.15)') : 'rgba(255,255,255,0.05)',
                                   color: s.avg !== null ? (s.avg >= 80 ? '#4ADE80' : s.avg >= 40 ? '#00CED1' : '#FB7185') : '#334155' }}>
                          {s.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{s.profiles?.full_name || s.profiles?.email}</p>
                          <p className="text-[10px] text-white/20">{s.assessed} skills assessed · {s.mastered} mastered</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {s.avg !== null ? (
                          <span className="text-sm font-black" style={{ color: s.avg >= 80 ? '#4ADE80' : s.avg >= 40 ? '#00CED1' : '#FB7185' }}>
                            {s.avg}%
                          </span>
                        ) : (
                          <span className="text-xs text-white/15">—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick insights */}
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(0,206,209,0.08), rgba(167,139,250,0.08))', border: '1px solid rgba(0,206,209,0.12)' }}>
              <h3 className="text-sm font-bold text-white mb-3">Quick Insights</h3>
              <div className="space-y-3 text-xs text-white/60 leading-relaxed">
                {skillStats.length > 0 && skillStats[0].avg < 40 && (
                  <p><span className="text-rose-400 font-bold">Weakest skill:</span> {skillStats[0].name} at {skillStats[0].avg}% avg. Consider additional instruction.</p>
                )}
                {skillStats.length > 0 && skillStats[skillStats.length - 1].avg >= 70 && (
                  <p><span className="text-emerald-400 font-bold">Strongest skill:</span> {skillStats[skillStats.length - 1].name} at {skillStats[skillStats.length - 1].avg}% avg.</p>
                )}
                {atRiskStudents.length > 0 && (
                  <p><span className="text-rose-400 font-bold">{atRiskStudents.length} student{atRiskStudents.length > 1 ? 's' : ''}</span> below 40% average. May need targeted support.</p>
                )}
                {implicitSkills.length > 0 && (
                  <p><span className="text-purple-300 font-bold">{implicitSkills.length} transferable skills</span> mapped from your syllabus — critical thinking, communication, collaboration.</p>
                )}
              </div>
            </div>

            {/* Manage */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-bold text-white mb-3">Manage</h3>
              <div className="space-y-2">
                <Link href={`/courses/${courseId}/skills`}
                  className="block w-full rounded-xl px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  Edit Skill Framework →
                </Link>
              </div>
            </div>

            {/* Governance */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Governed</span>
              </div>
              <p className="text-[10px] text-white/20 leading-relaxed">
                All student assessments pass through fairness, confidence, and privacy constraints. No student data is shared between students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
