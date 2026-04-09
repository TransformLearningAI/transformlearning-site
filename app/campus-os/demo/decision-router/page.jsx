'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ── Brand tokens ─────────────────────────────────────────────── */
const navy  = '#0C1F3F';
const teal  = '#00A8A8';
const green = '#4F8A5B';
const plum  = '#5A3E6B';
const coral = '#FF6B4A';
const amber = '#D4952A';

/* ── Mock data ────────────────────────────────────────────────── */

const activeDecisions = [
  {
    id: 1,
    urgency: 'URGENT',
    urgencyColor: coral,
    signal: 'Bio 201 Section 3: 6 students below intervention threshold on membrane transport',
    analysis: 'Pattern indicates instructional misalignment, not student deficiency. 4 of 6 students are strong in related skills (cellular respiration, ATP synthesis). Section 1 covers the same topic with 92% proficiency.',
    routedTo: 'Dr. Kim',
    routedRole: 'Biology Dept Chair',
    recommended: 'Review Section 3 instructional approach for membrane transport. Compare to Section 1 (92% proficiency on same topic).',
    timeWaiting: '2 hours',
    checks: { fairness: true, confidence: 94, privacy: true, humanRequired: true },
  },
  {
    id: 2,
    urgency: 'ACTION',
    urgencyColor: amber,
    signal: 'Financial aid: 12 students with >70% withdrawal probability have unused emergency fund eligibility',
    analysis: 'Correlation between financial stress indicators and proficiency decline across 3 courses. Estimated retention impact: 8 students saveable. Combined tuition at risk: $96,000.',
    routedTo: 'Maria Gonzalez',
    routedRole: 'Financial Aid Director',
    recommended: 'Proactive outreach to 12 students with eligibility notification. Estimated 15-minute call per student.',
    timeWaiting: '6 hours',
    checks: { fairness: true, confidence: 87, privacy: true, humanRequired: true },
  },
  {
    id: 3,
    urgency: 'STRATEGIC',
    urgencyColor: teal,
    signal: 'English Composition DFW rate dropped from 28% to 14% after AI coaching integration',
    analysis: 'Statistically significant improvement. p < 0.01. Effect size: 0.72. Comparable to adding a full-time writing tutor per section. 340 students impacted.',
    routedTo: 'Provost Williams',
    routedRole: 'Provost',
    recommended: 'Expand to all composition sections. Budget impact: $12K/year vs. $180K for equivalent tutoring staff.',
    timeWaiting: '1 day',
    checks: { fairness: true, confidence: 96, privacy: true, humanRequired: true },
  },
  {
    id: 4,
    urgency: 'ACTION',
    urgencyColor: amber,
    signal: 'Psychology 101: 3 sections showing divergent proficiency — Section B is 18 points below Sections A and C',
    analysis: 'Same curriculum, same assessments, same week. Instructor variable is the primary differentiator. Section B instructor is first-year adjunct.',
    routedTo: 'Dr. Reyes',
    routedRole: 'Psychology Dept Chair',
    recommended: 'Pair Section B instructor with peer mentor from Section A. Share specific lesson plans for statistical reasoning module.',
    timeWaiting: '4 hours',
    checks: { fairness: true, confidence: 91, privacy: true, humanRequired: true },
  },
  {
    id: 5,
    urgency: 'MONITOR',
    urgencyColor: plum,
    signal: 'Campus-wide: Tuesday/Thursday 8am sections show 12% lower engagement than 10am sections across all departments',
    analysis: 'Consistent across 14 sections, 6 departments, 2 semesters. Not instructor-dependent. Likely schedule-driven.',
    routedTo: 'Dr. Chen',
    routedRole: 'VP Academic Affairs',
    recommended: 'Consider reducing 8am section offerings by 20% next semester. Shift capacity to 10am and 1pm slots.',
    timeWaiting: '3 hours',
    checks: { fairness: true, confidence: 82, privacy: true, humanRequired: true },
  },
];

