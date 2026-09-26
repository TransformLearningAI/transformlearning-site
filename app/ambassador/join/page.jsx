'use client'
import { useState } from 'react'
import { track } from '@vercel/analytics'

export default function JoinAmbassadorPage() {
  const [form, setForm] = useState({
    name: '', email: '', school: '', major: '', year: '',
    instagram: '', tiktok: '', followers: '', why: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/ambassador-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      track('ambassador_apply', { school: form.school })
      setSubmitted(true)
    } catch (err) {}
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
    color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <div style={{ maxWidth: 500, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, marginBottom: 16 }}>Application received!</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7 }}>
            We'll review your application and get back to you within a few days. Keep an eye on your email at <strong style={{ color: '#00A8A8' }}>{form.email}</strong>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#fff' }}>
      <div style={{ padding: 'clamp(40px,8vw,80px) 28px 40px', textAlign: 'center' }}>
        <p style={{ color: '#00A8A8', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Ambassador Program</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1, maxWidth: 600, margin: '0 auto 16px' }}>
          Help students study <span style={{ color: '#00A8A8' }}>smarter</span>. Get paid for it.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Join the Transform Learning Ambassador Program. Share a free AI study tool with your audience, help college students improve their learning, and earn 20% commission on every paid signup you refer.
        </p>
      </div>

      {/* What you get */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
          {[
            { icon: '&#128176;', title: '20% Commission', desc: 'On every paid signup you refer — for as long as they subscribe' },
            { icon: '&#128279;', title: 'Personal Tracking Links', desc: 'Unique links that track every signup back to you' },
            { icon: '&#127775;', title: 'Real Resume Builder', desc: 'Content creation + brand partnership experience' },
            { icon: '&#129309;', title: 'Help Real Students', desc: 'Share a tool that actually improves learning, not shortcuts' },
          ].map((item, i) => (
            <div key={i} style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* What we ask */}
        <div style={{ padding: 20, background: 'rgba(0,168,168,0.06)', borderRadius: 12, border: '1px solid rgba(0,168,168,0.15)', marginBottom: 32 }}>
          <p style={{ color: '#00A8A8', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What We Ask</p>
          <ul style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
            <li>1 feed post per month (Reel or TikTok preferred)</li>
            <li>At least 2 Instagram Stories per week tagging @TransformLearning.AI</li>
            <li>Show the platform in a way that feels natural to you and your audience</li>
          </ul>
        </div>

        {/* Application form */}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 300, marginBottom: 16, textAlign: 'center' }}>Apply Now</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="text" value={form.name} onChange={set('name')} required placeholder="Your name" style={inputStyle} />
          <input type="email" value={form.email} onChange={set('email')} required placeholder="Email" style={inputStyle} />
          <input type="text" value={form.school} onChange={set('school')} required placeholder="School / University" style={inputStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input type="text" value={form.major} onChange={set('major')} placeholder="Major (optional)" style={inputStyle} />
            <select value={form.year} onChange={set('year')} style={{ ...inputStyle, color: form.year ? '#fff' : 'rgba(255,255,255,0.25)' }}>
              <option value="">Year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
              <option value="Recent Grad">Recent Grad</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input type="text" value={form.instagram} onChange={set('instagram')} placeholder="Instagram handle" style={inputStyle} />
            <input type="text" value={form.tiktok} onChange={set('tiktok')} placeholder="TikTok handle (optional)" style={inputStyle} />
          </div>
          <select value={form.followers} onChange={set('followers')} style={{ ...inputStyle, color: form.followers ? '#fff' : 'rgba(255,255,255,0.25)' }}>
            <option value="">Total social media following</option>
            <option value="Under 500">Under 500</option>
            <option value="500-1000">500 - 1,000</option>
            <option value="1000-5000">1,000 - 5,000</option>
            <option value="5000-10000">5,000 - 10,000</option>
            <option value="10000+">10,000+</option>
          </select>
          <textarea value={form.why} onChange={set('why')} rows={3} placeholder="Why do you want to be an ambassador? How would you share Transform Learning with your audience?" style={{ ...inputStyle, resize: 'vertical' }} />

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 16, borderRadius: 12, border: 'none', background: '#00A8A8', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 8, opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Submitting...' : 'Apply to Be an Ambassador'}
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, textAlign: 'center', marginTop: 16 }}>
          Already an ambassador? <a href="/ambassador" style={{ color: '#00A8A8' }}>Get your tracking links</a> &middot;{' '}
          <a href="/ambassador/faq" style={{ color: 'rgba(255,255,255,0.3)' }}>FAQ</a> &middot;{' '}
          <a href="/ambassador/community" style={{ color: 'rgba(255,255,255,0.3)' }}>Community</a> &middot;{' '}
          <a href="/ambassador/terms" style={{ color: 'rgba(255,255,255,0.3)' }}>Terms</a>
        </p>
        <p style={{ color: 'rgba(255,255,255,0.1)', fontSize: 10, textAlign: 'center', marginTop: 8 }}>
          Must be 16+ to participate. Applicants under 18 require <a href="/ambassador/terms" style={{ color: 'rgba(255,255,255,0.2)' }}>parental consent</a>.
        </p>
      </div>
    </div>
  )
}
