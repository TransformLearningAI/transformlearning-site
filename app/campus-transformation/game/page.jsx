'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════
   DON'T CLOSE. TRANSFORM. — The College Survival Game
   ═══════════════════════════════════════════════════════════════ */

const ROLES = [
  { id: 'president', title: 'President', desc: 'You answer to the board. You manage the faculty. You own the vision — and the blame.', icon: '🎓' },
  { id: 'chair', title: 'Board Chair', desc: 'You answer to the donors, the accreditor, and 94 years of history. The president reports to you.', icon: '🪑' },
]

const INITIAL = {
  semester: 0,
  enrollment: 820,
  firstYear: 180,
  discountRate: 52,
  netTuition: 14200000,
  deficit: -1800000,
  endowment: 18000000,
  deferred: 14000000,
  debt: 12000000,
  faculty: 48,
  morale: 65,
  communityTrust: 70,
  donorConfidence: 60,
  boardUnity: 55,
  accreditationStanding: 'good',
  outcome: null,
  events: [],
  people: {
    cfo: { name: 'Patricia Chen', status: 'here', mood: 'exhausted' },
    provost: { name: 'Dr. James Washington', status: 'here', mood: 'frustrated' },
    facilities: { name: 'Ray Kowalski', status: 'here', mood: 'scared' },
    enrollmentVP: { name: 'Diana Santos', status: 'here', mood: 'overwhelmed' },
    topDonor: { name: 'Arthur Hartwell', status: 'engaged', mood: 'skeptical' },
    facultyLeader: { name: 'Dr. Sarah Okonkwo', status: 'here', mood: 'angry' },
    townMayor: { name: 'Janet Novak', status: 'distant', mood: 'worried' },
  }
}

