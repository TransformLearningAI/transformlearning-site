'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ───────────────────────── Mock Data ───────────────────────── */

const cohortQueue = [
  { name: 'Jamal Williams',   proficiency: 28, trend: 'down', daysSince: 11, priority: 'Critical' },
  { name: 'Priya Patel',      proficiency: 35, trend: 'down', daysSince: 8,  priority: 'Critical' },
  { name: 'Tyler Morrison',   proficiency: 42, trend: 'flat', daysSince: 6,  priority: 'Watch' },
  { name: 'Anika Johansson',  proficiency: 48, trend: 'up',   daysSince: 3,  priority: 'Watch' },
  { name: 'Carlos Medina',    proficiency: 55, trend: 'flat', daysSince: 5,  priority: 'Nudge' },
  { name: 'Destiny Brooks',   proficiency: 51, trend: 'up',   daysSince: 2,  priority: 'Nudge' },
];

const atRiskStudents = [
  { name: 'Jamal Williams',   proficiency: 28, trend: 'down', lastActive: 'Oct 18', risk: 'High',   action: 'Schedule advising meeting' },
  { name: 'Priya Patel',      proficiency: 35, trend: 'down', lastActive: 'Oct 21', risk: 'High',   action: 'Refer to tutoring center' },
  { name: 'Kevin Okafor',     proficiency: 38, trend: 'flat', lastActive: 'Oct 24', risk: 'High',   action: 'Send check-in message' },
  { name: 'Tyler Morrison',   proficiency: 42, trend: 'flat', lastActive: 'Oct 23', risk: 'Medium', action: 'Assign practice set on Derivatives' },
  { name: 'Anika Johansson',  proficiency: 48, trend: 'up',   lastActive: 'Oct 26', risk: 'Medium', action: 'Encourage office hours visit' },
  { name: 'Destiny Brooks',   proficiency: 51, trend: 'up',   lastActive: 'Oct 27', risk: 'Medium', action: 'Pair with peer mentor' },
  { name: 'Carlos Medina',    proficiency: 55, trend: 'flat', lastActive: 'Oct 24', risk: 'Low',    action: 'Integration practice quiz' },
  { name: 'Maria Gonzalez',   proficiency: 58, trend: 'up',   lastActive: 'Oct 28', risk: 'Low',    action: 'Monitor — trending positive' },
];

const skills = [
  { name: 'Limits & Continuity',     avg: 78 },
  { name: 'Derivatives — Rules',     avg: 72 },
  { name: 'Derivatives — Applications', avg: 62 },
  { name: 'Related Rates',           avg: 54 },
  { name: 'Fundamental Theorem',     avg: 48 },
  { name: 'Integration Techniques',  avg: 41 },
];

/* ───────────────────────── Helpers ───────────────────────── */

function TrendArrow({ trend }) {
  if (trend === 'up') return <span className="text-brand-green font-bold text-sm">&#9650;</span>;
  if (trend === 'down') return <span className="text-brand-coral font-bold text-sm">&#9660;</span>;
  return <span className="text-gray-400 font-bold text-sm">&#9654;</span>;
}

