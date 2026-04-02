'use client'
import Link from 'next/link'
import { proficiencyColor, proficiencyLabel } from '@/lib/utils/proficiency'

export default function EvidenceWall({ node, enrollmentId, onClose }) {
  if (!node) return null

  const { skill, score, confidence, evidenceSummary, status } = node
  const color = proficiencyColor(score)
  const label = proficiencyLabel(score)
  const isImplicit = skill.skill_type === 'implicit'

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] z-50 bg-white shadow-2xl overflow-y-auto"
           style={{ animation: 'slideInRight 0.3s ease-out' }}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <button onClick={onClose} className="text-gray-400 hover:text-navy text-sm font-medium">← Close</button>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                style={{ background: isImplicit ? 'rgba(90,62,107,0.08)' : 'rgba(0,168,168,0.08)',
                         color: isImplicit ? '#5A3E6B' : '#00A8A8' }}>
            {isImplicit ? 'implicit skill' : 'explicit skill'}
          </span>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Score hero */}
          <div className="text-center py-6">
            <div className="text-6xl font-black mb-2" style={{ color }}>{score}%</div>
            <div className="text-sm font-bold uppercase tracking-wider" style={{ color }}>{label}</div>
            <h2 className="font-serif font-light text-navy text-2xl mt-3" style={{ letterSpacing: '-0.02em' }}>
              {skill.name}
            </h2>
            {skill.description && (
              <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">{skill.description}</p>
            )}
          </div>

          {/* Confidence meter */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-500 font-medium">Confidence</span>
              <span className="font-bold" style={{ color: (confidence ?? 0) >= 0.75 ? '#4F8A5B' : '#FF6B4A' }}>
                {confidence ? `${Math.round(confidence * 100)}%` : 'Pending'}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(confidence ?? 0) * 100}%`, background: '#4F8A5B' }} />
              {/* Threshold marker at 75% */}
              <div className="absolute top-0 bottom-0 w-px bg-gray-300" style={{ left: '75%' }} />
            </div>
            <p className="text-[10px] text-gray-300 mt-1">Governance threshold: 75%</p>
          </div>

          {/* Evidence */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Evidence</h3>
            <div className="rounded-xl p-4" style={{ background: '#F4F7FB' }}>
              <p className="text-sm text-gray-600 leading-relaxed">
                {evidenceSummary || 'No assessment evidence yet. Complete a quiz or upload your work to generate evidence for this skill.'}
              </p>
            </div>
          </div>

          {/* Governance */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Governance</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Fairness', pass: true },
                { label: 'Confidence', pass: (confidence ?? 0) >= 0.75 },
                { label: 'Privacy', pass: true },
              ].map(g => (
                <div key={g.label} className="rounded-lg p-3 text-center" style={{ background: g.pass ? '#F0FDF4' : '#FFF5F5' }}>
                  <div className="w-2 h-2 rounded-full mx-auto mb-1.5" style={{ background: g.pass ? '#4F8A5B' : '#FF6B4A' }} />
                  <span className="text-[10px] font-bold" style={{ color: g.pass ? '#4F8A5B' : '#FF6B4A' }}>{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link href={`/my-progress/${enrollmentId}/quiz/${skill.id}`}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white text-sm font-bold"
              style={{ background: '#00A8A8' }}>
              Practice Quiz
            </Link>
            <Link href={`/my-progress/${enrollmentId}/chat/${skill.id}`}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold border border-gray-200 text-navy hover:bg-gray-50">
              Ask Coach
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
