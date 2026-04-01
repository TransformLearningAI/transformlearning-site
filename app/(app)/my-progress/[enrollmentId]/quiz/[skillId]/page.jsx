'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { proficiencyColor, proficiencyLabel } from '@/lib/utils/proficiency'
import Link from 'next/link'

export default function QuizPage() {
  const { enrollmentId, skillId } = useParams()
  const router = useRouter()
  const [step, setStep] = useState('loading') // loading | quiz | submitting | results
  const [questions, setQuestions] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [results, setResults] = useState(null)
  const [skillName, setSkillName] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`/api/skills/${skillId}`).then(r => r.json()),
      fetch('/api/assessments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, skillIds: [skillId] }),
      }).then(r => r.json()),
    ]).then(([skill, assessment]) => {
      setSkillName(skill.name)
      setQuestions(assessment.questions)
      setSessionId(assessment.sessionId)
      setStep('quiz')
    })
  }, [enrollmentId, skillId])

  async function submit() {
    setStep('submitting')
    const formattedAnswers = questions.map(q => ({ question_id: q.id, answer: answers[q.id] || '' }))
    const res = await fetch('/api/assessments/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answers: formattedAnswers }),
    })
    const data = await res.json()
    setResults(data.skill_scores?.[0])
    setStep('results')
  }

  const q = questions[current]
  const isLast = current === questions.length - 1

  if (step === 'loading') return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-10 h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 text-sm">Generating adaptive questions…</p>
    </div>
  )

  if (step === 'submitting') return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-10 h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 text-sm">Analyzing your answers…</p>
    </div>
  )

  if (step === 'results' && results) return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-4">Quiz Complete</p>
        <div className="text-6xl font-black mb-2" style={{ color: proficiencyColor(results.score) }}>
          {results.score}%
        </div>
        <p className="font-bold text-navy mb-2">{proficiencyLabel(results.score)}</p>
        <p className="text-sm text-gray-500 leading-relaxed">{results.evidence_summary}</p>
      </div>

      {results.question_feedback && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-navy mb-4">Question Feedback</h3>
          <div className="space-y-4">
            {results.question_feedback.map((fb, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-0.5 ${
                  fb.correct ? 'bg-green-500' : 'bg-red-400'
                }`}>
                  {fb.correct ? '✓' : '✗'}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{fb.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link href={`/my-progress/${enrollmentId}/chat/${skillId}`}
          className="flex-1 py-3 rounded-xl font-bold text-sm text-white text-center"
          style={{ background: '#0C1F3F' }}>
          Get Coaching on This Skill
        </Link>
        <Link href={`/my-progress/${enrollmentId}`}
          className="flex-1 py-3 rounded-xl font-bold text-sm text-navy text-center border border-gray-200">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )

  if (step === 'quiz' && q) return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/my-progress/${enrollmentId}/skill/${skillId}`} className="text-xs text-gray-400 hover:text-navy">
          ← {skillName}
        </Link>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%`, background: '#00A8A8' }} />
        </div>
        <span className="text-xs text-gray-400">{current + 1}/{questions.length}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-4">
          {q.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'} · {q.difficulty}
        </p>
        <p className="text-navy font-semibold text-lg leading-relaxed mb-6">{q.text}</p>

        {q.type === 'mcq' ? (
          <div className="space-y-3">
            {q.choices.map((choice, i) => (
              <button key={i} onClick={() => setAnswers(a => ({ ...a, [q.id]: choice }))}
                className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${
                  answers[q.id] === choice ? 'border-brand-teal font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
                style={answers[q.id] === choice ? { background: 'rgba(0,168,168,0.06)', color: '#0C1F3F' } : {}}>
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <textarea rows={4} placeholder="Type your answer here…"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal text-navy resize-none"
            value={answers[q.id] || ''}
            onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))} />
        )}

        <div className="flex justify-between mt-6">
          <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-navy disabled:opacity-0">← Back</button>
          {isLast ? (
            <button onClick={submit} disabled={!answers[q.id]}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40"
              style={{ background: '#4F8A5B' }}>
              Submit →
            </button>
          ) : (
            <button onClick={() => setCurrent(c => c + 1)} disabled={!answers[q.id]}
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
