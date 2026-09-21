'use client'
import { useState, useEffect } from 'react'

export default function AmbassadorAdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [payModal, setPayModal] = useState(null) // { code, name }
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('Venmo')
  const [payNotes, setPayNotes] = useState('')
  const [paying, setPaying] = useState(false)
  const [tab, setTab] = useState('overview') // overview | referrals | payments

  async function loadData(s) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/ambassador-admin?secret=${encodeURIComponent(s || secret)}`)
      const json = await res.json()
      if (json.error) { setError(json.error); setLoading(false); return }
      setData(json)
      setAuthed(true)
      sessionStorage.setItem('amb_secret', s || secret)
    } catch (err) {
      setError('Failed to load data')
    }
    setLoading(false)
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('amb_secret')
    if (saved) { setSecret(saved); loadData(saved) }
  }, [])

  async function recordPayment() {
    if (!payModal || !payAmount) return
    setPaying(true)
    try {
      const res = await fetch('/api/ambassador-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          ambassador_code: payModal.code,
          amount: parseFloat(payAmount),
          method: payMethod,
          notes: payNotes,
        }),
      })
      const json = await res.json()
      if (json.error) { alert(json.error); setPaying(false); return }
      setPayModal(null)
      setPayAmount('')
      setPayNotes('')
      loadData()
    } catch (err) {
      alert('Payment recording failed')
    }
    setPaying(false)
  }

  // Login screen
  if (!authed) {
    return (
      <div style={styles.page}>
        <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
          <p style={styles.label}>Ambassador Admin</p>
          <h1 style={styles.h1}>Admin Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>
            Enter your admin key to continue.
          </p>
          <form onSubmit={e => { e.preventDefault(); loadData() }}>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="Admin secret"
              style={styles.input}
            />
            <button type="submit" disabled={loading || !secret} style={{ ...styles.btn, width: '100%', marginTop: 12, opacity: loading ? 0.5 : 1 }}>
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    )
  }

  const { ambassadors = [], stats = [], referrals = [], payments = [] } = data || {}
  const totalSignups = referrals.length
  const totalPaidUsers = stats.reduce((s, r) => s + r.paid_users, 0)
  const totalRevenue = stats.reduce((s, r) => s + r.total_revenue, 0)
  const totalOwed = stats.reduce((s, r) => s + Math.max(0, r.commission_owed), 0)
  const totalPaid = payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0)

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={styles.label}>Ambassador Admin</p>
        <h1 style={styles.h1}>Dashboard</h1>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
          <Card label="Ambassadors" value={ambassadors.length} />
          <Card label="Total Signups" value={totalSignups} />
          <Card label="Paid Users" value={totalPaidUsers} />
          <Card label="Revenue" value={`$${totalRevenue.toFixed(2)}`} />
          <Card label="Commission Owed" value={`$${totalOwed.toFixed(2)}`} color="#FF6B6B" />
          <Card label="Total Paid Out" value={`$${totalPaid.toFixed(2)}`} color="#2E7D4F" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {['overview', 'referrals', 'payments'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t ? '#00A8A8' : 'rgba(255,255,255,0.06)',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
              fontWeight: 700, fontSize: 13, textTransform: 'capitalize',
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview tab — per-ambassador stats */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stats.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 40 }}>No referrals tracked yet.</p>}
            {stats.sort((a, b) => b.signups - a.signups).map(s => {
              const amb = ambassadors.find(a => a.full_name?.toLowerCase().replace(/\s+/g, '') === s.code.toLowerCase() || a.email?.split('@')[0] === s.code.toLowerCase())
              return (
                <div key={s.code} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{s.code}</p>
                      {amb && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{amb.email}</p>}
                    </div>
                    <button onClick={() => setPayModal({ code: s.code, name: s.code })} style={{ ...styles.btn, padding: '8px 16px', fontSize: 12 }}>
                      Record Payment
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, marginTop: 16 }}>
                    <MiniStat label="Signups" value={s.signups} />
                    <MiniStat label="Paid" value={s.paid_users} />
                    <MiniStat label="Revenue" value={`$${s.total_revenue.toFixed(2)}`} />
                    <MiniStat label="Owed" value={`$${Math.max(0, s.commission_owed).toFixed(2)}`} color={s.commission_owed > 0 ? '#FF6B6B' : '#2E7D4F'} />
                  </div>
                  {/* Recent referrals for this ambassador */}
                  {s.referrals.slice(0, 5).map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: i === 0 ? 12 : 0 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{r.student_name || r.student_email || 'Anonymous'}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{new Date(r.signup_date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )
            })}

            {/* Ambassadors with accounts but no referrals yet */}
            {ambassadors.filter(a => !stats.find(s =>
              s.code.toLowerCase() === a.full_name?.toLowerCase().replace(/\s+/g, '') ||
              s.code.toLowerCase() === a.email?.split('@')[0]
            )).map(a => (
              <div key={a.id} style={{ ...styles.card, opacity: 0.5 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{a.full_name || a.email}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{a.email} — 0 signups</p>
              </div>
            ))}
          </div>
        )}

        {/* Referrals tab — all signups */}
        {tab === 'referrals' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Ambassador</th>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Source</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No referrals yet</td></tr>
                )}
                {referrals.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={styles.td}>{new Date(r.signup_date).toLocaleDateString()}</td>
                    <td style={{ ...styles.td, color: '#00A8A8', fontWeight: 700 }}>{r.ambassador_code}</td>
                    <td style={styles.td}>{r.student_name || '—'}</td>
                    <td style={styles.td}>{r.student_email || '—'}</td>
                    <td style={styles.td}>{r.utm_medium || '—'}</td>
                    <td style={styles.td}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                        background: r.subscription_status === 'paid' ? 'rgba(46,125,79,0.2)' : 'rgba(255,255,255,0.06)',
                        color: r.subscription_status === 'paid' ? '#4ADE80' : 'rgba(255,255,255,0.4)',
                      }}>
                        {r.subscription_status || 'free'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments tab */}
        {tab === 'payments' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Ambassador</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Method</th>
                  <th style={styles.th}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No payments recorded yet</td></tr>
                )}
                {payments.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={styles.td}>{new Date(p.paid_at).toLocaleDateString()}</td>
                    <td style={{ ...styles.td, color: '#00A8A8', fontWeight: 700 }}>{p.ambassador_code}</td>
                    <td style={{ ...styles.td, color: '#4ADE80', fontWeight: 700 }}>${parseFloat(p.amount).toFixed(2)}</td>
                    <td style={styles.td}>{p.method || '—'}</td>
                    <td style={styles.td}>{p.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment modal */}
      {payModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}
          onClick={() => setPayModal(null)}>
          <div style={{ background: '#141a2a', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 300, color: '#fff', margin: '0 0 4px' }}>Record Payment</h2>
            <p style={{ color: '#00A8A8', fontSize: 13, fontWeight: 700, marginBottom: 20 }}>{payModal.code}</p>

            <label style={styles.fieldLabel}>Amount ($)</label>
            <input type="number" step="0.01" value={payAmount} onChange={e => setPayAmount(e.target.value)}
              placeholder="0.00" style={{ ...styles.input, marginBottom: 12 }} />

            <label style={styles.fieldLabel}>Method</label>
            <select value={payMethod} onChange={e => setPayMethod(e.target.value)}
              style={{ ...styles.input, marginBottom: 12 }}>
              <option value="Venmo">Venmo</option>
              <option value="PayPal">PayPal</option>
              <option value="Zelle">Zelle</option>
              <option value="CashApp">CashApp</option>
              <option value="Check">Check</option>
              <option value="Other">Other</option>
            </select>

            <label style={styles.fieldLabel}>Notes (optional)</label>
            <input type="text" value={payNotes} onChange={e => setPayNotes(e.target.value)}
              placeholder="e.g., September 2026 commission" style={{ ...styles.input, marginBottom: 20 }} />

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPayModal(null)} style={{ ...styles.btn, background: '#333', flex: 1 }}>Cancel</button>
              <button onClick={recordPayment} disabled={paying || !payAmount}
                style={{ ...styles.btn, flex: 1, opacity: paying || !payAmount ? 0.5 : 1 }}>
                {paying ? 'Recording...' : `Pay $${payAmount || '0.00'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Card({ label, value, color }) {
  return (
    <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 700, color: color || '#fff', margin: 0 }}>{value}</p>
    </div>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: color || '#fff', margin: 0 }}>{value}</p>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0f1a', color: '#fff', padding: 'clamp(40px,8vw,60px) 28px' },
  label: { color: '#00A8A8', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 32 },
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  btn: { padding: '12px 24px', borderRadius: 10, border: 'none', background: '#00A8A8', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  card: { padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' },
  th: { textAlign: 'left', padding: '10px 12px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' },
  td: { padding: '10px 12px', color: 'rgba(255,255,255,0.5)' },
  error: { color: '#FB7185', fontSize: 13, marginTop: 12 },
  fieldLabel: { display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 },
}
