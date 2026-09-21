'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AmbassadorCommunityPage() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Load posts
      const { data } = await supabase
        .from('ambassador_community')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      setPosts(data || [])
      setLoading(false)
    }
    init()
  }, [])

  async function handlePost(e) {
    e.preventDefault()
    if (!newPost.trim() || !user) return
    setPosting(true)

    const supabase = createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    const { data, error } = await supabase
      .from('ambassador_community')
      .insert({
        user_id: user.id,
        author_name: profile?.full_name || 'Ambassador',
        content: newPost.trim(),
      })
      .select()
      .single()

    if (!error && data) {
      setPosts([data, ...posts])
      setNewPost('')
    }
    setPosting(false)
  }

  function timeAgo(dateStr) {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago'
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago'
    return Math.floor(seconds / 86400) + 'd ago'
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 300, marginBottom: 16 }}>Ambassador Community</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>Sign in to access the ambassador community board.</p>
          <a href="/login" style={{ display: 'inline-block', padding: '14px 28px', background: '#00A8A8', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Sign In →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#fff', padding: 'clamp(40px,8vw,60px) 28px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <p style={{ color: '#00A8A8', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Ambassador Program</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Ambassador <span style={{ color: '#00A8A8' }}>Community</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 }}>
          Share tips, content ideas, wins, and questions with fellow ambassadors. This is your space.
        </p>

        {/* New post form */}
        <form onSubmit={handlePost} style={{ marginBottom: 32 }}>
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Share a tip, ask a question, celebrate a win..."
            rows={3}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
              color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical',
            }}
          />
          <button
            type="submit"
            disabled={posting || !newPost.trim()}
            style={{
              marginTop: 8, padding: '10px 24px', borderRadius: 8, border: 'none',
              background: newPost.trim() ? '#00A8A8' : '#333', color: '#fff',
              fontWeight: 700, fontSize: 13, cursor: newPost.trim() ? 'pointer' : 'default',
              opacity: posting ? 0.5 : 1,
            }}
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </form>

        {/* Posts */}
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Loading...</p>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 24, marginBottom: 8 }}>&#128075;</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No posts yet. Be the first to say hello!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map(post => (
              <div key={post.id} style={{
                padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#00A8A8' }}>{post.author_name}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{timeAgo(post.created_at)}</span>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{post.content}</p>
              </div>
            ))}
          </div>
        )}

        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, textAlign: 'center', marginTop: 40 }}>
          <a href="/ambassador/faq" style={{ color: 'rgba(255,255,255,0.3)' }}>FAQ</a> &middot;{' '}
          <a href="/ambassador" style={{ color: 'rgba(255,255,255,0.3)' }}>Tracking links</a> &middot;{' '}
          <a href="/ambassador/terms" style={{ color: 'rgba(255,255,255,0.3)' }}>Terms</a>
        </p>
      </div>
    </div>
  )
}
