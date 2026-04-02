'use client'
import { useState } from 'react'
import { proficiencyLabel, proficiencyColor } from '@/lib/utils/proficiency'
import Link from 'next/link'

const COURSE = { title: 'Human Physiology', code: 'BSC3096', term: 'Fall 2025' }

const SKILLS = [
  { id: '1', name: 'Physiology and Technology', type: 'explicit', score: 4 },
  { id: '2', name: 'Ethical Considerations', type: 'explicit', score: 0 },
  { id: '3', name: 'Communication Skills', type: 'explicit', score: 0 },
  { id: '4', name: 'Critical Thinking', type: 'explicit', score: 13 },
  { id: '5', name: 'Research Application', type: 'explicit', score: 0 },
  { id: '6', name: 'Pathophysiology Concepts', type: 'explicit', score: 0 },
  { id: '7', name: 'Laboratory Techniques', type: 'explicit', score: 0 },
  { id: '8', name: 'Data Interpretation', type: 'explicit', score: 0 },
  { id: '9', name: 'Homeostasis Mechanisms', type: 'implicit', score: 0 },
  { id: '10', name: 'Organ System Functions', type: 'implicit', score: 0 },
  { id: '11', name: 'Physiological Processes', type: 'implicit', score: 9 },
  { id: '12', name: 'Anatomy Terminology', type: 'implicit', score: 0 },
]

const CHAT_HISTORY = [
  { role: 'user', content: "I'd like you to assess my understanding of \"Ethical Considerations\". Please ask me a question to test my knowledge." },
  { role: 'assistant', content: "**Assessment Question**\n\nWhat do you think are some ethical issues that researchers should consider when conducting studies involving human participants in physiology?" },
]

