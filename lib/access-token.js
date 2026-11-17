import { createHmac, timingSafeEqual } from 'crypto'

// Server-only helpers for access links. Requires ACCESS_SECRET in the environment.
// The secret never leaves the server, so a valid key or signature cannot be forged
// by someone who only knows an email address.

function secret() {
  const s = process.env.ACCESS_SECRET
  if (!s) throw new Error('ACCESS_SECRET is not set')
  return s
}

const normalize = (email) => String(email || '').trim().toLowerCase()

function hmac(payload) {
  return createHmac('sha256', secret()).update(payload).digest('hex')
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

// Access key: base64url(email) + "." + HMAC(email)
export function makeAccessKey(email) {
  const e = normalize(email)
  return `${Buffer.from(e).toString('base64url')}.${hmac(`access:${e}`)}`
}

// Returns the normalized email when the key is valid, otherwise null.
export function checkAccessKey(key) {
  if (typeof key !== 'string' || !key.includes('.')) return null
  const [encoded, sig] = key.split('.')
  let email
  try {
    email = Buffer.from(encoded, 'base64url').toString('utf8')
  } catch {
    return null
  }
  if (!email.includes('@')) return null
  return safeEqual(sig, hmac(`access:${normalize(email)}`)) ? normalize(email) : null
}

// Signature carried by the approve/deny links that are emailed to the site owner.
export function makeActionSig(email, action) {
  return hmac(`action:${action}:${normalize(email)}`)
}

export function checkActionSig(email, action, sig) {
  return Boolean(sig) && safeEqual(sig, makeActionSig(email, action))
}

// Revoked emails come from an environment variable, not from client code.
// Format: REVOKED_EMAILS=first@example.com,second@example.com
export function isRevoked(email) {
  const list = (process.env.REVOKED_EMAILS || '')
    .split(',')
    .map(normalize)
    .filter(Boolean)
  return list.includes(normalize(email))
}
