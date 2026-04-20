'use client'
import { useState } from 'react'
import Link from 'next/link'

function generateCoachMessage(terrainNodes, selectedSkillId) {
  if (!terrainNodes || terrainNodes.length === 0) return 'Start here. Pick any skill and see where you stand.'

  const selected = selectedSkillId ? terrainNodes.find(n => n.skill.id === selectedSkillId) : null
  if (selected) {
    if (selected.score === 0) return `${selected.skill.name} is unexplored. A single quiz will reveal where you stand.`
    if (selected.score < 40) return `You're close. The gap in ${selected.skill.name} is specific.`
    if (selected.score < 80) return `${selected.skill.name} is within reach. ${80 - selected.score} points to proficiency.`
    return `${selected.skill.name} is at proficiency. Build from this strength.`
  }

  const uncharted = terrainNodes.filter(n => n.status === 'uncharted')
  const emerging = terrainNodes.filter(n => n.status === 'emerging')
  const explored = terrainNodes.filter(n => n.status === 'explored')

  if (explored.length > 0) return `${explored.length} skill${explored.length > 1 ? 's' : ''} at proficiency. Keep going.`
  if (emerging.length > 0) return `${emerging.length} skill${emerging.length > 1 ? 's are' : ' is'} emerging. Steady progress.`
  if (uncharted.length === terrainNodes.length) return 'Nothing measured yet. Start anywhere — one quiz shows you the picture.'
  return 'Select a skill to begin.'
}

export default function Coach({ terrainNodes, selectedSkillId, enrollmentId }) {
  const [expanded, setExpanded] = useState(false)
  const message = generateCoachMessage(terrainNodes, selectedSkillId)

  return (
    <div className="fixed bottom-6 right-6 z-30 max-w-[300px]">
      <div className="rounded-2xl shadow-lg overflow-hidden"
           style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(12,31,63,0.08)', backdropFilter: 'blur(12px)' }}>
        {/* Coach message */}
        <div className="px-4 py-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#00A8A8', boxShadow: '0 0 6px rgba(0,168,168,0.4)' }} />
            <p className="text-[13px] text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Expanded: quick input */}
        {expanded && (
          <div className="border-t border-gray-100 px-4 py-3">
            <input type="text" placeholder="Ask a quick question..."
              className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none mb-2" />
            {selectedSkillId && (
              <Link href={`/my-progress/${enrollmentId}/chat/${selectedSkillId}`}
                className="text-[11px] font-bold hover:underline" style={{ color: '#00A8A8' }}>
                Start full session →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
