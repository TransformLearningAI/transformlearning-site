'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCoursePage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1=details, 2=syllabus
  const [courseId, setCourseId] = useState(null)
  const [form, setForm] = useState({ title: '', course_code: '', term: '', institution: '' })
  const [syllabus, setSyllabus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  async function createCourse(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setCourseId(data.id)
    setStep(2)
    setLoading(false)
  }

  async function uploadSyllabus(e) {
    e.preventDefault()
    if (!syllabus.trim()) { setError('Please paste your syllabus text.'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/syllabi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, syllabusText: syllabus }),
    })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    router.push(`/courses/${courseId}/skills`)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {[1,2,3].map(n => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                n < step ? 'text-white' : n === step ? 'text-white' : 'text-gray-400 bg-gray-100'
              }`} style={n <= step ? { background: '#00A8A8' } : {}}>
                {n < step ? '✓' : n}
              </div>
              {n < 3 && <div className={`w-12 h-0.5 ${n < step ? 'bg-brand-teal' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="text-xs text-gray-400 ml-2">
            {step === 1 ? 'Course details' : step === 2 ? 'Upload syllabus' : 'Review skills'}
          </span>
        </div>
        <h1 className="font-serif font-light text-navy" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>
          {step === 1 ? 'Create a course.' : 'Upload your syllabus.'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {step === 1
            ? 'Enter your course details to get started.'
            : 'Paste your syllabus text. Our AI will map every skill your course develops — explicit knowledge and implicit capabilities.'}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={createCourse} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.1em] mb-2">Course Title *</label>
              <input type="text" value={form.title} onChange={set('title')} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal text-navy"
                placeholder="Introduction to Psychology" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.1em] mb-2">Course Code</label>
              <input type="text" value={form.course_code} onChange={set('course_code')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal text-navy"
                placeholder="PSY 101" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.1em] mb-2">Term</label>
              <input type="text" value={form.term} onChange={set('term')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal text-navy"
                placeholder="Fall 2026" />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60"
            style={{ background: '#00A8A8' }}>
            {loading ? 'Creating…' : 'Continue →'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={uploadSyllabus} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.1em] mb-2">Syllabus Text *</label>
            <textarea
              value={syllabus} onChange={e => setSyllabus(e.target.value)} rows={16} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal text-navy font-mono resize-none"
              placeholder="Paste your complete syllabus here — course description, learning objectives, weekly schedule, assignments, everything. The more detail, the better the skill map." />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60"
            style={{ background: '#00A8A8' }}>
            {loading ? '🤖 AI is mapping your skills… (30–60 sec)' : 'Generate Skill Framework →'}
          </button>
        </form>
      )}
    </div>
  )
}
