import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: courses } = await supabase
    .from('courses')
    .select('*, skills(count), enrollments(count)')
    .eq('faculty_id', user.id)
    .order('created_at', { ascending: false })

  const statusConfig = {
    pending:    { label: 'No syllabus', color: '#334155', glow: false },
    generating: { label: 'Mapping skills…', color: '#F59E0B', glow: true },
    ready:      { label: 'Review skills', color: '#A78BFA', glow: true },
    approved:   { label: 'Active', color: '#4ADE80', glow: false },
  }

  return (
    <div className="min-h-screen -m-6 lg:-m-8 px-8 py-8" style={{ background: '#0A0E1A' }}>
      {/* Nebula */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: '10%', right: '10%', background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: '10%', left: '20%', background: 'radial-gradient(circle, rgba(0,206,209,0.03) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">My Courses</h1>
            <p className="text-white/25 text-sm mt-1">Upload a syllabus. Watch the constellation form.</p>
          </div>
          <Link href="/courses/new"
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00CED1, #0891B2)' }}>
            + New Course
          </Link>
        </div>

        {!courses?.length ? (
          <div className="rounded-3xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-5xl mb-4 opacity-30">✦</div>
            <h3 className="font-bold text-white text-lg mb-2">No courses yet</h3>
            <p className="text-white/25 text-sm mb-8 max-w-sm mx-auto">
              Upload a syllabus and the AI will map every skill — explicit and implicit — into a constellation your students can navigate.
            </p>
            <Link href="/courses/new"
              className="inline-block px-6 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #00CED1, #0891B2)' }}>
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {courses.map(course => {
              const config = statusConfig[course.framework_status] || statusConfig.pending
              const skillCount = course.skills?.[0]?.count ?? 0
              const studentCount = course.enrollments?.[0]?.count ?? 0

              return (
                <Link key={course.id} href={`/courses/${course.id}`}
                  className="rounded-2xl p-6 block transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {course.course_code && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 mb-1">{course.course_code}</p>
                      )}
                      <h3 className="font-bold text-white text-lg leading-tight">{course.title}</h3>
                      {course.term && <p className="text-xs text-white/20 mt-1">{course.term}</p>}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1.5"
                      style={{ background: config.color + '15', color: config.color }}>
                      {config.glow && <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color, boxShadow: `0 0 6px ${config.color}` }} />}
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/20">
                    <span>{skillCount} skills mapped</span>
                    <span>{studentCount} student{studentCount !== 1 ? 's' : ''}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
