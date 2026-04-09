'use client';

import Link from 'next/link';

/* ───────────────────────── Mock Data ───────────────────────── */

const dfwCourses = [
  { course: 'College Algebra (MTH 110)',       enrollment: 480, dfwRate: 32, avgTuition: 4200, projectedReduction: 8  },
  { course: 'Intro to Chemistry (CHM 101)',    enrollment: 360, dfwRate: 28, avgTuition: 4350, projectedReduction: 7  },
  { course: 'English Composition (ENG 101)',   enrollment: 520, dfwRate: 22, avgTuition: 4100, projectedReduction: 6  },
  { course: 'Intro to Biology (BIO 105)',      enrollment: 410, dfwRate: 26, avgTuition: 4250, projectedReduction: 7  },
  { course: 'US History (HIS 101)',            enrollment: 340, dfwRate: 19, avgTuition: 4100, projectedReduction: 5  },
  { course: 'Principles of Economics (ECN 201)', enrollment: 290, dfwRate: 24, avgTuition: 4300, projectedReduction: 6 },
  { course: 'General Psychology (PSY 101)',    enrollment: 450, dfwRate: 17, avgTuition: 4100, projectedReduction: 4  },
  { course: 'Statistics (MTH 220)',            enrollment: 310, dfwRate: 30, avgTuition: 4200, projectedReduction: 8  },
];

const budgetItems = [
  { item: 'Platform Licensing',       budgeted: 185000, actual: 178500 },
  { item: 'Faculty Development',      budgeted: 120000, actual: 94200  },
  { item: 'Student Support Services', budgeted: 245000, actual: 231800 },
  { item: 'IT Infrastructure',        budgeted: 160000, actual: 172400 },
  { item: 'Assessment Tools',         budgeted: 88000,  actual: 79600  },
];

const discountTrend = [
  { year: '2023-24', rate: 52, netRevenue: 18200, totalDiscount: 11400000 },
  { year: '2024-25', rate: 54, netRevenue: 17600, totalDiscount: 12100000 },
  { year: '2025-26', rate: 56, netRevenue: 17100, totalDiscount: 12800000 },
  { year: '2026-27', rate: 55, netRevenue: 17400, totalDiscount: 12500000 },
];

const retentionScenarios = [
  { improvement: '3 pp', studentsRetained: 19, revenueRecovered: 912000  },
  { improvement: '5 pp', studentsRetained: 31, revenueRecovered: 1488000 },
  { improvement: '8 pp', studentsRetained: 50, revenueRecovered: 2400000 },
];

/* ───────────────────────── Helpers ───────────────────────── */

function fmt(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n.toLocaleString();
}

function fmtFull(n) {
  return '$' + n.toLocaleString();
}

function pct(n) {
  return n.toFixed(1) + '%';
}

/* ───────────────────────── Page ───────────────────────── */

