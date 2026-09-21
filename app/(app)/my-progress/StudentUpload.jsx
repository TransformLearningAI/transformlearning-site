'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  { label: 'Course syllabus', placeholder: 'Paste your syllabus here — the AI will map every skill and knowledge area...' },
  { label: 'Program guide', placeholder: 'Paste your degree program description, requirements, and course sequence...' },
  { label: 'Course list', placeholder: 'List the courses in your major or program, one per line...' },
  { label: 'Degree requirements', placeholder: 'Paste the requirements from your college catalog...' },
]

const SAMPLE_SYLLABUS = `Introduction to Human Physiology — BIOL 2410
Fall 2026 | State University | Dr. Sarah Mitchell

Course Description:
This course provides a comprehensive study of the major organ systems of the human body, with emphasis on the mechanisms that maintain homeostasis. Topics include cellular physiology, membrane transport, neurophysiology, cardiovascular, respiratory, renal, endocrine, and gastrointestinal systems.

Learning Objectives:
Upon completion, students will be able to:
1. Explain cellular mechanisms including membrane potentials, signal transduction, and gene expression
2. Describe the structure and function of excitable tissues (nerve and muscle)
3. Analyze the regulation of cardiovascular function including cardiac output, blood pressure, and blood flow
4. Explain respiratory mechanics, gas exchange, and oxygen/CO2 transport
5. Describe renal filtration, reabsorption, secretion, and the regulation of body fluid composition
6. Integrate endocrine signaling with organ system regulation and homeostatic feedback loops
7. Apply systems thinking to predict physiological responses to perturbations
8. Design and interpret basic physiological experiments

Weekly Topics:
Week 1-2: Cell physiology, membrane transport, osmosis
Week 3-4: Neurophysiology — resting potential, action potentials, synaptic transmission
Week 5-6: Muscle physiology — skeletal, smooth, cardiac muscle
Week 7-8: Cardiovascular — cardiac cycle, hemodynamics, blood pressure regulation
Week 9-10: Respiratory — ventilation, gas exchange, oxygen transport
Week 11-12: Renal — nephron function, acid-base balance, fluid regulation
Week 13-14: Endocrine — hormones, feedback loops, metabolic regulation
Week 15: Integration and review

Assessment: Exams (60%), Lab reports (20%), Problem sets (10%), Participation (10%)`

