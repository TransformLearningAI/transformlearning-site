'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { proficiencyLabel, proficiencyColor } from '@/lib/utils/proficiency'

export default function SkillDetailPage() {
  const { enrollmentId, skillId } = useParams()
  const [skill, setSkill] = useState(null)
  const [proficiency, setProficiency] = useState(null)
  const [guide, setGuide] = useState(null)
  const [loadingGuide, setLoadingGuide] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/skills/${skillId}`).then(r => r.json()),
      fetch(`/api/proficiency?enrollmentId=${enrollmentId}`).then(r => r.json()),
    ]).then(([s, p]) => {
      setSkill(s)
      const score = p.scores?.find(ps => ps.skill_id === skillId)
      setProficiency(score || null)
      setLoading(false)
    })
  }, [enrollmentId, skillId])

  async function loadStudyGuide() {
    setLoadingGuide(true)
    const res = await fetch('/api/study-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId, skillId }),
    })
    const data = await res.json()
    setGuide(data.content)
    setLoadingGuide(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const score = proficiency?.score ?? null
  const color = proficiencyColor(score)

  return (
    <div className="max-w-3xl">
      <Link href={`/my-progress/${enrollmentId}`} className="text-xs text-gray-400 hover:text-navy mb-4 block">← Dashboard</Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block`}
            style={{ background: skill?.skill_type === 'explicit' ? 'rgba(0,168,168,0.1)' : 'rgba(90,62,107,0.1)',
                     color: skill?.skill_type === 'explicit' ? '#00A8A8' : '#5A3E6B' }}>
            {skill?.skill_type} skill
          </span>
          <h1 className="font-serif font-light text-navy" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>{skill?.name}</h1>
          {skill?.description && <p className="text-gray-500 text-sm mt-2">{skill.description}</p>}
        </div>
        <div className="text-right flex-shrink-0 ml-6">
          <div className="text-4xl font-black" style={{ color }}>{score ?? '—'}%</div>
          <div className="text-xs font-bold mt-1" style={{ color }}>{proficiencyLabel(score)}</div>
        </div>
      </div>

      {proficiency?.evidence_summary && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-2">Assessment evidence</p>
          <p className="text-sm text-gray-600 leading-relaxed">{proficiency.evidence_summary}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <Link href={`/my-progress/${enrollmentId}/chat/${skillId}`}
          className="bg-navy text-white rounded-2xl p-5 text-center hover:opacity-90 transition-opacity">
          <div className="text-2xl mb-2">💬</div>
          <p className="font-bold text-sm">Coaching Chat</p>
          <p className="text-xs text-white/50 mt-1">AI tutor focused on this skill</p>
        </Link>
        <Link href={`/my-progress/${enrollmentId}/quiz/${skillId}`}
          className="rounded-2xl p-5 text-center hover:opacity-90 transition-opacity"
          style={{ background: '#00A8A8' }}>
          <div className="text-2xl mb-2 text-white">◈</div>
          <p className="font-bold text-sm text-white">Practice Quiz</p>
          <p className="text-xs text-white/70 mt-1">Test and improve your score</p>
        </Link>
        <button onClick={loadStudyGuide} disabled={loadingGuide}
          className="rounded-2xl p-5 text-center hover:opacity-90 transition-opacity"
          style={{ background: '#4F8A5B' }}>
          <div className="text-2xl mb-2 text-white">📖</div>
          <p className="font-bold text-sm text-white">Study Guide</p>
          <p className="text-xs text-white/70 mt-1">{loadingGuide ? 'Generating…' : 'AI-written just for you'}</p>
        </button>
      </div>

      {/* Study guide */}
      {guide && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(guide) }} />
        </div>
      )}
    </div>
  )
}

function markdownToHtml(md) {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="font-bold text-navy text-base mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-bold text-navy text-lg mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-bold text-navy text-xl mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600 text-sm mb-1">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 text-gray-600 text-sm mb-1"><span class="font-bold">$1.</span> $2</li>')
    .replace(/\n\n/g, '</p><p class="text-gray-600 text-sm leading-relaxed mb-3">')
    .replace(/^(?!<)(.+)$/gm, '<p class="text-gray-600 text-sm leading-relaxed mb-3">$1</p>')
}
