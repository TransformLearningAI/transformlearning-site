'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const { enrollmentId } = useParams()
  const router = useRouter()
  const [step, setStep] = useState('choose') // choose | quiz | processing | done
  const [questions, setQuestions] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [courseName, setCourseName] = useState('')

  useEffect(() => {
    fetch(`/api/enrollments/${enrollmentId}`)
      .then(r => r.json())
      .then(d => setCourseName(d.course_title || ''))
  }, [enrollmentId])

  async function startAssessment() {
    setLoading(true)
    const res = await fetch('/api/assessments/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId }),
    })
    const data = await res.json()
    setQuestions(data.questions)
    setSessionId(data.sessionId)
    setStep('quiz')
    setLoading(false)
  }

  function answerQuestion(qId, answer) {
    setAnswers(a => ({ ...a, [qId]: answer }))
  }

  async function submitQuiz() {
    setStep('processing')
    const formattedAnswers = questions.map(q => ({ question_id: q.id, answer: answers[q.id] || '' }))
    await fetch('/api/assessments/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answers: formattedAnswers }),
    })
    router.push(`/my-progress/${enrollmentId}`)
  }

  const q = questions[current]
  const isAnswered = q && answers[q.id]
  const isLast = current === questions.length - 1

  if (step === 'choose') return (
    <div className="max-w-2xl">
      <h1 className="font-serif font-light text-navy mb-2" style={{ fontSize: '40px', letterSpacing: '-0.02em' }}>
        Let's find your starting point.
      </h1>
      <p className="text-gray-500 mb-8">{courseName && `For ${courseName}. `}We'll map your current proficiency on every skill so we can show you exactly what to focus on.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <button onClick={startAssessment} disabled={loading}
          className="bg-white border-2 border-brand-teal rounded-2xl p-6 text-left hover:shadow-md transition-all group">
          <div className="text-2xl mb-3">◈</div>
          <h3 className="font-bold text-navy mb-2">Take a quick assessment</h3>
          <p className="text-sm text-gray-500">Answer a short set of questions about course topics. Takes 10–20 minutes. Most accurate for a fresh start.</p>
          <p className="text-xs font-bold text-brand-teal mt-4 group-hover:underline">
            {loading ? 'Generating questions…' : 'Start assessment →'}
          </p>
        </button>

        <button className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-md transition-all group opacity-60 cursor-not-allowed">
          <div className="text-2xl mb-3">↑</div>
          <h3 className="font-bold text-navy mb-2">Upload your work</h3>
          <p className="text-sm text-gray-500">Have prior work from this course? Upload essays, problem sets, or notes and we'll assess your skills from those.</p>
          <p className="text-xs font-bold text-gray-400 mt-4">Coming soon</p>
        </button>
      </div>
    </div>
  )

  if (step === 'processing') return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-12 h-12 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mb-6" />
      <h2 className="font-serif font-light text-navy text-2xl mb-2">Analyzing your responses…</h2>
      <p className="text-gray-500 text-sm">Building your personalized skill map. This takes about 15 seconds.</p>
    </div>
  )

  if (step === 'quiz' && q) return (
    <div className="max-w-2xl">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%`, background: '#00A8A8' }} />
        </div>
        <span className="text-xs text-gray-400">{current + 1} / {questions.length}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-4">
          {q.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'} · {q.difficulty}
        </p>
        <p className="text-navy font-semibold text-lg leading-relaxed mb-6">{q.text}</p>

        {q.type === 'mcq' ? (
          <div className="space-y-3">
            {q.choices.map((choice, i) => (
              <button key={i} onClick={() => answerQuestion(q.id, choice)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${
                  answers[q.id] === choice
                    ? 'border-brand-teal text-navy font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
                style={answers[q.id] === choice ? { background: 'rgba(0,168,168,0.06)' } : {}}>
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal text-navy resize-none"
            rows={4} placeholder="Type your answer here…"
            value={answers[q.id] || ''}
            onChange={e => answerQuestion(q.id, e.target.value)} />
        )}

        <div className="flex justify-between mt-6">
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-navy disabled:opacity-0">
            ← Back
          </button>
          {isLast ? (
            <button onClick={submitQuiz} disabled={!isAnswered}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40"
              style={{ background: '#4F8A5B' }}>
              Submit & See My Dashboard →
            </button>
          ) : (
            <button onClick={() => setCurrent(c => c + 1)} disabled={!isAnswered}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40"
              style={{ background: '#00A8A8' }}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return null
}