export default function FinanceDashboard() {
  // Compute DFW table derived values
  const tableData = dfwCourses.map((c) => {
    const studentsLost = Math.round(c.enrollment * (c.dfwRate / 100));
    const revenueLost = studentsLost * c.avgTuition;
    const studentsSaved = Math.round(c.enrollment * (c.projectedReduction / 100));
    const projectedSavings = studentsSaved * c.avgTuition;
    return { ...c, studentsLost, revenueLost, studentsSaved, projectedSavings };
  });

  const totalEnrollment = tableData.reduce((s, r) => s + r.enrollment, 0);
  const totalStudentsLost = tableData.reduce((s, r) => s + r.studentsLost, 0);
  const totalRevenueLost = tableData.reduce((s, r) => s + r.revenueLost, 0);
  const totalSavings = tableData.reduce((s, r) => s + r.projectedSavings, 0);

  const budgetTotal = budgetItems.reduce((s, b) => ({ budgeted: s.budgeted + b.budgeted, actual: s.actual + b.actual }), { budgeted: 0, actual: 0 });

  return (
    <div className="min-h-screen bg-brand-soft font-sans">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-brand-border bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-navy">
            transformlearning.ai
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-sm font-medium text-brand-gray">Finance</span>
            <Link
              href="/campus-os/demo"
              className="text-sm font-medium text-navy hover:text-brand-teal transition-colors"
            >
              &larr; All Dashboards
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── 1. Header ── */}
        <section className="bg-navy rounded-2xl px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-coral/10" />
          <div className="relative">
            <p className="text-brand-coral text-sm font-semibold tracking-wide uppercase">Finance Dashboard</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight font-serif">
              Michael Torres
            </h1>
            <p className="mt-1 text-white/70 text-base">
              VP of Finance &nbsp;&middot;&nbsp; Regional State University &nbsp;&middot;&nbsp; Fall 2026
            </p>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Total Enrollment</p>
              <p className="mt-1 text-3xl font-bold">4,820</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Tuition Revenue</p>
              <p className="mt-1 text-3xl font-bold">$38.2<span className="text-lg text-white/60">M</span></p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Net Revenue / Student</p>
              <p className="mt-1 text-3xl font-bold">$17,400</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Fiscal Year</p>
              <p className="mt-1 text-3xl font-bold">FY27</p>
            </div>
          </div>
        </section>

        {/* ── 2. Financial Impact Cards ── */}
        <section>
          <h2 className="text-lg font-bold text-navy font-serif mb-4">Financial Impact Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: 'DFW Revenue Loss',
                value: '$2.1M',
                sub: 'annually',
                detail: 'Projected $1.6M with intervention',
                color: '#FF6B4A',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                label: 'Retention Revenue Recovery',
                value: '$840K',
                sub: 'projected annually',
                detail: 'From 3pp retention improvement',
                color: '#4F8A5B',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="17 6 23 6 23 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                label: 'Cost Per Student Saved',
                value: '$420',
                sub: 'vs. $12,400 acquisition',
                detail: '29.5x more cost-effective',
                color: '#00A8A8',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                label: 'ROI on Platform',
                value: '6.2x',
                sub: 'return on investment',
                detail: '$798K invested → $4.9M recovered',
                color: '#5A3E6B',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-brand-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-brand-gray font-medium">{card.label}</p>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: card.color + '14', color: card.color }}
                  >
                    {card.icon}
                  </div>
                </div>
                <p className="mt-2 text-3xl font-bold" style={{ color: card.color }}>{card.value}</p>
                <p className="mt-0.5 text-xs text-brand-gray">{card.sub}</p>
                <div className="mt-3 pt-3 border-t border-brand-border">
                  <p className="text-xs font-medium" style={{ color: card.color }}>{card.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. DFW Cost Analysis Table ── */}
        <section className="bg-white rounded-xl border border-brand-border overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-brand-border">
            <h2 className="text-lg font-bold text-navy font-serif">DFW Cost Analysis — Gateway Courses</h2>
            <p className="text-xs text-brand-gray mt-0.5">Revenue impact of D/F/W grades across high-enrollment gateway courses</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-mist text-xs uppercase tracking-wider text-brand-gray">
                  <th className="px-6 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold text-right">Enrollment</th>
                  <th className="px-4 py-3 font-semibold text-right">DFW Rate</th>
                  <th className="px-4 py-3 font-semibold text-right">Students Lost</th>
                  <th className="px-4 py-3 font-semibold text-right">Avg Tuition</th>
                  <th className="px-4 py-3 font-semibold text-right">Revenue Lost</th>
                  <th className="px-4 py-3 font-semibold text-right">Projected Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {tableData.map((row) => (
                  <tr key={row.course} className="hover:bg-brand-mist/40 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-navy whitespace-nowrap">{row.course}</td>
                    <td className="px-4 py-3.5 text-sm text-brand-gray text-right">{row.enrollment.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`text-sm font-semibold ${row.dfwRate >= 25 ? 'text-brand-coral' : row.dfwRate >= 20 ? 'text-amber-600' : 'text-brand-gray'}`}>
                        {row.dfwRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-navy font-medium text-right">{row.studentsLost}</td>
                    <td className="px-4 py-3.5 text-sm text-brand-gray text-right">{fmtFull(row.avgTuition)}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-brand-coral text-right">{fmtFull(row.revenueLost)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-semibold text-brand-green">{fmtFull(row.projectedSavings)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-navy/[0.03] border-t-2 border-navy/20">
                  <td className="px-6 py-4 text-sm font-bold text-navy">Totals</td>
                  <td className="px-4 py-4 text-sm font-bold text-navy text-right">{totalEnrollment.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm font-bold text-navy text-right">{pct(totalStudentsLost / totalEnrollment * 100)}</td>
                  <td className="px-4 py-4 text-sm font-bold text-navy text-right">{totalStudentsLost.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-brand-gray text-right">—</td>
                  <td className="px-4 py-4 text-sm font-bold text-brand-coral text-right">{fmtFull(totalRevenueLost)}</td>
                  <td className="px-4 py-4 text-sm font-bold text-brand-green text-right">{fmtFull(totalSavings)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ── 4. Retention Revenue Model ── */}
        <section className="bg-white rounded-xl border border-brand-border p-6">
          <h2 className="text-lg font-bold text-navy font-serif">Retention Revenue Model</h2>
          <p className="text-xs text-brand-gray mt-0.5 mb-6">Impact of retention improvement on at-risk student revenue</p>

          {/* Key equation */}
          <div className="bg-brand-mist rounded-xl p-6 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-3 text-center">
              <div className="bg-white rounded-lg px-5 py-3 border border-brand-border">
                <p className="text-xs text-brand-gray uppercase tracking-wider">Students at Risk</p>
                <p className="text-2xl font-bold text-navy mt-1">620</p>
              </div>
              <span className="text-2xl font-bold text-brand-gray">&times;</span>
              <div className="bg-white rounded-lg px-5 py-3 border border-brand-border">
                <p className="text-xs text-brand-gray uppercase tracking-wider">Avg Remaining Lifetime Revenue</p>
                <p className="text-2xl font-bold text-navy mt-1">$48,000</p>
              </div>
              <span className="text-2xl font-bold text-brand-gray">=</span>
              <div className="bg-white rounded-lg px-5 py-3 border border-brand-coral/30" style={{ backgroundColor: '#FF6B4A08' }}>
                <p className="text-xs text-brand-coral uppercase tracking-wider font-semibold">Total At-Risk Revenue</p>
                <p className="text-2xl font-bold text-brand-coral mt-1">$29.7M</p>
              </div>
            </div>
          </div>

          {/* Scenarios */}
          <h3 className="text-sm font-semibold text-navy mb-3">Retention Improvement Scenarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {retentionScenarios.map((scenario, i) => {
              const colors = ['#00A8A8', '#4F8A5B', '#5A3E6B'];
              const labels = ['Conservative', 'Moderate', 'Ambitious'];
              return (
                <div
                  key={scenario.improvement}
                  className="rounded-xl border border-brand-border p-5 relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: colors[i] }}
                  />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors[i] }}>
                      {labels[i]}
                    </span>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: colors[i] + '14', color: colors[i] }}
                    >
                      +{scenario.improvement}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-navy">{fmt(scenario.revenueRecovered)}</p>
                  <p className="text-xs text-brand-gray mt-1">revenue recovered annually</p>
                  <div className="mt-3 pt-3 border-t border-brand-border">
                    <p className="text-sm text-brand-gray">
                      <span className="font-semibold text-navy">{scenario.studentsRetained}</span> additional students retained
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 5. Budget vs. Actual ── */}
        <section className="bg-white rounded-xl border border-brand-border overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-brand-border">
            <h2 className="text-lg font-bold text-navy font-serif">Budget vs. Actual — Student Success Initiatives</h2>
            <p className="text-xs text-brand-gray mt-0.5">FY27 year-to-date spending across platform and support line items</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-mist text-xs uppercase tracking-wider text-brand-gray">
                  <th className="px-6 py-3 font-semibold">Line Item</th>
                  <th className="px-4 py-3 font-semibold text-right">Budgeted</th>
                  <th className="px-4 py-3 font-semibold text-right">Actual</th>
                  <th className="px-4 py-3 font-semibold text-right">Variance</th>
                  <th className="px-4 py-3 font-semibold text-right">% Spent</th>
                  <th className="px-4 py-3 font-semibold w-48">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {budgetItems.map((b) => {
                  const variance = b.actual - b.budgeted;
                  const pctSpent = ((b.actual / b.budgeted) * 100).toFixed(1);
                  const overBudget = variance > 0;
                  return (
                    <tr key={b.item} className="hover:bg-brand-mist/40 transition-colors">
                      <td className="px-6 py-3.5 text-sm font-medium text-navy whitespace-nowrap">{b.item}</td>
                      <td className="px-4 py-3.5 text-sm text-brand-gray text-right">{fmtFull(b.budgeted)}</td>
                      <td className="px-4 py-3.5 text-sm text-navy font-medium text-right">{fmtFull(b.actual)}</td>
                      <td className={`px-4 py-3.5 text-sm font-semibold text-right ${overBudget ? 'text-brand-coral' : 'text-brand-green'}`}>
                        {overBudget ? '+' : ''}{fmtFull(variance)}
                      </td>
                      <td className={`px-4 py-3.5 text-sm font-semibold text-right ${parseFloat(pctSpent) > 100 ? 'text-brand-coral' : 'text-brand-gray'}`}>
                        {pctSpent}%
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(parseFloat(pctSpent), 100)}%`,
                              backgroundColor: overBudget ? '#FF6B4A' : parseFloat(pctSpent) > 90 ? '#F59E0B' : '#4F8A5B',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-navy/[0.03] border-t-2 border-navy/20">
                  <td className="px-6 py-4 text-sm font-bold text-navy">Total</td>
                  <td className="px-4 py-4 text-sm font-bold text-navy text-right">{fmtFull(budgetTotal.budgeted)}</td>
                  <td className="px-4 py-4 text-sm font-bold text-navy text-right">{fmtFull(budgetTotal.actual)}</td>
                  <td className={`px-4 py-4 text-sm font-bold text-right ${budgetTotal.actual - budgetTotal.budgeted > 0 ? 'text-brand-coral' : 'text-brand-green'}`}>
                    {budgetTotal.actual - budgetTotal.budgeted > 0 ? '+' : ''}{fmtFull(budgetTotal.actual - budgetTotal.budgeted)}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-navy text-right">
                    {((budgetTotal.actual / budgetTotal.budgeted) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min((budgetTotal.actual / budgetTotal.budgeted) * 100, 100)}%`,
                          backgroundColor: '#4F8A5B',
                        }}
                      />
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ── 6. Tuition Discount Analysis ── */}
        <section className="bg-white rounded-xl border border-brand-border p-6">
          <h2 className="text-lg font-bold text-navy font-serif">Tuition Discount Analysis</h2>
          <p className="text-xs text-brand-gray mt-0.5 mb-6">Institutional discount rate trend and net revenue impact</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Discount rate trend visual */}
            <div>
              <h3 className="text-sm font-semibold text-navy mb-4">Discount Rate Trend</h3>
              <div className="space-y-4">
                {discountTrend.map((d, i) => {
                  const isLatest = i === discountTrend.length - 1;
                  const improving = i > 0 && d.rate < discountTrend[i - 1].rate;
                  return (
                    <div key={d.year}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm ${isLatest ? 'font-bold text-navy' : 'text-brand-gray'}`}>
                          {d.year}
                          {isLatest && <span className="ml-2 text-xs font-semibold text-brand-teal">(Current)</span>}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${d.rate >= 56 ? 'text-brand-coral' : d.rate >= 54 ? 'text-amber-600' : 'text-brand-green'}`}>
                            {d.rate}%
                          </span>
                          {i > 0 && (
                            <span className={`text-xs font-semibold ${improving ? 'text-brand-green' : d.rate > discountTrend[i - 1].rate ? 'text-brand-coral' : 'text-brand-gray'}`}>
                              {improving ? '▼' : d.rate > discountTrend[i - 1].rate ? '▲' : '—'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${d.rate}%`,
                            backgroundColor: d.rate >= 56 ? '#FF6B4A' : d.rate >= 54 ? '#F59E0B' : '#4F8A5B',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-brand-border">
                <div className="flex items-center gap-4 text-xs text-brand-gray">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-green inline-block" /> &lt; 54%</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> 54–55%</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-coral inline-block" /> &ge; 56%</span>
                </div>
              </div>
            </div>

            {/* Net revenue & discount cost */}
            <div>
              <h3 className="text-sm font-semibold text-navy mb-4">Net Revenue &amp; Discount Cost</h3>
              <div className="space-y-3">
                {discountTrend.map((d, i) => {
                  const isLatest = i === discountTrend.length - 1;
                  const change = i > 0 ? d.netRevenue - discountTrend[i - 1].netRevenue : 0;
                  return (
                    <div
                      key={d.year}
                      className={`rounded-lg border p-4 ${isLatest ? 'border-brand-teal/30 bg-brand-teal/[0.03]' : 'border-brand-border'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isLatest ? 'font-bold text-navy' : 'text-brand-gray font-medium'}`}>
                          {d.year}
                        </span>
                        {isLatest && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal">
                            Current Year
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-brand-gray">Net Revenue / Student</p>
                          <p className="text-lg font-bold text-navy">
                            ${d.netRevenue.toLocaleString()}
                            {i > 0 && (
                              <span className={`ml-2 text-xs font-semibold ${change > 0 ? 'text-brand-green' : change < 0 ? 'text-brand-coral' : 'text-brand-gray'}`}>
                                {change > 0 ? '+' : ''}{change > 0 ? '$' : '-$'}{Math.abs(change).toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-brand-gray">Total Discount Cost</p>
                          <p className="text-lg font-bold text-brand-coral">{fmt(d.totalDiscount)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary insight */}
          <div className="mt-6 bg-brand-mist rounded-lg p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-teal/15 flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00A8A8" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">Key Insight</p>
              <p className="text-sm text-brand-gray mt-0.5">
                Discount rate decreased 1pp year-over-year to 55%, recovering approximately $300K in net tuition revenue.
                Continued focus on retention and student success outcomes is projected to allow a further 1-2pp reduction
                in FY28 without impacting enrollment yield.
              </p>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center py-8">
          <p className="text-xs text-brand-gray">
            transformlearning.ai Campus OS &nbsp;&middot;&nbsp; Finance View &nbsp;&middot;&nbsp; Data refreshed Oct 29, 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
