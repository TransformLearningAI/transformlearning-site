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

const networkCourses = [
  { id: 'calc1',    course: 'Calculus I',            dept: 'Mathematics', deptColor: teal,  role: 'Primary',    students: 187, proficiency: 68, weight: 35 },
  { id: 'stats',    course: 'Statistics',            dept: 'Mathematics', deptColor: teal,  role: 'Primary',    students: 142, proficiency: 64, weight: 30 },
  { id: 'genchem',  course: 'General Chemistry I',   dept: 'Chemistry',   deptColor: coral, role: 'Supporting', students: 210, proficiency: 57, weight: 12 },
  { id: 'micro',    course: 'Principles of Micro',   dept: 'Economics',   deptColor: plum,  role: 'Supporting', students: 168, proficiency: 61, weight: 10 },
  { id: 'resmeth',  course: 'Research Methods',      dept: 'Psychology',  deptColor: green, role: 'Supporting', students: 95,  proficiency: 53, weight: 8 },
  { id: 'ecology',  course: 'Ecology',               dept: 'Biology',     deptColor: amber, role: 'Supporting', students: 78,  proficiency: 59, weight: 5 },
];

const crossInsights = [
  {
    icon: '🔗',
    text: 'Students who take Statistics before Research Methods score 23% higher on statistical inference.',
    type: 'Sequencing',
    typeColor: teal,
  },
  {
    icon: '⚠️',
    text: 'Calculus I and Gen Chem stoichiometry share 4 sub-skills. Students struggling in one are likely struggling in both — but no one coordinates.',
    type: 'Overlap',
    typeColor: coral,
  },
  {
    icon: '👁️',
    text: '68 students are below threshold in quantitative reasoning across 3 departments. Only the Math dept knows about 22 of them.',
    type: 'Visibility Gap',
    typeColor: plum,
  },
];

const stewardActions = [
  { action: 'Coordinate shared remediation for stoichiometry + integration sub-skills', students: 34, depts: ['Math', 'Chemistry'], priority: 'High' },
  { action: 'Recommend Statistics before Research Methods in advising pathways', students: 95, depts: ['Math', 'Psychology'], priority: 'Medium' },
  { action: 'Deploy cross-department quantitative reasoning diagnostic', students: 68, depts: ['Math', 'Chemistry', 'Economics', 'Psychology'], priority: 'High' },
  { action: 'Share Ecology population modeling exercises with Calculus I for applied context', students: 78, depts: ['Biology', 'Math'], priority: 'Low' },
];

const strugglingByDept = [
  { dept: 'Mathematics', count: 22, color: teal },
  { dept: 'Chemistry',   count: 18, color: coral },
  { dept: 'Economics',    count: 14, color: plum },
  { dept: 'Psychology',   count: 14, color: green },
];

const institutionalOutcomes = [
  { name: 'Quantitative Reasoning',   pct: 61, color: coral },
  { name: 'Critical Thinking',        pct: 67, color: amber },
  { name: 'Written Communication',    pct: 72, color: green },
  { name: 'Ethical Reasoning',        pct: 58, color: coral },
  { name: 'Scientific Literacy',      pct: 65, color: amber },
  { name: 'Information Literacy',     pct: 71, color: green },
  { name: 'Oral Communication',       pct: 69, color: amber },
  { name: 'Global Awareness',         pct: 63, color: amber },
];

/* ── Helpers ──────────────────────────────────────────────────── */

