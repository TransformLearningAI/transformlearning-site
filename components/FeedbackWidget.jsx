'use client'

import { useState } from 'react'

export default function FeedbackWidget({ page = 'unknown' }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const reset = () => {
    setRating(0)
    setHoverRating(0)
    setComment('')
    setName('')
    setEmail('')
    setStatus('idle')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return
    setStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || null, email: email.trim() || null, rating, comment: comment.trim() || null, page }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
      setTimeout(() => {
        setOpen(false)
        reset()
      }, 2000)
    } catch {
      setStatus('error')
    }
  }

  const btnStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#0C1F3F',
    color: '#fff',
    border: 'none',
    borderRadius: '24px',
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(12,31,63,0.3)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  }

  const panelStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 9999,
    width: '340px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 40px rgba(12,31,63,0.18)',
    border: '1px solid #e5e7eb',
    padding: '20px',
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={btnStyle}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(12,31,63,0.4)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(12,31,63,0.3)' }}
        aria-label="Open feedback form"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Feedback
      </button>
    )
  }

  if (status === 'sent') {
    return (
      <div style={panelStyle}>
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>&#10003;</div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#0C1F3F', margin: 0 }}>Thank you!</p>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Your feedback has been sent.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0C1F3F' }}>Send Feedback</h3>
        <button
          onClick={() => { setOpen(false); reset() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9CA3AF', fontSize: '18px', lineHeight: 1 }}
          aria-label="Close feedback form"
        >
          &#10005;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Star rating */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            Rating <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '28px',
                  padding: '0 2px',
                  color: (hoverRating || rating) >= star ? '#F59E0B' : '#D1D5DB',
                  transition: 'color 0.1s ease, transform 0.1s ease',
                  transform: hoverRating >= star ? 'scale(1.15)' : 'scale(1)',
                }}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                &#9733;
              </button>
            ))}
          </div>
          {status !== 'idle' && !rating && (
            <p style={{ fontSize: '11px', color: '#EF4444', margin: '4px 0 0' }}>Please select a rating</p>
          )}
        </div>

        {/* Comment */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think? What could be better?"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Name */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Optional"
            style={inputStyle}
          />
        </div>

        {status === 'error' && (
          <p style={{ fontSize: '12px', color: '#EF4444', margin: '0 0 12px' }}>Something went wrong. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={!rating || status === 'sending'}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: !rating ? '#D1D5DB' : '#00A8A8',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: !rating ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s ease',
            opacity: status === 'sending' ? 0.7 : 1,
          }}
        >
          {status === 'sending' ? 'Sending...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}
