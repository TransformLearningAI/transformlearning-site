import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { CT_POSTS } from './posts'
import { BeyondTheCollegeIllustration, BoardNotHearingIllustration, BuildingsTellingUsIllustration } from '@/components/BlogIllustration'

const ILLUSTRATIONS = {
  'the-buildings-are-trying-to-tell-us-something': BuildingsTellingUsIllustration,
  'beyond-the-college': BeyondTheCollegeIllustration,
  'what-your-board-isnt-hearing': BoardNotHearingIllustration,
}

export const metadata = {
  title: 'Blog — Campus Transformation',
  description: 'Thought leadership on campus transformation, college closures, and reimagining higher education for boards, presidents, and community leaders.',
  openGraph: {
    title: 'Campus Transformation Blog',
    description: 'Honest thinking about what happens when colleges close — and what could happen instead.',
    siteName: 'Campus Transformation',
  },
}

export default function CTBlogPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal>
          <p className="eyebrow mb-4">Blog</p>
          <h1 className="section-headline mb-4">Thinking out loud about what comes next.</h1>
          <p className="text-brand-gray max-w-lg mb-12">
            Honest writing about campus closures, community transformation, and the future of
            small colleges — for the people making the hardest decisions.
          </p>
        </ScrollReveal>

        <div className="space-y-8">
          {CT_POSTS.map((post, i) => (
            <ScrollReveal key={post.slug} delay={Math.min(i, 3)}>
              <Link href={`/campus-transformation/blog/${post.slug}`}
                    className="block card-lift bg-white rounded-xl overflow-hidden border hover:border-gray-300 transition-colors"
                    style={{ borderColor: '#DDE5EF' }}>
                {ILLUSTRATIONS[post.slug] && (
                  <div className="pointer-events-none" style={{ height: '140px', overflow: 'hidden' }}>
                    {(() => { const Ill = ILLUSTRATIONS[post.slug]; return <Ill /> })()}
                  </div>
                )}
                <div className="p-6">
                <p className="text-xs text-brand-gray mb-2">{post.date} · {post.author}</p>
                <h2 className="text-lg font-bold mb-2" style={{ color: '#0C1F3F' }}>{post.title}</h2>
                <p className="text-sm text-brand-gray leading-relaxed">{post.summary}</p>
                <p className="text-sm font-medium mt-3" style={{ color: '#00A8A8' }}>Read →</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
