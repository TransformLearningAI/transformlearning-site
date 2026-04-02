import Link from 'next/link'

export const metadata = {
  title: 'Investors — Arrival',
  description: 'Go-to-market strategy, market entry model, and growth path for Arrival in higher education.',
}

const STATS = [
  { label: 'Category',        value: 'Adaptive Learning Operating System' },
  { label: 'Entry Motion',    value: 'Faculty-first departmental pilots' },
  { label: 'Priority Courses', value: 'Algebra · Statistics · Biology' },
  { label: 'Growth Path',     value: 'Faculty → Department → Institution' },
]

const PHASES = [
  { phase: 'T–90', color: '#4F8A5B', title: 'Preparation', body: 'Finalize ICP, shortlist target universities and departments, secure design partner faculty, and confirm compliance readiness. Optional LMS integration as needed.' },
  { phase: 'T–60', color: '#4F8A5B', title: 'Pilot Launch', body: 'Begin pilots in selected gateway courses and capture baseline performance and usage data.' },
  { phase: 'T–30', color: '#4F8A5B', title: 'Signal Review', body: 'Analyze early pilot signals, document usability patterns, and begin case study development.' },
  { phase: 'Launch', color: '#00A8A8', title: 'Market Activation', body: 'Initiate targeted outreach to similar institutions using pilot proof, faculty testimonials, and evidence-backed positioning.' },
  { phase: 'T+90', color: '#00A8A8', title: 'Conversion & Expansion', body: 'Convert successful pilots into paid contracts and expand within departments through additional sections and instructors.' },
]

const RISKS = [
  { risk: 'Insufficient time to value',              mitigation: 'Optimize for rapid insight generation' },
  { risk: 'Increased faculty workload perception',    mitigation: 'Minimize operational burden on faculty' },
  { risk: 'Lack of rigorous evidence',                mitigation: 'Design pilots with measurable outcomes' },
  { risk: 'Overreliance on administrative pathways',  mitigation: 'Maintain a faculty-first engagement model' },
]

function Section({ id, num, title, color, children }) {
  return (
    <section id={id} className="border-b border-brand-border">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
               style={{ background: color }}>
            {num}
          </div>
          <h2 className="font-serif font-light text-navy"
              style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  )
}

