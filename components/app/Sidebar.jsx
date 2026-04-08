'use client'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const QUOTES = [
  '"Night owl mode: Activated."',
  '"Reviewing the wins of the day."',
  '"Small steps, big arrivals."',
  '"Building momentum."',
  '"Every gap closed is a win."',
  '"Focus mode: engaged."',
  '"The path forward is clear."',
  '"Progress over perfection."',
]

function ArrivalLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L4 21H9L12 14L15 21H20L12 3Z" fill="currentColor" />
    </svg>
  )
}

function LevelBadge({ xp = 0 }) {
  const level = Math.min(10, Math.floor(xp / 500) + 1)
  const titles = ['Novice', 'Explorer', 'Learner', 'Scholar', 'Practitioner', 'Achiever', 'Expert', 'Master', 'Sage', 'Luminary']
  const progress = ((xp % 500) / 500) * 100
  return (
    <div className="mt-1">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-amber-400">Level {level}</span>
        <span className="text-[10px] text-white/65">{titles[level - 1]}</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
             style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default function Sidebar({ profile, enrollments = [], open, onClose, theme }) {
  const pathname = usePathname()
  const router = useRouter()
  const [quote, setQuote] = useState('')

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  }, [])

  const isFaculty = profile.role === 'faculty'

  const mainNav = isFaculty ? [
    { href: '/courses', label: 'My Courses', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
    )},
    { href: '/analytics', label: 'Analytics', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 14V9M6 14V6M10 14V4M14 14V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    )},
    { href: '/settings', label: 'Settings', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
    )},
  ] : [
    { href: '/my-progress', label: 'Skill Mapping', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
    )},
    { href: '/learn', label: 'Learn', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4l6-2 6 2v8l-6 2-6-2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6v8" stroke="currentColor" strokeWidth="1.3"/></svg>
    )},
    { href: '/study-planner', label: 'Study Planner', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6h12M6 2v12" stroke="currentColor" strokeWidth="1.3"/></svg>
    )},
    { href: '/sources', label: 'Source Library', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 2h4l2 2h4a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
    )},
  ]

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
           style={{ background: '#0D1117' }}>

      {/* User profile */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
               style={{ background: theme?.accent || '#0891B2' }}>
            {profile.full_name?.[0]?.toUpperCase() ?? profile.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{profile.full_name || profile.email}</p>
            {!isFaculty && <LevelBadge xp={profile.xp || 0} />}
            {isFaculty && <p className="text-[10px] text-white/65 uppercase tracking-wider">Faculty</p>}
          </div>
          <button onClick={onClose} className="lg:hidden text-white/65 hover:text-white p-1" aria-label="Close sidebar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Motivational quote */}
        {!isFaculty && quote && (
          <div className="mt-3 px-3 py-2 rounded-lg text-[11px] text-white/50 italic"
               style={{ background: 'rgba(255,255,255,0.06)' }}>
            {quote}
          </div>
        )}
      </div>

      {/* Main nav */}
      <div className="px-3 flex-1">
        <p className="px-3 text-[10px] font-bold text-white/60 uppercase tracking-[0.12em] mb-2">Main</p>
        <nav className="space-y-0.5" role="navigation" aria-label="Main navigation">
          {mainNav.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <a key={href} href={href}
                 className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                   active
                     ? 'text-white'
                     : 'text-white/50 hover:text-white hover:bg-white/5'
                 }`}
                 style={active ? { background: `${theme?.accent || '#00CED1'}20` } : undefined}>
                <span className="w-5 flex items-center justify-center flex-shrink-0">{icon}</span>
                {label}
              </a>
            )
          })}
        </nav>

        {/* Classes / Enrollments */}
        {!isFaculty && enrollments.length > 0 && (
          <div className="mt-6">
            <p className="px-3 text-[10px] font-bold text-white/60 uppercase tracking-[0.12em] mb-2">My Classes</p>
            <div className="space-y-0.5">
              {enrollments.map(e => {
                const active = pathname.includes(e.id)
                return (
                  <a key={e.id} href={`/my-progress/${e.id}`}
                     className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                       active ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                     }`}
                     style={active ? { background: `${theme?.accent || '#00CED1'}20` } : undefined}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{ background: '#D4603A' }}>
                      {e.courses?.course_code?.[0] || '?'}
                    </span>
                    <span className="truncate">{e.courses?.course_code || 'Course'}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: sign out + branding */}
      <div className="px-3 pb-4 space-y-2">
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 w-full transition-all">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 2H4a2 2 0 00-2 2v8a2 2 0 002 2h2M11 11l3-3-3-3M6 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Sign out
        </button>
        <div className="flex items-center gap-2 px-3 py-2 text-white/50">
          <ArrivalLogo size={16} />
          <span className="text-[11px] font-bold">arrival<span style={{ color: theme?.accent || '#00CED1' }}>.ai</span></span>
        </div>
      </div>
    </aside>
  )
}
