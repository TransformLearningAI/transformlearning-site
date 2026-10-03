'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAVY = '#0C1F3F'
const TEAL = '#00A8A8'
const GREEN = '#4F8A5B'
const PLUM = '#5A3E6B'
const CORAL = '#FF6B4A'
const AMBER = '#D4A017'
const WARM_BG = '#FAF8F5'
const WARM_BORDER = '#EBE6E0'
const MUTED = '#6b635a'
const BODY = '#3a3530'
const serif = 'Georgia, serif'

const statusColors = { met: GREEN, progress: AMBER, planned: PLUM }
const statusLabels = { met: 'Met', progress: 'In Progress', planned: 'Planned' }

const ukReqs = [
  { req: 'Academic Standards', status: 'met', how: 'Knowledge graph maps directly to QAA Subject Benchmark competencies. AI assessment evaluates each outcome. External examiner verifies.', evidence: 'Benchmark alignment matrix, evidence maps, external examiner reports' },
  { req: 'Quality of Learning', status: 'met', how: 'AI instruction engine + 6 guide types. Process fidelity evaluation proves teaching quality. 27 fidelity criteria, 90% agreement with human raters.', evidence: 'Fidelity audit reports, synthetic learner test results, LLM-as-judge logs' },
  { req: 'Student Outcomes', status: 'met', how: 'Evidence maps track every competency. Degree classification based on demonstrated mastery, not GPA averaging.', evidence: 'Per-student evidence maps, competency completion rates, outcome analytics' },
  { req: 'Assessment Rigor', status: 'met', how: 'Adaptive assessment + LLM-as-judge + human verification. External examiners review samples. Anti-gaming through varied question generation.', evidence: 'Assessment validity studies, external examiner sign-off, item analysis data' },
  { req: 'Student Protection', status: 'progress', how: 'Teach-out agreements with partner institutions. Financial bonds. Student data portability. Credit transfer agreements.', evidence: 'Teach-out contracts, financial bond documentation, data export specifications' },
  { req: 'Governance', status: 'met', how: 'Board of directors. Academic board with guide representation. Student representation. Annual quality review cycle.', evidence: 'Governance charter, board minutes, quality review reports' },
  { req: 'Financial Sustainability', status: 'met', how: 'Platform model: low fixed costs, scalable. Revenue per student exceeds cost per student at 200+ enrollment.', evidence: 'Financial projections, cost model, break-even analysis' },
]

const usReqs = [
  { req: 'Mission & Goals', status: 'met', how: 'Clear mission aligned with AI-native education model. Competency-based learning at the core.', evidence: 'Mission statement, strategic plan' },
  { req: 'Ethics & Integrity', status: 'met', how: 'Transparent AI use, no black boxes, student data rights, full explainability on all AI decisions.', evidence: 'AI transparency policy, student data rights charter' },
  { req: 'Student Experience Design', status: 'progress', how: 'Requires demonstration that AI + guide model produces equivalent or better outcomes than traditional instruction.', evidence: 'UK cohort outcome data (Years 1-2), comparative analysis' },
  { req: 'Support of Student Experience', status: 'met', how: 'Resilience mentors, peer network, career guidance exceed typical support services.', evidence: 'Student satisfaction data, intervention resolution rates, career placement rates' },
  { req: 'Educational Effectiveness', status: 'planned', how: 'Requires multi-year outcome data. UK cohort data (Years 1-2) will serve as evidence base for US application.', evidence: 'Longitudinal outcome study, process fidelity evidence, retention/completion data' },
  { req: 'Planning & Resources', status: 'met', how: 'Financial model demonstrates sustainability at projected enrollment levels.', evidence: 'Financial projections, enrollment pipeline, resource allocation model' },
  { req: 'Governance & Faculty', status: 'progress', how: 'Key challenge: US accreditors require "qualified faculty" controlling curriculum. Guides must be recognized as faculty-equivalent for governance purposes.', evidence: 'Guide credential matrix, governance structure, curriculum control documentation' },
]

const timeline = [
  { year: '2027', label: 'Year 1', desc: 'OfS registration application. Small pilot cohort (50-100 students). Begin evidence collection. Process fidelity baseline established.', color: TEAL },
  { year: '2028', label: 'Year 2', desc: 'Full OfS registration. Scale to 500 students. QAA review. External examiner reports. First cohort outcome data.', color: GREEN },
  { year: '2029', label: 'Year 3', desc: 'US accreditation candidacy application with 2 years of UK outcome data, external examiner reports, and process fidelity evidence.', color: PLUM },
  { year: '2030', label: 'Year 4', desc: 'US accreditation site visit. First US cohort. Platform licensing to existing institutions begins.', color: CORAL },
]

