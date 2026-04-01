import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: courses } = await supabase
    .from('courses')
    .select('*, enrollments(count)')
    .eq('faculty_id', user.id)
    .order('created_at', { ascending: false })

  const statusLabel = { pending: 'No syllabus', generating: 'Processing…', ready: 'Needs review', approved: 'Active' }
  const statusColor = { pending: '#9CA3AF', generating: '#F59E0B', ready: '#5A3E6B', approved: '#4F8A5B' }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif font-light text-navy" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>My Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Upload a syllabus to get started. Students see their progress — you see outcomes.</p>
        </div>
        <Link href="/courses/new"
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white"
          style={{ background: '#00A8A8' }}>
          + New Course
        </Link>
      </div>

      {!courses?.length ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="text-4xl mb-4">◫</div>
          <h3 className="font-semibold text-navy mb-2">No courses yet</h3>
          <p className="text-gray-500 text-sm mb-6">Upload a syllabus and Transform Learning will map every skill your course develops.</p>
          <Link href="/courses/new"
            className="inline-block px-6 py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: '#00A8A8' }}>
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <Link key={course.id} href={`/courses/${course.id}`}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all block">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {course.course_code && (
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400 mb-1">{course.course_code}</p>
                  )}
                  <h3 className="font-semibold text-navy text-base leading-tight">{course.title}</h3>
                  {course.term && <p className="text-xs text-gray-400 mt-1">{course.term}</p>}
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full ml-3 flex-shrink-0"
                  style={{ background: statusColor[course.framework_status] + '18', color: statusColor[course.framework_status] }}>
                  {statusLabel[course.framework_status]}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{course.enrollments?.[0]?.count ?? 0} students</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
