'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function CourseNav({ courseId }) {
  const pathname = usePathname()
  const tabs = [
    { href: `/courses/${courseId}`, label: 'Overview' },
    { href: `/courses/${courseId}/skills`, label: 'Skills' },
  ]
  return (
    <div className="flex gap-1 mb-6 border-b border-gray-200">
      {tabs.map(tab => {
        const active = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active ? 'border-brand-teal text-navy' : 'border-transparent text-gray-400 hover:text-navy'
            }`}>
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
