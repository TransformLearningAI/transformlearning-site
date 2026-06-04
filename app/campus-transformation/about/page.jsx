import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

export const metadata = {
  title: 'About Us — Campus Transformation',
  description: 'Educators, business developers, financial analysts, community builders, and innovation specialists working to save closing campuses.',
  openGraph: {
    title: 'About the Campus Transformation Team',
    description: 'We\'re educators who watched campuses close from the inside. Now we help them transform instead.',
    siteName: 'Campus Transformation',
  },
}

const CAPABILITIES = [
  {
    area: 'Education & Workforce',
    emoji: '🎓',
    items: ['25+ years in higher education', 'Workforce program design', 'Curriculum-free training models', 'Industry certification pathways', 'K-12 outdoor education design', 'Lifelong learning programming'],
  },
  {
    area: 'Business & Strategy',
    emoji: '📊',
    items: ['Business model development', 'Revenue stream diversification', 'Market analysis & positioning', 'Employer partnership building', 'Grant writing & fund development', 'Operational planning'],
  },
  {
    area: 'Community Development',
    emoji: '🤝',
    items: ['Community listening & engagement', 'Stakeholder facilitation', 'Collaborative design processes', 'Municipal partnership building', 'Nonprofit & civic org outreach', 'Arts & culture programming'],
  },
  {
    area: 'Finance & Legal',
    emoji: '⚖️',
    items: ['Financial modeling & projections', 'Debt restructuring strategy', 'Bond covenant analysis', 'Federal grant compliance', 'Zoning & land use navigation', 'Nonprofit governance'],
  },
  {
    area: 'Technology & Innovation',
    emoji: '🤖',
    items: ['AI-powered learning platforms', 'Career exploration tools', 'Community engagement platforms', 'Impact dashboards & analytics', 'Micro-credential delivery systems', 'Digital transformation'],
  },
  {
    area: 'Real Estate & Facilities',
    emoji: '🏗️',
    items: ['Campus facility assessment', 'Adaptive reuse planning', 'Housing conversion strategy', 'Space utilization optimization', 'Renovation scoping & budgeting', 'Historic preservation awareness'],
  },
]