const resolvedDecisions = [
  { id: 'R1',  signal: 'Chem 101 Lab Section 4: safety protocol quiz scores dropped below 80% threshold',      resolvedBy: 'Dr. Patel (Chem Chair)',        time: '12 min', action: 'Mandatory safety review session added before next lab' },
  { id: 'R2',  signal: 'Advising: 23 undeclared sophomores have not met with advisor this semester',            resolvedBy: 'Dir. Thompson (Advising)',       time: '18 min', action: 'Triggered automated scheduling outreach with follow-up' },
  { id: 'R3',  signal: 'Math 200: homework completion rate dropped 30% after midterm',                          resolvedBy: 'Dr. Chen (Instructor)',          time: '8 min',  action: 'Reduced assignment length, added checkpoint problems' },
  { id: 'R4',  signal: 'Tutoring center: 40% increase in demand for organic chemistry — waitlist growing',      resolvedBy: 'Maria Santos (Tutoring Dir)',    time: '25 min', action: 'Added 3 evening drop-in sessions, recruited 2 peer tutors' },
  { id: 'R5',  signal: 'Transfer student cohort: 8 students missing prerequisite for registered spring courses', resolvedBy: 'Registrar Office',               time: '45 min', action: 'Flagged for advisor review, 6 approved for co-requisite model' },
  { id: 'R6',  signal: 'Student wellness: dining hall swipe data shows 4 students skipping meals consistently', resolvedBy: 'Dean of Students',               time: '22 min', action: 'Confidential outreach initiated, connected to food assistance' },
  { id: 'R7',  signal: 'Physics 150: online practice system usage at 0 for 31 students after week 4',           resolvedBy: 'Dr. Okafor (Instructor)',        time: '15 min', action: 'In-class walkthrough of system, reset student access' },
  { id: 'R8',  signal: 'English 102: 3 students flagged for potential academic integrity concern',               resolvedBy: 'Prof. Davis (Instructor)',       time: '1.5 hr', action: 'Individual meetings scheduled, reviewed AI usage policy' },
  { id: 'R9',  signal: 'Residence life: noise complaints up 200% in Hall B during finals prep week',            resolvedBy: 'RD Martinez',                   time: '30 min', action: 'Opened 24-hour quiet study space in Hall B lounge' },
  { id: 'R10', signal: 'Career services: employer info session has 3 RSVPs (expected 40)',                       resolvedBy: 'Dir. Williams (Career Svcs)',    time: '20 min', action: 'Pushed targeted notification to relevant majors, added pizza' },
  { id: 'R11', signal: 'IT: LMS response time exceeded 5s threshold during peak hours',                         resolvedBy: 'CTO Office',                    time: '6 min',  action: 'Scaled cloud resources, scheduled off-peak maintenance' },
];

const governanceChecks = [
  { name: 'Fairness Audit',           icon: '⚖️', description: 'Every recommendation checked for demographic bias. No action disproportionately affects any group.' },
  { name: 'Confidence Threshold',     icon: '📊', description: 'AI must exceed 80% confidence before routing. Below threshold = flagged for manual review.' },
  { name: 'Privacy Constraint',       icon: '🔒', description: 'Student-identifiable data only visible to authorized roles. All routing respects FERPA.' },
  { name: 'Human Override Required',  icon: '🧑', description: 'The AI never acts. It recommends. A human must approve, modify, or reject every decision.' },
];

/* ── Helpers ──────────────────────────────────────────────────── */

function UrgencyBadge({ urgency, color }) {
  return (
    <span
      className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
      style={{ backgroundColor: color + '1A', color }}
    >
      {urgency}
    </span>
  );
}

