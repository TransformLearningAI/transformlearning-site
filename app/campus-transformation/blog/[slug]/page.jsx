import Link from 'next/link'
import { notFound } from 'next/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import { CT_POSTS } from '../posts'
import { BeyondTheCollegeIllustration, BoardNotHearingIllustration, BuildingsTellingUsIllustration, WhenCollegesCloseIllustration } from '@/components/BlogIllustration'

const ILLUSTRATIONS = {
  'the-buildings-are-trying-to-tell-us-something': BuildingsTellingUsIllustration,
  'beyond-the-college': BeyondTheCollegeIllustration,
  'what-your-board-isnt-hearing': BoardNotHearingIllustration,
  'when-colleges-close-communities-dont-have-to': WhenCollegesCloseIllustration,
}

export function generateStaticParams() {
  return CT_POSTS.map(post => ({ slug: post.slug }))
}

export function generateMetadata({ params }) {
  const post = CT_POSTS.find(p => p.slug === params.slug)
  if (!post) return { title: 'Blog — Campus Transformation' }
  return {
    title: `${post.title} — Campus Transformation`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: 'Campus Transformation',
      type: 'article',
      authors: [post.author],
    },
  }
}

export default function CTBlogPost({ params }) {
  const post = CT_POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  // Convert markdown-style bold and italic and links
  const renderBody = (text) => {
    return text.split('\n\n').map((paragraph, i) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        // Section heading
        return (
          <h2 key={i} className="text-lg font-bold mt-8 mb-3" style={{ color: '#0C1F3F' }}>
            {paragraph.replace(/\*\*/g, '')}
          </h2>
        )
      }

      // Process inline markdown
      let html = paragraph
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#00A8A8" class="hover:underline">$1</a>')

      if (paragraph.startsWith('*') && paragraph.endsWith('*') && !paragraph.startsWith('**')) {
        return <p key={i} className="text-sm text-brand-gray italic mt-8 pt-4 border-t" style={{ borderColor: '#DDE5EF' }} dangerouslySetInnerHTML={{ __html: html }} />
      }

      if (paragraph.startsWith('>')) {
        return (
          <blockquote key={i} className="border-l-4 pl-4 my-4 text-brand-gray italic" style={{ borderColor: '#00A8A8' }}
                      dangerouslySetInnerHTML={{ __html: html.replace(/^>\s*/, '') }} />
        )
      }

      return <p key={i} className="text-sm text-brand-gray leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    })
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/campus-transformation/blog"
              className="text-sm text-brand-gray hover:text-brand-teal mb-8 inline-block" style={{ color: '#00A8A8' }}>
          ← All Posts
        </Link>

        <ScrollReveal>
          <p className="text-xs text-brand-gray mb-3">{post.date} · {post.author}</p>
          <h1 className="font-serif font-light mb-6"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0C1F3F' }}>
            {post.title}
          </h1>
          {ILLUSTRATIONS[post.slug] && (
            <div className="mb-8">
              {(() => { const Ill = ILLUSTRATIONS[post.slug]; return <Ill /> })()}
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <div className="space-y-4">
            {renderBody(post.body)}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={2}>
          <div className="mt-12 p-6 rounded-xl text-center" style={{ background: '#F4F7FB', border: '1px solid #DDE5EF' }}>
            <p className="text-sm text-brand-gray mb-3">
              Facing a closure decision? The first conversation is free and confidential.
            </p>
            <Link href="/campus-transformation/inquiry"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold hover:opacity-90"
                  style={{ background: '#00A8A8' }}>
              Start a Conversation
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
