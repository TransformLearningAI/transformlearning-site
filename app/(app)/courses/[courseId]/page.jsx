import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CourseNav from '@/components/faculty/CourseNav'
import InviteStudentModal from '@/components/faculty/InviteStudentModal'
import CohortChart from '@/components/faculty/CohortChart'

export default async function CourseDetailPage({ params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: course } = await supabase
    .from('courses')
    .select(`*, skills(*), enrollments(id, onboarding_status, profiles(full_name, email))`)
    .eq('id', params.courseId)
    .eq('faculty_id', user.id)
    .single()

  if (!course) redirect('/courses')

  // Get proficiency scores for all enrollments
  const enrollmentIds = course.enrollments?.map(e => e.id) || []
  const { data: scores } = enrollmentIds.length ? await supabase
    .from('proficiency_scores')
    .select('enrollment_id, skill_id, score')
    .in('enrollment_id', enrollmentIds) : { data: [] }

  const atRiskCount = enrollmentIds.filter(id => {
    const studentScores = (scores || []).filter(s => s.enrollment_id === id)
    if (!studentScores.length) return false
    const avg = studentScores.reduce((sum, s) => sum + s.score, 0) / studentScores.length
    return avg < 51
  }).length

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/courses" className="text-xs text-gray-400 hover:text-navy mb-2 block">← Courses</Link>
          <h1 className="font-serif font-light text-navy" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>{course.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            {course.course_code && <span className="text-xs text-gray-400 font-bold">{course.course_code}</span>}
            {course.term && <span className="text-xs text-gray-400">{course.term}</span>}
          </div>
        </div>
        <InviteStudentModal courseId={params.courseId} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Students', value: course.enrollments?.length ?? 0, color: '#0C1F3F' },
          { label: 'Skills mapped', value: course.skills?.filter(s => s.is_approved).length ?? 0, color: '#00A8A8' },
          { label: 'Onboarded', value: course.enrollments?.filter(e => e.onboarding_status === 'complete').length ?? 0, color: '#4F8A5B' },
          { label: 'At-risk', value: atRiskCount, color: atRiskCount > 0 ? '#FF6B4A' : '#4F8A5B' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-2">{stat.label}</p>
            <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Cohort chart */}
      {scores?.length > 0 && course.skills?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="font-bold text-navy mb-4">Cohort Proficiency by Skill</h2>
          <CohortChart skills={course.skills.filter(s => s.is_approved)} scores={scores} />
        </div>
      )}

      {/* Student roster */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-navy mb-4">Students</h2>
        {!course.enrollments?.length ? (
          <p className="text-gray-400 text-sm py-8 text-center">No students enrolled yet. Invite them above.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {course.enrollments.map(enrollment => (
              <div key={enrollment.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy text-sm">{enrollment.profiles?.full_name || enrollment.profiles?.email}</p>
                  <p className="text-xs text-gray-400">{enrollment.profiles?.email}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  enrollment.onboarding_status === 'complete' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {enrollment.onboarding_status === 'complete' ? 'Active' : 'Onboarding'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
