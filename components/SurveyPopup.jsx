'use client'
import { useState, useEffect } from 'react'

export default function SurveyPopup({ site, audienceOptions, featureOptions, delayMs = 30000 }) {
  const [show, setShow] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    rating: null,
    audience: '',
    features: [],
    comment: '',
  })

  useEffect(() => {
    if (sessionStorage.getItem(`survey-${site}`)) return
    const timer = setTimeout(() => setShow(true), delayMs)
    return () => clearTimeout(timer)
  }, [site, delayMs])

  function dismiss() {
    setShow(false)
    sessionStorage.setItem(`survey-${site}`, 'dismissed')
  }

  function toggleFeature(f) {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f],
    }))
  }

  async function handleSubmit() {
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site, ...form }),
      })
    } catch {}
    setSubmitted(true)
    sessionStorage.setItem(`survey-${site}`, 'submitted')
    setTimeout(dismiss, 3000)
  }

  if (!show) return null

  // ── Submitted thank you ──
  if (submitted) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[999] p-4">
        <div className="max-w-lg mx-auto bg-green-50 border border-green-200 rounded-2xl p-5 text-center shadow-xl">
          <p className="text-lg mb-1">🙏</p>
          <p className="font-bold text-green-800 text-sm">Thank you! Your feedback shapes what we build next.</p>
        </div>
      </div>
    )
  }

  // ── Bottom banner (not expanded) ──
  if (!expanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 animate-fade-up">
        <div className="max-w-lg mx-auto bg-gray-900 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4">
          <div className="flex-1">
            <p className="font-bold text-sm">Help us make this better</p>
            <p className="text-xs text-white/50">30-second feedback — your input directly shapes what we build next</p>
          </div>
          <button
            onClick={() => setExpanded(true)}
            className="px-4 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-100 shrink-0"
          >
            Sure →
          </button>
          <button onClick={dismiss} className="text-white/30 hover:text-white/60 text-lg shrink-0" aria-label="Close">
            ✕
          </button>
        </div>
      </div>
    )
  }

  // ── Expanded survey ──
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 animate-fade-up">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
          </p>
          <button onClick={dismiss} className="p-1 text-gray-300 hover:text-gray-500 text-sm" aria-label="Close">✕</button>
        </div>

        <div className="px-5 pb-5">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2.5">How useful is this site to you?</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setForm(f => ({ ...f, rating: n }))}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                              form.rating === n ? 'bg-blue-600 text-white scale-110' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}>
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                  <span>Not useful</span><span>Very useful</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Which best describes you?</p>
                <div className="flex flex-wrap gap-1.5">
                  {audienceOptions.map(a => (
                    <button key={a} onClick={() => setForm(f => ({ ...f, audience: a }))}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                              form.audience === a
                                ? 'bg-blue-50 border-blue-300 text-blue-700 border'
                                : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(2)} disabled={!form.rating}
                      className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-30">
                Next
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">What would you like to see?</p>
                <div className="flex flex-wrap gap-1.5">
                  {featureOptions.map(f => (
                    <button key={f} onClick={() => toggleFeature(f)}
                            className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                              form.features.includes(f) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Comments or questions?</p>
                <textarea
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Ideas, feedback, anything..."
                  rows={2}
                  maxLength={1000}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(1)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
                  Back
                </button>
                <button onClick={handleSubmit}
                        className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800">
                  Submit →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
