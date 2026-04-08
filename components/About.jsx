import Link from 'next/link'
import ScrollReveal from './ScrollReveal'

const TEAM = [
  {
    name: 'Jeff Ritter',
    title: 'Founder & Chief Learning Officer',
    bio: 'Jeff founded Arrival with the conviction that the biggest problem in higher education isn\'t access to data — it\'s access to the right signal at the right moment. As Chief Learning Officer, he ensures every feature, every intervention signal, and every pilot outcome is grounded in how learning actually works.',
    initials: 'JR',
    color: '#0C1F3F',
  },
  {
    name: 'Orsolya Cypert',
    title: 'Co-Founder, Product & CTO',
    bio: 'Orsolya leads product at Arrival, bringing rare experience as a CTO across both school systems and major technology companies. She has built and shipped products at the intersection of institutional complexity and technical precision — and understands what it takes to make a platform that works inside real academic environments.',
    initials: 'OC',
    color: '#00A8A8',
  },
  {
    name: 'Ryan Rydstrom',
    title: 'Sales, Marketing & Client Success',
    bio: 'Ryan leads the relationships that make Arrival\'s pilots work. He manages sales, marketing, and client partnerships — connecting institutions with the right entry point, guiding faculty through the pilot process, and building the research relationships that turn early results into lasting adoption.',
    initials: 'RR',
    color: '#4F8A5B',
  },
]

export default function About() {
  return (
    <section id="about" className="py-32 lg:py-40 bg-white relative overflow-hidden">

      <div className="absolute right-0 top-0 font-serif font-light select-none pointer-events-none"
           style={{ fontSize: '280px', lineHeight: 1, color: 'rgba(12,31,63,0.03)', letterSpacing: '-0.05em' }}>
        07
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">

        <div className="max-w-2xl mb-16">
          <ScrollReveal>
            <p className="eyebrow mb-5">The Team</p>
            <h2 className="font-serif font-light text-navy"
                style={{ fontSize: 'clamp(38px, 5.5vw, 64px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
              Built by people who understand both sides of the classroom.
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TEAM.map((person, i) => (
            <ScrollReveal key={person.name} delay={i + 1}>
              <div className="card-lift group h-full" style={{ boxShadow: '0 4px 24px rgba(12,31,63,0.06)' }}>
                <div className="gradient-border h-full">
                  <div className="p-8 flex flex-col h-full">

                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black mb-6 transition-transform group-hover:scale-105"
                         style={{
                           background: `linear-gradient(135deg, ${person.color}, ${person.color}99)`,
                           boxShadow: `0 8px 24px ${person.color}30`
                         }}>
                      {person.initials}
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: person.color }}>
                      {person.title}
                    </div>
                    <h3 className="font-serif font-light text-navy mb-4"
                        style={{ fontSize: '26px', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                      {person.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-brand-gray flex-1">{person.bio}</p>

                    <div className="mt-6 h-0.5 rounded-full w-10 transition-all group-hover:w-16"
                         style={{ background: `linear-gradient(90deg, ${person.color}, transparent)` }} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Methodology link */}
        <ScrollReveal delay={4}>
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 bg-brand-mist border border-brand-border rounded-2xl px-8 py-6">
              <p className="text-sm text-brand-gray leading-relaxed max-w-md">
                Want to understand how our AI measures student proficiency? Read our detailed
                methodology paper on evidence weighting, trajectory analysis, and governance.
              </p>
              <Link href="/methodology"
                    className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
                    style={{ background: '#0C1F3F' }}>
                Read Our Methodology
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
