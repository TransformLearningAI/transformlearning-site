'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  { label: 'Course syllabus', placeholder: 'Paste your syllabus here — the AI will map every skill and knowledge area...' },
  { label: 'Program guide', placeholder: 'Paste your degree program description, requirements, and course sequence...' },
  { label: 'Course list', placeholder: 'List the courses in your major or program, one per line...' },
  { label: 'Degree requirements', placeholder: 'Paste the requirements from your college catalog...' },
]

export default function StudentUpload() {
  const router = useRouter()
  const [mode, setMode] = useState('text') // text | url | file
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [activeExample, setActiveExample] = useState(0)
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')

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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <h2 className="font-semibold text-navy text-lg mb-1">Map your learning</h2>
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
        {mode === 'file' ? (
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
  )
}