const VALUES = [
  { title: 'The campus belongs to the community', desc: 'We don\'t impose plans. We listen, facilitate, and build what the community tells us they need. The people who live here know more than we do.' },
  { title: 'Keep people working', desc: 'Every staff member is a person with a mortgage and a family. Our plans prioritize retaining and transitioning people, not replacing them.' },
  { title: 'Honor the story', desc: 'A 100-year-old institution has a story. Alumni have memories. The transformation should build on that legacy, not demolish it.' },
  { title: 'Revenue follows mission', desc: 'We don\'t start with a spreadsheet. We start with what the community needs. The financial model serves the mission, not the other way around.' },
  { title: 'Radical transparency', desc: 'Every number, every decision, every trade-off — visible to the board, the staff, and the community. Trust is built through openness.' },
  { title: 'We stay', desc: 'We don\'t hand over a report and leave. We sit in the community meetings, stand on stage at the re-opening, and stay until the campus is self-sustaining.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28" style={{ background: '#0A0A0A' }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: '#00A8A8' }}>About Us</p>
            <h1 className="font-serif font-light text-white mb-6"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              We watched campuses close<br />
              <span style={{ color: '#00A8A8' }}>from the inside.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl leading-relaxed">
              Now we help them transform instead. We&rsquo;re educators, business developers,
              financial analysts, community builders, and innovation specialists who believe
              a campus should outlive its accreditation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* The Founder */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img src="/team-jeff.jpg" alt="Jeff Ritter" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: '#0C1F3F' }}>Jeff Ritter, PhD</h2>
                <p className="text-sm text-brand-gray mb-4">Founder, Transform Learning</p>
                <div className="space-y-4 text-sm text-brand-gray leading-relaxed">
                  <p>
                    Jeff spent 25 years as a professor at La Roche University in Pittsburgh. He watched
                    enrollment decline year after year. He sat in faculty meetings where the budget cuts
                    got deeper. He saw colleagues — good teachers, good people — lose their jobs because
                    the model stopped working.
                  </p>
                  <p>
                    Instead of accepting that campuses have to die when enrollment drops, he built
                    Transform Learning — a company that combines AI technology, workforce development
                    expertise, and deep understanding of what actually happens inside a struggling
                    institution. Not from a consulting firm&rsquo;s distance, but from the inside.
                  </p>
                  <p>
                    Jeff has built and deployed AI-powered career exploration tools across multiple
                    countries, workforce coaching platforms for veterans and returning citizens, civic
                    transparency technology for municipalities, and the institutional data infrastructure
                    that powers campus transformation planning.
                  </p>
                  <p className="font-medium" style={{ color: '#0C1F3F' }}>
                    &ldquo;I didn&rsquo;t start this company because I saw a market opportunity.
                    I started it because I watched good campuses close and good people lose their
                    jobs, and I knew there was a better way.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Team Members */}
          <div className="mt-16 space-y-12">
            <ScrollReveal>
              <h2 className="section-headline mb-8">Our Team</h2>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img src="/team-craig.jpg" alt="Craig Rathmell" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-0.5" style={{ color: '#0C1F3F' }}>Craig Rathmell</h3>
                  <p className="text-sm text-brand-gray mb-3">Business Strategy &amp; Data Analytics</p>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Craig brings deep expertise in product management, data strategy, and business analytics.
                    At Crown Castle, he led cross-functional teams through complex technology transitions,
                    built enterprise reporting and analytics platforms on Snowflake and Power BI, and earned
                    an Annual Achievement Award for driving process innovation. He specializes in turning
                    complex challenges into clear, actionable plans — the exact skill a campus transformation demands.
                    Experienced in Agile delivery, GIS analysis, Python automation, and aligning business
                    goals with technical reality.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img src="/team-roxy.jpg" alt="Roxy Finn" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-0.5" style={{ color: '#0C1F3F' }}>Roxy Finn</h3>
                  <p className="text-sm text-brand-gray mb-3">Community Development &amp; Experiential Learning</p>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Roxy brings 30 years of experience designing community-centered educational programs —
                    from K-12 through higher ed, across three countries. With a geology degree from Smith College,
                    she built and led experiential, project-based design and entrepreneurship programs during
                    fifteen years at Hampshire College. She has developed educational programs internationally
                    in Japan, Italy, and New York City. Certified in permaculture design and active on the
                    Pioneer Valley Habitat for Humanity Landscape Committee, Roxy understands how campuses
                    connect to communities and land in ways that go beyond buildings and budgets.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img src="/team-ann.webp" alt="Ann Fradkin-Hayslip" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-0.5" style={{ color: '#0C1F3F' }}>Ann Fradkin-Hayslip, Ed.D.</h3>
                  <p className="text-sm text-brand-gray mb-3">Education Design &amp; Equity</p>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Ann brings nearly 30 years of classroom experience from pre-K through graduate level,
                    in urban, rural, and suburban settings. An associate professor at SUNY Oneonta and published
                    author of <em>Process Learning: It&rsquo;s Not About the Product, It&rsquo;s About the Journey</em>,
                    her research focuses on teacher autonomy, equity in education, and what makes learning environments
                    actually work. A graduate of Hampshire College (a non-graded system) with a doctorate from the
                    University of Florida, Ann has led educational study trips to Finland and published internationally
                    on school culture and motivation. She knows what transforms a space into a place where people
                    genuinely learn — at any age, any stage.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={4}>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img src="/team-debbie.png" alt="Debbie Brockett" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-0.5" style={{ color: '#0C1F3F' }}>Debbie Brockett, Ed.D.</h3>
                  <p className="text-sm text-brand-gray mb-3">Executive Educational Leadership &amp; Strategic Operations</p>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Debbie brings more than three decades of experience transforming instructional systems
                    and leading large-scale organizational change. As Superintendent of McMinnville School
                    District, she led a $137M organization serving 6,300+ students and 900 staff. As Regional
                    Superintendent in the Clark County School District — one of the nation&rsquo;s largest — she
                    oversaw 6,400 staff and guided 108 schools through complex operational transformations.
                    A passionate advocate for equity and historically marginalized communities, Debbie has
                    consistently closed achievement gaps and expanded access to high-quality learning. She&rsquo;s
                    served as a high school principal, led two schools simultaneously as a franchise principal,
                    pioneered academic pathways and behavioral interventions, and taught graduate-level courses
                    in educational leadership. A certified AI Learning Consultant with a doctorate from Nova
                    Southeastern University, Debbie knows how to take a vision and turn it into an operating
                    organization that actually delivers.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What We Bring */}
      <section className="py-20" style={{ background: '#F4F7FB' }}>
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="section-headline mb-4">What we bring to the table.</h2>
            <p className="text-brand-gray max-w-2xl mb-12">
              Campus transformation isn&rsquo;t one discipline. It&rsquo;s education, business,
              community development, finance, technology, and real estate — all working together.
              Our team covers every angle.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap, i) => (
              <ScrollReveal key={cap.area} delay={Math.min(i, 4)} type="scale">
                <div className="bg-white rounded-xl p-5 h-full border" style={{ borderColor: '#DDE5EF' }}>
                  <span className="text-2xl block mb-2">{cap.emoji}</span>
                  <h3 className="font-bold text-sm mb-3" style={{ color: '#0C1F3F' }}>{cap.area}</h3>
                  <ul className="space-y-1.5">
                    {cap.items.map(item => (
                      <li key={item} className="text-xs text-brand-gray flex items-start gap-1.5">
                        <span style={{ color: '#00A8A8' }}>&#10003;</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="section-headline mb-12">How we work.</h2>
          </ScrollReveal>

          <div className="space-y-6">
            {VALUES.map((val, i) => (
              <ScrollReveal key={val.title} delay={Math.min(i, 3)}>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                       style={{ background: '#00A8A815', color: '#00A8A8', fontSize: '14px', fontWeight: 'bold' }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#0C1F3F' }}>{val.title}</h3>
                    <p className="text-sm text-brand-gray leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Platforms */}
      <section className="py-20" style={{ background: '#0C1F3F' }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Our Technology</p>
            <h2 className="font-serif font-light text-white mb-8"
                style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', lineHeight: 1.1 }}>
              We don&rsquo;t just consult. We build.
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'transformlearning.ai', desc: 'AI proficiency measurement for education', url: 'https://transformlearning.ai' },
              { name: 'findmyway.today', desc: 'Free AI career exploration for young people', url: 'https://findmyway.today' },
              { name: 'holdfast.today', desc: 'Career transition coaching for veterans', url: 'https://holdfast.today' },
              { name: 'soltas.ai', desc: 'Career coaching for returning citizens', url: 'https://soltas.ai' },
              { name: 'civicfeed.net', desc: 'AI civic transparency — 100K+ legislation records', url: 'https://civicfeed.net' },
              { name: 'study.transformlearning.ai', desc: 'AI tutoring and study tools for students', url: 'https://study.transformlearning.ai' },
            ].map((platform, i) => (
              <ScrollReveal key={platform.name} delay={Math.min(i, 3)} type="scale">
                <a href={platform.url} target="_blank" rel="noopener noreferrer"
                   className="block bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <p className="text-sm font-bold text-white">{platform.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{platform.desc}</p>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-brand-gray mb-6">Ready to talk about your campus?</p>
            <Link href="/campus-transformation/inquiry"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white text-lg font-bold hover:opacity-90"
                  style={{ background: '#00A8A8' }}>
              Start a Conversation
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
