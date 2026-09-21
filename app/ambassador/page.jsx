'use client'
import { useState } from 'react'

export default function AmbassadorPage() {
  const [name, setName] = useState('')
  const [generated, setGenerated] = useState(false)

  const base = 'https://www.transformlearning.ai/signup-student'
  const profileLink = `${base}?utm_id=Ambassador&utm_source=social+media&utm_campaign=${encodeURIComponent(name)}&utm_medium=profile`
  const storyLink = `${base}?utm_id=Ambassador&utm_source=social+media&utm_campaign=${encodeURIComponent(name)}&utm_medium=story`

  function copy(text) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#fff', padding: 'clamp(40px,8vw,80px) 28px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <p style={{ color: '#00A8A8', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Ambassador Program</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12 }}>
          Get Your <span style={{ color: '#00A8A8' }}>Tracking Links</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
          Enter your campaign name (first name + last initial, e.g., AshlieH) and we'll generate your personalized tracking links. Use these everywhere you share Transform Learning.
        </p>

        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setGenerated(false) }}
            placeholder="Your campaign name (e.g., AshlieH)"
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
              color: '#fff', fontSize: 16, outline: 'none', fontFamily: 'inherit',
            }}
          />
          <button
            onClick={() => name.trim() && setGenerated(true)}
            disabled={!name.trim()}
            style={{
              width: '100%', padding: 16, borderRadius: 12, border: 'none',
              background: name.trim() ? '#00A8A8' : '#333', color: '#fff',
              fontWeight: 700, fontSize: 15, cursor: name.trim() ? 'pointer' : 'default',
              marginTop: 12, opacity: name.trim() ? 1 : 0.5,
            }}
          >
            Generate My Links
          </button>
        </div>

        {generated && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <LinkBox
              label="Profile Link"
              description="Use this anywhere you permanently link Transform Learning from your bio or profile."
              link={profileLink}
              onCopy={() => copy(profileLink)}
            />
            <LinkBox
              label="Story Link"
              description="Use this whenever you share Transform Learning in your Stories or temporary posts."
              link={storyLink}
              onCopy={() => copy(storyLink)}
            />

            <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
              <p style={{ color: '#00A8A8', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Your Monthly Deliverables</p>
              <ul style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
                <li>1 feed post per month (Reel or TikTok preferred) — invite @TransformLearning.AI as collaborator</li>
                <li>At least 2 Instagram Stories per week featuring and tagging @TransformLearning.AI</li>
                <li>Use your <strong style={{ color: '#fff' }}>Story Link</strong> in Stories and your <strong style={{ color: '#fff' }}>Profile Link</strong> in your bio</li>
                <li>Keep your campaign name <strong style={{ color: '#fff' }}>{name}</strong> consistent every time</li>
              </ul>
            </div>

            <div style={{ padding: 24, background: 'rgba(0,168,168,0.08)', borderRadius: 12, border: '1px solid rgba(0,168,168,0.2)' }}>
              <p style={{ color: '#00A8A8', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Commission</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7 }}>
                You earn <strong style={{ color: '#00CED1' }}>20% of monthly revenue</strong> from every student who signs up through your link and upgrades to a paid plan. Commissions are calculated monthly and paid out within 30 days. Free signups are tracked too — when they upgrade, you get credit.
              </p>
            </div>
          </div>
        )}

        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, textAlign: 'center', marginTop: 40 }}>
          Questions? Email jeff@yourclassroom.ai
        </p>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
          <a href="/ambassador/faq" style={{ color: 'rgba(255,255,255,0.3)' }}>FAQ</a> &middot;{' '}
          <a href="/ambassador/community" style={{ color: 'rgba(255,255,255,0.3)' }}>Community</a> &middot;{' '}
          <a href="/ambassador/terms" style={{ color: 'rgba(255,255,255,0.3)' }}>Terms</a> &middot;{' '}
          <a href="/ambassador/join" style={{ color: 'rgba(255,255,255,0.3)' }}>Apply</a>
        </p>
        <p style={{ color: 'rgba(255,255,255,0.1)', fontSize: 10, textAlign: 'center', marginTop: 4 }}>
          By generating links, you agree to the <a href="/ambassador/terms" style={{ color: 'rgba(255,255,255,0.2)' }}>Ambassador Program Terms</a>.
        </p>
      </div>
    </div>
  )
}

function LinkBox({ label, description, link, onCopy }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
      <p style={{ color: '#00A8A8', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 12 }}>{description}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={link}
          readOnly
          style={{
            flex: 1, padding: '10px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)',
            color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'monospace', outline: 'none',
          }}
        />
        <button
          onClick={handleCopy}
          style={{
            padding: '10px 16px', borderRadius: 8, border: 'none',
            background: copied ? '#2E7D4F' : '#00A8A8', color: '#fff',
            fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
