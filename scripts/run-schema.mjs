import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local if present
import { existsSync } from 'fs'
if (existsSync('.env.local')) {
  const { readFileSync } = await import('fs')
  readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim()
  })
}

const DB_URL = process.env.DATABASE_URL || `postgresql://postgres:${process.env.DB_PASSWORD}@db.ujohihxjavfjungdlomj.supabase.co:5432/postgres`

const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } })

const sql = readFileSync(join(__dirname, '../supabase/schema.sql'), 'utf8')

try {
  await client.connect()
  console.log('✓ Connected to Supabase\n')

  await client.query(sql)
  console.log('✓ Schema applied successfully\n')

  const { rows } = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `)
  console.log('Tables created:')
  rows.forEach(r => console.log(`  • ${r.table_name}`))

  const { rows: triggers } = await client.query(`
    SELECT trigger_name, event_object_table FROM information_schema.triggers
    WHERE trigger_schema = 'public' OR event_object_schema = 'auth'
    ORDER BY trigger_name
  `)
  console.log('\nTriggers:')
  triggers.forEach(r => console.log(`  • ${r.trigger_name} on ${r.event_object_table}`))

  const { rows: policies } = await client.query(`
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname
  `)
  console.log('\nRLS Policies:')
  policies.forEach(r => console.log(`  • ${r.tablename}: ${r.policyname}`))

} catch (err) {
  console.error('✗ Error:', err.message)
  process.exit(1)
} finally {
  await client.end()
}
