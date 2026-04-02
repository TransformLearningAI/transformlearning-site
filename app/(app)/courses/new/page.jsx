'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCoursePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [courseId, setCourseId] = useState(null)
  const [form, setForm] = useState({ title: '', course_code: '', term: '' })
  const [syllabus, setSyllabus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

  async function createCourse(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setCourseId(data.id); setStep(2); setLoading(false)
  }

  async function uploadSyllabus(e) {
    e.preventDefault()
    if (!syllabus.trim()) { setError('Paste your syllabus text.'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/syllabi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId, syllabusText: syllabus }) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    router.push(`/courses/${courseId}/skills`)
  }

  return (
    <div className="min-h-screen -m-6 lg:-m-8 px-8 py-8 flex items-start justify-center" style={{ background: '#0A0E1A' }}>
      {/* Nebula */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: '5%', left: '60%', background: 'radial-gradient(circle, rgba(0,206,209,0.06) 0%, transparent 70%)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: '20%', left: '10%', background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl pt-8">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                n < step ? 'text-white' : n === step ? 'text-white' : 'text-white/20'
              }`} style={n <= step ? { background: n < step ? '#4ADE80' : 'linear-gradient(135deg, #00CED1, #0891B2)' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {n < step ? '✓' : n}
              </div>
              {n < 3 && <div className="w-12 h-px" style={{ background: n < step ? '#4ADE80' : 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
          <span className="text-[10px] text-white/20 uppercase tracking-wider ml-2">
            {step === 1 ? 'Course details' : 'Upload syllabus'}
          </span>
        </div>

        <h1 className="font-serif font-light text-white mb-2" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>
          {step === 1 ? 'Name the constellation.' : 'Feed the intelligence.'}
        </h1>
        <p className="text-white/25 text-sm mb-8">
          {step === 1
            ? 'Every course becomes a constellation of skills. Start with the basics.'
            : 'Paste your syllabus. Arrival\'s AI will map every explicit and implicit skill into stars your students can navigate.'}
        </p>

        {step === 1 && (
          <form onSubmit={createCourse} className="rounded-2xl p-8 space-y-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">Course Title *</label>
              <input type="text" value={form.title} onChange={set('title')} required
                className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/15" style={inputStyle}
                placeholder="Human Physiology" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">Course Code</label>
                <input type="text" value={form.course_code} onChange={set('course_code')}
                  className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/15" style={inputStyle}
                  placeholder="BSC3096" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">Term</label>
                <input type="text" value={form.term} onChange={set('term')}
                  className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/15" style={inputStyle}
                  placeholder="Fall 2025" />
              </div>
            </div>
            {error && <p className="text-sm" style={{ color: '#FB7185' }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-50 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #00CED1, #0891B2)' }}>
              {loading ? 'Creating…' : 'Continue →'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={uploadSyllabus} className="rounded-2xl p-8 space-y-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">Syllabus Text *</label>
              <textarea value={syllabus} onChange={e => setSyllabus(e.target.value)} rows={18} required
                className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/15 resize-none font-mono"
                style={inputStyle}
                placeholder="Paste your complete syllabus here — course description, learning objectives, weekly schedule, assignments, everything. The more detail, the brighter the constellation." />
            </div>
            {error && <p className="text-sm" style={{ color: '#FB7185' }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-50 transition-all hover:opacity-90"
              style={{ background: loading ? 'linear-gradient(135deg, #A78BFA, #7C3AED)' : 'linear-gradient(135deg, #00CED1, #0891B2)' }}>
              {loading ? '✦ AI is mapping your skills… this takes 30–60 seconds' : 'Generate Constellation →'}
            </button>
            {loading && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-white/30" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)' }}>
                  <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                  Identifying explicit knowledge and implicit skills…
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
