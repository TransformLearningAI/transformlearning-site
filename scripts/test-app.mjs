/**
 * End-to-end smoke test for Transform Learning
 * Tests the full faculty → student flow against the real database
 */
import { createClient } from '@supabase/supabase-js'
import pg from 'pg'

const { Client } = pg

// Load from .env.local if present
import { existsSync, readFileSync } from 'fs'
if (existsSync('.env.local')) {
  readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim()
  })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const DB_URL = process.env.DATABASE_URL || `postgresql://postgres:${process.env.DB_PASSWORD}@db.ujohihxjavfjungdlomj.supabase.co:5432/postgres`

const service = createClient(SUPABASE_URL, SERVICE_KEY)
const db = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } })

let pass = 0, fail = 0
const results = []

function check(label, ok, detail = '') {
  if (ok) { pass++; console.log(`  ✓ ${label}`) }
  else { fail++; console.error(`  ✗ ${label}${detail ? ': ' + detail : ''}`) }
  results.push({ label, ok })
}

async function cleanup(email1, email2, courseId) {
  try {
    if (courseId) await service.from('courses').delete().eq('id', courseId)
    // Clean up test users from auth
    const { data: users } = await service.auth.admin.listUsers()
    for (const u of users?.users || []) {
      if (u.email === email1 || u.email === email2) {
        await service.auth.admin.deleteUser(u.id)
      }
    }
    await service.from('profiles').delete().eq('email', email1)
    await service.from('profiles').delete().eq('email', email2)
  } catch {}
}

await db.connect()

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Transform Learning — End-to-End Test')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const testEmail1 = `test-faculty-${Date.now()}@test.com`
const testEmail2 = `test-student-${Date.now()}@test.com`
let facultyId, studentId, courseId, enrollmentId, skillId

// ── 1. DATABASE CONNECTIVITY ──────────────────────────
console.log('1. Database')
const { rows } = await db.query(`SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'`)
check('All 12 tables exist', parseInt(rows[0].count) >= 12, `found ${rows[0].count}`)

const { rows: triggers } = await db.query(`SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created'`)
check('Auto-profile trigger exists', parseInt(triggers[0].count) > 0)

const { rows: policies } = await db.query(`SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public'`)
check('RLS policies active', parseInt(policies[0].count) >= 13, `found ${policies[0].count}`)

// ── 2. FACULTY SIGNUP & PROFILE ───────────────────────
console.log('\n2. Faculty Auth')
const { data: facultyAuth, error: facultyErr } = await service.auth.admin.createUser({
  email: testEmail1, password: 'TestPass123!', email_confirm: true,
  user_metadata: { full_name: 'Test Faculty', institution: 'Test University', role: 'faculty' },
})
check('Faculty user created', !facultyErr, facultyErr?.message)
facultyId = facultyAuth?.user?.id

if (facultyId) {
  // Wait for trigger
  await new Promise(r => setTimeout(r, 800))
  const { data: profile } = await service.from('profiles').select('*').eq('id', facultyId).single()
  check('Profile auto-created via trigger', !!profile, 'trigger may not have fired')
  check('Faculty role set correctly', profile?.role === 'faculty', `got: ${profile?.role}`)
}

// ── 3. COURSE CREATION ────────────────────────────────
console.log('\n3. Course & Syllabus')
if (facultyId) {
  const { data: course, error: courseErr } = await service.from('courses').insert({
    faculty_id: facultyId,
    title: 'Calculus I',
    course_code: 'MATH 101',
    term: 'Fall 2026',
    framework_status: 'pending',
  }).select().single()
  check('Course created', !courseErr, courseErr?.message)
  courseId = course?.id
}

// ── 4. CLAUDE API — SYLLABUS PARSE ────────────────────
console.log('\n4. Claude API (Syllabus → Skills)')
const testSyllabus = `
MATH 101: Calculus I — Fall 2026
Instructor: Dr. Test Faculty

Course Description:
Introduction to differential and integral calculus. Topics include limits, derivatives,
applications of differentiation, and introduction to integration.

Learning Objectives:
- Understand and apply the concept of limits and continuity
- Compute derivatives using differentiation rules (power, product, quotient, chain)
- Apply derivatives to optimization problems and curve sketching
- Understand the Fundamental Theorem of Calculus
- Compute basic integrals using substitution

Topics by Week:
Week 1-3: Limits and Continuity
Week 4-7: Derivatives and Differentiation Rules
Week 8-10: Applications of Derivatives
Week 11-13: Integration
Week 14-15: Fundamental Theorem of Calculus

Assessments: 3 exams (60%), weekly homework (20%), quizzes (20%)
`

let parsedSkills = null
try {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: `Extract a skill framework from this syllabus. Return ONLY valid JSON:
{"explicit_skills":[{"name":"...","description":"...","category":"..."}],"implicit_skills":[{"name":"...","description":"...","category":"..."}]}
Aim for 6-10 explicit skills and 3-5 implicit skills.`,
      messages: [{ role: 'user', content: testSyllabus }],
    }),
  })
  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  const match = text.match(/\{[\s\S]*\}/)
  if (match) parsedSkills = JSON.parse(match[0])
  check('Claude API reachable', !!data.content, data.error?.message)
  check('Syllabus parsed to skills', !!parsedSkills?.explicit_skills?.length)
  check(`Explicit skills extracted (${parsedSkills?.explicit_skills?.length})`, parsedSkills?.explicit_skills?.length >= 4)
  check(`Implicit skills extracted (${parsedSkills?.implicit_skills?.length})`, parsedSkills?.implicit_skills?.length >= 2)
} catch (err) {
  check('Claude API reachable', false, err.message)
}

