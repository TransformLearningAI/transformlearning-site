import Link from 'next/link'
import ScrollReveal from './ScrollReveal'

export default function CampusTransformCTA() {
  return (
    <section className="py-16 relative overflow-hidden" style={{ background: '#0A0A0A' }}>
      <div className="absolute inset-0 opacity-10"
           style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(0,168,168,0.4) 0%, transparent 50%)' }} />
      <div className="max-w-6xl mx-auto px-6 relative">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#00A8A8' }}>
                New from Transform Learning
              </p>
              <h2 className="font-serif font-light text-white mb-3"
                  style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Is your campus closing?<br />
                <span style={{ color: '#00A8A8' }}>It doesn&rsquo;t have to.</span>
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-lg mb-5">
                We help boards and presidents transform closing campuses into workforce centers,
                community hubs, and revenue-generating assets — without accreditation. Same buildings.
                Same staff. Bigger mission.
              </p>
              <Link href="/campus-transformation"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90"
                    style={{ background: '#00A8A8', color: 'white' }}>
                Learn More →
              </Link>
            </div>
            <div className="shrink-0 text-center">
              <p className="text-6xl mb-2">🏛️</p>
              <p className="text-white/30 text-xs">2 colleges close<br />every week in America</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
