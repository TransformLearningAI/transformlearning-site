'use client'

import { useState, useEffect, useCallback } from 'react'

const SUPABASE_URL = 'https://ujohihxjavfjungdlomj.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqb2hpaHhqYXZmanVuZ2Rsb21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjM2NjksImV4cCI6MjA5MDYzOTY2OX0.J1_BYkuldTwCUIqXV2Ov6H0thA0POgwc50cjKGQEX-0'
const SITE = 'transformlearning'

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default function CommunityPage() {
  const [posts, setPosts] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/discussions?site=eq.${SITE}&select=*&order=created_at.desc&limit=50`,
        { headers: { apikey: ANON_KEY } }
      )
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
    const interval = setInterval(fetchPosts, 30000)
    return () => clearInterval(interval)
  }, [fetchPosts])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim() || cooldown > 0) return
    setSubmitting(true)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/discussions`, {
        method: 'POST',
        headers: {
          apikey: ANON_KEY,
          'Authorization': `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ site: SITE, name: name.trim(), message: message.trim() }),
      })
      if (res.ok) {
        setMessage('')
        setCooldown(30)
        fetchPosts()
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = name.trim().length > 0 && message.trim().length > 0 && message.length <= 500 && cooldown === 0 && !submitting

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#0C1F3F' }}>Community</h1>
        <p className="text-gray-500 mb-8">Questions, ideas, study tips, and conversations about learning. No account needed.</p>

        {/* Post Form */}
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-10 shadow-sm">
          <input
            type="text"
            placeholder="Your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#00A8A8]/40 bg-white"
          />
          <textarea
            placeholder="What's on your mind?"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#00A8A8]/40 bg-white"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{message.length}/500</span>
            <button
              type="submit"
              disabled={!canSubmit}
              className="text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 rounded-lg transition-colors hover:opacity-90"
              style={{ background: '#00A8A8' }}
            >
              {cooldown > 0 ? `Posted! (${cooldown}s)` : 'Post'}
            </button>
          </div>
        </form>

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No posts yet. Be the first!</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-semibold text-sm" style={{ color: '#0C1F3F' }}>{post.name}</span>
                  <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{post.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
