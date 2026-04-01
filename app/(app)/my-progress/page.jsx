import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function MyProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, onboarding_status, courses(title, course_code, term, faculty_id, profiles(full_name))')
    .eq('student_id', user.id)
    .order('enrolled_at', { ascending: false })

  if (enrollments?.length === 1) {
    const e = enrollments[0]
    if (e.onboarding_status !== 'complete') {
      return (
        <meta httpEquiv="refresh" content={`0;url=/my-progress/${e.id}/onboarding`} />
      )
    }
    return (
      <meta httpEquiv="refresh" content={`0;url=/my-progress/${e.id}`} />
    )
  }

  return (
    <div>
      <h1 className="font-serif font-light text-navy mb-6" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>My Courses</h1>
      {!enrollments?.length ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="text-4xl mb-4">◈</div>
          <h3 className="font-semibold text-navy mb-2">No courses yet</h3>
          <p className="text-gray-500 text-sm">Ask your instructor to send you an invite link.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(e => (
            <Link key={e.id}
              href={e.onboarding_status === 'complete' ? `/my-progress/${e.id}` : `/my-progress/${e.id}/onboarding`}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all block">
              {e.courses.course_code && (
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400 mb-1">{e.courses.course_code}</p>
              )}
              <h3 className="font-semibold text-navy">{e.courses.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{e.courses.term}</p>
              <span className={`inline-block mt-3 text-xs font-bold px-2.5 py-1 rounded-full ${
                e.onboarding_status === 'complete' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
              }`}>
                {e.onboarding_status === 'complete' ? 'Active' : 'Complete setup →'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
