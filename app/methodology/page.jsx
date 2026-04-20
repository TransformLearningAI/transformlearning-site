import Link from 'next/link'
import AccessGate from '@/components/AccessGate'

export const metadata = {
  title: 'Methodology — How Transform Learning Estimates What Students Actually Know',
  description: 'A comprehensive methodology paper on Transform Learning\'s Bayesian competency estimation system: evidence fusion, adaptive item calibration, temporal learning dynamics, uncertainty quantification, and the integrity framework.',
}

/* ── Reusable layout pieces ────────────────────────────────────── */

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

function Callout({ color = '#00A8A8', children }) {
  return (
    <blockquote className="font-serif font-light text-navy border-l-4 pl-6 my-8"
                style={{ borderColor: color, fontSize: 'clamp(20px, 2.5vw, 28px)', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
      {children}
    </blockquote>
  )
}

function Bullet({ color = '#00A8A8', children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
      <span className="text-sm text-brand-gray leading-relaxed">{children}</span>
    </div>
  )
}

/* ── Hero stats ──────────────────────────────────────────────────── */

const STATS = [
  { label: 'Estimation Framework', value: 'Bayesian Posterior Updating' },
  { label: 'Item Calibration',     value: 'Adaptive Difficulty & Discrimination' },
  { label: 'Temporal Model',       value: 'Exponential Relevance Decay' },
  { label: 'Uncertainty',          value: 'Credible Intervals with t-Correction' },
]

/* ── Page ─────────────────────────────────────────────────────────── */

export default function Methodology() {
  return (
    <AccessGate pageName="Methodology & Scoring White Paper">
    <div className="min-h-screen bg-white">

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header style={{ background: '#0C1F3F' }} className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.06] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">White Paper &middot; Competency Estimation Methodology</span>
          </div>
          <h1 className="font-serif font-light text-white mb-4"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
            How We Estimate<br /><em className="italic opacity-80">What Students Actually Know</em>
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-2xl">
            A comprehensive methodology paper on Transform Learning&apos;s Bayesian competency
            estimation system &mdash; how it fuses evidence from multiple sources, calibrates for
            question difficulty, models how knowledge changes over time, quantifies its own
            uncertainty, and refuses to act when it doesn&apos;t know enough.
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

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 1 — The Measurement Challenge                    */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="measurement-challenge" num="1" title="The Measurement Challenge" color="#0C1F3F">
        <p className="body-text mb-4">
          What a student actually understands is invisible. It cannot be directly observed. It can only
          be inferred from observable behavior &mdash; answers to questions, quality of submitted work,
          depth of engagement in coaching conversations. Every one of these observations is noisy: a
          student who truly understands a concept can still answer a question wrong (a <strong className="text-navy">slip</strong>),
          and a student who does not understand can still answer correctly (a <strong className="text-navy">lucky guess</strong>).
        </p>
        <p className="body-text mb-4">
          Traditional grading systems ignore this noise. They compute a weighted average of assignment
          scores and report it as a fact. This creates three compounding failures:
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card title="Temporal Contamination">
            <p className="text-sm text-brand-gray leading-relaxed">
              A score from week two carries the same weight as one from yesterday. For a student who
              has been steadily improving, the average drags the estimate below their current capability.
              For a student who has been forgetting, it inflates the estimate above reality. The average
              is always wrong about the present.
            </p>
          </Card>
          <Card title="Evidence Blindness">
            <p className="text-sm text-brand-gray leading-relaxed">
              A multiple-choice answer and a written analysis are treated as equally informative. A
              homework completion checkbox and a proctored exam are given the same evidentiary standing.
              The system cannot distinguish between strong evidence and weak evidence because it treats
              all inputs as interchangeable.
            </p>
          </Card>
          <Card title="False Certainty">
            <p className="text-sm text-brand-gray leading-relaxed">
              A student assessed on two questions and a student assessed on twenty receive identically
              formatted numbers. There is no mechanism to communicate &ldquo;we have a good read on this
              student&rdquo; versus &ldquo;we are largely guessing.&rdquo; Faculty cannot calibrate the
              urgency of an intervention without knowing the precision of the estimate.
            </p>
          </Card>
        </div>
        <Callout>
          The core problem is not computational. It is epistemological. What does a number mean when
          the thing being measured is invisible, the instruments are imperfect, and the quantity changes
          over time? That is the problem this system is designed to solve.
        </Callout>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 2 — Competency as a Hidden State                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="hidden-state" num="2" title="Competency as a Hidden State" color="#5A3E6B">
        <p className="body-text mb-6">
          The theoretical foundation of Transform Learning&apos;s estimation system is a simple
          but consequential insight: <strong className="text-navy">a student&apos;s true competency on
          any skill is a hidden variable that we can never observe directly.</strong> We can only
          observe evidence &mdash; quiz answers, written work, coaching exchanges &mdash; and each
          observation is an imperfect, noisy reflection of the underlying state.
        </p>
        <p className="body-text mb-6">
          This reframes the measurement problem from &ldquo;calculate a score&rdquo; to
          &ldquo;estimate the most probable state of understanding, given all available evidence,
          while being honest about the remaining uncertainty.&rdquo;
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card title="The Prior: What We Believe Before Any Evidence">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              Before a student answers a single question, the system begins with a <strong className="text-navy">prior
              belief</strong>: a broad, uninformative distribution that says &ldquo;this student could
              be anywhere from complete novice to full mastery, and we have no reason to favor any
              position.&rdquo; This is not a guess. It is an explicit statement of ignorance.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              The prior is intentionally diffuse. It does not assume students start at zero. It does
              not assume students start at fifty. It says: &ldquo;we do not yet know.&rdquo;
            </p>
          </Card>
          <Card title="Posterior Updating: Learning from Evidence">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              Each new observation &mdash; a correct answer, an incorrect answer, a well-structured
              paragraph, a confused coaching exchange &mdash; updates the prior belief into a
              <strong className="text-navy"> posterior belief</strong>. The update is proportional to two things:
              how informative the evidence is, and how much it conflicts with the current belief.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              A correct answer on a difficult question shifts the estimate substantially. A correct
              answer on an easy question barely moves it. This is not a design choice &mdash; it is a
              mathematical consequence of Bayesian reasoning applied to evidence of varying diagnostic
              power.
            </p>
          </Card>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Why This Matters for Faculty</p>
        <Card>
          <p className="text-sm text-brand-gray leading-relaxed mb-3">
            The practical consequence is that the system automatically handles the problems that
            plague simple averages:
          </p>
          <div className="space-y-2">
            <Bullet color="#5A3E6B"><strong className="text-navy">Bad days are absorbed, not amplified.</strong> A single poor score against a strong prior produces a modest dip, not a collapse. The prior acts as a stabilizer.</Bullet>
            <Bullet color="#5A3E6B"><strong className="text-navy">Lucky guesses do not inflate.</strong> A correct answer on a question the student was unlikely to answer correctly (given their current estimate) produces a smaller update than a correct answer on a question they were expected to get right.</Bullet>
            <Bullet color="#5A3E6B"><strong className="text-navy">Uncertainty shrinks with evidence.</strong> After one quiz, the estimate is wide. After five, it narrows. The system communicates this difference rather than hiding it behind a single number.</Bullet>
            <Bullet color="#5A3E6B"><strong className="text-navy">Different sources contribute proportionally to their reliability.</strong> A controlled assessment updates the estimate more than a coaching signal, because it provides stronger evidence. This is not a weight someone assigned &mdash; it falls out of the model&apos;s reliability parameters.</Bullet>
          </div>
        </Card>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 3 — Evidence Fusion Architecture                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="evidence-fusion" num="3" title="Evidence Fusion Architecture" color="#00A8A8">
        <p className="body-text mb-6">
          The system accepts evidence from four distinct channels, each with a different
          <strong className="text-navy"> reliability coefficient</strong> reflecting the strength
          of inference it supports about true competency:
        </p>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { source: 'Controlled Assessment', coeff: '1.00', color: '#0C1F3F', desc: 'Quizzes and formal assessments with calibrated questions mapped to specific skills. Highest diagnostic reliability. Questions are designed to distinguish levels of understanding, not just recall.' },
            { source: 'Baseline Diagnostic', coeff: '1.00', color: '#00A8A8', desc: 'Initial onboarding assessment spanning all course skills. Establishes the first meaningful posterior for every skill before instruction begins. Equivalent reliability to controlled assessment.' },
            { source: 'Applied Work', coeff: '0.75', color: '#4F8A5B', desc: 'Student-submitted essays, projects, and problem sets analyzed by AI. Rich evidence of applied understanding, but higher measurement variance due to open-ended format and grading ambiguity.' },
            { source: 'Engagement Signal', coeff: '0.35', color: '#5A3E6B', desc: 'Indicators derived from coaching conversations. Engagement correlates with learning but is a weak proxy for mastery. A student may engage deeply and still not understand, or understand deeply without engaging.' },
          ].map(s => (
            <div key={s.source} className="bg-brand-soft border border-brand-border rounded-2xl p-5 border-t-4" style={{ borderTopColor: s.color }}>
              <div className="text-2xl font-black text-navy mb-1">{s.coeff}</div>
              <div className="text-xs font-bold uppercase tracking-[0.1em] mb-2" style={{ color: s.color }}>{s.source}</div>
              <p className="text-sm text-brand-gray leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Source-Normalized Fusion</p>
        <p className="body-text mb-4">
          A critical design constraint is <strong className="text-navy">source normalization</strong>: the
          system prevents any single evidence channel from dominating the estimate through volume alone.
          A student who has ten coaching exchanges and one quiz should not see coaching overwhelm the
          assessment signal.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card title="Phase 1: Intra-Channel Aggregation">
            <p className="text-sm text-brand-gray leading-relaxed">
              Within each evidence channel, all observations are combined into a single
              time-weighted aggregate. Ten coaching signals produce one channel estimate,
              not ten independent inputs competing for influence. This eliminates count-based
              distortion at the source level.
            </p>
          </Card>
          <Card title="Phase 2: Cross-Channel Fusion">
            <p className="text-sm text-brand-gray leading-relaxed">
              The per-channel aggregates are then fused using their reliability coefficients.
              The assessment channel (coefficient 1.0) and the engagement channel (coefficient 0.35)
              contribute proportionally to the fused estimate. The final result reflects the
              <em> quality</em> of evidence, not the <em>quantity</em>.
            </p>
          </Card>
        </div>

        <Callout color="#4F8A5B">
          One well-designed assessment is worth more than twenty coaching interactions &mdash; and the
          mathematics enforces that principle without exception.
        </Callout>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 4 — Adaptive Item Calibration                    */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="item-calibration" num="4" title="Adaptive Item Calibration" color="#FF6B4A">
        <p className="body-text mb-6">
          Not all questions are equal. A student who answers a difficult application question
          correctly tells us far more than a student who answers an easy recall question correctly.
          The system accounts for this through <strong className="text-navy">item calibration</strong> &mdash;
          modeling each question&apos;s diagnostic properties to extract maximum information from
          every response.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card title="Difficulty Parameter">
            <p className="text-sm text-brand-gray leading-relaxed">
              Each question has an estimated difficulty level, reflecting the competency threshold
              at which a student has a 50% chance of answering correctly. Questions are generated
              across three difficulty tiers &mdash; recall, comprehension, and application &mdash;
              ensuring the assessment probes multiple depths of understanding, not just surface
              recognition.
            </p>
          </Card>
          <Card title="Discrimination Index">
            <p className="text-sm text-brand-gray leading-relaxed">
              The discrimination index measures how well a question separates students who have
              mastered a skill from those who have not. A high-discrimination question is one where
              competent students almost always answer correctly and incompetent students almost
              always answer incorrectly. Low-discrimination questions (where everyone gets it right
              or everyone gets it wrong) provide minimal diagnostic value.
            </p>
          </Card>
          <Card title="Guess and Slip Parameters">
            <p className="text-sm text-brand-gray leading-relaxed">
              The <strong className="text-navy">guess rate</strong> models the probability that a
              student who has not mastered the skill answers correctly by chance (typically 0.25 for
              four-choice questions). The <strong className="text-navy">slip rate</strong> models the
              probability that a student who has mastered the skill answers incorrectly due to
              carelessness, misreading, or test anxiety. Both are estimated per question format.
            </p>
          </Card>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">How Item Calibration Improves Estimation</p>
        <Card>
          <p className="text-sm text-brand-gray leading-relaxed mb-3">
            Without item calibration, the system treats a correct answer on an easy recall question
            and a correct answer on a difficult application question identically. Both produce the
            same upward shift in the estimate. This is mathematically wrong and educationally misleading.
          </p>
          <p className="text-sm text-brand-gray leading-relaxed mb-3">
            With item calibration, the system extracts the right amount of information from each response:
          </p>
          <div className="space-y-2">
            <Bullet color="#FF6B4A"><strong className="text-navy">Correct on a hard question:</strong> large upward update. The student demonstrated understanding at a level where guessing is unlikely.</Bullet>
            <Bullet color="#FF6B4A"><strong className="text-navy">Correct on an easy question:</strong> small upward update. Most students get this right regardless of mastery level, so it provides weak evidence.</Bullet>
            <Bullet color="#FF6B4A"><strong className="text-navy">Incorrect on an easy question:</strong> large downward update. This is unexpected for a competent student and suggests a real gap.</Bullet>
            <Bullet color="#FF6B4A"><strong className="text-navy">Incorrect on a hard question:</strong> small downward update. Many competent students miss difficult questions; this is within expected variance.</Bullet>
          </div>
        </Card>

        <Callout color="#FF6B4A">
          The goal is not more questions. It is more informative questions. A three-question
          assessment with well-calibrated items at different difficulty levels can produce a
          tighter estimate than a twenty-question assessment with uniformly easy items.
        </Callout>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 5 — Temporal Learning Dynamics                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="temporal-dynamics" num="5" title="Temporal Learning Dynamics" color="#4F8A5B">
        <p className="body-text mb-6">
          Knowledge is not static. Students learn, forget, relearn, and consolidate. A proficiency
          estimate that ignores time is a photograph of a moving target &mdash; it captures one
          moment but says nothing about direction, speed, or whether the student will still know
          this material next week. The system models three temporal phenomena:
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card title="Relevance Decay">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              Older evidence is less informative about current competency than recent evidence.
              The system applies exponential relevance decay with a <strong className="text-navy">45-day
              half-life</strong>: an observation from today has full weight, an observation from 45
              days ago has half weight, and an observation from 90 days ago has one-quarter weight.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              This is a continuous, smooth decay &mdash; not a hard cutoff. Old observations still
              contribute to the estimate; they simply cannot dominate it when fresher evidence exists.
            </p>
          </Card>
          <Card title="Velocity Estimation">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              The system computes an exponentially-weighted velocity across consecutive observations.
              Recent score changes carry more weight than older ones (decay factor: 0.7 per step),
              so a student who was declining but has recently turned around will show a positive
              velocity rather than the stagnation a simple average would report.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              Velocity is classified into five regimes: accelerating (&gt;+5 pts), improving (+1 to +5),
              stable (&minus;1 to +1), slipping (&minus;5 to &minus;1), and declining (&lt;&minus;5). Each regime
              carries specific intervention implications for faculty.
            </p>
          </Card>
          <Card title="Authenticity Screening">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              Not all improvement is genuine learning. The system computes a continuous
              <strong className="text-navy"> authenticity index</strong> (0&ndash;1) that distinguishes
              sustained, consistent improvement from noisy or suspicious score changes. The index
              combines directional consistency, velocity magnitude, and an anomaly penalty.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              Only when the authenticity index exceeds 0.4 and at least three data points exist
              does the system apply any trajectory-based adjustment to the competency estimate.
              Below that threshold, the estimate relies solely on the evidence-weighted posterior.
            </p>
          </Card>
        </div>

        <div className="bg-brand-mist border border-brand-border rounded-2xl p-6 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-4">Relevance Weight by Observation Age</p>
          <div className="grid grid-cols-5 gap-3">
            {[
              { age: 'Today', weight: '100%' },
              { age: '2 Weeks', weight: '80%' },
              { age: '45 Days', weight: '50%' },
              { age: '90 Days', weight: '25%' },
              { age: '6 Months', weight: '6%' },
            ].map(r => (
              <div key={r.age} className="text-center">
                <div className="text-xl font-black text-navy">{r.weight}</div>
                <div className="text-xs text-brand-gray mt-1">{r.age}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Adaptive Outlier Screening</p>
        <p className="body-text mb-4">
          Rather than flagging any score change exceeding a fixed threshold, the system computes each
          student&apos;s natural variability and flags changes beyond <strong className="text-navy">2&sigma;
          </strong> of their own score delta distribution (with a minimum floor of 20 points). This means:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-brand-gray leading-relaxed">
              <strong className="text-navy">High-variability students</strong> &mdash; who naturally
              fluctuate between strong and weak performances &mdash; are not constantly flagged for
              normal behavior. Their threshold adapts to their pattern.
            </p>
          </Card>
          <Card>
            <p className="text-sm text-brand-gray leading-relaxed">
              <strong className="text-navy">Consistent students</strong> &mdash; who typically score within
              a narrow band &mdash; trigger a flag on smaller deviations that would go unnoticed under
              a universal threshold. A 25-point jump for a student who never varies by more than 5
              points is genuinely anomalous.
            </p>
          </Card>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 6 — The Error Model                              */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="error-model" num="6" title="The Error Model" color="#FF6B4A">
        <p className="body-text mb-6">
          Every measurement system produces errors. The question is not whether errors exist, but
          whether the system identifies, classifies, and corrects for them. Transform Learning
          models six distinct error types, each with a different correction mechanism:
        </p>

        <div className="space-y-4 mb-8">
          {[
            {
              type: 'Lucky Guess',
              desc: 'A student who has not mastered a skill answers correctly by chance.',
              mechanism: 'The guess parameter (typically 0.25 for four-choice MCQ) limits the upward update from any single correct answer. A correct answer on a question where the student\'s current estimate predicts a low probability of success produces a smaller update than naively expected.',
              color: '#FF6B4A',
            },
            {
              type: 'Careless Slip',
              desc: 'A student who has mastered a skill answers incorrectly due to misreading, rushing, or test anxiety.',
              mechanism: 'The slip parameter limits the downward update from a single incorrect answer against a strong prior. One wrong answer does not collapse a well-established estimate. The prior acts as a stabilizer, requiring consistent counter-evidence before revising downward.',
              color: '#5A3E6B',
            },
            {
              type: 'Cramming Effect',
              desc: 'A student achieves a high score through short-term memorization that decays rapidly.',
              mechanism: 'Relevance decay naturally discounts old high scores. If a student scores 90 on day one and never demonstrates that level again, the 90 fades as a contributor. Authenticity screening requires sustained improvement across multiple observations before adjusting the trajectory upward.',
              color: '#0C1F3F',
            },
            {
              type: 'Evidence Sparsity',
              desc: 'The system has too few observations to produce a reliable estimate.',
              mechanism: 'The credible interval widens dramatically with sparse data. With one observation, the interval can span 30+ points. The integrity framework blocks automated interventions when uncertainty exceeds the action threshold, deferring to human judgment.',
              color: '#00A8A8',
            },
            {
              type: 'Source Imbalance',
              desc: 'A high volume of low-reliability evidence (e.g., coaching signals) overwhelms a small amount of high-reliability evidence (e.g., quiz scores).',
              mechanism: 'Source-normalized fusion prevents this categorically. Each channel produces one aggregate signal regardless of observation count. Ten coaching signals cannot outweigh one quiz because they contribute through a single channel aggregate, not ten independent inputs.',
              color: '#4F8A5B',
            },
            {
              type: 'Temporal Contamination',
              desc: 'Stale evidence from early in the semester distorts the current estimate.',
              mechanism: 'Exponential relevance decay with a 45-day half-life ensures that old observations fade smoothly. A 6-month-old score carries only 6% of its original weight. There is no threshold at which old evidence suddenly disappears; it simply becomes irrelevant gradually.',
              color: '#FF6B4A',
            },
          ].map(e => (
            <div key={e.type} className="bg-brand-soft border border-brand-border rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: e.color }} />
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">{e.type}</h3>
                  <p className="text-sm italic text-brand-gray mb-2">{e.desc}</p>
                  <p className="text-sm text-brand-gray leading-relaxed"><strong className="text-navy">Correction:</strong> {e.mechanism}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Callout color="#FF6B4A">
          The system does not eliminate error. It bounds error, classifies it, and prevents it from
          compounding. A single lucky guess cannot create a false mastery signal. A single bad day
          cannot erase genuine learning. The architecture is designed so that every error type has
          a named, documented correction mechanism.
        </Callout>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 7 — Uncertainty Quantification                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="uncertainty" num="7" title="Uncertainty Quantification" color="#00A8A8">
        <p className="body-text mb-6">
          The system never reports a point estimate without a <strong className="text-navy">credible
          interval</strong> that communicates the precision of the estimate. Instead of &ldquo;this
          student is at 72%,&rdquo; the system reports &ldquo;this student is at 72% (65&ndash;79).&rdquo;
          The width of the interval is the most important number in the system. It tells faculty:
          &ldquo;here is how sure we are.&rdquo;
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card title="Standard Error with Small-Sample Correction">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              The interval width is derived from the <strong className="text-navy">standard error of
              the mean</strong> of all observations, multiplied by the appropriate t-value for a 90%
              credible interval. For small samples (n &le; 10), the Student&apos;s t-distribution is
              used rather than the normal approximation, which correctly produces wider intervals when
              data is sparse.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              With a single observation, the t-value is 6.314 &mdash; producing a wide, honest
              interval. By ten observations, it narrows to 1.812. This is not a heuristic. It is the
              statistically correct treatment for small-sample uncertainty.
            </p>
          </Card>
          <Card title="Evidence Quality Adjustment">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              The interval width is further adjusted by the proportion of high-reliability evidence
              channels (controlled assessments and diagnostics) in the observation set. When all
              evidence comes from controlled assessments, the interval narrows by up to 15%.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              This reflects the practical reality that assessment scores have lower measurement
              noise than engagement signals, independent of sample size. A student assessed
              entirely through quizzes can be estimated more precisely than one assessed
              primarily through coaching interactions.
            </p>
          </Card>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Confidence Accumulation</p>
        <p className="body-text mb-4">
          Overall confidence (0&ndash;1) accumulates with <strong className="text-navy">diminishing
          returns</strong>. Each additional observation from a channel adds less confidence than
          the previous one, following a geometric model:
        </p>
        <Card>
          <p className="text-sm text-brand-gray leading-relaxed mb-3">
            <strong className="text-navy">Channel Confidence = 1 &minus; (1 &minus; rate)<sup>n</sup></strong>,
            where <em>rate</em> is the per-observation contribution and <em>n</em> is the observation count.
          </p>
          <p className="text-sm text-brand-gray leading-relaxed">
            The first controlled assessment adds 15% toward full confidence. The second adds 12.75%.
            The fifth adds 7.5%. Full confidence requires either extensive evidence from a single
            reliable channel or corroborating evidence across multiple channels. This prevents
            the system from reaching false certainty on a narrow evidence base.
          </p>
        </Card>

        <div className="bg-brand-mist border border-brand-border rounded-2xl p-6 mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-4">Reliability Tiers</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'High Reliability', criteria: 'Confidence \u2265 80%, interval width \u2264 10 pts', color: '#4F8A5B' },
              { label: 'Moderate Reliability', criteria: 'Confidence \u2265 50%, interval width \u2264 18 pts', color: '#00A8A8' },
              { label: 'Low Reliability', criteria: 'Below moderate thresholds', color: '#FF6B4A' },
            ].map(r => (
              <div key={r.label} className="text-center">
                <div className="text-lg font-black mb-1" style={{ color: r.color }}>{r.label}</div>
                <div className="text-xs text-brand-gray">{r.criteria}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 8 — The Integrity Framework                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="integrity" num="8" title="The Integrity Framework" color="#0C1F3F">
        <p className="body-text mb-6">
          Every competency estimate passes through a four-layer integrity framework before it is
          persisted or surfaced to any user. The system operates under the constraint that
          <strong className="text-navy"> automated action is conditional, not assumed</strong>. When
          any constraint fails, the system defers to human review rather than acting on uncertain
          or potentially unfair estimates.
        </p>

        <div className="space-y-4 mb-8">
          {[
            { layer: 'L0', title: 'Input Integrity', color: '#0C1F3F', body: 'Verifies consent, data provenance, and structural validity. Only necessary fields are propagated forward. An estimate without a verifiable student identity and skill mapping is rejected before computation begins.' },
            { layer: 'L1', title: 'Explainability Gate', color: '#00A8A8', body: 'Requires every estimate to include an evidence summary that can be read by a human. An estimate that cannot explain the basis for its score is flagged as inadmissible. This ensures full traceability from number to evidence.' },
            { layer: 'L2', title: 'Uncertainty Constraint', color: '#4F8A5B', body: 'Computes the variance of the student\'s score distribution and checks it against the action threshold (\u03B4 = 0.25). Prevents the system from recommending interventions based on unstable or overconfident estimates. High uncertainty always defers to faculty.' },
            { layer: 'L3', title: 'Decision Hierarchy', color: '#5A3E6B', body: 'Evaluates all constraints in strict priority: Privacy \u227B Equity \u227B Risk \u227B Confidence. Automated action requires all constraints to pass. Insufficient assessment history always defers to human judgment. The system cannot override a failed constraint.' },
          ].map(l => (
            <div key={l.layer} className="flex gap-6 bg-brand-soft border border-brand-border rounded-2xl p-5">
              <div className="text-sm font-black min-w-[28px]" style={{ color: l.color }}>{l.layer}</div>
              <div>
                <div className="font-bold text-navy text-sm mb-1">{l.title}</div>
                <p className="text-sm text-brand-gray leading-relaxed">{l.body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Equity Assurance</p>
        <p className="body-text mb-4">
          By design, Transform Learning does not collect race, gender, or demographic data. Equity is
          monitored using proxy groupings &mdash; enrollment cohort, institution type, and engagement
          pattern &mdash; to detect whether AI scoring produces systematically different outcomes across
          groups. The equity metric is the difference in competency rates (estimate &ge; 70) between
          groups, held to an &epsilon; = 0.10 threshold. A deviation exceeding 10% triggers automatic
          escalation for human review.
        </p>
        <Card>
          <p className="text-sm text-brand-gray leading-relaxed">
            <strong className="text-navy">L4: Continuous Surveillance</strong> monitors drift,
            anomalies, and equity deviations across all scored assessments in real time. Score changes
            exceeding 40 points between consecutive assessments for the same skill are flagged
            regardless of whether the individual estimate passed the integrity framework.
          </p>
        </Card>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 9 — AI-Driven Assessment Scoring                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="ai-scoring" num="9" title="AI-Driven Assessment Scoring" color="#00A8A8">
        <p className="body-text mb-6">
          The raw skill-level scores that feed the estimation system are generated by Anthropic&apos;s
          Claude, operating under constrained system prompts that enforce evidence-based scoring
          discipline. The AI does not produce final estimates. It produces <strong className="text-navy">raw
          observations</strong> that enter the Bayesian pipeline as one evidence source among many.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card title="Controlled Assessment Scoring">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              The AI receives the assessment questions, the correct answers, the student&apos;s responses,
              and the skill definitions for the course. It produces a score on a 0&ndash;100 rubric,
              a confidence rating reflecting how much evidence the questions provided, and an evidence
              summary citing specific response quality.
            </p>
            <div className="space-y-2 mt-3">
              <Bullet color="#0C1F3F">0&ndash;30: Little to no demonstrated understanding</Bullet>
              <Bullet color="#FF6B4A">31&ndash;50: Partial understanding, significant gaps</Bullet>
              <Bullet color="#5A3E6B">51&ndash;70: Foundational competency, some gaps</Bullet>
              <Bullet color="#00A8A8">71&ndash;85: Solid understanding, minor gaps</Bullet>
              <Bullet color="#4F8A5B">86&ndash;100: Strong mastery demonstrated</Bullet>
            </div>
          </Card>
          <Card title="Applied Work Scoring">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              For student-submitted work (essays, projects, problem sets), the AI analyzes the
              submission against all course skills, returning a score only for skills where the work
              provides direct evidence. Skills without evidence receive <code className="text-xs bg-brand-mist px-1.5 py-0.5 rounded">null</code> rather
              than zero &mdash; ensuring the absence of evidence is not treated as evidence of absence.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              The scoring prompt enforces rigor: &ldquo;High scores require clear demonstration, not
              just mention.&rdquo; Every assessment includes specific citations from the student&apos;s
              work to maintain full traceability from score to source.
            </p>
          </Card>
        </div>

        <Card>
          <p className="text-sm font-semibold text-navy">
            The AI&apos;s raw scores are the starting point, not the final answer. They enter the
            Bayesian estimation pipeline as one observation among many, subject to the same relevance
            decay, source normalization, item calibration, and integrity constraints as every other
            evidence channel.
          </p>
        </Card>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 10 — Validation and Accuracy                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="validation" num="10" title="Validation and Accuracy" color="#4F8A5B">
        <p className="body-text mb-6">
          A measurement system is only as valuable as the evidence that it measures what it claims to
          measure. Transform Learning validates the estimation system across four dimensions:
        </p>

        <div className="space-y-4 mb-8">
          {[
            {
              title: 'Construct Validity',
              body: 'Do the competency estimates actually reflect understanding? The system tests this by examining whether students with high estimates consistently demonstrate mastery on novel questions (not just questions they\'ve seen before). If the estimate predicts performance on unseen assessments, it is measuring something real.',
              color: '#4F8A5B',
            },
            {
              title: 'Predictive Validity',
              body: 'Do the estimates predict future outcomes? As longitudinal data accumulates, the system will measure whether mid-semester competency estimates predict end-of-course performance, course completion, and performance in subsequent courses. An estimate that cannot predict forward has limited practical value.',
              color: '#00A8A8',
            },
            {
              title: 'Internal Consistency',
              body: 'Do different evidence channels converge on the same estimate? When a student\'s quiz scores, applied work scores, and engagement signals all point in the same direction, confidence is warranted. When they diverge, the system flags the inconsistency rather than averaging over it.',
              color: '#0C1F3F',
            },
            {
              title: 'Calibration Accuracy',
              body: 'When the system says it is 80% confident, is it correct 80% of the time? Calibration analysis compares stated confidence levels against observed accuracy rates. A well-calibrated system is neither overconfident nor underconfident. Miscalibration is detected and corrected through ongoing monitoring.',
              color: '#5A3E6B',
            },
          ].map(v => (
            <div key={v.title} className="bg-brand-soft border border-brand-border rounded-2xl p-6 border-l-4" style={{ borderLeftColor: v.color }}>
              <h3 className="text-base font-bold text-navy mb-2">{v.title}</h3>
              <p className="text-sm text-brand-gray leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>

        <Callout color="#4F8A5B">
          We do not ask faculty to trust the system because we say it works. We ask them to trust it
          because it can demonstrate, with their own students and their own course data, that the
          estimates hold up under scrutiny.
        </Callout>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 11 — The Roadmap                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="roadmap" num="11" title="The Estimation Roadmap" color="#5A3E6B">
        <p className="body-text mb-6">
          The current system is built on strong theoretical priors and conservative defaults. As
          Transform Learning accumulates institutional data across pilot deployments, the estimation
          system will evolve from informed defaults to empirically calibrated parameters. The following
          represent the highest-priority evolution targets, in order of feasibility:
        </p>

        <div className="space-y-4 mb-8">
          {[
            {
              title: 'Empirically Calibrated Reliability Coefficients',
              horizon: 'After 2\u20133 pilot semesters',
              body: 'Current reliability coefficients (assessment: 1.0, applied work: 0.75, engagement: 0.35) are informed priors. With sufficient paired data \u2014 where students have observations from multiple channels for the same skill \u2014 the system will compute the actual predictive validity of each channel against end-of-course outcomes and update the coefficients accordingly.',
            },
            {
              title: 'Adaptive Relevance Half-Life',
              horizon: 'After 1\u20132 pilot semesters',
              body: 'The 45-day half-life is calibrated for a standard 15-week semester. Intensive summer courses, year-long sequences, and modular programs have different temporal dynamics. With cross-course data, the system will learn optimal decay rates per course structure rather than applying a universal constant.',
            },
            {
              title: 'Full Item Response Theory Integration',
              horizon: 'After 5+ pilot semesters',
              body: 'The current item calibration uses difficulty tiers and format-level guess/slip parameters. Full IRT models each question\'s difficulty and discrimination individually, producing substantially more precise estimates per question answered. This requires a large item bank with response data across many students. As the question bank grows through adaptive generation, IRT integration becomes increasingly feasible.',
            },
            {
              title: 'Bayesian Knowledge Tracing',
              horizon: 'After 3\u20135 pilot semesters',
              body: 'BKT models competency as a hidden Markov state that transitions probabilistically with each learning event. It estimates the probability that a student has truly learned a skill versus performing correctly by chance, naturally handling lucky-guess and careless-slip failure modes at the model level rather than through separate correction parameters.',
            },
            {
              title: 'Predictive Credible Intervals',
              horizon: 'After 2\u20133 pilot semesters',
              body: 'Current intervals describe uncertainty about the present estimate. With longitudinal data, the system will produce predictive intervals: \u201Cbased on students with similar learning dynamics, this student\'s competency is likely to be between X and Y by end of term.\u201D This transforms the interval from a retrospective measurement into a forward-looking planning tool for faculty.',
            },
            {
              title: 'Cross-Institutional Equity Monitoring',
              horizon: 'After 3+ pilot semesters across institutions',
              body: 'With data across multiple institutions, the system will test for scoring equity across institution type (community college vs. research university), course format (online vs. in-person), and engagement pattern clusters \u2014 without ever collecting protected demographic attributes.',
            },
          ].map(d => (
            <div key={d.title} className="bg-brand-soft border border-brand-border rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-base font-bold text-navy">{d.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-teal whitespace-nowrap px-2 py-1 rounded-full bg-brand-mist border border-brand-border">
                  {d.horizon}
                </span>
              </div>
              <p className="text-sm text-brand-gray leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>

        <Card>
          <p className="text-sm font-semibold text-navy mb-3">
            The Design Principle Behind Every Evolution
          </p>
          <p className="text-sm text-brand-gray leading-relaxed">
            Every parameter in the current system has been set to a defensible default. No parameter
            has been set by convenience. As data accumulates, each default can be replaced with an
            empirically learned value &mdash; but only when the evidence for the change exceeds the
            confidence in the current prior. This is a system designed to sharpen, not drift.
          </p>
        </Card>
      </Section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SECTION 12 — Closing                                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <Section id="closing" num="12" title="What This Means" color="#0C1F3F">
        <p className="body-text mb-4">
          Transform Learning&apos;s estimation system is not a grading tool. It does not assign
          numbers and move on. It is a transparent, governed diagnostic pipeline where every
          estimate can be traced to its evidence, every number carries an honest measure of its
          own uncertainty, and every automated decision is conditional on satisfying integrity,
          equity, and explainability constraints.
        </p>
        <p className="body-text mb-4">
          For <strong className="text-navy">faculty</strong>: this means you can trust the estimates
          enough to act on them &mdash; because the system tells you when it doesn&apos;t know, and
          it never pretends to be more certain than the evidence warrants.
        </p>
        <p className="body-text mb-4">
          For <strong className="text-navy">deans and administrators</strong>: this means you have a
          measurement system that can withstand scrutiny from accreditors, institutional review boards,
          and faculty governance committees &mdash; because every decision is documented, every
          threshold is explicit, and the system defers to human judgment when it reaches the limits
          of its evidence.
        </p>
        <p className="body-text mb-4">
          For <strong className="text-navy">investors</strong>: this means the scoring methodology
          is built on established statistical foundations (Bayesian estimation, item response theory,
          small-sample inference) rather than ad-hoc heuristics &mdash; and is designed to improve
          with every semester of data it encounters without requiring architectural changes.
        </p>
        <Callout>
          We do not claim this system is perfect. We claim it is honest about what it knows,
          transparent about how it knows it, and architecturally designed to get more precise with
          every piece of evidence it encounters. That is the standard any institution should expect
          from a system that presumes to measure what their students actually understand.
        </Callout>
      </Section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-brand-border py-8" style={{ background: '#071429' }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold text-white hover:text-brand-teal transition-colors">
            &larr; Back to transformlearning.ai
          </Link>
          <p className="text-xs text-white/30">Transform Learning &middot; Competency Estimation Methodology &middot; April 2026</p>
        </div>
      </footer>

    </div>
    </AccessGate>
  )
}