function PriorityTag({ priority }) {
  const styles = {
    Critical: 'bg-brand-coral/15 text-brand-coral',
    Watch:    'bg-amber-100 text-amber-700',
    Nudge:    'bg-brand-teal/15 text-brand-teal',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function RiskBadge({ level }) {
  const styles = {
    High:   'bg-brand-coral/15 text-brand-coral',
    Medium: 'bg-amber-100 text-amber-700',
    Low:    'bg-brand-green/15 text-brand-green',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[level]}`}>
      {level}
    </span>
  );
}

function SkillBar({ name, value }) {
  const barColor =
    value >= 70 ? '#4F8A5B' :
    value >= 55 ? '#00A8A8' :
    value >= 45 ? '#F59E0B' :
    '#FF6B4A';

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-brand-gray w-48 shrink-0 truncate">{name}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-sm font-semibold text-navy w-10 text-right">{value}%</span>
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function ProfessorDashboard() {
  const [queueFilter, setQueueFilter] = useState('All');

  const filteredQueue = queueFilter === 'All'
    ? cohortQueue
    : cohortQueue.filter(s => s.priority === queueFilter);

  return (
    <div className="min-h-screen bg-brand-soft font-sans">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-brand-border bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-navy">
            transformlearning.ai
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-sm font-medium text-brand-gray">Professor</span>
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
        {/* ── Header ── */}
        <section className="bg-navy rounded-2xl px-8 py-8 text-white relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-teal/10" />
          <div className="relative">
            <p className="text-brand-teal text-sm font-semibold tracking-wide uppercase">Professor Dashboard</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight font-serif">
              Dr. Sarah Chen
            </h1>
            <p className="mt-1 text-white/70 text-base">
              Calculus I &nbsp;·&nbsp; Fall 2026 &nbsp;·&nbsp; MTH 151
            </p>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Cohort Proficiency</p>
              <p className="mt-1 text-3xl font-bold">
                64<span className="text-lg text-white/60">%</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Enrolled</p>
              <p className="mt-1 text-3xl font-bold">187</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Sections</p>
              <p className="mt-1 text-3xl font-bold">4</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Week</p>
              <p className="mt-1 text-3xl font-bold">
                7<span className="text-lg text-white/60">/15</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Cohort Stats ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Avg Proficiency',   value: '64%',      sub: '+3 pts this week',  color: '#0C1F3F', icon: '📊' },
            { label: 'DFW Rate',          value: '18%',      sub: '↓ 2 pts vs. midterm', color: '#4F8A5B', icon: '📉' },
            { label: 'Active This Week',  value: '142/187',  sub: '76% engagement',     color: '#00A8A8', icon: '⚡' },
            { label: 'Skills Mastered',   value: '3.2/8',    sub: 'class average',      color: '#5A3E6B', icon: '🎯' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-brand-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-brand-gray font-medium">{stat.label}</p>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="mt-2 text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="mt-1 text-xs text-brand-gray">{stat.sub}</p>
            </div>
          ))}
        </section>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Cohort Queue */}
          <section className="lg:col-span-2 bg-white rounded-xl border border-brand-border overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-brand-border">
              <h2 className="text-lg font-bold text-navy font-serif">Cohort Queue</h2>
              <p className="text-xs text-brand-gray mt-0.5">Students needing attention, sorted by urgency</p>
              <div className="flex gap-2 mt-3">
                {['All', 'Critical', 'Watch', 'Nudge'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setQueueFilter(f)}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${
                      queueFilter === f
                        ? 'bg-navy text-white'
                        : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <ul className="divide-y divide-brand-border">
              {filteredQueue.map((s) => (
                <li key={s.name} className="px-6 py-4 flex items-center justify-between gap-3 hover:bg-brand-mist/60 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{s.name}</p>
                    <p className="text-xs text-brand-gray mt-0.5">
                      {s.proficiency}% &nbsp;
                      <TrendArrow trend={s.trend} />
                      &nbsp; · &nbsp;{s.daysSince}d since last activity
                    </p>
                  </div>
                  <PriorityTag priority={s.priority} />
                </li>
              ))}
              {filteredQueue.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-brand-gray">No students match this filter.</li>
              )}
            </ul>
          </section>

          {/* Skill Distribution */}
          <section className="lg:col-span-3 bg-white rounded-xl border border-brand-border p-6">
            <h2 className="text-lg font-bold text-navy font-serif">Skill Distribution</h2>
            <p className="text-xs text-brand-gray mt-0.5 mb-6">Class average proficiency by skill area</p>
            <div className="space-y-4">
              {skills.map((s) => (
                <SkillBar key={s.name} name={s.name} value={s.avg} />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-brand-border">
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded-full bg-brand-green inline-block" /> ≥ 70%
              </span>
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded-full bg-brand-teal inline-block" /> 55–69%
              </span>
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> 45–54%
              </span>
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded-full bg-brand-coral inline-block" /> &lt; 45%
              </span>
            </div>
          </section>
        </div>

        {/* ── At-Risk Table ── */}
        <section className="bg-white rounded-xl border border-brand-border overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-brand-border">
            <h2 className="text-lg font-bold text-navy font-serif">At-Risk Students</h2>
            <p className="text-xs text-brand-gray mt-0.5">Students below 60% proficiency or declining trend</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-mist text-xs uppercase tracking-wider text-brand-gray">
                  <th className="px-6 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Proficiency</th>
                  <th className="px-4 py-3 font-semibold">Trend</th>
                  <th className="px-4 py-3 font-semibold">Last Active</th>
                  <th className="px-4 py-3 font-semibold">Risk Level</th>
                  <th className="px-4 py-3 font-semibold">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {atRiskStudents.map((s) => (
                  <tr key={s.name} className="hover:bg-brand-mist/40 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-navy whitespace-nowrap">{s.name}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${s.proficiency}%`,
                              backgroundColor: s.proficiency < 40 ? '#FF6B4A' : s.proficiency < 55 ? '#F59E0B' : '#00A8A8',
                            }}
                          />
                        </div>
                        <span className="text-sm text-navy font-medium">{s.proficiency}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><TrendArrow trend={s.trend} /></td>
                    <td className="px-4 py-3.5 text-sm text-brand-gray whitespace-nowrap">{s.lastActive}</td>
                    <td className="px-4 py-3.5"><RiskBadge level={s.risk} /></td>
                    <td className="px-4 py-3.5 text-sm text-brand-gray">{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center py-8">
          <p className="text-xs text-brand-gray">
            transformlearning.ai Campus OS &nbsp;·&nbsp; Professor View &nbsp;·&nbsp; Data refreshed Oct 29, 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