export default function AccreditationPage() {
  const [region, setRegion] = useState('uk')

  const reqs = region === 'uk' ? ukReqs : usReqs

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
          The Accreditation Map
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: MUTED }}>
          How every component meets regulatory standards. UK first, US next.
        </p>
      </header>

      {/* Region Tabs */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex gap-2 mb-8 justify-center">
          {[
            { id: 'uk', label: 'UK (QAA / OfS)' },
            { id: 'us', label: 'US (Regional Accreditation)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRegion(tab.id)}
              className="px-6 py-3 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: region === tab.id ? NAVY : 'white',
                color: region === tab.id ? 'white' : NAVY,
                border: `1px solid ${region === tab.id ? NAVY : WARM_BORDER}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Requirements Table */}
        <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: WARM_BORDER }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: NAVY }}>
                <th className="text-left px-5 py-3 font-medium text-white/80 w-1/5">Requirement</th>
                <th className="text-left px-5 py-3 font-medium text-white/80 w-1/12">Status</th>
                <th className="text-left px-5 py-3 font-medium text-white/80">How We Meet It</th>
                <th className="text-left px-5 py-3 font-medium text-white/80 w-1/4">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {reqs.map((r, i) => (
                <tr key={r.req} className="border-t" style={{ borderColor: WARM_BORDER, backgroundColor: i % 2 === 0 ? 'white' : WARM_BG }}>
                  <td className="px-5 py-4 font-medium" style={{ color: NAVY }}>{r.req}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: statusColors[r.status] + '15', color: statusColors[r.status] }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[r.status] }} />
                      {statusLabels[r.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4" style={{ color: BODY }}>{r.how}</td>
                  <td className="px-5 py-4 text-xs" style={{ color: MUTED }}>{r.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* US Challenge Callout */}
        {region === 'us' && (
          <div className="mt-6 rounded-xl border-2 p-6" style={{ borderColor: AMBER, backgroundColor: AMBER + '08' }}>
            <h3 className="font-bold text-sm mb-2" style={{ color: AMBER }}>The Key Challenge</h3>
            <p className="text-sm leading-relaxed" style={{ color: BODY }}>
              US accreditors require &ldquo;qualified faculty&rdquo; with terminal degrees controlling curriculum. In our model, the AI platform delivers instruction and guides facilitate. We need either: (a) accreditors to recognize guides as faculty-equivalent, or (b) a small core of credentialed faculty for governance + guides for delivery. The UK-first strategy builds the evidence base to make this case.
            </p>
          </div>
        )}
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center mb-12 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            The strategy
          </h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ backgroundColor: WARM_BORDER }} />
            <div className="space-y-8">
              {timeline.map(t => (
                <div key={t.year} className="flex gap-6 items-start">
                  <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ backgroundColor: t.color }}>
                    {t.year}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold mb-1" style={{ color: NAVY }}>{t.label}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: BODY }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Fidelity as Evidence */}
      <section className="py-20" style={{ backgroundColor: WARM_BG }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="mb-4 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            Process fidelity as accreditation evidence
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: BODY }}>
            Traditional accreditation asks: <em>do you have qualified teachers?</em> We ask: <em>does the system teach?</em> And we can prove it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: '27', label: 'Fidelity criteria', sub: 'Binary pass/fail per criterion', color: TEAL },
              { value: '7', label: 'Synthetic personas', sub: 'Stress-test the hardest cases', color: PLUM },
              { value: '90%', label: 'Human agreement', sub: 'LLM-as-judge matches raters', color: GREEN },
            ].map(m => (
              <div key={m.label} className="rounded-xl border bg-white p-5" style={{ borderColor: WARM_BORDER }}>
                <p className="text-3xl font-bold mb-1" style={{ color: m.color }}>{m.value}</p>
                <p className="text-sm font-medium" style={{ color: NAVY }}>{m.label}</p>
                <p className="text-xs" style={{ color: MUTED }}>{m.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-6" style={{ color: MUTED }}>
            This evidence package is stronger than any traditional accreditation review, which relies on syllabi, CVs, and a 2-day site visit.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 bg-white text-center">
        <p className="text-sm leading-relaxed max-w-xl mx-auto mb-6" style={{ fontFamily: serif, color: NAVY }}>
          The UK system evaluates outcomes. The US system evaluates inputs. We start where outcomes matter, build the evidence, then bring it to the system that needs convincing.
        </p>
        <Link href="/campus-os/demo" className="text-sm font-semibold hover:underline" style={{ color: TEAL }}>
          &larr; Back to all demos
        </Link>
      </section>
    </div>
  )
}
