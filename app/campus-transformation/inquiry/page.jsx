'use client'
import { useState } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: '', title: '', email: '', phone: '',
    institution: '', location: '', role: '',
    enrollment: '', situation: '', timeline: '',
    message: '',
  })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.institution) return
    setSending(true)
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: 'campus-transformation-inquiry',
          rating: 5,
          audience: form.role,
          features: [form.situation, form.timeline],
          comment: `CAMPUS INQUIRY\n\nName: ${form.name}\nTitle: ${form.title}\nEmail: ${form.email}\nPhone: ${form.phone}\nInstitution: ${form.institution}\nLocation: ${form.location}\nRole: ${form.role}\nEnrollment: ${form.enrollment}\nSituation: ${form.situation}\nTimeline: ${form.timeline}\n\nMessage:\n${form.message}`,
        }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
    setSending(false)
  }

  return (
    <>
      <section className="py-20 lg:py-28" style={{ background: '#0A0A0A' }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: '#00A8A8' }}>
              Start a Conversation
            </p>
            <h1 className="font-serif font-light text-white mb-6"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              Every transformation starts<br />
              <span style={{ color: '#00A8A8' }}>with a conversation.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl leading-relaxed">
              Tell us about your campus. The first conversation is free, confidential,
              and comes with no obligation. We&rsquo;ll listen before we propose anything.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          {status === 'success' ? (
            <ScrollReveal>
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🤝</p>
                <h2 className="text-2xl font-bold mb-3" style={{ color: '#0C1F3F' }}>Thank you.</h2>
                <p className="text-brand-gray mb-2">We&rsquo;ve received your inquiry and will be in touch within 48 hours.</p>
                <p className="text-sm text-brand-gray">All conversations are confidential.</p>
                <p className="text-sm mt-6">
                  <a href="mailto:jeff@transformlearning.ai" style={{ color: '#00A8A8' }}>
                    jeff@transformlearning.ai
                  </a>
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800">
                  🔒 All information is confidential. We will not contact your institution or board without your permission.
                </div>

                {/* Contact Info */}
                <div>
                  <p className="text-sm font-bold mb-3" style={{ color: '#0C1F3F' }}>About You</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Your name *" required value={form.name}
                           onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                           className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
                    <input type="text" placeholder="Your title" value={form.title}
                           onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                           className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
                    <input type="email" placeholder="Email *" required value={form.email}
                           onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                           className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
                    <input type="tel" placeholder="Phone (optional)" value={form.phone}
                           onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                           className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
                  </div>
                </div>

                {/* Institution Info */}
                <div>
                  <p className="text-sm font-bold mb-3" style={{ color: '#0C1F3F' }}>About the Institution</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Institution name *" required value={form.institution}
                           onChange={e => setForm(f => ({ ...f, institution: e.target.value }))}
                           className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
                    <input type="text" placeholder="City, State" value={form.location}
                           onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                           className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                            className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500 text-gray-600" style={{ borderColor: '#DDE5EF' }}>
                      <option value="">Your relationship to the institution</option>
                      <option value="Board Member / Trustee">Board Member / Trustee</option>
                      <option value="President / Chancellor">President / Chancellor</option>
                      <option value="VP / Provost">VP / Provost</option>
                      <option value="CFO / Finance">CFO / Finance</option>
                      <option value="Faculty">Faculty</option>
                      <option value="Staff">Staff</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Municipal / Government">Municipal / Government</option>
                      <option value="Community Member">Community Member</option>
                      <option value="Investor / Foundation">Investor / Foundation</option>
                      <option value="Other">Other</option>
                    </select>

                    <select value={form.enrollment} onChange={e => setForm(f => ({ ...f, enrollment: e.target.value }))}
                            className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500 text-gray-600" style={{ borderColor: '#DDE5EF' }}>
                      <option value="">Approximate current enrollment</option>
                      <option value="Under 500">Under 500</option>
                      <option value="500-1,000">500 – 1,000</option>
                      <option value="1,000-2,500">1,000 – 2,500</option>
                      <option value="2,500-5,000">2,500 – 5,000</option>
                      <option value="5,000+">5,000+</option>
                      <option value="Already closed">Already closed</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <select value={form.situation} onChange={e => setForm(f => ({ ...f, situation: e.target.value }))}
                            className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500 text-gray-600" style={{ borderColor: '#DDE5EF' }}>
                      <option value="">Current situation</option>
                      <option value="Considering closure">Actively considering closure</option>
                      <option value="Financial distress">Under financial distress</option>
                      <option value="Enrollment declining">Enrollment declining significantly</option>
                      <option value="Already voted to close">Board has voted to close</option>
                      <option value="Already closed">Campus already closed</option>
                      <option value="Exploring alternatives">Exploring alternatives to closure</option>
                      <option value="Just curious">Just learning about options</option>
                    </select>

                    <select value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                            className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500 text-gray-600" style={{ borderColor: '#DDE5EF' }}>
                      <option value="">Timeline</option>
                      <option value="Urgent - months">Urgent — decision in months</option>
                      <option value="This year">Decision expected this year</option>
                      <option value="1-2 years">1-2 years out</option>
                      <option value="Planning ahead">Planning ahead</option>
                      <option value="Campus already closed">Campus already closed</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm font-bold mb-3" style={{ color: '#0C1F3F' }}>Tell us more</p>
                  <textarea value={form.message}
                            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                            placeholder="What's on your mind? What are you hoping for? What keeps you up at night about this? Anything you want us to know."
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500 resize-none"
                            style={{ borderColor: '#DDE5EF' }} />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-600">Something went wrong. Please try again or email jeff@transformlearning.ai directly.</p>
                )}

                <button type="submit" disabled={sending}
                        className="w-full py-4 rounded-xl text-white text-lg font-bold hover:opacity-90 disabled:opacity-50"
                        style={{ background: '#00A8A8' }}>
                  {sending ? 'Sending...' : 'Send — Free & Confidential'}
                </button>

                <p className="text-xs text-center text-brand-gray">
                  Or email directly: <a href="mailto:jeff@transformlearning.ai" style={{ color: '#00A8A8' }}>jeff@transformlearning.ai</a>
                  <br />All inquiries receive a response within 48 hours.
                </p>
              </form>
            </ScrollReveal>
          )}
        </div>
      </section>
    </>
  )
}