function GovernanceCheckDot({ passed }) {
  return (
    <span className={`w-2 h-2 rounded-full inline-block ${passed ? 'bg-brand-green' : 'bg-brand-coral'}`} />
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function DecisionRouterDemo() {
  const [expandedDecision, setExpandedDecision] = useState(1);

  return (
    <div className="min-h-screen bg-brand-soft font-sans">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-brand-border bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-navy">
            transformlearning.ai
          </Link>
          <Link
            href="/campus-os/demo"
            className="text-sm font-medium text-navy hover:text-brand-teal transition-colors"
          >
            &larr; All Demos
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Header ── */}
        <section className="bg-navy rounded-2xl px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-teal/10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-coral/8" />
          <div className="relative">
            <p className="text-brand-teal text-sm font-semibold tracking-wide uppercase">The Decision Router</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight font-serif">
              AI handles the signal. Humans make the call.
            </h1>
            <p className="mt-3 text-white/70 text-base max-w-2xl leading-relaxed">
              Every important signal detected. Analyzed. Routed to exactly the right person.
              No committees. No agendas. No waiting.
            </p>
          </div>

          <div className="relative mt-8 flex flex-wrap gap-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Routed Today</p>
              <p className="mt-1 text-3xl font-bold">14</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Awaiting Action</p>
              <p className="mt-1 text-3xl font-bold text-brand-coral">
                {activeDecisions.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Resolved Today</p>
              <p className="mt-1 text-3xl font-bold text-brand-green">
                {resolvedDecisions.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Avg Resolution</p>
              <p className="mt-1 text-3xl font-bold">
                4.2<span className="text-lg text-white/60"> hrs</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Active Decision Queue ── */}
        <section className="bg-white rounded-xl border border-brand-border overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-coral animate-pulse" />
              <h2 className="text-lg font-bold text-navy font-serif">Active Decision Queue</h2>
            </div>
            <p className="text-xs text-brand-gray mt-0.5">Decisions awaiting human judgment. Click to expand.</p>
          </div>

          <div className="divide-y divide-brand-border">
            {activeDecisions.map((d) => {
              const isExpanded = expandedDecision === d.id;
              return (
                <div
                  key={d.id}
                  className={`transition-colors ${isExpanded ? 'bg-brand-soft' : 'hover:bg-brand-mist/40'}`}
                >
                  {/* Collapsed row */}
                  <button
                    onClick={() => setExpandedDecision(isExpanded ? null : d.id)}
                    className="w-full px-6 py-4 flex items-start gap-4 text-left"
                  >
                    <UrgencyBadge urgency={d.urgency} color={d.urgencyColor} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy leading-relaxed">{d.signal}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className="text-xs text-brand-gray">Routed to: <span className="font-semibold text-navy">{d.routedTo}</span></span>
                        <span className="text-xs text-brand-gray">&middot;</span>
                        <span className="text-xs text-brand-gray">Waiting: {d.timeWaiting}</span>
                      </div>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-5 h-5 text-brand-gray shrink-0 transition-transform duration-200 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-6 pb-5 pt-0 space-y-4 animate-fade-up">
                      {/* AI Analysis */}
                      <div className="ml-[88px]">
                        <div className="bg-white rounded-lg border border-brand-border p-4">
                          <p className="text-xs font-semibold text-brand-teal uppercase tracking-wider mb-1.5">AI Analysis</p>
                          <p className="text-sm text-navy leading-relaxed">{d.analysis}</p>
                        </div>
                      </div>

                      {/* Recommended action */}
                      <div className="ml-[88px]">
                        <div className="bg-brand-teal/5 rounded-lg border border-brand-teal/20 p-4">
                          <p className="text-xs font-semibold text-brand-teal uppercase tracking-wider mb-1.5">Recommended Action</p>
                          <p className="text-sm text-navy leading-relaxed">{d.recommended}</p>
                        </div>
                      </div>

                      {/* Routing info + governance */}
                      <div className="ml-[88px] flex flex-wrap items-center gap-6">
                        <div>
                          <p className="text-xs text-brand-gray">Routed To</p>
                          <p className="text-sm font-semibold text-navy">{d.routedTo} <span className="font-normal text-brand-gray">({d.routedRole})</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <GovernanceCheckDot passed={d.checks.fairness} />
                            <span className="text-xs text-brand-gray">Fairness</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GovernanceCheckDot passed={d.checks.confidence >= 80} />
                            <span className="text-xs text-brand-gray">Confidence {d.checks.confidence}%</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GovernanceCheckDot passed={d.checks.privacy} />
                            <span className="text-xs text-brand-gray">Privacy</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GovernanceCheckDot passed={d.checks.humanRequired} />
                            <span className="text-xs text-brand-gray">Human Required</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="ml-[88px] flex gap-3">
                        <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-navy text-white hover:bg-navy-light transition-colors">
                          Approve &amp; Act
                        </button>
                        <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-white border border-brand-border text-navy hover:bg-brand-mist transition-colors">
                          Modify
                        </button>
                        <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-white border border-brand-border text-brand-gray hover:bg-brand-mist transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Resolved Today ── */}
        <section className="bg-white rounded-xl border border-brand-border overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
              <h2 className="text-lg font-bold text-navy font-serif">Resolved Today</h2>
            </div>
            <p className="text-xs text-brand-gray mt-0.5">{resolvedDecisions.length} decisions resolved &nbsp;·&nbsp; Average resolution time: 19 minutes</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-mist text-xs uppercase tracking-wider text-brand-gray">
                  <th className="px-5 py-3 font-semibold">Signal</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Resolved By</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Time</th>
                  <th className="px-4 py-3 font-semibold">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {resolvedDecisions.map((r) => (
                  <tr key={r.id} className="hover:bg-brand-mist/40 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-navy max-w-xs">{r.signal}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-navy whitespace-nowrap">{r.resolvedBy}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-semibold ${
                        r.time.includes('hr') ? 'text-amber-600' : 'text-brand-green'
                      }`}>
                        {r.time}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-brand-gray max-w-sm">{r.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Committee Comparison ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* OLD */}
          <div className="rounded-xl border-2 border-brand-coral/30 bg-brand-coral/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-coral/15 text-brand-coral uppercase tracking-wider">Old Model</span>
            </div>
            <h3 className="text-lg font-bold text-navy font-serif mb-5">Academic Standards Committee</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-brand-border flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-coral">14</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Members</p>
                  <p className="text-xs text-brand-gray">All must attend. All must be available.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-brand-border flex items-center justify-center">
                  <span className="text-lg font-bold text-brand-coral">1x/mo</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Monthly meeting</p>
                  <p className="text-xs text-brand-gray">2-hour agenda. If you miss it, wait 30 days.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-brand-border flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-coral">6</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Items discussed</p>
                  <p className="text-xs text-brand-gray">2 decisions made. 4 tabled for next month.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-brand-border flex items-center justify-center">
                  <span className="text-lg font-bold text-brand-coral">34d</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Average time from signal to action</p>
                  <p className="text-xs text-brand-gray">Students don&rsquo;t have 34 days.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-brand-coral/20">
              <p className="text-sm text-brand-gray leading-relaxed">
                <span className="font-semibold text-navy">28 faculty-hours per meeting. 12 meetings per year. 336 hours of committee time.</span>
                {' '}For an average of 24 decisions per year.
              </p>
            </div>
          </div>

          {/* NEW */}
          <div className="rounded-xl border-2 border-brand-green/30 bg-brand-green/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-green/15 text-brand-green uppercase tracking-wider">Decision Router</span>
            </div>
            <h3 className="text-lg font-bold text-navy font-serif mb-5">Intelligent Decision Routing</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-brand-border flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-green">14</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Decisions routed today</p>
                  <p className="text-xs text-brand-gray">Not per month. Per day.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-brand-border flex items-center justify-center">
                  <span className="text-lg font-bold text-brand-green">4.2h</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Average time to resolution</p>
                  <p className="text-xs text-brand-gray">Not 34 days. Hours.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-brand-border flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-green">0</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Meetings required</p>
                  <p className="text-xs text-brand-gray">Zero agendas. Zero scheduling conflicts.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-brand-border flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-green">0</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Faculty hours wasted</p>
                  <p className="text-xs text-brand-gray">Each person sees only the decisions they can act on.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-brand-green/20">
              <p className="text-sm text-brand-gray leading-relaxed">
                <span className="font-semibold text-navy">The right person. The right signal. The right time.</span>
                {' '}No more asking 14 people to sit in a room and discuss something only 1 of them can act on.
              </p>
            </div>
          </div>
        </section>

        {/* ── Governance Layer ── */}
        <section className="bg-white rounded-xl border border-brand-border p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-navy font-serif">Governance Layer</h2>
            <p className="text-xs text-brand-gray mt-0.5">
              Every routed decision passes through four gates before reaching a human. No exceptions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {governanceChecks.map((g) => (
              <div key={g.name} className="rounded-xl border border-brand-border p-5 hover:shadow-md transition-shadow text-center">
                <span className="text-3xl">{g.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-navy">{g.name}</h3>
                <p className="mt-2 text-xs text-brand-gray leading-relaxed">{g.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-navy rounded-xl p-5 text-center">
            <p className="text-white text-sm font-medium leading-relaxed">
              The AI never acts. It recommends. Humans decide.
            </p>
            <p className="text-white/60 text-xs mt-2">
              Every recommendation includes a confidence score, a fairness audit, a privacy check, and a mandatory human approval step.
              If any gate fails, the decision is flagged for manual review before routing.
            </p>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center py-8">
          <p className="text-xs text-brand-gray">
            transformlearning.ai Campus OS &nbsp;·&nbsp; Decision Router &nbsp;·&nbsp; Replacing committees with intelligence
          </p>
        </footer>
      </main>
    </div>
  );
}