function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-brand-soft border border-brand-border rounded-2xl p-6 ${className}`}>
      {title && <h3 className="text-base font-bold text-navy mb-3">{title}</h3>}
      {children}
    </div>
  )
}

export default function Investors() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0C1F3F' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L2 14H6L8 10L10 14H14L8 2Z" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-navy text-sm">
              arrival<span style={{ color: '#00A8A8' }}>.ai</span>
            </span>
          </Link>
          <Link href="/" className="text-xs font-medium text-brand-gray hover:text-navy transition-colors">
            ← Back to site
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header style={{ background: '#0C1F3F' }} className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.06] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">Go-To-Market Strategy · Higher Education</span>
          </div>
          <h1 className="font-serif font-light text-white mb-4"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
            Higher Education<br /><em className="italic opacity-80">Market Entry</em>
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-2xl">
            Executive overview of Arrival's go-to-market model for higher education —
            market definition, stakeholder structure, sales motion, pricing, and growth path.
          </p>
        </div>

        {/* Stat strip */}
        <div className="border-t border-white/10 bg-white">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-brand-border">
            {STATS.map(s => (
              <div key={s.label} className="px-5 py-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">{s.label}</div>
                <div className="text-sm font-bold text-navy">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Framework sidebar + content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-brand-mist border border-brand-border rounded-2xl p-6 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Framework</p>
          <h3 className="font-serif font-light text-navy text-2xl mb-4" style={{ letterSpacing: '-0.02em' }}>
            Architect → Activate → Amplify
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { name: 'Architect', color: '#0C1F3F', desc: 'Define market, entry wedge, stakeholder structure, category design, and value architecture.' },
              { name: 'Activate',  color: '#00A8A8', desc: 'Operationalize pilots, sales motion, pricing, onboarding, proof capture, and conversion pathways.' },
              { name: 'Amplify',   color: '#4F8A5B', desc: 'Scale through evidence, academic credibility, peer advocacy, and institutional expansion.' },
            ].map(f => (
              <div key={f.name} className="bg-white border border-brand-border rounded-xl p-4 border-l-4"
                   style={{ borderLeftColor: f.color }}>
                <div className="font-bold text-sm text-navy mb-1">{f.name}</div>
                <p className="text-xs leading-relaxed text-brand-gray">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-white border border-brand-coral/20 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-coral mb-1">Brand Principle</p>
            <p className="text-sm text-brand-gray">Arrival wins by reducing noise, clarifying what matters now, and creating forward movement through selective clarity.</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <Section id="s1" num="1" title="Executive Summary" color="#0C1F3F">
        <p className="body-text mb-4">Arrival will enter the Higher Education market through a focused, evidence-driven, faculty-first strategy centered on high-impact gateway courses. The go-to-market approach prioritizes measurable academic outcomes, rapid time-to-insight, and departmental adoption as the foundation for institutional scale.</p>
        <p className="body-text mb-4">The AI is not the product — it's the underlying intelligence. What we are building is a wayfinding system for learning: a system that reads signals, recognizes patterns, applies judgment, and helps a student see a path forward. Not by removing challenge, but by introducing the right amount of tension at the right moment and guiding them toward an arrival point. This positions Arrival not as an AI tool, an LMS extension, or a content repository — but as an adaptive, prescriptive learning operating system.</p>
        <p className="body-text font-semibold text-navy">The primary growth mechanism is not broad awareness. It is validated movement within targeted academic environments, supported by proof, usability, and faculty credibility.</p>
      </Section>

      <Section id="s2" num="2" title="Market Definition and Entry Focus" color="#00A8A8">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Beachhead Market</p>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { name: 'College Algebra', body: 'High DFW rates, broad enrollment, and direct relevance to first-year persistence and completion risk.' },
            { name: 'Introductory Statistics', body: 'Strong fit for measurable progression signals and early intervention use cases.' },
            { name: 'General Biology', body: 'High-volume course environment with strong institutional visibility and evidence potential.' },
          ].map(c => <Card key={c.name} title={c.name}><p className="text-sm text-brand-gray leading-relaxed">{c.body}</p></Card>)}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Selection Criteria</p>
        <div className="grid md:grid-cols-2 gap-3 mb-8">
          {['High DFW rates and direct retention impact', 'Quantifiable performance metrics and department-level accountability', 'Digital readiness (LMS integration optional, not required)', 'Institutional openness to AI-enabled or data-informed instruction'].map(item => (
            <div key={item} className="flex items-start gap-3 bg-brand-soft border border-brand-border rounded-xl p-4">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#00A8A8' }} />
              <span className="text-sm text-brand-gray leading-relaxed">{item}</span>
            </div>
          ))}
        </div>

        <Card title="Serviceable Obtainable Market">
          <p className="text-sm text-brand-gray leading-relaxed">Within 12 to 18 months, Arrival should target <strong className="text-navy">10–15 universities</strong>, <strong className="text-navy">20–40 departments</strong>, and <strong className="text-navy">50–100 course implementations</strong> — sufficient to establish category credibility, create a repeatable pilot model, and generate a meaningful evidence base for expansion.</p>
        </Card>
      </Section>

      <Section id="s3" num="3" title="Ideal Customer Profile & Stakeholder Model" color="#4F8A5B">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card title="Ideal Customer Profile">
            <ul className="space-y-2">{['Institutions under retention or performance pressure', 'Works standalone or alongside existing LMS (Canvas, Blackboard, etc.)', 'Active exploration of AI-enabled or data-informed instruction', 'Departments responsible for high-enrollment gateway courses'].map(i => <li key={i} className="text-sm text-brand-gray flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 flex-shrink-0" />{i}</li>)}</ul>
          </Card>
          <Card title="Primary Entry Personas">
            <ul className="space-y-2">{['Faculty in high-enrollment gateway courses', 'Department chairs accountable for course outcomes', 'Institutional Research and academic leadership', 'IT leaders as operational gatekeepers (when LMS integration is desired)'].map(i => <li key={i} className="text-sm text-brand-gray flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 flex-shrink-0" />{i}</li>)}</ul>
          </Card>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { role: 'Faculty', desc: 'Controls instructional adoption and determines whether the platform creates meaningful pedagogical value.' },
            { role: 'Department Chair', desc: 'Links instructional proof to broader departmental priorities and expansion decisions.' },
            { role: 'Academic Leadership', desc: 'Translates course-level impact into retention, performance, and funding logic.' },
            { role: 'IT', desc: 'Validates compliance, privacy, and security. Supports optional LMS integration when desired.' },
          ].map(s => <Card key={s.role} title={s.role}><p className="text-sm text-brand-gray leading-relaxed">{s.desc}</p></Card>)}
        </div>
      </Section>

      <Section id="s4" num="4" title="Product Positioning & Value Proposition" color="#0C1F3F">
        <blockquote className="font-serif font-light text-navy border-l-4 border-navy pl-6 mb-8"
                    style={{ fontSize: 'clamp(22px, 3vw, 32px)', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          The AI is not the product — it's the underlying intelligence. What we're building is a wayfinding system for learning. An adaptive, prescriptive learning operating system.
        </blockquote>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card title="Core Problem">
            <p className="text-sm text-brand-gray leading-relaxed">Higher Education institutions often lack timely visibility into student progression toward mastery, early indicators of academic risk, and the specific timing and type of intervention most likely to improve outcomes. Faculty and administrators operate with fragmented signals, delayed awareness, and inconsistent intervention timing.</p>
          </Card>
          <Card title="Proof Requirements">
            <p className="text-sm text-brand-gray leading-relaxed">All GTM messaging and sales efforts should be supported by pilot data with baseline comparisons, faculty-authored case studies, and measurable changes in student outcomes, intervention timing, or instructional efficiency. In this market, <strong className="text-navy">proof is not a support element — it is a condition of adoption.</strong></p>
          </Card>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Academic Outcomes', body: 'Reduction in DFW rates and improved course pass rates.' },
            { label: 'Institutional Outcomes', body: 'Improved retention indicators and stronger evidence for student success initiatives.' },
            { label: 'Faculty Outcomes', body: 'Clearer instructional decisions with less uncertainty and faster intervention timing.' },
          ].map(o => <Card key={o.label} title={o.label}><p className="text-sm text-brand-gray">{o.body}</p></Card>)}
        </div>
      </Section>

      <Section id="s5" num="5" title="Sales & Distribution Strategy" color="#00A8A8">
        <p className="body-text mb-6">Arrival operates with a hybrid model combining bottom-up faculty adoption with top-down administrative expansion. Entry credibility is earned through faculty value. Scale is unlocked through departmental and institutional funding pathways.</p>
        <div className="space-y-4 mb-8">
          {[
            { phase: 'Phase 1', title: 'Faculty Engagement', body: 'Identify and recruit design partner faculty through warm introductions, departmental relationships, and mission-aligned outreach. Initial conversations should be diagnostic rather than demonstrative.' },
            { phase: 'Phase 2', title: 'Structured Pilot', body: 'Deploy within one course across 3–5 sections, ideally serving 100–300 students over a 6–8 week period. Framed as a research-informed instructional collaboration.' },
            { phase: 'Phase 3', title: 'Evidence Capture', body: 'Measure assignment completion behavior, timing of interventions, grade trajectory shifts, and faculty usability patterns against baseline conditions.' },
            { phase: 'Phase 4', title: 'Conversion Path', body: 'Translate course-level proof into department adoption, multi-course expansion, and then institutional licensing based on demonstrated value and operational fit.' },
          ].map(p => (
            <div key={p.phase} className="flex gap-6 bg-brand-soft border border-brand-border rounded-2xl p-5">
              <div className="text-xs font-bold uppercase tracking-[0.1em] text-brand-teal min-w-[64px]">{p.phase}</div>
              <div>
                <div className="font-bold text-navy text-sm mb-1">{p.title}</div>
                <p className="text-sm text-brand-gray leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {['Faculty Validation', 'Department Adoption', 'Leadership Funding', 'Institutional Scale'].map((step, i) => (
            <div key={step} className="bg-brand-soft border border-brand-border rounded-xl p-4 text-center">
              <div className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center mx-auto mb-2" style={{ background: '#00A8A8' }}>{i + 1}</div>
              <div className="text-sm font-bold text-navy">{step}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="s6" num="6" title="Pricing & Packaging Strategy" color="#4F8A5B">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { tier: 'Pilot Entry', desc: 'Low-cost or no-cost pilot to establish trust, evidence, and usability fit.' },
            { tier: 'Course License', desc: 'Entry model aligned to course-level experimentation and early departmental use.' },
            { tier: 'Department Bundle', desc: 'Expansion model supporting multiple sections, instructors, and coordinated outcomes work.' },
            { tier: 'Institutional License', desc: 'Enterprise model aligned to retention, performance, and system-level reporting value.' },
          ].map(t => <Card key={t.tier} title={t.tier}><p className="text-sm text-brand-gray leading-relaxed">{t.desc}</p></Card>)}
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {['Retention improvement and progression support', 'Course success metrics and academic performance improvement', 'Institutional reporting and accreditation value', 'Department-level instructional efficiency and consistency'].map(item => (
            <div key={item} className="flex items-start gap-3 bg-brand-soft border border-brand-border rounded-xl p-4">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#4F8A5B' }} />
              <span className="text-sm text-brand-gray">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="s7" num="7" title="Engagement Unit Model" color="#0C1F3F">
        <p className="body-text mb-6">An Engagement Unit (EU) is one complete interaction cycle between a student and the system — a prompt and a response. A student asks something, the system responds, and that exchange is one unit. It's a clean, quantifiable measure of both usage and cost without getting lost in technical detail.</p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card title="Per Student / Week">
            <div className="text-3xl font-black text-navy mb-1">~75</div>
            <p className="text-sm text-brand-gray">Engagement Units per week for meaningful engagement in a course like College Algebra</p>
          </Card>
          <Card title="Per Student / Semester">
            <div className="text-3xl font-black text-navy mb-1">~1,125</div>
            <p className="text-sm text-brand-gray">EUs across a standard 15-week semester — coaching, quizzes, study guides, and work feedback combined</p>
          </Card>
          <Card title="Per 1,000 Student Cohort">
            <div className="text-3xl font-black text-navy mb-1">~1.125M</div>
            <p className="text-sm text-brand-gray">Engagement Units per semester at scale — the foundation for modeling cost, value, and infrastructure</p>
          </Card>
        </div>
        <Card>
          <p className="text-sm text-brand-gray leading-relaxed">Once we define engagement this way, we can stop guessing and start modeling. Every coaching session, quiz question, study guide interaction, and work assessment maps to a discrete, measurable unit — giving us precise visibility into cost-per-student, engagement depth, and system capacity as we scale.</p>
        </Card>
      </Section>

      <Section id="s9" num="8" title="Metrics & Performance Framework" color="#5A3E6B">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Adoption Metrics', items: ['Faculty activation rate', 'Student engagement levels', 'Weekly active usage', 'Cross-section usage consistency'] },
            { label: 'Outcome Metrics', items: ['Reduction in DFW rates', 'Increase in pass rates', 'Improvement in retention indicators', 'Evidence of intervention effectiveness'] },
            { label: 'Expansion Metrics', items: ['Course-to-department adoption rate', 'Department-to-institution expansion', 'Pilot-to-paid conversion rate', 'Average time to expansion decision'] },
            { label: 'Efficiency Metrics', items: ['Time to first actionable insight', 'Reduction in time to intervention', 'Faculty time saved', 'Operational burden reduction'] },
          ].map(g => (
            <Card key={g.label} title={g.label}>
              <ul className="space-y-2">{g.items.map(i => <li key={i} className="text-sm text-brand-gray flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#5A3E6B' }} />{i}</li>)}</ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="s10" num="9" title="Launch Timeline" color="#4F8A5B">
        <div className="space-y-4">
          {PHASES.map(p => (
            <div key={p.phase} className="flex gap-6 bg-brand-soft border border-brand-border rounded-2xl p-5">
              <div className="text-sm font-black min-w-[64px]" style={{ color: p.color }}>{p.phase}</div>
              <div>
                <div className="font-bold text-navy text-sm mb-1">{p.title}</div>
                <p className="text-sm text-brand-gray leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="s11" num="10" title="Risk Assessment" color="#FF6B4A">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {RISKS.map(r => (
            <div key={r.risk} className="bg-brand-soft border border-brand-border rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#FF6B4A' }} />
                <span className="text-sm font-bold text-navy">{r.risk}</span>
              </div>
              <div className="flex items-start gap-3 pl-5">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#4F8A5B' }} />
                <span className="text-sm text-brand-gray">{r.mitigation}</span>
              </div>
            </div>
          ))}
        </div>
        <Card>
          <p className="text-sm font-semibold text-navy">The most material risk is not market awareness. It is failure to produce fast, credible, workflow-compatible value for faculty. Every GTM, product, and onboarding decision should be evaluated against this threshold.</p>
        </Card>
      </Section>

      <Section id="s12" num="11" title="Strategic Conclusion" color="#0C1F3F">
        <p className="body-text mb-4">Arrival's success in Higher Education depends on its ability to deliver immediate, observable instructional clarity, build credibility through evidence and faculty trust, and scale through departmental adoption rather than top-down mandates.</p>
        <p className="body-text mb-4">This is not an AI tool, an LMS extension, or a content repository. It is an adaptive, prescriptive learning operating system — a wayfinding system that reads signals, applies judgment, and guides students toward an arrival point. The GTM strategy establishes a repeatable pathway from individual faculty validation to institutional standardization, positioning Arrival as critical infrastructure for academic success.</p>
        <blockquote className="font-serif font-light text-navy border-l-4 border-navy pl-6"
                    style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          Enter narrowly. Prove value rigorously. Expand deliberately. Build a durable position as the operating system for learning inside universities.
        </blockquote>
      </Section>

      {/* Footer */}
      <footer className="border-t border-brand-border py-8" style={{ background: '#071429' }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold text-white hover:text-brand-teal transition-colors">
            ← Back to arrival.ai
          </Link>
          <p className="text-xs text-white/30">Arrival · Investor Overview · Confidential</p>
        </div>
      </footer>

    </div>
  )
}
