'use client'
import { useState } from 'react'

export default function InviteStudentModal({ courseId }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  async function sendInvite(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    const res = await fetch(`/api/courses/${courseId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.error) setStatus({ type: 'error', msg: data.error })
    else { setStatus({ type: 'success', msg: `Invite sent to ${email}` }); setEmail('') }
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="px-5 py-2.5 rounded-xl font-bold text-sm text-white"
      style={{ background: '#00A8A8' }}>
      + Invite Student
    </button>
  )

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="font-bold text-navy text-lg mb-1">Invite a Student</h2>
        <p className="text-sm text-gray-500 mb-6">They'll receive an email with a link to join your course and create their account.</p>

        <form onSubmit={sendInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.1em] mb-2">Student Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal text-navy"
              placeholder="student@university.edu" autoFocus />
          </div>
          {status && (
            <p className={`text-sm ${status.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{status.msg}</p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={() => setOpen(false)}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-500 border border-gray-200">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60"
              style={{ background: '#00A8A8' }}>
              {loading ? 'Sending…' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
