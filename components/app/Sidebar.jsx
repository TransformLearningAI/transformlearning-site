'use client'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const FACULTY_LINKS = [
  { href: '/courses', label: 'My Courses', icon: '◫' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
]

const STUDENT_LINKS = [
  { href: '/my-progress', label: 'My Progress', icon: '◈' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
]

export default function Sidebar({ profile, open, onClose }) {
  const pathname = usePathname()
  const router = useRouter()
  const links = profile.role === 'faculty' ? FACULTY_LINKS : STUDENT_LINKS

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col bg-navy transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
               style={{ background: '#00A8A8' }}>
            <span className="text-white font-bold text-sm">TL</span>
          </div>
          <span className="text-white font-semibold text-sm leading-tight">Transform<br/>Learning</span>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href)
          return (
            <a key={href} href={href}
               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                 active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
               }`}>
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </a>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-4 py-4 border-t border-white/10">
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 w-full transition-all">
          <span className="text-base w-5 text-center">→</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