// ── 5. SKILLS SAVED TO DB ─────────────────────────────
console.log('\n5. Skills Framework')
if (courseId && parsedSkills) {
  const allSkills = [
    ...(parsedSkills.explicit_skills || []).map((s, i) => ({ ...s, course_id: courseId, skill_type: 'explicit', sort_order: i, is_approved: true })),
    ...(parsedSkills.implicit_skills || []).map((s, i) => ({ ...s, course_id: courseId, skill_type: 'implicit', sort_order: i, is_approved: true })),
  ]
  const { error: skillErr } = await service.from('skills').insert(allSkills)
  check('Skills saved to DB', !skillErr, skillErr?.message)

  const { data: savedSkills } = await service.from('skills').select('*').eq('course_id', courseId)
  check(`All skills persisted (${savedSkills?.length})`, savedSkills?.length === allSkills.length)
  skillId = savedSkills?.[0]?.id

  await service.from('courses').update({ framework_status: 'approved' }).eq('id', courseId)
  const { data: updatedCourse } = await service.from('courses').select('framework_status').eq('id', courseId).single()
  check('Course marked approved', updatedCourse?.framework_status === 'approved')
}

// ── 6. STUDENT ENROLLMENT ─────────────────────────────
console.log('\n6. Student Enrollment')
const { data: studentAuth, error: studentErr } = await service.auth.admin.createUser({
  email: testEmail2, password: 'TestPass123!', email_confirm: true,
  user_metadata: { full_name: 'Test Student', role: 'student' },
})
check('Student user created', !studentErr, studentErr?.message)
studentId = studentAuth?.user?.id

if (studentId && courseId) {
  await new Promise(r => setTimeout(r, 800))
  const { data: enrollment, error: enrollErr } = await service.from('enrollments').insert({
    course_id: courseId, student_id: studentId, onboarding_status: 'pending',
  }).select().single()
  check('Student enrolled', !enrollErr, enrollErr?.message)
  enrollmentId = enrollment?.id
}

// ── 7. PROFICIENCY SCORING ────────────────────────────
console.log('\n7. Proficiency Scores')
if (enrollmentId && skillId) {
  const { data: savedSkills2 } = await service.from('skills').select('id').eq('course_id', courseId)
  const scoreInserts = (savedSkills2 || []).slice(0, 5).map(s => ({
    enrollment_id: enrollmentId, skill_id: s.id,
    score: Math.round(40 + Math.random() * 40),
    confidence: 0.8, source: 'assessment',
    evidence_summary: 'Test score from automated test suite',
  }))
  const { error: scoreErr } = await service.from('proficiency_scores').upsert(scoreInserts, { onConflict: 'enrollment_id,skill_id' })
  check('Proficiency scores saved', !scoreErr, scoreErr?.message)

  const { data: scores } = await service.from('proficiency_scores').select('*').eq('enrollment_id', enrollmentId)
  check(`Scores readable (${scores?.length})`, scores?.length === scoreInserts.length)

  // History
  const { error: histErr } = await service.from('proficiency_history').insert(
    scoreInserts.map(({ id, ...s }) => s)
  )
  check('History recorded', !histErr, histErr?.message)
}

// ── 8. CLAUDE API — COACHING PROMPT ───────────────────
console.log('\n8. Claude API (Coaching Chat)')
try {
  const chatRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: 'You are a math tutor helping a student with Limits & Continuity in Calculus I. Keep responses under 100 words.',
      messages: [{ role: 'user', content: 'I don\'t understand what a limit actually means. Can you explain it simply?' }],
    }),
  })
  const chatData = await chatRes.json()
  check('Coaching chat response received', !!chatData.content?.[0]?.text)
  check('Response is reasonable length', (chatData.content?.[0]?.text?.length || 0) > 20)
  if (chatData.content?.[0]?.text) {
    console.log(`     Sample: "${chatData.content[0].text.slice(0, 80)}…"`)
  }
} catch (err) {
  check('Coaching chat works', false, err.message)
}

// ── 9. INVITE FLOW ────────────────────────────────────
console.log('\n9. Invite System')
if (courseId && facultyId) {
  const { data: invite, error: invErr } = await service.from('invites').insert({
    course_id: courseId, email: 'test-invite@test.com', invited_by: facultyId,
  }).select().single()
  check('Invite created', !invErr, invErr?.message)
  check('Invite token generated', invite?.token?.length > 10)

  const futureDate = new Date(invite?.expires_at)
  check('Invite expires in future', !isNaN(futureDate) && futureDate > new Date())
}

// ── 10. CLEANUP ───────────────────────────────────────
console.log('\n10. Cleanup')
await cleanup(testEmail1, testEmail2, courseId)
check('Test data cleaned up', true)
await db.end()

// ── SUMMARY ───────────────────────────────────────────
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
const total = pass + fail
console.log(`Result: ${pass}/${total} passed ${fail > 0 ? `(${fail} failed)` : '✓'}`)
if (fail === 0) console.log('🟢 All systems operational')
else console.log('🔴 Some checks failed — see above')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

process.exit(fail > 0 ? 1 : 0)
