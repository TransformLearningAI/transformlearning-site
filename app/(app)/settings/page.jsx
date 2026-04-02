import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const isFaculty = profile?.role === 'faculty'

  // Get stats for the account page
  let stats = {}
  if (isFaculty) {
    const { data: courses } = await supabase.from('courses').select('id').eq('faculty_id', user.id)
    const { data: enrollments } = await supabase.from('enrollments').select('id').in('course_id', (courses || []).map(c => c.id))
    stats = { courses: courses?.length || 0, students: enrollments?.length || 0 }
  } else {
    const { data: enrollments } = await supabase.from('enrollments').select('id, courses(title)').eq('student_id', user.id)
    const { data: scores } = await supabase.from('proficiency_scores').select('score').in('enrollment_id', (enrollments || []).map(e => e.id))
    const mastered = (scores || []).filter(s => s.score >= 80).length
    stats = { courses: enrollments?.length || 0, mastered, totalScores: scores?.length || 0 }
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
             style={{ background: isFaculty ? '#5A3E6B' : '#00A8A8' }}>
          {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy">{profile?.full_name || 'Your Account'}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: isFaculty ? 'rgba(90,62,107,0.08)' : 'rgba(0,168,168,0.08)',
                           color: isFaculty ? '#5A3E6B' : '#00A8A8' }}>
              {isFaculty ? 'Faculty' : 'Student'}
            </span>
            <span className="text-xs text-gray-400">{profile?.institution || ''}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={`grid ${isFaculty ? 'grid-cols-2' : 'grid-cols-3'} gap-4 mb-8`}>
        <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(12,31,63,0.06)' }}>
          <p className="text-3xl font-black text-navy">{stats.courses}</p>
          <p className="text-xs text-gray-400 mt-1">{isFaculty ? 'Courses Created' : 'Enrolled Courses'}</p>
        </div>
        {isFaculty ? (
          <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(12,31,63,0.06)' }}>
            <p className="text-3xl font-black text-navy">{stats.students}</p>
            <p className="text-xs text-gray-400 mt-1">Students Enrolled</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(12,31,63,0.06)' }}>
              <p className="text-3xl font-black" style={{ color: '#4F8A5B' }}>{stats.mastered}</p>
              <p className="text-xs text-gray-400 mt-1">Skills Mastered</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(12,31,63,0.06)' }}>
              <p className="text-3xl font-black" style={{ color: '#00A8A8' }}>{stats.totalScores}</p>
              <p className="text-xs text-gray-400 mt-1">Assessments Taken</p>
            </div>
          </>
        )}
      </div>

      {/* Account details */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(12,31,63,0.06)' }}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-navy">Account Details</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { label: 'Full Name', value: profile?.full_name || '—' },
            { label: 'Email', value: profile?.email },
            { label: 'Role', value: profile?.role },
            { label: 'Institution', value: profile?.institution || '—' },
            { label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <dt className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em]">{label}</dt>
              <dd className="text-sm text-navy font-medium capitalize">{value}</dd>
            </div>
          ))}
        </div>
      </div>

      {/* Governance info for students */}
      {!isFaculty && (
        <div className="mt-6 rounded-2xl p-6" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <div className="flex items-center gap-2 mb-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2l6 3v4c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V5l6-3z" stroke="#2D8B6F" strokeWidth="1.3" fill="none"/>
              <path d="M7 9l2 2 3-3.5" stroke="#2D8B6F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="font-bold text-sm" style={{ color: '#1B3A2D' }}>Your Data is Governed</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Every AI assessment of your work passes through Arrival's ethical orchestration layer.
            Fairness constraints, confidence thresholds, and privacy gates are enforced at every step.
            The system cannot act on uncertain predictions or produce inequitable outcomes.
            Your data is never shared with other students or used for purposes outside your learning.
          </p>
        </div>
      )}
    </div>
  )
}