function ProficiencyBar({ value, color, height = 'h-2.5' }) {
  const barColor =
    color || (value >= 70 ? green : value >= 60 ? teal : value >= 50 ? amber : coral);
  return (
    <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden`}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, backgroundColor: barColor }}
      />
    </div>
  );
}

function RoleBadge({ role }) {
  const isPrimary = role === 'Primary';
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
      isPrimary ? 'bg-navy text-white' : 'bg-brand-mist text-brand-gray'
    }`}>
      {role}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High:   'bg-brand-coral/15 text-brand-coral',
    Medium: 'bg-amber-100 text-amber-700',
    Low:    'bg-brand-green/15 text-brand-green',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[priority]}`}>
      {priority}
    </span>
  );
}

/* ── Network Visualization ────────────────────────────────────── */

function NetworkMap() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const centerX = 300;
  const centerY = 220;
  const radius = 155;

  const nodes = networkCourses.map((c, i) => {
    const angle = (i * 2 * Math.PI) / networkCourses.length - Math.PI / 2;
    return {
      ...c,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox="0 0 600 440" className="w-full max-w-2xl mx-auto" style={{ minWidth: 400 }}>
        {/* Connection lines */}
        {nodes.map((node) => (
          <line
            key={`line-${node.id}`}
            x1={centerX}
            y1={centerY}
            x2={node.x}
            y2={node.y}
            stroke={hoveredNode === node.id ? node.deptColor : '#DDE5EF'}
            strokeWidth={hoveredNode === node.id ? 3 : node.role === 'Primary' ? 2.5 : 1.5}
            strokeDasharray={node.role === 'Supporting' ? '6,4' : 'none'}
            className="transition-all duration-300"
          />
        ))}

        {/* Weight labels on lines */}
        {nodes.map((node) => {
          const mx = (centerX + node.x) / 2;
          const my = (centerY + node.y) / 2;
          return (
            <g key={`weight-${node.id}`}>
              <rect x={mx - 14} y={my - 9} width={28} height={18} rx={9} fill="white" stroke="#DDE5EF" strokeWidth={1} />
              <text x={mx} y={my + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={navy}>
                {node.weight}%
              </text>
            </g>
          );
        })}

        {/* Center node */}
        <circle cx={centerX} cy={centerY} r={48} fill={navy} />
        <circle cx={centerX} cy={centerY} r={48} fill="none" stroke={teal} strokeWidth={3} opacity={0.6} />
        <text x={centerX} y={centerY - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="white">Quantitative</text>
        <text x={centerX} y={centerY + 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="white">Reasoning</text>
        <text x={centerX} y={centerY + 22} textAnchor="middle" fontSize={10} fill={teal}>61%</text>

        {/* Course nodes */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const nodeRadius = node.role === 'Primary' ? 36 : 30;
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={isHovered ? node.deptColor : 'white'}
                stroke={node.deptColor}
                strokeWidth={2.5}
                className="transition-all duration-300"
              />
              <text
                x={node.x}
                y={node.y - (node.role === 'Primary' ? 8 : 4)}
                textAnchor="middle"
                fontSize={node.role === 'Primary' ? 9.5 : 8.5}
                fontWeight={600}
                fill={isHovered ? 'white' : navy}
                className="transition-all duration-300"
              >
                {node.course.length > 14 ? node.course.slice(0, 14) + '...' : node.course}
              </text>
              <text
                x={node.x}
                y={node.y + (node.role === 'Primary' ? 5 : 7)}
                textAnchor="middle"
                fontSize={8}
                fill={isHovered ? 'white' : '#5F7691'}
              >
                {node.dept}
              </text>
              <text
                x={node.x}
                y={node.y + (node.role === 'Primary' ? 18 : 18)}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={isHovered ? 'white' : node.deptColor}
              >
                {node.proficiency}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function OutcomeNetworksDemo() {
  return (
    <div className="min-h-screen bg-brand-soft font-sans">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-brand-border bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-navy">
            arrival.ai
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
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-green/10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-teal/8" />
          <div className="relative">
            <p className="text-brand-green text-sm font-semibold tracking-wide uppercase">Outcome Networks</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight font-serif">
              Outcome Network: Quantitative Reasoning
            </h1>
            <p className="mt-3 text-white/70 text-base max-w-2xl leading-relaxed">
              Not owned by one department. Contributed to by many.
              Departments are dead. Learning outcomes cross every boundary.
            </p>
          </div>

          <div className="relative mt-8 flex flex-wrap gap-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Contributing Courses</p>
              <p className="mt-1 text-3xl font-bold">6</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Departments</p>
              <p className="mt-1 text-3xl font-bold">4</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Students Reached</p>
              <p className="mt-1 text-3xl font-bold">880</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Overall Proficiency</p>
              <p className="mt-1 text-3xl font-bold">
                61<span className="text-lg text-white/60">%</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Below Threshold</p>
              <p className="mt-1 text-3xl font-bold text-brand-coral">68</p>
            </div>
          </div>
        </section>

        {/* ── Network Map ── */}
        <section className="bg-white rounded-xl border border-brand-border p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-navy font-serif">Outcome Network Map</h2>
            <p className="text-xs text-brand-gray mt-0.5">
              Hover to explore connections. Line weight = contribution percentage. Solid = primary, dashed = supporting.
            </p>
          </div>

          <NetworkMap />

          {/* Course detail table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-mist text-xs uppercase tracking-wider text-brand-gray">
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Students</th>
                  <th className="px-4 py-3 font-semibold">Proficiency</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {networkCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-brand-mist/40 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-navy whitespace-nowrap">{c.course}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium" style={{ color: c.deptColor }}>{c.dept}</span>
                    </td>
                    <td className="px-4 py-3.5"><RoleBadge role={c.role} /></td>
                    <td className="px-4 py-3.5 text-sm text-navy font-medium">{c.students}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <ProficiencyBar value={c.proficiency} />
                        <span className="text-sm font-semibold text-navy w-10 text-right">{c.proficiency}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{c.weight}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Cross-Department Insight Panel ── */}
        <section className="bg-white rounded-xl border border-brand-border p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
            <h2 className="text-lg font-bold text-navy font-serif">Cross-Department Insights</h2>
          </div>
          <p className="text-xs text-brand-gray mb-5">AI-generated patterns invisible within any single department</p>

          <div className="space-y-4">
            {crossInsights.map((insight, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-brand-border bg-brand-soft hover:shadow-md transition-shadow">
                <span className="text-2xl shrink-0 mt-0.5">{insight.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: insight.typeColor + '1A', color: insight.typeColor }}
                    >
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-sm text-navy leading-relaxed">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Outcome Steward ── */}
        <section className="bg-white rounded-xl border border-brand-border overflow-hidden">
          <div className="bg-gradient-to-r from-navy to-navy-light px-6 py-6 text-white">
            <p className="text-brand-teal text-xs font-semibold tracking-wide uppercase">Outcome Steward</p>
            <h2 className="mt-1.5 text-2xl font-bold font-serif">Dr. Min-Jun Park</h2>
            <p className="mt-1 text-white/70 text-sm">
              Quantitative Reasoning Steward &nbsp;·&nbsp; Cross-Department Authority
            </p>
            <p className="mt-3 text-white/90 text-sm leading-relaxed max-w-xl">
              Not a department chair. A steward of a learning outcome. Sees every student, every course, every department
              that touches quantitative reasoning. One person. One view. Total visibility.
            </p>
          </div>

          <div className="p-6">
            {/* Steward's view: struggling students by dept */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-navy mb-3">Steward&rsquo;s View: 68 Students Below Threshold</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {strugglingByDept.map((d) => (
                  <div key={d.dept} className="rounded-xl border border-brand-border p-4 text-center">
                    <p className="text-2xl font-bold" style={{ color: d.color }}>{d.count}</p>
                    <p className="text-xs text-brand-gray mt-1">{d.dept}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-brand-coral/10 rounded-lg px-4 py-3">
                <p className="text-sm text-brand-coral font-medium">
                  Before Campus OS, each department only saw their own slice. The steward sees all 68.
                </p>
              </div>
            </div>

            {/* Recommended cross-departmental actions */}
            <h3 className="text-sm font-bold text-navy mb-3">Recommended Cross-Departmental Actions</h3>
            <div className="space-y-3">
              {stewardActions.map((a, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-brand-border hover:bg-brand-mist/40 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-brand-teal/15 text-brand-teal flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{a.action}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs text-brand-gray">{a.students} students</span>
                      <span className="text-xs text-brand-gray">·</span>
                      {a.depts.map((d) => (
                        <span key={d} className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-mist text-brand-gray">{d}</span>
                      ))}
                    </div>
                  </div>
                  <PriorityBadge priority={a.priority} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Before/After Comparison ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* OLD */}
          <div className="rounded-xl border-2 border-brand-coral/30 bg-brand-coral/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-coral/15 text-brand-coral uppercase tracking-wider">Old Model</span>
            </div>
            <h3 className="text-lg font-bold text-navy font-serif mb-4">Departmental Silos</h3>
            <div className="space-y-3">
              {strugglingByDept.map((d) => (
                <div key={d.dept} className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-brand-border">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: d.color }}>
                    {d.count}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">{d.dept} sees {d.count} struggling students</p>
                    <p className="text-xs text-brand-gray">Separate intervention. No coordination.</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-brand-coral/20">
              <p className="text-sm text-brand-gray leading-relaxed">
                <span className="font-semibold text-navy">68 students. 4 separate interventions. Zero coordination.</span>
                {' '}Nobody connects the dots. A student struggling in Gen Chem stoichiometry and Calculus integration is getting two unrelated emails from two departments that don&rsquo;t talk to each other.
              </p>
            </div>
          </div>

          {/* NEW */}
          <div className="rounded-xl border-2 border-brand-green/30 bg-brand-green/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-green/15 text-brand-green uppercase tracking-wider">Campus OS</span>
            </div>
            <h3 className="text-lg font-bold text-navy font-serif mb-4">One Outcome Network</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-brand-border">
                <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-sm font-bold text-white">
                  68
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">All 68 students visible. One view.</p>
                  <p className="text-xs text-brand-gray">One outcome steward. Full cross-department authority.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-brand-border">
                <div className="w-10 h-10 rounded-lg bg-brand-teal flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="12" r="6" opacity="0.6" />
                    <circle cx="12" cy="12" r="10" opacity="0.3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">One coordinated response</p>
                  <p className="text-xs text-brand-gray">AI identifies shared sub-skills causing the gap.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-brand-border">
                <div className="w-10 h-10 rounded-lg bg-brand-green flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">Shared remediation, not duplicated effort</p>
                  <p className="text-xs text-brand-gray">4 overlapping sub-skills addressed once, not four times.</p>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-brand-green/20">
              <p className="text-sm text-brand-gray leading-relaxed">
                <span className="font-semibold text-navy">The outcome doesn&rsquo;t care about your org chart.</span>
                {' '}When you organize around what students need to learn, not who reports to whom, you see what was always there but invisible.
              </p>
            </div>
          </div>
        </section>

        {/* ── Institutional Outcome Dashboard ── */}
        <section className="bg-white rounded-xl border border-brand-border p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-navy font-serif">Institutional Learning Outcomes</h2>
            <p className="text-xs text-brand-gray mt-0.5">
              Each outcome is a network like the one above. Every bar represents dozens of courses, thousands of students, and connections no org chart captures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {institutionalOutcomes.map((o) => {
              const barColor = o.pct >= 70 ? green : o.pct >= 65 ? teal : o.pct >= 60 ? amber : coral;
              const isActive = o.name === 'Quantitative Reasoning';
              return (
                <div
                  key={o.name}
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-brand-teal bg-brand-teal/5 ring-2 ring-brand-teal/20'
                      : 'border-brand-border hover:bg-brand-mist/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-navy">{o.name}</p>
                    <span className="text-sm font-bold" style={{ color: barColor }}>{o.pct}%</span>
                  </div>
                  <ProficiencyBar value={o.pct} color={barColor} height="h-3" />
                  {isActive && (
                    <p className="text-xs text-brand-teal font-medium mt-2">Currently viewing this network</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-4 pt-4 border-t border-brand-border">
            <span className="flex items-center gap-1.5 text-xs text-brand-gray">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: green }} /> &ge; 70%
            </span>
            <span className="flex items-center gap-1.5 text-xs text-brand-gray">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: teal }} /> 65&ndash;69%
            </span>
            <span className="flex items-center gap-1.5 text-xs text-brand-gray">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: amber }} /> 60&ndash;64%
            </span>
            <span className="flex items-center gap-1.5 text-xs text-brand-gray">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: coral }} /> &lt; 60%
            </span>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center py-8">
          <p className="text-xs text-brand-gray">
            arrival.ai Campus OS &nbsp;·&nbsp; Outcome Networks &nbsp;·&nbsp; Quantitative Reasoning Network
          </p>
        </footer>
      </main>
    </div>
  );
}
