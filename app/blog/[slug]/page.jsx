import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { POSTS } from '../posts'

export function generateStaticParams() {
  return POSTS.map(post => ({ slug: post.slug }))
}

export function generateMetadata({ params }) {
  const post = POSTS.find(p => p.slug === params.slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: `${post.title} — Transform Learning Blog`,
    description: post.summary,
    openGraph: {
      title: `${post.title} — Transform Learning Blog`,
      description: post.summary,
      url: `https://transformlearning.ai/blog/${post.slug}`,
      siteName: 'Transform Learning',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — Transform Learning Blog`,
      description: post.summary,
    },
  }
}

export default function BlogPost({ params }) {
  const post = POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0C1F3F' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 12C4.5 8 7 5 10 4C12.5 3 14.5 3.5 15 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/><circle cx="15" cy="5" r="1.2" fill="#4F8A5B"/>
              </svg>
            </div>
            <span className="font-bold text-navy text-sm">
              transform<span style={{ color: '#00A8A8' }}>learning</span>
            </span>
          </Link>
          <Link href="/blog" className="text-xs font-medium text-brand-gray hover:text-navy transition-colors">
            &larr; All posts
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <time className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray">
              {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span className="text-[11px] text-brand-gray">&middot;</span>
            <span className="text-[11px] text-brand-gray">{post.author}</span>
          </div>
          <h1 className="font-serif font-light text-navy mb-4"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {post.title}
          </h1>
          <p className="text-base text-brand-gray leading-relaxed italic">
            {post.summary}
          </p>
        </div>

        {post.image && (
          <div className="mb-10">
            <img src={post.image} alt={post.title} className="w-full rounded-2xl border border-brand-border" />
          </div>
        )}

        <div className="border-t border-brand-border pt-8 prose prose-lg max-w-none" style={{ fontFamily: 'Georgia, serif' }}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="text-base text-navy/80 leading-relaxed mb-6">{children}</p>,
              h2: ({ children }) => <h2 className="font-serif font-light text-navy mt-10 mb-4" style={{ fontSize: 'clamp(22px, 3vw, 28px)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{children}</h2>,
              h3: ({ children }) => <h3 className="font-serif font-light text-navy mt-8 mb-3" style={{ fontSize: '20px', lineHeight: 1.3 }}>{children}</h3>,
              strong: ({ children }) => <strong className="font-bold text-navy">{children}</strong>,
              a: ({ href, children }) => <a href={href} className="text-brand-teal hover:text-navy underline transition-colors">{children}</a>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
              li: ({ children }) => <li className="text-base text-navy/80 leading-relaxed">{children}</li>,
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>

        <div className="border-t border-brand-border pt-8 mt-12 flex items-center justify-between">
          <Link href="/blog" className="text-sm text-brand-gray hover:text-navy transition-colors">
            &larr; All posts
          </Link>
          <Link href="/demo" className="text-sm font-bold text-brand-teal hover:text-navy transition-colors">
            See it in action &rarr;
          </Link>
        </div>
      </article>
    </div>
  )
}
