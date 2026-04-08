'use client';

import Link from 'next/link';

/* ─── Brand Tokens ─── */
const NAVY = '#0C1F3F';
const TEAL = '#00A8A8';
const GREEN = '#4F8A5B';
const PLUM = '#5A3E6B';
const CORAL = '#FF6B4A';

/* ─── Mock Data ─── */
const healthMetrics = [
  { label: 'Course Completion Rate', value: '87.3%', accent: GREEN },
  { label: 'Avg DFW Rate', value: '17.8%', accent: CORAL },
  { label: 'Gen Ed Proficiency', value: '72%', accent: TEAL },
  { label: 'Faculty Engagement', value: '68%', accent: PLUM },
  { label: 'Assessment Compliance', value: '94%', accent: GREEN },
];

const learningOutcomes = [
  {
    name: 'Critical Thinking',
    coursesMapped: 34,
    avgProficiency: 74,
    evidenceCount: 218,
    status: 'Complete',
  },
  {
    name: 'Written Communication',
    coursesMapped: 28,
    avgProficiency: 69,
    evidenceCount: 192,
    status: 'Complete',
  },
  {
    name: 'Quantitative Reasoning',
    coursesMapped: 22,
    avgProficiency: 61,
    evidenceCount: 145,
    status: 'In Progress',
  },
  {
    name: 'Information Literacy',
    coursesMapped: 18,
    avgProficiency: 78,
    evidenceCount: 110,
    status: 'Complete',
  },
  {
    name: 'Ethical Reasoning',
    coursesMapped: 15,
    avgProficiency: 66,
    evidenceCount: 87,
    status: 'In Progress',
  },
  {
    name: 'Intercultural Competence',
    coursesMapped: 12,
    avgProficiency: 58,
    evidenceCount: 42,
    status: 'Not Started',
  },
];

const gatewayCourses = [
  {
    name: 'ENG 101 — Composition I',
    sections: 12,
    dfwRate: '22.4%',
    proficiency: '68%',
    improvement: '+3.1 pp',
    improvementPositive: true,
    intervention: 'Supplemental Instruction',
  },
  {
    name: 'MATH 110 — College Algebra',
    sections: 9,
    dfwRate: '31.2%',
    proficiency: '54%',
    improvement: '+1.8 pp',
    improvementPositive: true,
    intervention: 'Co-Requisite Model',
  },
  {
    name: 'BIO 101 — Intro Biology',
    sections: 7,
    dfwRate: '18.6%',
    proficiency: '72%',
    improvement: '+4.5 pp',
    improvementPositive: true,
    intervention: 'Active Learning Redesign',
  },
  {
    name: 'PSY 100 — Intro Psychology',
    sections: 8,
    dfwRate: '12.1%',
    proficiency: '81%',
    improvement: '-0.4 pp',
    improvementPositive: false,
    intervention: 'None',
  },
  {
    name: 'HIST 101 — Western Civilization',
    sections: 6,
    dfwRate: '19.8%',
    proficiency: '65%',
    improvement: '+2.2 pp',
    improvementPositive: true,
    intervention: 'Writing Scaffolds',
  },
];

const facultyStats = {
  activeFaculty: 42,
  totalFaculty: 67,
  trainingModules: {
    completed: 156,
    total: 201,
    rate: '77.6%',
  },
  proficiencyByEngagement: {
    engaged: '76.4%',
    notEngaged: '62.1%',
    gap: '+14.3 pp',
  },
};

const programReviews = [
  {
    program: 'B.A. English',
    cycle: '5-Year',
    lastReview: 'Spring 2021',
    enrollment: 142,
    completionRate: '71%',
    action: 'Self-Study Due',
    actionUrgency: 'high',
  },
  {
    program: 'B.S. Biology',
    cycle: '5-Year',
    lastReview: 'Fall 2021',
    enrollment: 318,
    completionRate: '64%',
    action: 'External Reviewer',
    actionUrgency: 'medium',
  },
  {
    program: 'B.B.A. Management',
    cycle: '7-Year (AACSB)',
    lastReview: 'Spring 2020',
    enrollment: 487,
    completionRate: '78%',
    action: 'Data Collection',
    actionUrgency: 'high',
  },
  {
    program: 'B.S. Nursing',
    cycle: '8-Year (CCNE)',
    lastReview: 'Fall 2019',
    enrollment: 264,
    completionRate: '82%',
    action: 'Site Visit Prep',
    actionUrgency: 'critical',
  },
];

