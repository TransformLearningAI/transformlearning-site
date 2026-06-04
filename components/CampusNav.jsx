'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/campus-transformation', label: 'Overview' },
  { href: '/campus-transformation/about', label: 'About Us' },
  { href: '/campus-transformation/process', label: 'Our Process' },
  { href: '/campus-transformation/cases', label: 'Case Studies' },
  { href: '/campus-transformation/blog', label: 'Blog' },
  { href: '/campus-transformation/inquiry', label: 'Start a Conversation' },
]

export default function CampusNav() {
  const pathname = usePathname()

  return (
    <div className="border-b" style={{ borderColor: '#DDE5EF', background: 'rgba(244,247,251,0.8)', backdropFilter: 'blur(10px)' }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 shrink-0 mr-2" title="Back to Transform Learning">
          ← TL
        </Link>
        <Link href="/campus-transformation" className="flex items-center gap-1.5 shrink-0 mr-4">
          <span className="text-sm font-bold" style={{ color: '#00A8A8' }}>Campus Transformation</span>
        </Link>
        {links.map(l => {
          const active = pathname === l.href || (l.href.includes('/blog') && pathname.startsWith(l.href))
          return (
            <Link key={l.href} href={l.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                    active ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}>
              {l.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
