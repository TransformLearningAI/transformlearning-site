'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAVY = '#0C1F3F'
const TEAL = '#00A8A8'
const GREEN = '#4F8A5B'
const PLUM = '#5A3E6B'
const CORAL = '#FF6B4A'
const WARM_BG = '#FAF8F5'
const WARM_BORDER = '#EBE6E0'
const MUTED = '#6b635a'
const BODY = '#3a3530'
const serif = 'Georgia, serif'

const guides = [
  {
    title: 'Practitioner-in-Residence',
    domain: 'STEM / Applied Science',
    color: TEAL,
    who: 'Working environmental scientist, 8 years at the Adirondack Land Trust. Master\'s in ecology plus real fieldwork. PhD not required.',
    whatTheyDo: 'Students learn cellular biology, chemistry, and statistics through the AI platform. The guide takes 20 students into the watershed three days a week. "The platform taught you dissolved oxygen levels. Now measure them. That number doesn\'t match your prediction — why?"',
    schedule: '20 hrs/week on campus, 3 field days. Available asynchronously for questions the AI flags.',
    comp: '$55–70K / 9 months',
    person: 'Loves mentoring, hates grading. Has said "I\'d teach if it didn\'t mean 80% paperwork." Wants to be in the field, not behind a podium.',
    aiInteraction: 'AI flags: "Student completed water chemistry module but can\'t apply concepts to field samples." Guide designs field exercise targeting that specific gap.',
  },
  {
    title: 'Socratic Provocateur',
    domain: 'Humanities / Liberal Arts',
    color: PLUM,
    who: 'Published essayist, former magazine editor, MFA. Teaches no content — the AI handles that. This person does one thing: make students think.',
    whatTheyDo: 'Seminar-style sessions, 12 students, twice a week. AI says "6 scored high on comprehension but none demonstrated original argumentation." Guide walks in: "The AI taught you what philosophers think. What do YOU think? Defend it."',
    schedule: '15 hrs/week. Two 90-min seminars per day. The rest is reading student writing the AI flagged as "technically competent but intellectually safe."',
    comp: '$45–60K / 9 months',
    person: 'The brilliant adjunct who left academia because the system was killing them. Still wants to argue about Kant at 10am on a Tuesday.',
    aiInteraction: 'AI flags: "Student essays are technically correct but show no original perspective." Guide assigns provocation — a position the student must defend against the guide.',
  },
  {
    title: 'Master Craftsperson',
    domain: 'Applied / Vocational',
    color: CORAL,
    who: 'Executive chef, 20 years in restaurants, no degree. Or a master carpenter. Or a licensed forester with 30 years of timber management.',
    whatTheyDo: 'AI teaches food science, nutrition, sanitation, cost accounting. Guide teaches how to break down a whole fish by feel. How to manage a kitchen when three orders come in wrong.',
    schedule: '25 hrs/week. Morning kitchen sessions. Afternoon service at the training restaurant.',
    comp: '$50–65K / 9 months',
    person: 'Says "I can\'t teach you this, I have to show you." Impatient with theory, brilliant at demonstration. The AI handles theory so this person never has to.',
    aiInteraction: 'AI teaches theory. Guide teaches hands. The platform says "student understands knife safety procedures." The guide says "now show me."',
  },
  {
    title: 'Integration Coach',
    domain: 'Cross-Disciplinary',
    color: GREEN,
    who: 'Former startup founder with a biology background. Or a policy analyst who used to be an engineer. Someone who has lived in two worlds.',
    whatTheyDo: 'AI teaches subjects in silos. This guide connects them. "You learned statistics in Module 4 and ecology in Module 7. Now design a study that uses both."',
    schedule: '20 hrs/week. Mostly project supervision and capstone reviews.',
    comp: '$60–75K / 9 months',
    person: 'Reads across five fields and sees patterns nobody else sees. Terrible at specialization. Brilliant at "wait, this is the same problem as that."',
    aiInteraction: 'AI identifies students with strong performance across multiple modules. Guide designs integration challenges that force synthesis.',
  },
  {
    title: 'Resilience Mentor',
    domain: 'Student Development',
    color: NAVY,
    who: 'Licensed counselor or social worker with experience in college-age populations. Former resident life director.',
    whatTheyDo: 'AI flags: "Engagement dropped 60% over 5 days. Login times shifted to 3am." Guide reaches out. Not about coursework — about the person. Homesick. Imposter syndrome. Financial crisis.',
    schedule: '30 hrs/week, staggered days and evenings. On call for crises. 50–80 student caseload.',
    comp: '$55–70K / 12 months (year-round, benefits included)',
    person: 'High emotional intelligence, low ego. Comfortable sitting in silence with a 19-year-old who can\'t articulate what\'s wrong.',
    aiInteraction: 'The AI tells them who to call. They know what to say when they get there.',
  },
  {
    title: 'Industry Bridge',
    domain: 'Career / Workforce',
    color: TEAL,
    who: 'Retired HR director. Workforce development officer. Someone who knows what employers actually need, not what career services thinks they need.',
    whatTheyDo: 'Connects AI competency data to actual jobs. "The platform shows you\'ve mastered GIS, watershed analysis, and statistical modeling. I know the hiring manager at two local firms. Let\'s call."',
    schedule: '10–15 hrs/week. Part-time. Mostly junior/senior year.',
    comp: '$30–40K part-time',
    person: 'Rolodex person. Knows everyone. Gets energy from making connections.',
    aiInteraction: 'AI shows what the student can do — a verified competency profile. This person knows who\'s hiring for exactly that.',
  },
]

