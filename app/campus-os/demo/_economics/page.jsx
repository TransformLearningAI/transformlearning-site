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

function Bar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: BODY }}>{label}</span>
        <span className="font-semibold" style={{ color: NAVY }}>${(value / 1000).toFixed(0)}K</span>
      </div>
      <div className="w-full h-3 rounded-full" style={{ backgroundColor: WARM_BORDER }}>
        <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function EconomicsPage() {
  const [enrollment, setEnrollment] = useState(750)
  const [guideCount, setGuideCount] = useState(15)
  const [platformCost, setPlatformCost] = useState(1500)
  const [guideSalary, setGuideSalary] = useState(55000)

  // Traditional model
  const tradFaculty = 40 * 85000
  const tradBenefits = tradFaculty * 0.3
  const tradAdjuncts = 1100000
  const tradAdmin = 2000000
  const tradCampus = 4000000
  const tradTotal = tradFaculty + tradBenefits + tradAdjuncts + tradAdmin + tradCampus
  const tradPerStudent = Math.round(tradTotal / enrollment)

  // New model
  const newPlatform = platformCost * enrollment
  const newGuides = guideCount * guideSalary
  const newBenefits = newGuides * 0.3
  const newAdmin = 600000
  const newCampus = 3500000
  const newTotal = newPlatform + newGuides + newBenefits + newAdmin + newCampus
  const newPerStudent = Math.round(newTotal / enrollment)

  const savings = tradTotal - newTotal
  const savingsPct = Math.round((savings / tradTotal) * 100)

  const maxCost = Math.max(tradTotal, newTotal)

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
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: CORAL }}>Campus OS</p>
        <h1 className="tracking-tight leading-tight mb-4" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
          The Economics
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: MUTED }}>
          What happens when instruction costs drop 70%?
        </p>
      </header>

      {/* Side by Side */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional */}
          <div className="rounded-xl border p-8" style={{ borderColor: '#ddd', backgroundColor: '#fafafa' }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: '#999' }}>Traditional Model</h3>
            <p className="text-xs mb-6" style={{ color: '#bbb' }}>{enrollment} students</p>
            <Bar label="Faculty (40 @ $85K)" value={tradFaculty} max={maxCost} color="#ccc" />
            <Bar label="Benefits (30%)" value={tradBenefits} max={maxCost} color="#ccc" />
            <Bar label="Adjuncts & TAs" value={tradAdjuncts} max={maxCost} color="#ccc" />
            <Bar label="Administration" value={tradAdmin} max={maxCost} color="#ccc" />
            <Bar label="Campus operations" value={tradCampus} max={maxCost} color="#ccc" />
            <div className="mt-6 pt-4 border-t" style={{ borderColor: WARM_BORDER }}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold" style={{ color: '#999' }}>Total</span>
                <span className="text-2xl font-bold" style={{ color: '#999' }}>${(tradTotal / 1000000).toFixed(1)}M</span>
              </div>
              <p className="text-right text-sm mt-1" style={{ color: '#bbb' }}>${tradPerStudent.toLocaleString()} / student</p>
            </div>
          </div>

          {/* New Model */}
          <div className="rounded-xl border p-8" style={{ borderColor: TEAL + '40', backgroundColor: TEAL + '04' }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: TEAL }}>AI + Guides Model</h3>
            <p className="text-xs mb-6" style={{ color: MUTED }}>{enrollment} students</p>
            <Bar label={`Platform license ($${platformCost}/student)`} value={newPlatform} max={maxCost} color={TEAL} />
            <Bar label={`Guides (${guideCount} @ $${(guideSalary / 1000).toFixed(0)}K)`} value={newGuides} max={maxCost} color={PLUM} />
            <Bar label="Benefits (30%)" value={newBenefits} max={maxCost} color={PLUM} />
            <Bar label="Admin (AI-routed)" value={newAdmin} max={maxCost} color={GREEN} />
            <Bar label="Campus operations" value={newCampus} max={maxCost} color={CORAL} />
            <div className="mt-6 pt-4 border-t" style={{ borderColor: WARM_BORDER }}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold" style={{ color: TEAL }}>Total</span>
                <span className="text-2xl font-bold" style={{ color: TEAL }}>${(newTotal / 1000000).toFixed(1)}M</span>
              </div>
              <p className="text-right text-sm mt-1" style={{ color: MUTED }}>${newPerStudent.toLocaleString()} / student</p>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="mt-6 rounded-xl p-6 text-center" style={{ backgroundColor: NAVY }}>
          <p className="text-white/60 text-sm">Annual savings</p>
          <p className="text-3xl font-bold mt-1" style={{ color: TEAL }}>${(savings / 1000000).toFixed(1)}M</p>
          <p className="text-white/40 text-sm mt-1">{savingsPct}% reduction in operating cost</p>
        </div>
      </section>

      {/* Sliders */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center mb-12 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            Adjust the model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: 'Enrollment', value: enrollment, set: setEnrollment, min: 250, max: 2000, step: 50, fmt: v => v },
              { label: 'Number of guides', value: guideCount, set: setGuideCount, min: 8, max: 25, step: 1, fmt: v => v },
              { label: 'Platform cost / student', value: platformCost, set: setPlatformCost, min: 1000, max: 3000, step: 100, fmt: v => `$${v.toLocaleString()}` },
              { label: 'Guide avg salary', value: guideSalary, set: setGuideSalary, min: 40000, max: 80000, step: 5000, fmt: v => `$${(v / 1000).toFixed(0)}K` },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium" style={{ color: NAVY }}>{s.label}</label>
                  <span className="text-sm font-bold" style={{ color: TEAL }}>{s.fmt(s.value)}</span>
                </div>
                <input
                  type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  onChange={e => s.set(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: TEAL, backgroundColor: WARM_BORDER }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: MUTED }}>
                  <span>{s.fmt(s.min)}</span>
                  <span>{s.fmt(s.max)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="rounded-xl border p-6" style={{ borderColor: WARM_BORDER }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: MUTED }}>Cost per student</p>
              <p className="text-3xl font-bold" style={{ color: TEAL }}>${newPerStudent.toLocaleString()}</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>vs. ${tradPerStudent.toLocaleString()} traditional</p>
            </div>
            <div className="rounded-xl border p-6" style={{ borderColor: WARM_BORDER }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: MUTED }}>Student : Guide ratio</p>
              <p className="text-3xl font-bold" style={{ color: PLUM }}>{Math.round(enrollment / guideCount)} : 1</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>vs. 19:1 traditional faculty</p>
            </div>
            <div className="rounded-xl border p-6" style={{ borderColor: WARM_BORDER }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: MUTED }}>Annual savings</p>
              <p className="text-3xl font-bold" style={{ color: GREEN }}>${(savings / 1000000).toFixed(1)}M</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>{savingsPct}% reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Impact */}
      <section className="py-20" style={{ backgroundColor: WARM_BG }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center mb-12 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            The tuition question
          </h2>
          <div className="rounded-xl border bg-white p-8" style={{ borderColor: WARM_BORDER }}>
            <p className="text-sm leading-relaxed mb-6" style={{ color: BODY }}>
              If it costs ${newPerStudent.toLocaleString()} per student to operate, why charge $45,000? The new model: charge $13,500.
              Still margin for sustainability. Still affordable for families. Still a real campus, real community, real degree.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: NAVY }}>
                    <th className="text-left px-4 py-3 text-white/80 font-medium">Scenario</th>
                    <th className="text-right px-4 py-3 text-white/80 font-medium">Students</th>
                    <th className="text-right px-4 py-3 text-white/80 font-medium">Tuition</th>
                    <th className="text-right px-4 py-3 text-white/80 font-medium">Revenue</th>
                    <th className="text-right px-4 py-3 text-white/80 font-medium">Cost</th>
                    <th className="text-right px-4 py-3 text-white/80 font-medium">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t" style={{ borderColor: WARM_BORDER }}>
                    <td className="px-4 py-3" style={{ color: '#999' }}>Traditional</td>
                    <td className="text-right px-4 py-3">750</td>
                    <td className="text-right px-4 py-3">$35,000</td>
                    <td className="text-right px-4 py-3">$26.3M</td>
                    <td className="text-right px-4 py-3">$11.5M</td>
                    <td className="text-right px-4 py-3 font-semibold">$14.8M</td>
                  </tr>
                  <tr className="border-t" style={{ borderColor: WARM_BORDER }}>
                    <td className="px-4 py-3 font-medium" style={{ color: TEAL }}>New @ 750</td>
                    <td className="text-right px-4 py-3">750</td>
                    <td className="text-right px-4 py-3">$13,500</td>
                    <td className="text-right px-4 py-3">$10.1M</td>
                    <td className="text-right px-4 py-3">$5.9M</td>
                    <td className="text-right px-4 py-3 font-semibold" style={{ color: TEAL }}>$4.2M</td>
                  </tr>
                  <tr className="border-t" style={{ borderColor: WARM_BORDER, backgroundColor: TEAL + '06' }}>
                    <td className="px-4 py-3 font-bold" style={{ color: TEAL }}>New @ 1,200</td>
                    <td className="text-right px-4 py-3 font-bold">1,200</td>
                    <td className="text-right px-4 py-3">$13,500</td>
                    <td className="text-right px-4 py-3 font-bold">$16.2M</td>
                    <td className="text-right px-4 py-3">$8.1M</td>
                    <td className="text-right px-4 py-3 font-bold" style={{ color: TEAL }}>$8.1M</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm text-center leading-relaxed" style={{ color: MUTED }}>
              At $13,500 you attract students who couldn&apos;t afford $45,000. More students, more margin, more impact.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <Link href="/campus-os/demo/guides" className="text-sm font-semibold hover:underline" style={{ color: PLUM }}>
          Meet the guides &rarr;
        </Link>
      </section>
    </div>
  )
}
