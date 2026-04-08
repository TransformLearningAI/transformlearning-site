'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/* ───────────────────────── Mock Data ───────────────────────── */

const studentMeta = {
  name: 'Marcus Thompson',
  course: 'Calculus I — MTH 151',
  week: 7,
  totalWeeks: 15,
  proficiency: 64,
  level: 'Explorer',
  xp: 2340,
  nextLevelXp: 3000,
};

const skillMap = [
  { name: 'Limits & Continuity',     proficiency: 82, status: 'Strong',      tag: 'Foundational' },
  { name: 'Derivative Rules',        proficiency: 74, status: 'Strong',      tag: 'Core' },
  { name: 'Derivative Applications', proficiency: 61, status: 'Progressing', tag: 'Core' },
  { name: 'Related Rates',           proficiency: 53, status: 'Progressing', tag: 'Core' },
  { name: 'Fundamental Theorem',     proficiency: 47, status: 'Needs Focus', tag: 'Core' },
  { name: 'Integration Techniques',  proficiency: 34, status: 'Needs Focus', tag: 'Core' },
];

const weeklyProficiency = [
  { week: 1,  value: 22 },
  { week: 2,  value: 30 },
  { week: 3,  value: 38 },
  { week: 4,  value: 44 },
  { week: 5,  value: 50 },
  { week: 6,  value: 57 },
  { week: 7,  value: 64 },
  { week: 8,  value: null },
  { week: 9,  value: null },
  { week: 10, value: null },
  { week: 11, value: null },
  { week: 12, value: null },
];

const recentActivity = [
  { type: 'quiz',     title: 'Derivative Rules Quiz',       score: '8/10',  date: 'Oct 28', xp: '+40 XP' },
  { type: 'coaching', title: 'Coaching: Related Rates',     score: null,    date: 'Oct 27', xp: '+25 XP' },
  { type: 'quiz',     title: 'Limits Practice Set',         score: '9/10',  date: 'Oct 25', xp: '+45 XP' },
  { type: 'upload',   title: 'Problem Set 5 Submission',    score: '72%',   date: 'Oct 23', xp: '+30 XP' },
  { type: 'coaching', title: 'Coaching: Study Strategies',  score: null,    date: 'Oct 21', xp: '+25 XP' },
];

const quests = [
  {
    title: 'Integration Boot Camp',
    description: 'Complete 5 integration practice problems to strengthen your weakest skill.',
    xp: 60,
    difficulty: 'Challenging',
    icon: '🏋️',
  },
  {
    title: 'Teach-Back Session',
    description: 'Explain the Fundamental Theorem to a peer and earn mastery credit.',
    xp: 80,
    difficulty: 'Medium',
    icon: '🎓',
  },
  {
    title: 'Daily Streak: Day 4',
    description: 'Complete any activity today to keep your streak alive.',
    xp: 20,
    difficulty: 'Easy',
    icon: '🔥',
  },
];

/* ───────────────────────── Helpers ───────────────────────── */

function CircularProgress({ value, size = 72, strokeWidth = 6 }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timeout);
  }, [value]);

  const color =
    value >= 70 ? '#4F8A5B' :
    value >= 50 ? '#00A8A8' :
    value >= 40 ? '#F59E0B' :
    '#FF6B4A';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#F0F0F0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