const SEMESTERS = [
  {
    label: 'Fall — Year 1',
    narration: 'You\'ve been in the job for three months. The honeymoon is over. Fall enrollment just came in.',
    event: 'First-year deposits are down 14% from last year. The discount rate crept up to 55% because Diana had to offer more aid to fill seats. Patricia is projecting a $2.4M deficit for the year. Dr. Washington wants to hire two new faculty for a data science program. Ray says the science building roof will cost $380K to fix and it can\'t wait another winter. Arthur Hartwell\'s assistant called to schedule a lunch — he wants to "understand the direction."',
    choices: [
      {
        text: 'Cut three underperforming academic programs and redirect the savings to scholarships and the roof repair.',
        effects: { enrollment: -25, faculty: -4, deficit: 800000, deferred: -380000, morale: -15, communityTrust: -5, donorConfidence: 5, discountRate: -2 },
        reaction: 'Dr. Okonkwo calls an emergency faculty senate meeting. Three professors in the cut programs start applying elsewhere. The local paper runs a story: "College Eliminates Programs Amid Financial Strain." But the roof gets fixed. And the scholarship money stops two transfer-outs.',
        peopleChanges: { facultyLeader: { mood: 'furious' } }
      },
      {
        text: 'Approve the data science program, defer the roof, and launch an aggressive enrollment marketing campaign.',
        effects: { enrollment: 10, deficit: -400000, deferred: 200000, morale: 5, donorConfidence: -5, discountRate: 2 },
        reaction: 'The data science program won\'t generate revenue for 18 months. The roof leaks into the chemistry lab during a November storm. Marketing brings in 15 extra applications but the discount rate climbs to cover them. Patricia sends you a memo at 11pm: "We are spending money we don\'t have on things that won\'t pay off in time."',
        peopleChanges: { cfo: { mood: 'alarmed' } }
      },
      {
        text: 'Call Arthur Hartwell. Be completely honest about the financial situation. Ask what it would take for him to lead a transformation campaign.',
        effects: { enrollment: 0, deficit: 0, donorConfidence: 15, boardUnity: 5, morale: 0 },
        reaction: 'Arthur listens for 40 minutes without interrupting. Then he says: "Thank you. No one has been this honest with me in ten years." He doesn\'t write a check today. But he asks for the full audit. He wants to see the real numbers. He says he\'ll bring two other donors to a private dinner next month. This is the first seed.',
        peopleChanges: { topDonor: { mood: 'engaged' } }
      },
    ]
  },
  {
    label: 'Spring — Year 1',
    narration: 'Winter was hard. Spring semester started with 12 fewer students than expected — they didn\'t come back from winter break.',
    event: 'The spring retention number is troubling — you lost students over the holiday. Parents are asking questions. The bond trustee sent a letter requesting a meeting about covenant compliance. Diana says fall deposits for next year are "soft." Dr. Washington tells you privately that the provost at a state university just offered him a position. Janet Novak, the town mayor, read the newspaper story about the program cuts and left you a voicemail: "We need to talk about what this means for the town."',
    choices: [
      {
        text: 'Meet with the bond trustee immediately. Bring Patricia. Be transparent about the numbers and propose a forbearance if needed.',
        effects: { deficit: 0, donorConfidence: 5, boardUnity: 10, debt: 0 },
        reaction: 'The trustee appreciates the honesty. They\'ve seen worse. They offer a 12-month forbearance with conditions: monthly financial reporting, no new debt, and a board-approved stabilization plan by December. It\'s not good news, but it\'s manageable news. Patricia says it\'s the first time in two years she\'s felt like leadership is facing reality.',
        peopleChanges: { cfo: { mood: 'cautiously hopeful' } }
      },
      {
        text: 'Call Janet Novak back. Visit her office. Ask what the town needs from the campus — not what the campus needs from the town.',
        effects: { enrollment: 0, communityTrust: 20, morale: 5 },
        reaction: 'Janet is surprised you called back. Most college presidents don\'t. She tells you the town has no workforce training facility, no community meeting space since the Elks Lodge closed, and the school district wants after-school STEM programs but has no space. She says: "If your campus could help with any of that, this town would fight for you." You didn\'t expect to feel hope today.',
        peopleChanges: { townMayor: { status: 'ally', mood: 'energized' } }
      },
      {
        text: 'Convince Dr. Washington to stay by offering him a raise and the title of Executive Vice President.',
        effects: { deficit: -95000, morale: 5, faculty: 0, donorConfidence: -5 },
        reaction: 'James stays, but the faculty notice the raise. In a university running a deficit, giving the provost a title bump and more money lands badly. Dr. Okonkwo says publicly: "I guess we know what leadership values." Two adjuncts who were told there\'s no money for course releases read about it in an email chain. The resentment is quiet but real.',
        peopleChanges: { provost: { mood: 'conflicted' }, facultyLeader: { mood: 'bitter' } }
      },
    ]
  },
  {
    label: 'Fall — Year 2',
    narration: 'A full year in. The decisions you made last year are showing their consequences. Fall enrollment is in.',
    event: (state) => {
      const enrollDown = state.enrollment < 780
      const moraleIssue = state.morale < 50
      const mayorAlly = state.people.townMayor.status === 'ally'
      let text = `Enrollment is ${state.enrollment + (enrollDown ? -30 : 10)}. `
      if (enrollDown) text += 'The downward trend is accelerating. '
      if (moraleIssue) text += 'Faculty morale is low — two more just resigned. '
      if (mayorAlly) text += 'Mayor Novak has been talking to the county economic development office about workforce training partnerships. '
      text += 'Arthur Hartwell had that donor dinner. Three people came. They want to see a plan — a real one, not a brochure. The accreditor sent a letter requesting a supplemental financial report. '
      text += 'You\'re at a fork in the road. What you decide this semester defines everything that follows.'
      return text
    },
    choices: [
      {
        text: 'Present a formal transformation plan to the board: diversify revenue, open the campus to community programs, workforce training, and non-degree credentials. Keep the college running alongside the new model.',
        effects: { enrollment: 15, deficit: 600000, morale: 10, communityTrust: 15, donorConfidence: 20, boardUnity: 10, discountRate: -3 },
        reaction: 'The board votes 7-3 to explore transformation. Arthur Hartwell pledges $500K to fund a pilot. Janet Novak brings the county workforce board to campus. Dr. Okonkwo is cautiously interested — she asks if faculty would have a role in designing the new programs. Ray walks you through every building and shows you which spaces could be converted. For the first time, people are talking about the future instead of managing decline.',
        peopleChanges: { topDonor: { mood: 'committed' }, facultyLeader: { mood: 'cautiously interested' }, facilities: { mood: 'hopeful' } }
      },
      {
        text: 'Double down on the traditional model: launch an emergency enrollment campaign, increase the discount rate to 65%, and cut institutional support costs by 20%.',
        effects: { enrollment: 25, deficit: 200000, morale: -20, communityTrust: -10, donorConfidence: -10, discountRate: 13 },
        reaction: 'The enrollment bump is real — but at 65% discount rate, each new student generates almost nothing in net revenue. You\'re filling seats with money you don\'t have. The institutional support cuts mean fewer advisors, slower IT response, and a registrar\'s office that can\'t keep up. Students notice. Arthur Hartwell goes quiet. Patricia says: "We just bought one more year. At the cost of two."',
        peopleChanges: { cfo: { mood: 'defeated' }, topDonor: { mood: 'disengaged' } }
      },
      {
        text: 'Begin confidential merger conversations with a larger regional university.',
        effects: { enrollment: 0, morale: -10, communityTrust: -15, boardUnity: -15, donorConfidence: -5 },
        reaction: 'The conversations are "confidential" for about 72 hours. A board member tells a friend. The friend tells the newspaper. "COLLEGE IN MERGER TALKS" runs above the fold. Parents panic. Three deposits for fall are withdrawn. Faculty start applying everywhere. Dr. Washington takes the state university job. The merger might be the right move — but the way it leaked poisoned everything.',
        peopleChanges: { provost: { status: 'left', mood: 'gone' }, facultyLeader: { mood: 'panicked' } }
      },
    ]
  },
  {
    label: 'Spring — Year 2',
    narration: 'The trajectory is set. This semester determines whether the institution finds a new path or begins the final descent.',
    event: (state) => {
      const transforming = state.donorConfidence > 65 && state.communityTrust > 60
      const declining = state.morale < 40 || state.enrollment < 730
      const merged = state.boardUnity < 35
      if (merged) return 'The merger talks have consumed everything. The partner university is offering terms — but they want to eliminate 60% of your programs and absorb the rest under their brand. The name disappears. Half the staff is redundant. It\'s not a merger. It\'s an acquisition with polite language.'
      if (transforming) return 'The transformation pilot is underway. A workforce training program launched in January with 22 participants — adults, not traditional students. The county is paying. The first community health screening happened in the gym. 180 people came. The nursing faculty ran it. Arthur Hartwell brought a foundation program officer to campus. She wants to see the data in June. The accreditor is watching closely — but they\'re interested, not hostile.'
      if (declining) return 'Spring enrollment dropped again. Two more faculty left. The registrar retired and hasn\'t been replaced. Students are complaining about response times, broken equipment, and courses being cancelled. The local paper ran an editorial: "Is This the End for Our College?" Parents are calling the admissions office asking if their kids should transfer. The bond trustee wants another meeting.'
      return 'The institution is stable but stagnant. You haven\'t gotten worse, but you haven\'t changed anything fundamental. The same pressures are building. The same questions are unanswered. Time is passing and the window is narrowing.'
    },
    choices: [
      {
        text: 'Go all in on transformation. Announce publicly that the college is evolving — new workforce programs, community partnerships, campus open to the region. Tell the whole story honestly.',
        effects: { enrollment: 20, deficit: 1200000, morale: 20, communityTrust: 25, donorConfidence: 25, boardUnity: 15 },
        reaction: 'The announcement lands differently than you expected. Instead of panic, there\'s relief. Faculty say: "Finally, someone said it out loud." Alumni write in — some angry, most supportive. The newspaper runs a follow-up: "College Charts Bold New Course." Arthur Hartwell calls and says three words: "Now I\'m in." The hardest part isn\'t the transformation. It\'s the honesty. And the honesty is what unlocks everything.',
        peopleChanges: { topDonor: { mood: 'all in' }, facultyLeader: { mood: 'committed' }, cfo: { mood: 'relieved' } }
      },
      {
        text: 'Hold steady. Make incremental improvements. Hope that next year\'s enrollment is better.',
        effects: { enrollment: -15, deficit: -300000, morale: -10, communityTrust: -10, donorConfidence: -15 },
        reaction: 'Nothing changes. Which means everything gets worse, slowly. Three more faculty leave over the summer. Fall deposits come in 20% below target. Arthur Hartwell donates to another institution. The bond trustee sends a second letter — this one is less friendly. Patricia updates her resume. She doesn\'t tell you.',
        peopleChanges: { cfo: { mood: 'preparing to leave' }, topDonor: { mood: 'gone' } }
      },
      {
        text: 'Accept the merger terms. Preserve what you can. Save the jobs you can save.',
        effects: { enrollment: 0, morale: -25, communityTrust: -20, boardUnity: -10 },
        reaction: 'The partner university takes over operations by fall. The name changes. 60% of programs are eliminated. 28 staff positions are cut. The campus stays open — as a satellite location with limited offerings. Ray keeps his job maintaining the buildings. Most faculty don\'t. The town feels betrayed. It\'s not the worst outcome. But standing in the empty student center on the last day of the semester, watching Diana carry a box to her car, it doesn\'t feel like a victory.',
        peopleChanges: { enrollmentVP: { status: 'left', mood: 'gone' }, facultyLeader: { status: 'left', mood: 'gone' } }
      },
    ]
  },
]

