'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LearnPage() {
  const router = useRouter()
  const [enrollments, setEnrollments] = useState(null)

  useEffect(() => {
    fetch('/api/enrollments/mine')
      .then(r => r.ok ? r.json() : { enrollments: [] })
      .then(data => {
        const list = data.enrollments || []
        setEnrollments(list)
        if (list.length === 1) {
          router.push(`/my-progress/${list[0].id}`)
        }
      })
      .catch(() => setEnrollments([]))
  }, [router])

  if (!enrollments) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (enrollments.length === 0) return (
    <div className="text-center py-24">
      <h2 className="text-xl font-bold text-navy mb-2">No courses yet</h2>
      <p className="text-sm text-gray-400">You'll see your courses here once an instructor invites you.</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">My Courses</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrollments.map(e => (
          <a key={e.id} href={`/my-progress/${e.id}`}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all block">
            <p className="text-xs text-gray-400 mb-1">{e.courses?.course_code}</p>
            <h3 className="font-bold text-navy mb-2">{e.courses?.title}</h3>
            <p className="text-xs text-gray-400">{e.courses?.term}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