export default function GuidesPage() {
  const [expanded, setExpanded] = useState(0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: WARM_BG }}>
      <nav className="border-b bg-white" style={{ borderColor: WARM_BORDER }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: NAVY }}>
            transform<span style={{ color: TEAL }}>learning</span>
          </Link>
          <Link href="/campus-os/demo" className="text-sm font-medium hover:underline" style={{ color: NAVY }}>&larr; All Demos</Link>
        </div>
      </nav>

      <header className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: PLUM }}>Campus OS</p>
        <h1 className="tracking-tight leading-tight mb-4" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
          The Guides
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: MUTED }}>
          Not professors. Not TAs. Not tutors. Six new roles for the moments only humans can handle.
        </p>
      </header>

      {/* Guide Cards */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="space-y-4">
          {guides.map((guide, i) => {
            const isOpen = expanded === i
            return (
              <div
                key={guide.title}
                className="rounded-xl border bg-white overflow-hidden transition-all duration-300"
                style={{ borderColor: isOpen ? guide.color + '60' : WARM_BORDER }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? -1 : i)}
                  className="w-full p-6 flex items-center gap-4 text-left"
                >
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: guide.color }} />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold" style={{ color: NAVY }}>{guide.title}</h3>
                    <p className="text-xs" style={{ color: MUTED }}>{guide.domain}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: guide.color }}>{guide.comp}</span>
                  <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: MUTED }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 border-t" style={{ borderColor: WARM_BORDER }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: guide.color }}>Who</h4>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: BODY }}>{guide.who}</p>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: guide.color }}>What they do</h4>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: BODY }}>{guide.whatTheyDo}</p>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: guide.color }}>Schedule</h4>
                        <p className="text-sm leading-relaxed" style={{ color: BODY }}>{guide.schedule}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: guide.color }}>The person</h4>
                        <p className="text-sm leading-relaxed mb-4 italic" style={{ color: BODY }}>{guide.person}</p>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: guide.color }}>AI interaction</h4>
                        <div className="rounded-lg p-4 text-sm leading-relaxed" style={{ backgroundColor: guide.color + '08', color: BODY }}>
                          {guide.aiInteraction}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Economics Summary */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center mb-8 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3vw, 32px)' }}>
            The economics of guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-6" style={{ borderColor: '#ddd', backgroundColor: '#fafafa' }}>
              <h3 className="font-bold mb-3" style={{ color: '#999' }}>Traditional</h3>
              <p className="text-sm" style={{ color: BODY }}>40 faculty &times; $85K = <span className="font-bold">$3.4M</span></p>
              <p className="text-sm" style={{ color: BODY }}>+ benefits (30%) = <span className="font-bold">$4.4M</span></p>
              <p className="text-sm" style={{ color: BODY }}>+ adjuncts, TAs = <span className="font-bold">$5.5M+</span></p>
            </div>
            <div className="rounded-xl border p-6" style={{ borderColor: TEAL + '40', backgroundColor: TEAL + '04' }}>
              <h3 className="font-bold mb-3" style={{ color: TEAL }}>Guides</h3>
              <p className="text-sm" style={{ color: BODY }}>12–15 guides &times; $55K avg = <span className="font-bold" style={{ color: TEAL }}>$660–825K</span></p>
              <p className="text-sm" style={{ color: BODY }}>+ benefits = <span className="font-bold" style={{ color: TEAL }}>$860K–1.1M</span></p>
              <p className="text-sm mt-3 font-bold" style={{ color: TEAL }}>70% reduction in instructional cost</p>
            </div>
          </div>
          <p className="text-center text-sm mt-8 leading-relaxed" style={{ color: MUTED }}>
            Guides earn less per person but work fewer hours, have zero admin burden, no publish-or-perish, no committee service, and do only the part of teaching they love.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 text-center" style={{ backgroundColor: WARM_BG }}>
        <p className="text-sm leading-relaxed max-w-xl mx-auto mb-6" style={{ fontFamily: serif, color: NAVY }}>
          The AI handles what software does better. The guides handle what humans do better. Nobody does what they hate. Everyone does what they&apos;re best at.
        </p>
        <Link href="/campus-os/demo/guide-dashboard" className="text-sm font-semibold hover:underline" style={{ color: GREEN }}>
          See the guide dashboard &rarr;
        </Link>
      </section>
    </div>
  )
}