const ENDINGS = {
  transformed: {
    title: 'Transformed',
    color: '#00A8A8',
    icon: '🌅',
    text: 'Two years later, the campus is alive in ways it hasn\'t been in a decade. The workforce training center runs three shifts. The nursing program partnered with the regional hospital. The old gym hosts a farmers market on Saturdays. Enrollment is different now — fewer 18-year-olds, more 35-year-olds, more community members, more employers sending workers for training. Net revenue is up. The deficit is closing. Arthur Hartwell gave $2M and told the foundation program officer this is "the most important thing happening in higher education right now." Ray still knows every pipe and wire. He also runs the building tours for visitors from other colleges who want to see how it\'s done. The name stayed. The mission evolved. The campus lived.'
  },
  survived: {
    title: 'Survived — For Now',
    color: '#D97706',
    icon: '⏳',
    text: 'The college is still open. That\'s the best thing you can say. Enrollment stabilized but didn\'t grow. The deficit narrowed but didn\'t close. The bond terms were renegotiated — barely. Faculty morale is fragile. The town is supportive but tired of uncertainty. You bought time. The question is what you do with it. The next president will inherit the same problems you did — unless someone, somewhere, has the courage to do something different. The window is still open. But it\'s closing.'
  },
  merged: {
    title: 'Merged',
    color: '#3B82F6',
    icon: '🤝',
    text: 'The campus is still there. The sign out front says a different name. Some programs survived. Some staff kept their jobs. The town lost its college but gained a satellite campus of a larger university. It\'s not nothing — but it\'s not what it was. The alumni association dissolved. The homecoming tradition ended. Ray retired early. Patricia took a job at a hospital system. Dr. Okonkwo moved to another state. The campus functions, but the soul of the place — the thing that made students feel like they belonged — that\'s harder to find now. Mergers save buildings. They don\'t always save communities.'
  },
  closed: {
    title: 'Closed',
    color: '#DC2626',
    icon: '🔒',
    text: 'The board voted 6-4 to cease operations at the end of the academic year. Students were given teach-out agreements with partner institutions. Faculty received 90 days notice. Ray was the last person to leave the campus. He locked the front door of Founders Hall, stood in the parking lot for a long time, and drove home. A developer bought the property eight months later. The residence halls were demolished first. Then the student center. The science building is still standing — it\'s a storage facility now. Janet Novak told the newspaper: "We lost more than a college. We lost the center of this town." She was right.'
  }
}

