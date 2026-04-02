'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import useWayfinding from '@/components/wayfinding/useWayfinding'
import Signal from '@/components/wayfinding/Signal'
import Terrain from '@/components/wayfinding/Terrain'
import PainMap from '@/components/wayfinding/PainMap'
import EvidenceWall from '@/components/wayfinding/EvidenceWall'
import Coach from '@/components/wayfinding/Coach'
import Journey from '@/components/wayfinding/Journey'
import ArrivalMoment from '@/components/wayfinding/ArrivalMoment'

export default function WayfindingPage() {
  const { enrollmentId } = useParams()
  const data = useWayfinding(enrollmentId)
  const [selectedSkillId, setSelectedSkillId] = useState(null)
  const [showArrival, setShowArrival] = useState(true)

  if (data.loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Mapping your terrain...</p>
      </div>
    </div>
  )

  if (!data.terrainNodes) return (
    <div className="text-center py-32">
      <p className="text-gray-400">No course data found.</p>
    </div>
  )

  const selectedNode = data.terrainNodes.find(n => n.skill.id === selectedSkillId)

  function handleSelectNode(node) {
    setSelectedSkillId(node.skill.id === selectedSkillId ? null : node.skill.id)
  }

  // Stats summary
  const explored = data.terrainNodes.filter(n => n.status === 'explored').length
  const emerging = data.terrainNodes.filter(n => n.status === 'emerging').length
  const uncharted = data.terrainNodes.filter(n => n.status === 'uncharted').length

  return (
    <div className="max-w-5xl mx-auto">
      {/* Course header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif font-light text-navy" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
            {data.courseCode} · {data.courseName}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">{data.term}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span><strong className="text-green-600">{explored}</strong> explored</span>
          <span><strong className="text-teal-600">{emerging}</strong> emerging</span>
          <span><strong className="text-gray-500">{uncharted}</strong> uncharted</span>
        </div>
      </div>

      {/* The Signal */}
      <Signal signal={data.signal} pulse={data.pulse} />

      {/* The Terrain */}
      <Terrain
        terrainNodes={data.terrainNodes}
        selectedSkillId={selectedSkillId}
        onSelectNode={handleSelectNode}
      />

      {/* The Pain Map */}
      <PainMap painPoints={data.painPoints} enrollmentId={enrollmentId} />

      {/* The Journey */}
      <Journey events={data.journeyEvents} />

      {/* The Coach (ambient, fixed bottom-right) */}
      <Coach terrainNodes={data.terrainNodes} selectedSkillId={selectedSkillId} enrollmentId={enrollmentId} />

      {/* Evidence Wall (slide-over) */}
      {selectedNode && (
        <EvidenceWall node={selectedNode} enrollmentId={enrollmentId} onClose={() => setSelectedSkillId(null)} />
      )}

      {/* Arrival Moments */}
      {showArrival && data.arrivals?.length > 0 && (
        <ArrivalMoment arrivals={data.arrivals} onDismiss={() => setShowArrival(false)} />
      )}
    </div>
  )
}