const QUIZ = [
  { q: 'Which principle requires researchers to minimize harm to participants in physiological studies?', choices: ['Beneficence', 'Autonomy', 'Justice', 'Fidelity'], correct: 0, explanation: 'Beneficence requires researchers to maximize benefits and minimize harm to study participants.' },
  { q: 'What is the primary purpose of informed consent in human physiology research?', choices: ['Legal protection for researchers', 'Ensuring participant autonomy and understanding', 'Reducing study costs', 'Increasing sample size'], correct: 1, explanation: 'Informed consent ensures participants understand the study and voluntarily agree to participate.' },
]

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="rounded-2xl p-5 text-white" style={{ background: color }}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-black">{value}</div>
      {sub && <p className="text-xs text-white/60 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function DemoPage() {
  const [view, setView] = useState('dashboard')
  const [activeSkill, setActiveSkill] = useState(SKILLS[1])
  const [activeTab, setActiveTab] = useState('review')
  const [skillFilter, setSkillFilter] = useState('all')
  const [skillSearch, setSkillSearch] = useState('')
  const [chatMsg, setChatMsg] = useState('')
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [quizDone, setQuizDone] = useState(false)

  const overall = Math.round(SKILLS.reduce((s, k) => s + k.score, 0) / SKILLS.length)
  const practicedCount = SKILLS.filter(s => s.score > 0).length
  const masteredCount = SKILLS.filter(s => s.score >= 80).length
  const needPractice = SKILLS.filter(s => s.score < 40).length
  const progressing = SKILLS.filter(s => s.score >= 40 && s.score < 80).length
  const strong = SKILLS.filter(s => s.score >= 80).length
  const focusAreas = [...SKILLS].sort((a, b) => a.score - b.score).slice(0, 2)

  const filteredSkills = SKILLS.filter(s => {
    if (skillSearch && !s.name.toLowerCase().includes(skillSearch.toLowerCase())) return false
    if (skillFilter === 'need_practice') return s.score < 40
    if (skillFilter === 'progressing') return s.score >= 40 && s.score < 80
    if (skillFilter === 'strong') return s.score >= 80
    return true
  })

  const tabs = [
    { id: 'coach', label: 'Coach', icon: '💬' },
    { id: 'practice', label: 'Practice', icon: '⚡' },
    { id: 'review', label: 'Review', icon: '📊' },
    { id: 'history', label: 'History', icon: '📈' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F4F7FB' }}>
      {/* Demo banner */}
      <div className="text-center py-2.5 text-xs font-bold text-white" style={{ background: '#5A3E6B' }}>
        DEMO — Student View &nbsp;·&nbsp;
        <Link href="/" className="underline opacity-70 hover:opacity-100">Back to site</Link>
        &nbsp;·&nbsp; <a href="/signup" className="underline opacity-70 hover:opacity-100">Sign up as Faculty →</a>
      </div>

      <div className="flex min-h-[calc(100vh-36px)]">
        {/* Sidebar */}
        <aside className="w-64 flex-col hidden lg:flex" style={{ background: '#1B3A2D' }}>
          {/* User profile */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#2D8B6F' }}>J</div>
              <div>
                <p className="text-sm font-bold text-white">jeff</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold text-amber-400">Level 4</span>
                  <span className="text-[10px] text-white/40">Scholar</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden w-24">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
            <div className="mt-3 px-3 py-2 rounded-lg text-[11px] text-white/50 italic" style={{ background: 'rgba(255,255,255,0.06)' }}>
              "Night owl mode: Activated. 🦉"
            </div>
          </div>

          {/* Nav */}
          <div className="px-3 flex-1">
            <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.12em] mb-2">Main</p>
            <nav className="space-y-0.5">
              {[
                { label: 'Skill Mapping', icon: '◎' },
                { label: 'Learn', icon: '📖', active: true },
                { label: 'Study Planner', icon: '📅' },
                { label: 'Source Library', icon: '📁' },
              ].map(n => (
                <button key={n.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all ${n.active ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                  style={n.active ? { background: 'rgba(45,139,111,0.35)' } : undefined}>
                  <span className="w-5 text-center">{n.icon}</span> {n.label}
                </button>
              ))}
            </nav>

            <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.12em] mb-2 mt-6">My Classes</p>
            <div className="space-y-0.5">
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left text-white" style={{ background: 'rgba(45,139,111,0.35)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: '#D4603A' }}>B</span>
                BSC3096
              </button>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left text-white/50 hover:text-white hover:bg-white/5">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: '#D4603A' }}>C</span>
                CMET 3005
              </button>
            </div>
          </div>

          {/* Bottom */}
          <div className="px-3 pb-4">
            <div className="flex items-center gap-2 px-3 py-2 text-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 21H9L12 14L15 21H20L12 3Z" fill="currentColor"/></svg>
              <span className="text-[11px] font-bold">arrival<span style={{ color: '#2D8B6F' }}>.ai</span></span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input type="text" placeholder="Search courses or actions..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none" style={{ background: '#F9FAFB' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500">Tour</button>
              <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500">Classes ›</button>
              <button className="relative p-2 rounded-lg hover:bg-gray-50">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 6.75a4.5 4.5 0 10-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75z" stroke="#6B7280" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>
              <button className="px-4 py-2 rounded-xl text-white text-xs font-bold" style={{ background: '#2D8B6F' }}>Upload</button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#2D8B6F' }}>J</div>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">

            {/* Course header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#FDF0E9' }}>🫀</div>
              <div>
                <h1 className="text-xl font-bold text-navy">{COURSE.code} <span className="text-gray-400 font-normal">·</span> Dashboard</h1>
                <p className="text-sm text-gray-400">{COURSE.title}
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#E8F8F0', color: '#2D8B6F' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Synced
                  </span>
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 mb-6">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === t.id ? 'border-teal-600 text-navy' : 'border-transparent text-gray-400 hover:text-navy'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* ===== REVIEW TAB ===== */}
            {activeTab === 'review' && (
              <div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard label="Course Progress" value={`${overall}%`} sub={`Mastery: ${masteredCount > 0 ? Math.round((masteredCount / SKILLS.length) * 100) : 0}%`} color="#2D6A4F" icon={<span className="text-white/70">📊</span>} />
                  <StatCard label="Skills Practiced" value={`${practicedCount}/${SKILLS.length}`} sub={`Mastery: 9%`} color="#2D8B6F" icon={<span className="text-white/70">◎</span>} />
                  <StatCard label="Mastered" value={masteredCount} color="#D4603A" icon={<span className="text-white/70">✓</span>} />
                  <StatCard label="This Week" value="0" color="#C94C3A" icon={<span className="text-white/70">📈</span>} />
                </div>

                <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
                  {/* Left */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <h3 className="font-bold text-navy mb-4">Recent Activity</h3>
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-400 mb-1">No activity yet this week</p>
                        <button onClick={() => setActiveTab('practice')} className="text-sm font-bold" style={{ color: '#2D8B6F' }}>Start practicing →</button>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <h3 className="font-bold text-navy mb-4">Quick Actions</h3>
                      <div className="space-y-2">
                        <button onClick={() => setActiveTab('practice')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left border border-gray-100" style={{ background: '#F0FDF4' }}>
                          <span>⚡</span><span className="text-sm font-bold" style={{ color: '#2D8B6F' }}>Practice Weak Skills</span>
                        </button>
                        <button onClick={() => setActiveTab('coach')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-gray-50 border border-gray-100">
                          <span>💬</span><span className="text-sm font-medium text-gray-700">Ask Coach for Help</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-gray-50 border border-gray-100">
                          <span>📄</span><span className="text-sm font-medium text-gray-700">Upload Work</span>
                        </button>
                      </div>
                    </div>
                    {/* Governance */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span>🛡️</span><h3 className="font-bold text-navy text-sm">Governed Assessment</h3>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-3">Every recommendation is bounded by fairness, confidence, and privacy constraints. The system cannot act on uncertain predictions.</p>
                      <div className="grid grid-cols-3 gap-2">
                        {['Fairness', 'Confidence', 'Privacy'].map(g => (
                          <div key={g} className="rounded-lg p-2 text-center" style={{ background: '#F0FDF4' }}>
                            <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1" style={{ background: '#2D8B6F' }} />
                            <span className="text-[10px] font-bold text-gray-500">{g}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right — Skills */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-navy mb-4">Skills ({filteredSkills.length} of {SKILLS.length})</h3>
                    <input type="text" placeholder="Search skills..." value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-3 focus:outline-none focus:border-teal-500" />
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {[
                        { id: 'all', label: `All (${SKILLS.length})`, color: '#2D8B6F' },
                        { id: 'need_practice', label: `Need Practice (${needPractice})`, color: '#DC2626' },
                        { id: 'progressing', label: `Progressing (${progressing})`, color: '#F59E0B' },
                        { id: 'strong', label: `Strong (${strong})`, color: '#16A34A' },
                      ].map(f => (
                        <button key={f.id} onClick={() => setSkillFilter(f.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${skillFilter === f.id ? 'text-white' : 'text-gray-500 bg-gray-100'}`}
                          style={skillFilter === f.id ? { background: f.color } : undefined}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                    {/* Focus areas */}
                    <div className="rounded-xl px-4 py-3 mb-4" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
                      <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>
                        Focus Areas: {focusAreas.map(s => `${s.name} (${s.score}%)`).join(', ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {filteredSkills.map(skill => (
                        <button key={skill.id} onClick={() => { setActiveSkill(skill); setView('skill') }}
                          className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                          <p className="text-sm font-semibold text-navy truncate mb-2">{skill.name}</p>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full rounded-full" style={{ width: `${skill.score}%`, background: proficiencyColor(skill.score) }} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-black" style={{ color: proficiencyColor(skill.score) }}>{skill.score}%</span>
                            <span className="text-xs text-gray-400">{skill.score < 40 ? 'beginning' : skill.score < 80 ? 'progressing' : 'strong'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress chart */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
                  <h3 className="font-bold text-navy mb-4">Course Progress Over Time</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Progress Over Time</span>
                    <span className="text-xs font-bold" style={{ color: '#2D8B6F' }}>↗ +3%</span>
                  </div>
                  <div className="relative h-32">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[100, 75, 50, 25, 0].map(v => (
                        <div key={v} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-300 w-6 text-right">{v}</span>
                          <div className="flex-1 border-t border-dashed border-gray-100" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-8 right-0 h-full flex items-end">
                      <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0,95 Q100,90 200,85 T400,80" fill="none" stroke="#2D8B6F" strokeWidth="2.5" />
                        <circle cx="0" cy="95" r="4" fill="#2D8B6F" />
                        <circle cx="400" cy="80" r="4" fill="#2D8B6F" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 px-8">
                    <span className="text-[10px] text-gray-300">Jan 16</span>
                    <span className="text-[10px] text-gray-300">Jan 17</span>
                  </div>
                </div>
              </div>
            )}

            {/* ===== COACH TAB ===== */}
            {activeTab === 'coach' && (
              <div className="grid lg:grid-cols-[280px_1fr_300px] gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Skills ({SKILLS.length})</p>
                  <div className="space-y-1">
                    {SKILLS.map(s => (
                      <button key={s.id} onClick={() => setActiveSkill(s)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left transition-colors ${activeSkill?.id === s.id ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-gray-50'}`}>
                        <span className="text-xs text-gray-600 flex-1 truncate">{s.name}</span>
                        <span className="text-xs font-bold" style={{ color: proficiencyColor(s.score) }}>{s.score}%</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 flex flex-col">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#2D8B6F' }}>Assessment Mode</p>
                        <p className="text-xs text-gray-400">Assessing: {activeSkill?.name}</p>
                      </div>
                      <button className="text-xs text-gray-400 hover:text-navy border border-gray-200 px-3 py-1 rounded-lg">Exit Assessment</button>
                    </div>
                    <div className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(45,139,111,0.08)', color: '#2D8B6F' }}>
                      Assessment mode: Answer questions to demonstrate your understanding. Your score will update your mastery.
                    </div>
                  </div>
                  <div className="flex-1 px-5 py-4 space-y-4 min-h-[300px]">
                    {CHAT_HISTORY.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'text-white rounded-br-sm' : 'bg-gray-50 border border-gray-200 text-gray-700 rounded-bl-sm'}`}
                          style={msg.role === 'user' ? { background: '#0C1F3F' } : {}}
                          dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400">Teaching Style:</span>
                      {[{ id: 'smart', label: '● Smart', active: true }, { id: 'questions', label: '? Questions' }, { id: 'explain', label: '✦ Explain' }].map(s => (
                        <button key={s.id} className={`px-3 py-1 rounded-full text-xs font-bold ${s.active ? 'text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                          style={s.active ? { background: '#2D8B6F' } : undefined}>{s.label}</button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Ask a question... (Shift+Enter for new line)"
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                      <a href="/signup" className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: '#2D8B6F' }}>→</a>
                    </div>
                  </div>
                </div>

                {/* Right panel */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                    <p className="text-sm text-gray-600">Identify ethical issues related to human physiology research and practice.</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Progress Over Time</p>
                    <p className="text-sm text-gray-400 text-center py-4">No progress history yet</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="text-3xl font-black mb-1" style={{ color: proficiencyColor(activeSkill?.score || 0) }}>{activeSkill?.score || 0}%</div>
                    <p className="text-xs text-gray-400">Projected Baseline</p>
                    <a href="/signup" className="text-xs font-bold mt-2 block" style={{ color: '#2D8B6F' }}>Practice to earn mastery</a>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50">💬 Ask Coach</button>
                    <a href="/signup" className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white text-center" style={{ background: '#2D8B6F' }}>Practice Quiz</a>
                  </div>
                </div>
              </div>
            )}

            {/* ===== PRACTICE TAB ===== */}
            {activeTab === 'practice' && (
              <div className="max-w-2xl mx-auto">
                {!quizDone ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(quizIdx / QUIZ.length) * 100}%`, background: '#2D8B6F' }} />
                      </div>
                      <span className="text-xs text-gray-400">{quizIdx + 1}/{QUIZ.length}</span>
                    </div>
                    <p className="font-semibold text-navy text-lg leading-relaxed mb-6">{QUIZ[quizIdx].q}</p>
                    <div className="space-y-3 mb-6">
                      {QUIZ[quizIdx].choices.map((c, i) => (
                        <button key={i} onClick={() => setQuizAnswer(i)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${quizAnswer === i ? 'font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                          style={quizAnswer === i ? { background: 'rgba(45,139,111,0.06)', borderColor: '#2D8B6F', color: '#0C1F3F' } : {}}>
                          {c}
                        </button>
                      ))}
                    </div>
                    {quizAnswer !== null && quizIdx < QUIZ.length - 1 && (
                      <button onClick={() => { setQuizIdx(i => i + 1); setQuizAnswer(null) }}
                        className="w-full py-3 rounded-xl font-bold text-sm text-white" style={{ background: '#2D8B6F' }}>Next →</button>
                    )}
                    {quizAnswer !== null && quizIdx === QUIZ.length - 1 && (
                      <button onClick={() => setQuizDone(true)}
                        className="w-full py-3 rounded-xl font-bold text-sm text-white" style={{ background: '#4F8A5B' }}>See Results →</button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-3">Quiz Complete</p>
                      <div className="text-5xl font-black mb-2" style={{ color: '#2D8B6F' }}>+8%</div>
                      <p className="font-bold text-navy">Ethical Considerations: 0% → 8%</p>
                      <p className="text-sm text-gray-500 mt-2">You're moving. Keep this direction.</p>
                    </div>
                    {QUIZ.map((q, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 mb-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 flex-shrink-0 bg-green-500">✓</div>
                        <p className="text-sm text-gray-600">{q.explanation}</p>
                      </div>
                    ))}
                    <button onClick={() => { setQuizDone(false); setQuizIdx(0); setQuizAnswer(null); setActiveTab('review') }}
                      className="mt-4 w-full py-3 rounded-xl font-bold text-sm text-navy border border-gray-200">← Back to Review</button>
                  </div>
                )}
              </div>
            )}

            {/* ===== HISTORY TAB ===== */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-navy mb-4">My Work History</h3>
                <p className="text-sm text-gray-400 text-center py-8">No evidence recorded yet. Complete a quiz or coaching session to start building your record.</p>
              </div>
            )}

          </main>

          {/* Floating ask bar */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-20">
            <div className="flex items-center gap-2 bg-white rounded-2xl shadow-xl border border-gray-200 px-4 py-3">
              <span style={{ color: '#2D8B6F' }}>✦</span>
              <input type="text" placeholder="Ask a quick question..." className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none" />
              <a href="/signup" className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: '#2D8B6F' }}>→</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