function getEnding(state) {
  if (state.enrollment < 650 && state.morale < 30) return 'closed'
  if (state.boardUnity < 30 || (state.enrollment < 700 && state.donorConfidence < 30)) return 'merged'
  if (state.donorConfidence > 70 && state.communityTrust > 70 && state.morale > 55) return 'transformed'
  return 'survived'
}

function StatBar({ label, value, max = 100, color = '#00A8A8', showValue }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-bold" style={{ color }}>{showValue || value}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct < 30 ? '#DC2626' : pct < 50 ? '#D97706' : color }} />
      </div>
    </div>
  )
}

function PersonCard({ person, role }) {
  if (person.status === 'left' || person.status === 'gone') {
    return (
      <div className="flex items-center gap-2 opacity-40">
        <span className="text-xs">👤</span>
        <div>
          <p className="text-[10px] font-bold text-gray-400 line-through">{person.name}</p>
          <p className="text-[9px] text-gray-400">{role} — departed</p>
        </div>
      </div>
    )
  }
  const moodColors = {
    'exhausted': '#D97706', 'frustrated': '#D97706', 'scared': '#DC2626', 'overwhelmed': '#D97706',
    'skeptical': '#D97706', 'angry': '#DC2626', 'worried': '#D97706', 'furious': '#DC2626',
    'alarmed': '#DC2626', 'bitter': '#DC2626', 'cautiously hopeful': '#059669', 'energized': '#059669',
    'engaged': '#059669', 'committed': '#059669', 'hopeful': '#059669', 'cautiously interested': '#059669',
    'conflicted': '#D97706', 'defeated': '#DC2626', 'disengaged': '#DC2626', 'panicked': '#DC2626',
    'all in': '#059669', 'relieved': '#059669', 'preparing to leave': '#DC2626', 'gone': '#94A3B8',
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs">👤</span>
      <div>
        <p className="text-[10px] font-bold" style={{ color: '#0C1F3F' }}>{person.name}</p>
        <p className="text-[9px]"><span className="text-gray-400">{role}</span> · <span style={{ color: moodColors[person.mood] || '#94A3B8' }}>{person.mood}</span></p>
      </div>
    </div>
  )
}

