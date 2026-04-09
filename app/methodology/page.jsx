import Link from 'next/link'
import AccessGate from '@/components/AccessGate'

export const metadata = {
  title: 'Methodology — How Arrival Measures What Students Know',
  description: 'A detailed white paper on Arrival\'s AI-driven proficiency scoring engine: multi-source evidence weighting, trajectory analysis, confidence intervals, governance, and future directions.',
}

/* ── Reusable layout pieces (mirrors /investors pattern) ─────── */

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

/* ── Hero stats ──────────────────────────────────────────────── */

const STATS = [
  { label: 'Evidence Sources',    value: 'Quizzes, Assessments, Work Uploads, Coaching' },
  { label: 'Recency Model',       value: 'Exponential Decay (45-Day Half-Life)' },
  { label: 'Anomaly Detection',   value: 'Adaptive 2\u03C3 Threshold' },
  { label: 'Confidence Intervals', value: 'Standard Error with t-Correction' },
]

/* ── Page ─────────────────────────────────────────────────────── */

export default function Methodology() {
  return (
    <AccessGate pageName="Methodology & Scoring White Paper">
    <div className="min-h-screen bg-white">

      {/* ── Nav ──────────────────────────────────────────────── */}
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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header style={{ background: '#0C1F3F' }} className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.06] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">White Paper &middot; Proficiency Scoring Methodology</span>
          </div>
          <h1 className="font-serif font-light text-white mb-4"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
            How Arrival Measures<br /><em className="italic opacity-80">What Students Know</em>
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-2xl">
            A detailed methodology paper on Arrival&apos;s multi-source, trajectory-aware proficiency
            scoring engine &mdash; how it works, what corrections have been made, our confidence in
            those corrections, and what will change as more data becomes available.
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

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 1 — Executive Summary                        */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="executive-summary" num="1" title="Executive Summary" color="#0C1F3F">
        <p className="body-text mb-4">
          Arrival&apos;s proficiency engine converts raw evidence &mdash; quiz scores, assessment results,
          work uploads, and coaching interactions &mdash; into a single, defensible proficiency estimate
          for every student on every skill. That estimate is not a simple average. It is the output of a
          multi-layered pipeline that accounts for the reliability of each evidence source, the recency
          of each observation, the trajectory of a student&apos;s learning over time, and the statistical
          confidence we can place in the result.
        </p>
        <p className="body-text mb-4">
          Every score passes through a governance layer that enforces fairness thresholds, explainability
          requirements, and uncertainty constraints before it is surfaced to faculty or used to inform
          interventions. The system cannot act on uncertain predictions. When any constraint fails, it
          defers to human review.
        </p>
        <Callout>
          The goal is not to assign a number. It is to produce a proficiency estimate that a faculty
          member can trust enough to act on &mdash; and that a student can trust enough to learn from.
        </Callout>
        <p className="body-text">
          This paper describes each stage of the pipeline, the recent corrections made to improve
          accuracy, the statistical confidence behind those corrections, and the directions we expect
          the model to evolve as more institutional data becomes available.
        </p>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 2 — The Problem with Simple Averages          */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="the-problem" num="2" title="The Problem with Simple Averages" color="#FF6B4A">
        <p className="body-text mb-6">
          Traditional grading systems compute a mean or weighted mean of assignment scores. This
          approach has three fundamental accuracy problems that compound as a course progresses:
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card title="Source Blindness">
            <p className="text-sm text-brand-gray leading-relaxed">
              A quiz answer and a coaching session exchange are treated with equal evidentiary weight.
              In reality, a controlled quiz provides far stronger evidence of mastery than an
              engagement signal from a coaching conversation. Simple averages cannot distinguish
              between these.
            </p>
          </Card>
          <Card title="Temporal Flatness">
            <p className="text-sm text-brand-gray leading-relaxed">
              A score from the first week of the semester carries the same weight as one from
              yesterday. For a student who has been improving steadily, this drags the estimate
              down. For a student who has been declining, it inflates the estimate. The average
              lags the truth in both directions.
            </p>
          </Card>
          <Card title="False Precision">
            <p className="text-sm text-brand-gray leading-relaxed">
              A student scored on two quiz questions receives a number that looks identical in format
              to a student scored on twenty. The average provides no mechanism to distinguish between
              &ldquo;we&apos;re fairly certain&rdquo; and &ldquo;we&apos;re guessing.&rdquo; Without
              confidence intervals, faculty cannot calibrate the urgency of an intervention.
            </p>
          </Card>
        </div>
        <Card>
          <p className="text-sm font-semibold text-navy">
            Arrival&apos;s proficiency engine was built to solve all three problems simultaneously. Every
            score carries source weights, recency decay, and a confidence interval that tells faculty
            not just where a student stands &mdash; but how sure we are about it.
          </p>
        </Card>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 3 — Multi-Source Evidence Weighting           */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="evidence-weighting" num="3" title="Multi-Source Evidence Architecture" color="#00A8A8">
        <p className="body-text mb-6">
          The engine accepts evidence from four distinct source types, each assigned a reliability
          weight reflecting how strongly a single observation from that source indicates true mastery:
        </p>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { source: 'Quiz', weight: '1.00', color: '#0C1F3F', desc: 'Controlled assessment environment. Questions are calibrated to specific skills. Highest evidentiary reliability.' },
            { source: 'Assessment', weight: '1.00', color: '#00A8A8', desc: 'Initial onboarding assessment. Broader in scope, establishes a baseline across all course skills.' },
            { source: 'Work Upload', weight: '0.75', color: '#4F8A5B', desc: 'Student-submitted work analyzed by AI. Rich evidence of applied mastery, but noisier due to open-ended format.' },
            { source: 'Coaching', weight: '0.35', color: '#5A3E6B', desc: 'Signals derived from coaching interactions. Engagement is a weak proxy for mastery. Lowest reliability.' },
          ].map(s => (
            <div key={s.source} className="bg-brand-soft border border-brand-border rounded-2xl p-5 border-t-4" style={{ borderTopColor: s.color }}>
              <div className="text-2xl font-black text-navy mb-1">{s.weight}</div>
              <div className="text-xs font-bold uppercase tracking-[0.1em] mb-2" style={{ color: s.color }}>{s.source}</div>
              <p className="text-sm text-brand-gray leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Source-Normalized Weighting</p>
        <p className="body-text mb-4">
          A critical design decision is <strong className="text-navy">source normalization</strong>. Rather
          than weighting each individual observation independently (which allows high-volume, low-reliability
          sources to overwhelm the estimate), the engine first computes a recency-weighted average
          <em> within</em> each source, then combines those per-source averages by reliability weight.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card title="Phase 1: Within-Source Averaging">
            <p className="text-sm text-brand-gray leading-relaxed">
              For each source type, all observations are combined into a single recency-weighted
              average. If a student has ten coaching signals and one quiz score, the coaching signals
              produce one aggregate number &mdash; not ten individual weights competing against a
              single quiz.
            </p>
          </Card>
          <Card title="Phase 2: Cross-Source Combination">
            <p className="text-sm text-brand-gray leading-relaxed">
              The per-source averages are then combined using reliability weights. The quiz average
              (weight 1.0) and the coaching average (weight 0.35) are brought together proportionally.
              This ensures the final score reflects the <em>quality</em> of evidence, not just the
              <em> quantity</em>.
            </p>
          </Card>
        </div>

        <Callout color="#4F8A5B">
          One strong quiz is worth more than ten coaching signals &mdash; and the algorithm ensures
          the math reflects that.
        </Callout>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 4 — Exponential Recency Model                 */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="recency-model" num="4" title="Exponential Recency Model" color="#4F8A5B">
        <p className="body-text mb-6">
          Learning is temporal. A student&apos;s proficiency today is better reflected by recent
          evidence than by observations from the start of the semester. The engine applies exponential
          recency decay with a <strong className="text-navy">45-day half-life</strong> to every observation.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card title="How It Works">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              Each observation&apos;s weight is multiplied by 2<sup>-t/45</sup>, where <em>t</em> is
              the age of the observation in days. An observation from today has full weight. An
              observation from 45 days ago has half weight. An observation from 90 days ago has
              one-quarter weight.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              This is a continuous, smooth decay &mdash; not a hard cutoff. Old observations still
              contribute; they simply cannot dominate the estimate when fresher evidence exists.
            </p>
          </Card>
          <Card title="Why Exponential, Not Linear">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              The previous model used a linear decay function that flattened after 70 days, treating
              a 70-day-old score identically to a 700-day-old one. This created a &ldquo;stale floor&rdquo;
              where old evidence accumulated permanent influence regardless of age.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              Exponential decay mirrors how learning actually works: recent performance is the
              strongest indicator of current capability, and the influence of older evidence fades
              naturally without artificial thresholds.
            </p>
          </Card>
        </div>

        <div className="bg-brand-mist border border-brand-border rounded-2xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-4">Recency Weight by Observation Age</p>
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
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 5 — Trajectory Analysis                       */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="trajectory" num="5" title="Trajectory Analysis" color="#5A3E6B">
        <p className="body-text mb-6">
          A point estimate tells you where a student is. Trajectory analysis tells you where they
          are <em>going</em>. The engine analyzes the sequence of scores over time to compute velocity,
          consistency, and a genuineness score that distinguishes real learning from noise.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card title="Exponentially-Weighted Velocity">
            <p className="text-sm text-brand-gray leading-relaxed">
              Rather than computing a simple average of all score changes, the engine weights recent
              changes more heavily (decay factor: 0.7 per step). A student who was declining but has
              recently turned around will show a positive velocity &mdash; the simple average would
              still show stagnation.
            </p>
          </Card>
          <Card title="Adaptive Anomaly Detection">
            <p className="text-sm text-brand-gray leading-relaxed">
              Instead of flagging any jump greater than a fixed 30-point threshold, the engine
              computes the standard deviation of the student&apos;s own score deltas and flags jumps
              beyond 2&sigma; (with a minimum floor of 20 points). This adapts to each student&apos;s
              natural variability.
            </p>
          </Card>
          <Card title="Continuous Genuineness Score">
            <p className="text-sm text-brand-gray leading-relaxed">
              Learning genuineness is no longer a binary yes/no. It is a continuous 0&ndash;1 score
              combining directional consistency, velocity magnitude, and an anomaly penalty. A
              genuineness of 0.8 means strong, sustained learning. A score of 0.2 means noisy or
              suspicious improvement.
            </p>
          </Card>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Trend Classification</p>
        <div className="space-y-3 mb-6">
          {[
            { trend: 'Accelerating', velocity: '> +5 pts/assessment', color: '#4F8A5B', desc: 'Strong upward trajectory with sustained, genuine improvement.' },
            { trend: 'Improving', velocity: '+1 to +5 pts', color: '#00A8A8', desc: 'Steady gains. Consistency determines whether progress appears sustained or variable.' },
            { trend: 'Stable', velocity: '-1 to +1 pts', color: '#0C1F3F', desc: 'Scores are flat. No significant growth detected. May indicate a plateau or need for intervention.' },
            { trend: 'Slipping', velocity: '-5 to -1 pts', color: '#FF6B4A', desc: 'Moderate decline. Early intervention recommended before the trend deepens.' },
            { trend: 'Declining', velocity: '< -5 pts', color: '#EF4444', desc: 'Significant, sustained loss of proficiency. Immediate support needed.' },
          ].map(t => (
            <div key={t.trend} className="flex items-start gap-4 bg-brand-soft border border-brand-border rounded-xl p-4">
              <div className="min-w-[100px]">
                <div className="text-sm font-bold" style={{ color: t.color }}>{t.trend}</div>
                <div className="text-xs text-brand-gray">{t.velocity}</div>
              </div>
              <p className="text-sm text-brand-gray leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Score Adjustment</p>
        <p className="body-text mb-4">
          When the trajectory is both genuine (genuineness &ge; 0.4) and backed by at least three data
          points, the engine applies a small momentum adjustment to the weighted score. The adjustment
          is proportional to both the velocity and the genuineness confidence:
        </p>
        <Card>
          <p className="text-sm text-brand-gray leading-relaxed mb-3">
            <strong className="text-navy">Momentum = genuineness &times; velocity &times; 0.3</strong>
          </p>
          <p className="text-sm text-brand-gray leading-relaxed mb-3">
            A student with genuineness 0.8 and velocity +6 receives a momentum boost of +1.4 points.
            A student with genuineness 0.3 (below the threshold) receives no adjustment regardless of
            velocity. This prevents lucky guesses or noisy spikes from inflating scores.
          </p>
          <p className="text-sm text-brand-gray leading-relaxed">
            Conversely, suspicious positive anomalies trigger proportional dampening. A 30-point
            unexplained jump dampens the score by approximately 3%. A 60-point jump dampens by
            approximately 6%, capped at 10%. Only suspicious <em>positive</em> jumps are dampened &mdash;
            legitimate score drops are not penalized further.
          </p>
        </Card>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 6 — Confidence Intervals                      */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="confidence-intervals" num="6" title="Confidence Intervals" color="#00A8A8">
        <p className="body-text mb-6">
          Instead of &ldquo;you&apos;re at 72%,&rdquo; Arrival says &ldquo;you&apos;re at 72%
          (65&ndash;79).&rdquo; Confidence intervals communicate the precision of the estimate
          and enable faculty to make appropriately calibrated decisions.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card title="Standard Error with t-Correction">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              The interval width is derived from the <strong className="text-navy">standard error of
              the mean</strong> of all observations, multiplied by the appropriate t-value for a 90%
              confidence interval. For small samples (n &le; 10), we use the Student&apos;s t-distribution
              rather than the normal approximation, which correctly produces wider intervals when data
              is sparse.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              With one observation, the t-value is 6.314 &mdash; producing a wide interval that
              honestly communicates uncertainty. By ten observations, it narrows to 1.812, approaching
              the large-sample z-value of 1.645.
            </p>
          </Card>
          <Card title="Source Quality Adjustment">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              The interval width is further adjusted by the proportion of high-reliability sources
              (quizzes and formal assessments) in the observation set. When 100% of evidence comes
              from controlled assessments, the interval narrows by up to 15%.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              This reflects the practical reality that quiz scores have lower measurement error than
              coaching signals, independent of sample size.
            </p>
          </Card>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Confidence Accumulation</p>
        <p className="body-text mb-4">
          Overall confidence (0&ndash;1) accumulates with <strong className="text-navy">diminishing returns</strong>.
          Each additional observation from a source adds less confidence than the previous one,
          following a geometric model:
        </p>
        <Card>
          <p className="text-sm text-brand-gray leading-relaxed mb-3">
            <strong className="text-navy">Source Confidence = 1 &minus; (1 &minus; rate)<sup>n</sup></strong>, where <em>rate</em> is
            the per-observation confidence contribution and <em>n</em> is the number of observations.
          </p>
          <p className="text-sm text-brand-gray leading-relaxed">
            The first quiz contributes 15% toward full confidence. The second adds 12.75% (15% of
            the remaining 85%). The fifth adds 7.5%. This prevents the system from reaching false
            certainty on a narrow evidence base, while still rewarding breadth of evidence.
          </p>
        </Card>

        <div className="bg-brand-mist border border-brand-border rounded-2xl p-6 mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-4">Reliability Labels</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'High', criteria: 'Confidence \u2265 80%, interval width \u2264 10 pts', color: '#4F8A5B' },
              { label: 'Moderate', criteria: 'Confidence \u2265 50%, interval width \u2264 18 pts', color: '#00A8A8' },
              { label: 'Low', criteria: 'Below moderate thresholds', color: '#FF6B4A' },
            ].map(r => (
              <div key={r.label} className="text-center">
                <div className="text-lg font-black mb-1" style={{ color: r.color }}>{r.label}</div>
                <div className="text-xs text-brand-gray">{r.criteria}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 7 — Governance & Fairness                     */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="governance" num="7" title="Governance and Fairness" color="#0C1F3F">
        <p className="body-text mb-6">
          Every proficiency score passes through a four-layer governance pipeline before it is
          persisted or surfaced to users. The system operates under the constraint that automated
          action is conditional, not assumed. When any constraint fails, the system defers to human
          review.
        </p>

        <div className="space-y-4 mb-8">
          {[
            { layer: 'L0', title: 'Input Validation', color: '#0C1F3F', body: 'Verifies consent, provenance, and data integrity. Only necessary fields are propagated forward (feature minimization). A score without a verifiable student identity and skill mapping is rejected before computation begins.' },
            { layer: 'L1', title: 'Score Audit', color: '#00A8A8', body: 'Requires every score to include an evidence summary (explainability constraint). Warns when confidence falls below the threshold. A score that cannot explain itself is flagged as inadmissible.' },
            { layer: 'L2', title: 'Uncertainty Estimation', color: '#4F8A5B', body: 'Computes the variance of the student\'s score distribution and checks it against the uncertainty threshold (\u03B4 = 0.25). Prevents the system from acting on unstable or overconfident predictions.' },
            { layer: 'L3', title: 'Decision Governance', color: '#5A3E6B', body: 'Evaluates all constraints in hierarchy: Privacy \u227B Fairness \u227B Risk \u227B Confidence. Automated action requires all constraints to pass. Insufficient assessment history always defers to human judgment.' },
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

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-3">Fairness Monitoring</p>
        <p className="body-text mb-4">
          By design, Arrival does not collect race, gender, or demographic data. Fairness is monitored
          using proxy groupings &mdash; enrollment cohort, institution, and engagement level &mdash; to
          detect whether AI scoring produces inequitable score distributions. The fairness metric is the
          difference in pass rates (score &ge; 70) between groups, held to an &epsilon; = 0.10 threshold.
          A deviation exceeding 10% triggers an automatic flag for human review.
        </p>
        <Card>
          <p className="text-sm text-brand-gray leading-relaxed">
            <strong className="text-navy">L4: Continuous Monitoring</strong> evaluates drift, anomalies,
            and fairness deviations across all scored assessments. Score changes exceeding 40 points
            between consecutive assessments for the same skill are flagged as anomalies for review,
            regardless of whether the governance pipeline approved the individual score.
          </p>
        </Card>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 8 — AI Scoring via Claude                     */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="ai-scoring" num="8" title="AI Assessment Scoring" color="#00A8A8">
        <p className="body-text mb-6">
          The raw skill scores that feed the proficiency engine are generated by Anthropic&apos;s
          Claude, operating under tightly constrained system prompts that enforce evidence-based
          scoring discipline.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card title="Quiz & Assessment Scoring">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              Claude receives the questions, correct answers, the student&apos;s responses, and the
              skill definitions for the course. It scores each skill on a 0&ndash;100 rubric, provides
              a confidence rating based on how much evidence the questions provided, and writes an
              evidence summary citing specific answer quality.
            </p>
            <div className="space-y-2 mt-3">
              <Bullet color="#0C1F3F">0&ndash;30: Little to no demonstrated understanding</Bullet>
              <Bullet color="#FF6B4A">31&ndash;50: Partial understanding, significant gaps</Bullet>
              <Bullet color="#5A3E6B">51&ndash;70: Foundational competency, some gaps</Bullet>
              <Bullet color="#00A8A8">71&ndash;85: Solid understanding, minor gaps</Bullet>
              <Bullet color="#4F8A5B">86&ndash;100: Strong mastery demonstrated</Bullet>
            </div>
          </Card>
          <Card title="Work Upload Assessment">
            <p className="text-sm text-brand-gray leading-relaxed mb-3">
              For student-submitted work (essays, projects, problem sets), Claude analyzes the
              submission against all course skills, returning a score only for skills where the work
              provides direct evidence. Skills without evidence receive <code className="text-xs bg-brand-mist px-1.5 py-0.5 rounded">null</code> rather
              than a zero &mdash; ensuring the absence of evidence is not treated as evidence of
              absence.
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              The system prompt enforces rigor: &ldquo;High scores require clear demonstration, not
              just mention.&rdquo; Every assessment includes specific citations from the student&apos;s
              work to maintain full traceability.
            </p>
          </Card>
        </div>

        <Card>
          <p className="text-sm font-semibold text-navy">
            Claude&apos;s raw scores are the starting point, not the final answer. They enter the
            multi-source weighting pipeline as one observation among many, subject to the same
            recency decay, source normalization, trajectory analysis, and governance constraints
            as every other evidence source.
          </p>
        </Card>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 9 — Recent Corrections                        */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="corrections" num="9" title="Recent Corrections and Improvements" color="#4F8A5B">
        <p className="body-text mb-6">
          The proficiency engine has undergone seven targeted corrections to improve scoring
          accuracy. Each correction addresses a specific, identified failure mode in the
          previous implementation.
        </p>

        <div className="space-y-4 mb-8">
          {[
            {
              num: '01',
              title: 'Linear Recency Decay Replaced with Exponential Decay',
              problem: 'The previous linear decay function (1 - ageDays \u00D7 0.01) produced a flat minimum weight of 0.3 after 70 days. A score from 70 days ago had the same influence as a score from 700 days ago, creating permanent contamination of the estimate by stale evidence.',
              fix: 'Replaced with exponential decay using a 45-day half-life: 2^(-t/45). Influence decays smoothly and continuously. A 6-month-old score carries only 6% weight, naturally fading without an arbitrary cutoff.',
              impact: 'High',
            },
            {
              num: '02',
              title: 'Source Count Imbalance Eliminated via Normalization',
              problem: 'Each observation was weighted independently. A student with 10 coaching signals and 1 quiz saw coaching dominate the final score despite coaching\'s low reliability weight (0.35), because raw accumulation overwhelmed the source weight multiplier.',
              fix: 'Introduced two-phase computation: within-source recency-weighted average first, then cross-source combination by reliability weight. Each source now contributes one aggregate signal, regardless of how many individual observations it contains.',
              impact: 'High',
            },
            {
              num: '03',
              title: 'Linear Confidence Replaced with Diminishing Returns',
              problem: 'Confidence accumulated linearly: 0.15 per quiz observation, uncapped until hitting 1.0. The 10th quiz added the same 15% as the 1st, and 7 quizzes alone could reach full confidence \u2014 creating false certainty on a narrow evidence base.',
              fix: 'Switched to geometric accumulation: 1 - (1 - rate)^n. The first quiz adds 15%. The fifth adds 7.5%. The tenth adds 3.9%. Full confidence now requires either extensive data from a single reliable source or corroborating evidence across multiple source types.',
              impact: 'Medium',
            },
            {
              num: '04',
              title: 'Fixed Anomaly Threshold Replaced with Adaptive Detection',
              problem: 'Any score change exceeding 30 points was flagged as anomalous. For a student with naturally high variability (e.g., strong quiz scores but weak uploads), normal fluctuations triggered false anomaly flags. For a student with very consistent scores, a suspicious 25-point jump went undetected.',
              fix: 'Anomaly threshold is now computed per-student as 2\u03C3 from their mean delta, with a 20-point minimum floor. The system adapts to each student\'s natural variability rather than applying a universal cutoff.',
              impact: 'Medium',
            },
            {
              num: '05',
              title: 'Heuristic Confidence Intervals Replaced with Statistical CIs',
              problem: 'The previous interval used an arbitrary base half-width of 25 points that narrowed by a hand-tuned formula. The resulting intervals bore no statistical relationship to the actual variance of the observed data.',
              fix: 'Intervals are now computed from the standard error of the mean, multiplied by the appropriate t-value for the sample size. For n=1, the wide t-value (6.314) produces an honest interval. For n=10+, the interval narrows toward the normal approximation. Source quality provides an additional continuous narrowing factor.',
              impact: 'Medium',
            },
            {
              num: '06',
              title: 'Trajectory Adjustments Scaled by Genuineness Confidence',
              problem: 'The previous model applied a flat velocity \u00D7 0.5 boost whenever isGenuine was true and velocity exceeded 3. Anomaly dampening was a blanket 5% applied to all anomalies regardless of direction or severity. This produced both over-boosting of noisy upward trends and unnecessary penalization of legitimate score drops.',
              fix: 'The boost is now genuineness \u00D7 velocity \u00D7 0.3, where genuineness is a continuous 0\u20131 score. Dampening is proportional to anomaly severity and applied only to suspicious positive jumps. Requires \u22653 data points before any trajectory adjustment is applied.',
              impact: 'Medium',
            },
            {
              num: '07',
              title: 'Trajectory Lag Bug Fixed',
              problem: 'When a new score was submitted, the trajectory analysis received only the historical scores \u2014 excluding the score just computed. This meant trajectory analysis was always one observation behind, missing the most recent and most relevant data point.',
              fix: 'The newly computed score is now included in the trajectory history array before analysis. Additionally, database queries were corrected to reference the scored_at column (the actual column name) rather than created_at (which did not exist in the table schema).',
              impact: 'High',
            },
          ].map(c => (
            <div key={c.num} className="bg-brand-soft border border-brand-border rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#4F8A5B' }}>
                  {c.num}
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">{c.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full" style={{
                    background: c.impact === 'High' ? 'rgba(79,138,91,0.15)' : 'rgba(0,168,168,0.15)',
                    color: c.impact === 'High' ? '#4F8A5B' : '#00A8A8',
                  }}>{c.impact} Impact</span>
                </div>
              </div>
              <div className="space-y-3 pl-13">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-coral mb-1">Problem</div>
                  <p className="text-sm text-brand-gray leading-relaxed">{c.problem}</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: '#4F8A5B' }}>Correction</div>
                  <p className="text-sm text-brand-gray leading-relaxed">{c.fix}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 10 — Confidence in Corrections                */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="confidence-assessment" num="10" title="Confidence Assessment of Corrections" color="#0C1F3F">
        <p className="body-text mb-6">
          Not all corrections carry equal certainty. Some are mathematically provable improvements.
          Others are well-grounded in statistical theory but will require empirical validation
          with production data. We assess each correction across three dimensions: theoretical
          soundness, expected impact magnitude, and remaining uncertainty.
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-brand-border">
                <th className="text-left py-3 pr-4 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray">Correction</th>
                <th className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray">Theoretical Confidence</th>
                <th className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray">Expected Impact</th>
                <th className="text-left py-3 pl-4 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray">Remaining Uncertainty</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Exponential recency decay', theory: 'Very High', impact: 'High', uncertainty: 'Optimal half-life (45 days) may need tuning per course duration. Semester-length courses may benefit from a shorter half-life than year-long sequences.' },
                { name: 'Source normalization', theory: 'Very High', impact: 'High', uncertainty: 'Minimal. Two-phase normalization is mathematically correct for preventing count imbalance. Source reliability weights may need calibration with empirical data.' },
                { name: 'Diminishing confidence', theory: 'High', impact: 'Medium', uncertainty: 'The geometric model is well-established. The per-observation rates (0.15 for quiz, 0.05 for coaching) are reasonable priors that should be validated against observed scoring consistency.' },
                { name: 'Adaptive anomaly detection', theory: 'High', impact: 'Medium', uncertainty: 'The 2\u03C3 threshold is standard in anomaly detection. With very few data points (n < 4), the estimated \u03C3 may be unreliable, which is why a 20-point minimum floor is enforced.' },
                { name: 'Standard-error CIs', theory: 'Very High', impact: 'Medium', uncertainty: 'The t-distribution is the correct theoretical framework for small-sample intervals. The only assumption is approximate normality of scores, which is reasonable for aggregated proficiency estimates.' },
                { name: 'Genuineness-scaled adjustments', theory: 'Moderate', impact: 'Medium', uncertainty: 'The 0.3 momentum coefficient is an informed prior but has not been empirically optimized. The genuineness score itself combines three factors with equal implicit weighting that may benefit from calibration.' },
                { name: 'Trajectory lag fix', theory: 'Certain', impact: 'High', uncertainty: 'None. This was a bug: the most recent score was excluded from trajectory analysis. The fix is definitionally correct.' },
              ].map((r, i) => (
                <tr key={r.name} className={i % 2 === 0 ? 'bg-brand-soft' : ''}>
                  <td className="py-3 pr-4 font-medium text-navy">{r.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{
                      background: r.theory === 'Certain' ? 'rgba(79,138,91,0.15)' : r.theory === 'Very High' ? 'rgba(0,168,168,0.15)' : r.theory === 'High' ? 'rgba(90,62,107,0.15)' : 'rgba(255,107,74,0.15)',
                      color: r.theory === 'Certain' ? '#4F8A5B' : r.theory === 'Very High' ? '#00A8A8' : r.theory === 'High' ? '#5A3E6B' : '#FF6B4A',
                    }}>{r.theory}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-brand-gray">{r.impact}</td>
                  <td className="py-3 pl-4 text-brand-gray leading-relaxed">{r.uncertainty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout color="#0C1F3F">
          Five of seven corrections are grounded in established statistical methods with very high
          theoretical confidence. One is a definitive bug fix. The remaining correction (genuineness-scaled
          adjustments) is the most heuristic and will be the first candidate for empirical refinement
          as production data accumulates.
        </Callout>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 11 — Future Directions                        */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="future-directions" num="11" title="Future Directions with More Data" color="#4F8A5B">
        <p className="body-text mb-6">
          The current engine is designed around strong priors and conservative defaults. As
          Arrival accumulates institutional data across pilot deployments, several components
          will evolve from informed estimates to empirically calibrated parameters. The following
          represent our highest-priority research directions.
        </p>

        <div className="space-y-4 mb-8">
          {[
            {
              title: 'Empirically Calibrated Source Weights',
              horizon: 'After 2\u20133 pilot semesters',
              body: 'Current source weights (quiz: 1.0, upload: 0.75, coaching: 0.35) are informed priors. With sufficient paired data \u2014 where students have scores from multiple source types for the same skill \u2014 we can compute the actual predictive validity of each source against end-of-course outcomes. If work uploads prove more predictive than quizzes for certain skill types, the weights will reflect that.',
            },
            {
              title: 'Course-Adaptive Recency Half-Life',
              horizon: 'After 1\u20132 pilot semesters',
              body: 'The 45-day half-life is a reasonable default for a standard 15-week semester. However, intensive summer courses, year-long sequences, and modular programs have different temporal dynamics. With cross-course data, we can fit optimal half-lives per course structure or allow the engine to learn the decay rate from observed score trajectories.',
            },
            {
              title: 'Item Response Theory (IRT) Integration',
              horizon: 'After 5+ pilot semesters',
              body: 'The current model treats all quiz questions as equally informative. IRT models each question\'s difficulty and discrimination, producing more precise proficiency estimates per question answered. This requires a large item bank with response data across many students. As our question bank grows through adaptive assessment generation, IRT integration becomes increasingly feasible and valuable.',
            },
            {
              title: 'Bayesian Knowledge Tracing (BKT)',
              horizon: 'After 3\u20135 pilot semesters',
              body: 'BKT models proficiency as a hidden state that evolves with each learning event, estimating the probability that a student has truly learned a skill versus performing correctly by chance. It naturally handles the "lucky guess" and "careless mistake" failure modes. Integrating BKT would replace the current trajectory adjustment heuristic with a principled probabilistic model of learning dynamics.',
            },
            {
              title: 'Multi-Dimensional Fairness Monitoring',
              horizon: 'After 3+ pilot semesters across institutions',
              body: 'Currently fairness is monitored using enrollment cohort as a proxy grouping. With data across multiple institutions, we can test for scoring equity across institution type (community college vs. research university), course format (online vs. in-person), and engagement pattern clusters \u2014 without ever collecting protected demographic attributes.',
            },
            {
              title: 'Genuineness Model Calibration',
              horizon: 'After 1\u20132 pilot semesters',
              body: 'The genuineness score currently combines consistency, velocity, and anomaly penalty with implicit equal weighting. With outcome data (did students with high genuineness scores actually retain their gains?), we can learn the optimal combination weights and potentially add new input signals such as time-between-assessments and practice frequency.',
            },
            {
              title: 'Predictive Confidence Intervals',
              horizon: 'After 2\u20133 pilot semesters',
              body: 'Current intervals describe uncertainty about the present estimate. With longitudinal data, we can produce predictive intervals: "based on students with similar trajectories, this student\'s score is likely to be between X and Y by end of term." This transforms the CI from a retrospective measurement into a forward-looking planning tool for faculty.',
            },
          ].map((d, i) => (
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
            The Design Principle Behind Every Future Change
          </p>
          <p className="text-sm text-brand-gray leading-relaxed">
            Every parameter in the current engine has been set to a defensible default. No parameter
            has been set by convenience. As data accumulates, each default can be replaced with an
            empirically learned value &mdash; but only when the evidence justifies the change with
            confidence exceeding the prior. This is not a system that will drift. It is a system
            designed to sharpen.
          </p>
        </Card>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  SECTION 12 — Conclusion                               */}
      {/* ────────────────────────────────────────────────────── */}
      <Section id="conclusion" num="12" title="Conclusion" color="#0C1F3F">
        <p className="body-text mb-4">
          Arrival&apos;s proficiency engine is not a black box that assigns numbers. It is a transparent,
          governed pipeline where every score can be traced to its evidence sources, every estimate
          carries an honest confidence interval, and every automated decision is conditional on
          satisfying fairness, explainability, and uncertainty constraints.
        </p>
        <p className="body-text mb-4">
          The recent corrections addressed fundamental accuracy issues: stale evidence contaminating
          current estimates, source count imbalances distorting the signal, false confidence from
          narrow evidence, and a trajectory analysis that was systematically one observation behind.
          Five of seven corrections are grounded in well-established statistical methods. One was a
          definitive bug fix. The remaining heuristic component is clearly identified and scheduled
          for empirical calibration.
        </p>
        <Callout>
          We do not claim this system is perfect. We claim it is honest about what it knows, transparent
          about how it knows it, and designed to get sharper with every semester of data it encounters.
          That is the standard faculty should expect from any system that presumes to measure what their
          students know.
        </Callout>
      </Section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-brand-border py-8" style={{ background: '#071429' }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold text-white hover:text-brand-teal transition-colors">
            &larr; Back to transformlearning.ai
          </Link>
          <p className="text-xs text-white/30">Arrival &middot; Proficiency Scoring Methodology &middot; April 2026</p>
        </div>
      </footer>

    </div>
    </AccessGate>
  )
}