export default function StudentUpload() {
  const router = useRouter()
  const [mode, setMode] = useState('text') // text | url | file | major
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [major, setMajor] = useState('')
  const [fileName, setFileName] = useState('')
  const [activeExample, setActiveExample] = useState(0)
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')

  async function handleTrySample() {
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/student-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Introduction to Human Physiology (Sample)',
          content: SAMPLE_SYLLABUS,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      router.push(`/my-progress/${data.enrollmentId}`)
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  async function handleMajorSubmit(e) {
    e.preventDefault()
    if (!major.trim()) return
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/student-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: major.trim(),
          content: `Undergraduate major: ${major.trim()}. Please infer all the core courses and skills a student in this major would develop over a typical 4-year program. Include both foundational subject-matter skills and transferable professional skills.`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      router.push(`/my-progress/${data.enrollmentId}`)
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setError('')

    if (file.type === 'application/pdf') {
      // Read as base64 and send to server for extraction
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        setContent(`__PDF_BASE64__${base64}`)
      }
      reader.readAsDataURL(file)
    } else {
      // Plain text, .docx treated as text, etc.
      const text = await file.text()
      setContent(text)
    }

    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/student-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || EXAMPLES[activeExample].label,
          content: mode === 'text' ? content : '',
          sourceUrl: mode === 'url' ? url : '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      // Redirect to the new enrollment
      router.push(`/my-progress/${data.enrollmentId}`)
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  return (
    <div className="space-y-4">
      {/* Quick start — try a sample */}
      <div className="bg-gradient-to-r from-[#0C1F3F] to-[#1a3560] rounded-2xl p-8 text-white">
        <h2 className="font-semibold text-lg mb-2">See how it works in 30 seconds</h2>
        <p className="text-white/60 text-sm mb-5">
          Don't have a syllabus handy? Try a sample — we'll map a real Human Physiology course so you can
          see exactly what the platform does. You can delete it and add your own courses anytime.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleTrySample} disabled={status === 'loading'}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 hover:opacity-90"
            style={{ background: '#00A8A8' }}>
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mapping skills…
              </span>
            ) : 'Try a Sample Syllabus →'}
          </button>
          <button onClick={() => setMode('major')}
            className="px-6 py-3 rounded-xl font-bold text-sm border border-white/20 hover:bg-white/10 transition-colors">
            Just Tell Us Your Major →
          </button>
        </div>
        {error && status === 'idle' && (
          <p className="text-red-300 text-sm mt-3">{error}</p>
        )}
      </div>

      {/* Tell us your major — expandable */}
      {mode === 'major' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="font-semibold text-navy text-lg mb-1">What's your major?</h2>
          <p className="text-sm text-gray-500 mb-4">
            Type your major and school (optional). The AI will build a skill map based on a typical program — you can refine it later.
          </p>
          <form onSubmit={handleMajorSubmit} className="flex gap-3">
            <input type="text" value={major} onChange={e => setMajor(e.target.value)}
              placeholder="e.g., Psychology at USF, Computer Science, Pre-Med"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#00A8A8]" />
            <button type="submit" disabled={status === 'loading' || !major.trim()}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
              style={{ background: '#00A8A8' }}>
              {status === 'loading' ? 'Mapping…' : 'Map It →'}
            </button>
          </form>
        </div>
      )}

    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <h2 className="font-semibold text-navy text-lg mb-1">Or upload your own</h2>
        <p className="text-sm text-gray-500">
          Upload a syllabus, program guide, course list, or degree requirements. The AI maps every
          skill so you can track your progress and close gaps.
        </p>
      </div>

      {/* Type tabs */}
      <div className="px-8 flex gap-2 mb-4">
        {EXAMPLES.map((ex, i) => (
          <button key={i} onClick={() => { setActiveExample(i); setContent('') }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeExample === i ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            {ex.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="px-8 pb-8">
        {/* Title */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Name this course or program
          </label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Calculus I, Biology Major, Pre-Med Requirements"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#00A8A8]" />
        </div>

        {/* Input mode toggle */}
        <div className="flex gap-2 mb-4">
          <button type="button" onClick={() => setMode('file')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              mode === 'file' ? 'bg-[#00A8A8] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
            Upload a file
          </button>
          <button type="button" onClick={() => setMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              mode === 'text' ? 'bg-[#00A8A8] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
            Paste text
          </button>
          <button type="button" onClick={() => setMode('url')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              mode === 'url' ? 'bg-[#00A8A8] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
            Link to a webpage
          </button>
        </div>

        {/* Content input */}
        {mode === 'major' ? null : mode === 'file' ? (
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#00A8A8] transition-colors cursor-pointer bg-gray-50">
              <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.rtf"
                onChange={handleFileChange} />
              {fileName ? (
                <div className="text-center">
                  <div className="text-2xl mb-2">📄</div>
                  <p className="text-sm font-medium text-navy">{fileName}</p>
                  <p className="text-xs text-gray-400 mt-1">Click to change file</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-2">📂</div>
                  <p className="text-sm font-medium text-gray-600">Drop a file here or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, Word, or text files — syllabi, program guides, requirements</p>
                </div>
              )}
            </label>
          </div>
        ) : mode === 'text' ? (
          <textarea value={content} onChange={e => setContent(e.target.value)}
            rows={8}
            placeholder={EXAMPLES[activeExample].placeholder}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#00A8A8] resize-none mb-4"
            required={mode === 'text'} />
        ) : (
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              URL to syllabus or program page
            </label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://your-school.edu/biology-major-requirements"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#00A8A8]"
              required={mode === 'url'} />
            <p className="text-xs text-gray-400 mt-1.5">
              Paste a link to any public webpage with your syllabus, program guide, or degree requirements.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm text-red-600 mb-4"
               style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={status === 'loading'}
          className="w-full py-3.5 rounded-lg font-bold text-sm text-white transition-all disabled:opacity-50"
          style={{ background: '#00A8A8' }}>
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mapping your skills…
            </span>
          ) : (
            'Map My Skills →'
          )}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          The AI will analyze your content and create a skill map in about 30 seconds.
          You can add more courses anytime.
        </p>
      </form>
    </div>
    </div>
  )
}