/* ─── Helpers ─── */
function statusColor(status) {
  if (status === 'Complete') return GREEN;
  if (status === 'In Progress') return TEAL;
  return '#9ca3af';
}

function urgencyColor(level) {
  if (level === 'critical') return CORAL;
  if (level === 'high') return '#D97706';
  return TEAL;
}

/* ─── Reusable Components ─── */
function SectionHeading({ children, sub }) {
  return (
    <div className="mb-4">
      <h2
        className="text-xl font-bold tracking-tight"
        style={{ fontFamily: 'Georgia, serif', color: NAVY }}
      >
        {children}
      </h2>
      {sub && <p className="text-sm text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function StatusTag({ text, color }) {
  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: color + '18', color }}
    >
      {text}
    </span>
  );
}

function ProgressBar({ value, color, height = 'h-2.5' }) {
  return (
    <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

/* ─── Page ─── */
export default function AcademicAffairsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* ── Nav ── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
            style={{ color: NAVY }}
          >
            arrival.ai
          </Link>
          <div className="flex items-center gap-6">
            <span
              className="hidden sm:inline text-sm font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: TEAL + '14', color: TEAL }}
            >
              Academic Affairs
            </span>
            <Link
              href="/campus-os/demo"
              className="text-sm font-medium hover:underline"
              style={{ color: NAVY }}
            >
              &larr; All Dashboards
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* ── 1. Header ── */}
        <header>
          <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
            Academic Affairs Dashboard &middot; Fall 2026
          </p>
          <h1
            className="mt-1 text-3xl md:text-4xl font-bold tracking-tight"
            style={{ fontFamily: 'Georgia, serif', color: NAVY }}
          >
            Dr. Linda Vasquez
          </h1>
          <p className="mt-1 text-gray-500">Provost &amp; VP of Academic Affairs &mdash; Regional State University</p>
        </header>

        {/* ── 2. Academic Health ── */}
        <section>
          <SectionHeading>Academic Health</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {healthMetrics.map((m) => (
              <div
                key={m.label}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col"
              >
                <span className="text-xs text-gray-400 font-medium leading-tight">
                  {m.label}
                </span>
                <span
                  className="mt-2 text-3xl font-bold tracking-tight"
                  style={{ fontFamily: 'Georgia, serif', color: m.accent }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Learning Outcomes Assessment ── */}
        <section>
          <SectionHeading sub="Institutional Learning Outcomes mapped to Gen Ed & major requirements">
            Learning Outcomes Assessment
          </SectionHeading>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <div className="col-span-3">Outcome</div>
              <div className="col-span-1 text-center">Courses</div>
              <div className="col-span-3">Proficiency</div>
              <div className="col-span-1 text-center">Evidence</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Avg Score</div>
            </div>
            {learningOutcomes.map((lo, i) => {
              const sc = statusColor(lo.status);
              return (
                <div
                  key={lo.name}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center ${
                    i < learningOutcomes.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="col-span-3">
                    <p className="text-sm font-semibold" style={{ color: NAVY }}>
                      {lo.name}
                    </p>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-sm text-gray-600">{lo.coursesMapped}</span>
                  </div>
                  <div className="col-span-3 flex items-center gap-3">
                    <ProgressBar value={lo.avgProficiency} color={sc} height="h-2" />
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-sm text-gray-500">{lo.evidenceCount}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <StatusTag text={lo.status} color={sc} />
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-bold" style={{ color: NAVY }}>
                      {lo.avgProficiency}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. Curriculum Effectiveness ── */}
        <section>
          <SectionHeading sub="Gateway course comparison — DFW rate, student proficiency, and intervention impact">
            Curriculum Effectiveness
          </SectionHeading>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Course
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 text-center">
                    Sections
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 text-center">
                    DFW Rate
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 text-center">
                    Proficiency
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 text-center">
                    vs. Last Sem
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Intervention
                  </th>
                </tr>
              </thead>
              <tbody>
                {gatewayCourses.map((c, i) => (
                  <tr
                    key={c.name}
                    className={
                      i < gatewayCourses.length - 1
                        ? 'border-b border-gray-50'
                        : ''
                    }
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold" style={{ color: NAVY }}>
                        {c.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-600">
                      {c.sections}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            parseFloat(c.dfwRate) > 25
                              ? CORAL
                              : parseFloat(c.dfwRate) > 18
                              ? '#D97706'
                              : GREEN,
                        }}
                      >
                        {c.dfwRate}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-semibold" style={{ color: NAVY }}>
                      {c.proficiency}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className="font-semibold"
                        style={{
                          color: c.improvementPositive ? GREEN : CORAL,
                        }}
                      >
                        {c.improvement}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {c.intervention !== 'None' ? (
                        <StatusTag text={c.intervention} color={TEAL} />
                      ) : (
                        <span className="text-xs text-gray-300 italic">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 5. Faculty Development ── */}
        <section>
          <SectionHeading>Faculty Development</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Platform Engagement */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                Platform Engagement
              </p>
              <div className="flex items-end gap-2 mb-4">
                <span
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'Georgia, serif', color: NAVY }}
                >
                  {facultyStats.activeFaculty}
                </span>
                <span className="text-lg text-gray-400 mb-1">
                  / {facultyStats.totalFaculty}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">faculty active on the platform</p>
              <ProgressBar
                value={Math.round(
                  (facultyStats.activeFaculty / facultyStats.totalFaculty) * 100
                )}
                color={PLUM}
              />
              <p className="text-xs text-gray-400 text-right mt-1 font-medium">
                {Math.round(
                  (facultyStats.activeFaculty / facultyStats.totalFaculty) * 100
                )}
                % adoption
              </p>
            </div>

            {/* Training Completion */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                Training Completion
              </p>
              <div className="flex items-end gap-2 mb-4">
                <span
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'Georgia, serif', color: TEAL }}
                >
                  {facultyStats.trainingModules.rate}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {facultyStats.trainingModules.completed} of{' '}
                {facultyStats.trainingModules.total} modules completed
              </p>
              <ProgressBar
                value={parseFloat(facultyStats.trainingModules.rate)}
                color={TEAL}
              />
            </div>

            {/* Proficiency Impact */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                Proficiency by Engagement
              </p>
              <div className="space-y-4 mt-2">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-600">
                      Engaged Faculty
                    </span>
                    <span className="text-sm font-bold" style={{ color: GREEN }}>
                      {facultyStats.proficiencyByEngagement.engaged}
                    </span>
                  </div>
                  <ProgressBar
                    value={parseFloat(facultyStats.proficiencyByEngagement.engaged)}
                    color={GREEN}
                    height="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-600">
                      Not Engaged
                    </span>
                    <span className="text-sm font-bold" style={{ color: '#9ca3af' }}>
                      {facultyStats.proficiencyByEngagement.notEngaged}
                    </span>
                  </div>
                  <ProgressBar
                    value={parseFloat(facultyStats.proficiencyByEngagement.notEngaged)}
                    color="#d1d5db"
                    height="h-2"
                  />
                </div>
                <div
                  className="pt-3 border-t border-gray-100 flex items-center justify-between"
                >
                  <span className="text-xs text-gray-400 font-medium">
                    Engagement Gap
                  </span>
                  <span className="text-sm font-bold" style={{ color: GREEN }}>
                    {facultyStats.proficiencyByEngagement.gap}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Program Review Queue ── */}
        <section className="pb-8">
          <SectionHeading sub="Programs due for periodic review or accreditation renewal">
            Program Review Queue
          </SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programReviews.map((pr) => {
              const uc = urgencyColor(pr.actionUrgency);
              return (
                <div
                  key={pr.program}
                  className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        className="text-base font-bold"
                        style={{ fontFamily: 'Georgia, serif', color: NAVY }}
                      >
                        {pr.program}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {pr.cycle} &middot; Last reviewed {pr.lastReview}
                      </p>
                    </div>
                    <StatusTag text={pr.action} color={uc} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Enrollment</p>
                      <p className="text-lg font-bold" style={{ color: NAVY }}>
                        {pr.enrollment}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Completion Rate</p>
                      <p
                        className="text-lg font-bold"
                        style={{
                          color:
                            parseFloat(pr.completionRate) < 70 ? CORAL : NAVY,
                        }}
                      >
                        {pr.completionRate}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
