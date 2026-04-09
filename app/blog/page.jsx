import Link from 'next/link'
import { POSTS } from './posts'

export const metadata = {
  title: 'Blog — Arrival / Transform Learning',
  description: 'Thoughts on AI in education, adaptive learning, higher ed challenges, and building technology that serves students and faculty.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0C1F3F' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L2 14H6L8 10L10 14H14L8 2Z" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-navy text-sm">
              transform<span style={{ color: '#00A8A8' }}>learning</span>
            </span>
          </Link>
          <Link href="/" className="text-xs font-medium text-brand-gray hover:text-navy transition-colors">
            &larr; Back to site
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <h1 className="font-serif font-light text-navy mb-2"
            style={{ fontSize: 'clamp(36px, 5vw, 52px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Blog
        </h1>
        <p className="text-brand-gray text-base mb-12 max-w-lg">
          On AI, education, adaptive learning, and building things that matter for students and faculty.
        </p>

        <div className="space-y-8">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block group">
              <article className="border-b border-brand-border pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <time className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray">
                    {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                  <span className="text-[11px] text-brand-gray">&middot;</span>
                  <span className="text-[11px] text-brand-gray">{post.author}</span>
                </div>
                <h2 className="font-serif font-light text-navy text-2xl mb-2 group-hover:text-brand-teal transition-colors"
                    style={{ letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  {post.title}
                </h2>
                <p className="text-sm text-brand-gray leading-relaxed">
                  {post.summary}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