function StatusTag({ status }) {
  const styles = {
    'Strong':      'bg-brand-green/15 text-brand-green',
    'Progressing': 'bg-brand-teal/15 text-brand-teal',
    'Needs Focus': 'bg-brand-coral/15 text-brand-coral',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

function SkillTag({ tag }) {
  return (
    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
      tag === 'Foundational' ? 'bg-brand-purple/10 text-brand-purple' : 'bg-gray-100 text-brand-gray'
    }`}>
      {tag}
    </span>
  );
}

function ActivityIcon({ type }) {
  const icons = {
    quiz:     <span className="text-brand-teal">✎</span>,
    coaching: <span className="text-brand-purple">💬</span>,
    upload:   <span className="text-brand-green">📄</span>,
  };
  return (
    <div className="w-8 h-8 rounded-full bg-brand-mist flex items-center justify-center text-sm">
      {icons[type]}
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-brand-soft font-sans">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-brand-border bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-navy">
            arrival.ai
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-sm font-medium text-brand-gray">Student</span>
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
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-brand-teal/10" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-brand-purple/10" />

          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-brand-teal text-sm font-semibold tracking-wide uppercase">Student Dashboard</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight font-serif">
                {studentMeta.name}
              </h1>
              <p className="mt-1 text-white/70 text-base">{studentMeta.course}</p>
            </div>

            <div className="flex flex-wrap items-end gap-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Week</p>
                <p className="mt-1 text-2xl font-bold">
                  {studentMeta.week}<span className="text-base text-white/50">/{studentMeta.totalWeeks}</span>
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Proficiency</p>
                <p className="mt-1 text-2xl font-bold">
                  {studentMeta.proficiency}<span className="text-base text-white/50">%</span>
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Level</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-2xl font-bold">{studentMeta.level}</span>
                  <span className="px-2 py-0.5 bg-brand-teal/20 text-brand-teal rounded-full text-xs font-semibold">
                    {studentMeta.xp} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="relative mt-6">
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>Level Progress</span>
              <span>{studentMeta.xp} / {studentMeta.nextLevelXp} XP</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-teal rounded-full transition-all duration-700"
                style={{ width: `${(studentMeta.xp / studentMeta.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* ── Priority Alert ── */}
        <section className="rounded-xl border-2 border-brand-coral/30 bg-brand-coral/5 p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-brand-coral/15 flex items-center justify-center text-2xl shrink-0">
            ⚠️
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-coral">Priority Gap</p>
            <p className="mt-1 text-lg font-bold text-navy font-serif">
              Integration Techniques — 34%
            </p>
            <p className="text-sm text-brand-gray mt-0.5">Exam covering this topic in 2 weeks. Closing this gap is your highest-leverage move.</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button className="px-4 py-2 bg-brand-coral text-white text-sm font-semibold rounded-lg hover:bg-brand-coral/90 transition-colors">
              Practice Quiz
            </button>
            <button className="px-4 py-2 bg-white border border-brand-border text-navy text-sm font-semibold rounded-lg hover:bg-brand-mist transition-colors">
              Ask Coach
            </button>
            <button className="px-4 py-2 bg-white border border-brand-border text-navy text-sm font-semibold rounded-lg hover:bg-brand-mist transition-colors">
              Study Guide
            </button>
          </div>
        </section>

        {/* ── Skill Map ── */}
        <section>
          <h2 className="text-lg font-bold text-navy font-serif mb-4">Skill Map</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillMap.map((skill) => (
              <div
                key={skill.name}
                className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${
                  skill.status === 'Needs Focus'
                    ? 'border-brand-coral/30'
                    : 'border-brand-border'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <SkillTag tag={skill.tag} />
                      <StatusTag status={skill.status} />
                    </div>
                    <p className="text-sm font-semibold text-navy">{skill.name}</p>
                    <p className="text-2xl font-bold mt-1" style={{
                      color: skill.proficiency >= 70 ? '#4F8A5B' : skill.proficiency >= 50 ? '#00A8A8' : skill.proficiency >= 40 ? '#F59E0B' : '#FF6B4A'
                    }}>
                      {skill.proficiency}%
                    </p>
                  </div>
                  <div className="shrink-0 relative">
                    <CircularProgress value={skill.proficiency} />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-navy rotate-90">
                      {skill.proficiency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Two-column: Trajectory + Activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trajectory */}
          <section className="lg:col-span-2 bg-white rounded-xl border border-brand-border p-6">
            <h2 className="text-lg font-bold text-navy font-serif">Proficiency Trajectory</h2>
            <p className="text-xs text-brand-gray mt-0.5 mb-6">Weekly proficiency over the semester</p>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-44">
              {weeklyProficiency.map((w) => {
                const isCurrent = w.week === studentMeta.week;
                const isFuture = w.value === null;
                const height = isFuture ? 0 : (w.value / 100) * 100;
                const barColor = isCurrent
                  ? '#0C1F3F'
                  : isFuture
                  ? 'transparent'
                  : w.value >= 60
                  ? '#00A8A8'
                  : w.value >= 40
                  ? '#F59E0B'
                  : '#FF6B4A';

                return (
                  <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold text-brand-gray">
                      {!isFuture ? `${w.value}%` : ''}
                    </span>
                    <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                      {isFuture ? (
                        <div
                          className="w-full max-w-8 rounded-t border-2 border-dashed border-gray-200"
                          style={{ height: '100%' }}
                        />
                      ) : (
                        <div
                          className="w-full max-w-8 rounded-t transition-all duration-500"
                          style={{
                            height: `${height}%`,
                            backgroundColor: barColor,
                            minHeight: '4px',
                          }}
                        />
                      )}
                    </div>
                    <span className={`text-[10px] ${isCurrent ? 'font-bold text-navy' : 'text-brand-gray'}`}>
                      W{w.week}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-brand-border">
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded bg-navy inline-block" /> Current
              </span>
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded bg-brand-teal inline-block" /> On Track
              </span>
              <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                <span className="w-3 h-3 rounded border-2 border-dashed border-gray-300 inline-block" /> Upcoming
              </span>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="bg-white rounded-xl border border-brand-border overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-brand-border">
              <h2 className="text-lg font-bold text-navy font-serif">Recent Activity</h2>
              <p className="text-xs text-brand-gray mt-0.5">Your latest learning events</p>
            </div>
            <ul className="divide-y divide-brand-border">
              {recentActivity.map((a, i) => (
                <li key={i} className="px-6 py-4 flex items-center gap-3 hover:bg-brand-mist/60 transition-colors">
                  <ActivityIcon type={a.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{a.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-brand-gray">{a.date}</span>
                      {a.score && (
                        <>
                          <span className="text-xs text-brand-gray">·</span>
                          <span className="text-xs font-semibold text-navy">{a.score}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-teal whitespace-nowrap">{a.xp}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ── Quest Board ── */}
        <section>
          <h2 className="text-lg font-bold text-navy font-serif mb-4">Quest Board</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quests.map((q) => {
              const difficultyColor = {
                Easy:        'bg-brand-green/15 text-brand-green',
                Medium:      'bg-brand-teal/15 text-brand-teal',
                Challenging: 'bg-brand-purple/15 text-brand-purple',
              };

              return (
                <div
                  key={q.title}
                  className="bg-white rounded-xl border border-brand-border p-5 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{q.icon}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${difficultyColor[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy">{q.title}</h3>
                  <p className="text-xs text-brand-gray mt-1 leading-relaxed">{q.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-teal">+{q.xp} XP</span>
                    <button className="text-xs font-semibold text-navy bg-brand-mist px-3 py-1.5 rounded-lg group-hover:bg-navy group-hover:text-white transition-all">
                      Start Quest
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center py-8">
          <p className="text-xs text-brand-gray">
            arrival.ai Campus OS &nbsp;·&nbsp; Student View &nbsp;·&nbsp; Data refreshed Oct 29, 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