export default function CollegeGame() {
  const [role, setRole] = useState(null)
  const [state, setState] = useState(INITIAL)
  const [chosenIdx, setChosenIdx] = useState(null)
  const [showReaction, setShowReaction] = useState(false)

  // Role selection
  if (!role) {
    return (
      <section className="min-h-screen" style={{ background: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto px-6 py-20">
          <Link href="/campus-transformation" className="text-sm text-gray-600 hover:text-gray-400 mb-8 inline-block">&larr; Campus Transformation</Link>
          <h1 className="font-serif text-white mb-2" style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Don't Close.<br /><span style={{ color: '#00A8A8' }}>Transform.</span>
          </h1>
          <p className="text-gray-500 text-sm mb-12 max-w-md">A college survival simulation. Real decisions. Real consequences. Real people whose lives depend on what you choose.</p>

          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-4">Choose your role</p>
          <div className="space-y-3">
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                      className="w-full text-left p-5 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-600 hover:bg-gray-800 transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{r.icon}</span>
                  <div>
                    <p className="text-white font-bold">{r.title}</p>
                    <p className="text-gray-500 text-sm mt-1">{r.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 border-t border-gray-800 pt-6">
            <p className="text-[10px] text-gray-700 leading-relaxed max-w-sm">
              Based on real financial data, real board dynamics, and real human consequences from colleges across America. No names are real. Everything else is.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Check ending
  if (state.semester >= SEMESTERS.length && !showReaction) {
    const endingKey = getEnding(state)
    const ending = ENDINGS[endingKey]
    return (
      <section className="min-h-screen" style={{ background: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">{ending.icon}</span>
            <h1 className="font-serif text-3xl text-white mb-2">{ending.title}</h1>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ background: ending.color }} />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">{ending.text}</p>

          <div className="bg-gray-900 rounded-xl p-5 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">Final State</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <StatBar label="Enrollment" value={state.enrollment} max={1000} showValue={state.enrollment} />
              <StatBar label="Morale" value={state.morale} />
              <StatBar label="Community Trust" value={state.communityTrust} />
              <StatBar label="Donor Confidence" value={state.donorConfidence} />
              <StatBar label="Board Unity" value={state.boardUnity} />
              <StatBar label="Discount Rate" value={100 - state.discountRate} max={100} showValue={`${state.discountRate}%`} />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">Your People</p>
            <div className="grid grid-cols-2 gap-3">
              <PersonCard person={state.people.cfo} role="CFO" />
              <PersonCard person={state.people.provost} role="Provost" />
              <PersonCard person={state.people.facilities} role="Facilities" />
              <PersonCard person={state.people.enrollmentVP} role="Enrollment VP" />
              <PersonCard person={state.people.topDonor} role="Top Donor" />
              <PersonCard person={state.people.facultyLeader} role="Faculty Leader" />
              <PersonCard person={state.people.townMayor} role="Mayor" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <button onClick={() => { setRole(null); setState(INITIAL); setChosenIdx(null); setShowReaction(false) }}
                    className="px-6 py-3 rounded-xl text-white font-bold text-sm" style={{ background: '#00A8A8' }}>
              Play Again
            </button>
            <p className="text-[10px] text-gray-700">
              This is what campus transformation work feels like. If you want to learn more: <a href="/campus-transformation" className="underline" style={{ color: '#00A8A8' }}>transformlearning.ai/campus-transformation</a>
            </p>
          </div>
        </div>
      </section>
    )
  }

  const semester = SEMESTERS[state.semester]
  const eventText = typeof semester.event === 'function' ? semester.event(state) : semester.event

  function choose(idx) {
    if (chosenIdx !== null) return
    setChosenIdx(idx)
    setShowReaction(true)
  }

  function advance() {
    const choice = semester.choices[chosenIdx]
    setState(prev => {
      const next = { ...prev }
      next.semester = prev.semester + 1
      if (choice.effects.enrollment) next.enrollment = Math.max(0, prev.enrollment + choice.effects.enrollment)
      if (choice.effects.faculty) next.faculty = Math.max(0, prev.faculty + choice.effects.faculty)
      if (choice.effects.deficit) next.deficit = prev.deficit + choice.effects.deficit
      if (choice.effects.deferred) next.deferred = Math.max(0, prev.deferred + choice.effects.deferred)
      if (choice.effects.morale) next.morale = Math.min(100, Math.max(0, prev.morale + choice.effects.morale))
      if (choice.effects.communityTrust) next.communityTrust = Math.min(100, Math.max(0, prev.communityTrust + choice.effects.communityTrust))
      if (choice.effects.donorConfidence) next.donorConfidence = Math.min(100, Math.max(0, prev.donorConfidence + choice.effects.donorConfidence))
      if (choice.effects.boardUnity) next.boardUnity = Math.min(100, Math.max(0, prev.boardUnity + choice.effects.boardUnity))
      if (choice.effects.discountRate) next.discountRate = Math.min(100, Math.max(0, prev.discountRate + choice.effects.discountRate))
      // People changes
      if (choice.peopleChanges) {
        next.people = { ...prev.people }
        Object.entries(choice.peopleChanges).forEach(([key, changes]) => {
          next.people[key] = { ...prev.people[key], ...changes }
        })
      }
      return next
    })
    setChosenIdx(null)
    setShowReaction(false)
  }

  return (
    <section className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#00A8A8' }}>
              {semester.label}
            </p>
            <p className="text-[10px] text-gray-600">Playing as: {role === 'president' ? 'President' : 'Board Chair'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-600">Enrollment</p>
            <p className="text-lg font-light text-white">{state.enrollment}</p>
          </div>
        </div>

        {/* Dashboard */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <StatBar label="Morale" value={state.morale} />
            <StatBar label="Community" value={state.communityTrust} />
            <StatBar label="Donors" value={state.donorConfidence} />
            <StatBar label="Board" value={state.boardUnity} />
            <StatBar label="Discount" value={100 - state.discountRate} max={100} showValue={`${state.discountRate}%`} />
            <StatBar label="Faculty" value={state.faculty} max={60} showValue={state.faculty} />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(state.people).slice(0, 4).map(([key, person]) => (
              <PersonCard key={key} person={person} role={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} />
            ))}
          </div>
        </div>

        {/* Narration */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{semester.narration}</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-300 text-sm leading-relaxed">{eventText}</p>
          </div>
        </div>

        {/* Choices */}
        {!showReaction && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600">What do you do?</p>
            {semester.choices.map((c, i) => (
              <button key={i} onClick={() => choose(i)}
                      className="w-full text-left p-4 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-600 hover:bg-gray-800 transition-all">
                <p className="text-sm text-gray-300 leading-relaxed">{c.text}</p>
              </button>
            ))}
          </div>
        )}

        {/* Reaction */}
        {showReaction && chosenIdx !== null && (
          <div>
            <div className="bg-gray-900 border-l-4 rounded-xl p-5 mb-4" style={{ borderColor: '#00A8A8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#00A8A8' }}>What happens</p>
              <p className="text-sm text-gray-300 leading-relaxed">{semester.choices[chosenIdx].reaction}</p>
            </div>
            <button onClick={advance}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm"
                    style={{ background: '#0C1F3F' }}>
              {state.semester + 1 >= SEMESTERS.length ? 'See How It Ends' : 'Next Semester →'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
