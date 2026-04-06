'use client'
import { useState } from 'react'

const STATUS_STYLES = {
  explored: { fill: '#4F8A5B', opacity: 1, ringCount: 3, glow: true },
  emerging: { fill: '#00A8A8', opacity: 0.7, ringCount: 2, glow: false },
  uncharted: { fill: '#DDE5EF', opacity: 0.4, ringCount: 1, glow: false },
}

function TerrainNode({ node, index, isSelected, onSelect, svgWidth, svgHeight }) {
  const [hovered, setHovered] = useState(false)
  const style = STATUS_STYLES[node.status]
  const cx = node.position.x * svgWidth
  const cy = node.position.y * svgHeight
  const baseRadius = 28
  const isImplicit = node.skill.skill_type === 'implicit'
  const active = isSelected || hovered

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(node)}
      style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
      transform={active ? `translate(${cx}, ${cy}) scale(1.12) translate(${-cx}, ${-cy})` : undefined}
    >
      {/* Contour rings */}
      {Array.from({ length: style.ringCount }).map((_, i) => (
        <circle key={i} cx={cx} cy={cy}
          r={baseRadius + (i + 1) * 10}
          fill="none"
          stroke={style.fill}
          strokeWidth={node.status === 'uncharted' ? 0.5 : 1}
          strokeDasharray={node.status === 'uncharted' ? '4 4' : 'none'}
          opacity={style.opacity * (0.3 - i * 0.08)}
        />
      ))}

      {/* Glow for explored */}
      {style.glow && (
        <circle cx={cx} cy={cy} r={baseRadius + 4}
          fill="none" stroke={style.fill} strokeWidth={2} opacity={0.2}>
          <animate attributeName="r" from={baseRadius + 2} to={baseRadius + 12} dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.25" to="0" dur="3s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Fog animation for uncharted */}
      {node.status === 'uncharted' && (
        <circle cx={cx} cy={cy} r={baseRadius + 16}
          fill="url(#fogGradient)" opacity={0.5}>
          <animate attributeName="opacity" values="0.3;0.55;0.3" dur="6s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Main node — circle for explicit, diamond for implicit */}
      {isImplicit ? (
        <rect
          x={cx - baseRadius * 0.7} y={cy - baseRadius * 0.7}
          width={baseRadius * 1.4} height={baseRadius * 1.4}
          rx={4}
          transform={`rotate(45, ${cx}, ${cy})`}
          fill={style.fill} opacity={style.opacity}
          stroke={active ? '#0C1F3F' : 'none'} strokeWidth={active ? 2 : 0}
        />
      ) : (
        <circle cx={cx} cy={cy} r={baseRadius}
          fill={style.fill} opacity={style.opacity}
          stroke={active ? '#0C1F3F' : 'none'} strokeWidth={active ? 2 : 0}
        />
      )}

      {/* Score text */}
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="13" fontWeight="800" opacity={node.score > 0 ? 1 : 0.5}>
        {node.score > 0 ? `${node.score}%` : '?'}
      </text>

      {/* Label */}
      <text x={cx} y={cy + baseRadius + 16} textAnchor="middle"
        fill="#1A2B3C" fontSize="11" fontWeight={active ? '700' : '500'}
        opacity={active ? 1 : 0.6}>
        {node.skill.name.length > 20 ? node.skill.name.substring(0, 18) + '…' : node.skill.name}
      </text>

      {/* Type indicator */}
      {isImplicit && (
        <text x={cx} y={cy + baseRadius + 28} textAnchor="middle"
          fill="#5A3E6B" fontSize="9" fontWeight="600" opacity={0.6}>
          core
        </text>
      )}
    </g>
  )
}

export default function Terrain({ terrainNodes = [], selectedSkillId, onSelectNode }) {
  const W = 900, H = 500

  // Draw connections between nodes with similar skill types
  const connections = []
  for (let i = 0; i < terrainNodes.length; i++) {
    for (let j = i + 1; j < terrainNodes.length; j++) {
      if (terrainNodes[i].skill.skill_type === terrainNodes[j].skill.skill_type) {
        const dist = Math.hypot(
          terrainNodes[i].position.x - terrainNodes[j].position.x,
          terrainNodes[i].position.y - terrainNodes[j].position.y
        )
        if (dist < 0.35) {
          connections.push({ from: terrainNodes[i], to: terrainNodes[j] })
        }
      }
    }
  }

  return (
    <div className="rounded-3xl overflow-hidden relative" style={{ background: '#FAFCFE', border: '1px solid rgba(12,31,63,0.06)' }}>
      {/* Legend */}
      <div className="absolute top-4 left-5 z-10 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#4F8A5B' }} />
          <span className="text-[10px] text-gray-500 font-medium">Explored</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#00A8A8', opacity: 0.7 }} />
          <span className="text-[10px] text-gray-500 font-medium">Emerging</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#DDE5EF' }} />
          <span className="text-[10px] text-gray-500 font-medium">Uncharted</span>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#00A8A8' }} />
          <span className="text-[10px] text-gray-500 font-medium">Foundational</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rotate-45 rounded-sm" style={{ background: '#5A3E6B', opacity: 0.6 }} />
          <span className="text-[10px] text-gray-500 font-medium">Core</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: '420px' }}>
        <defs>
          <radialGradient id="fogGradient">
            <stop offset="0%" stopColor="#DDE5EF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#DDE5EF" stopOpacity="0" />
          </radialGradient>
          {/* Subtle grid background */}
          <pattern id="terrainGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(12,31,63,0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="url(#terrainGrid)" />

        {/* Connection paths */}
        {connections.map((c, i) => (
          <line key={i}
            x1={c.from.position.x * W} y1={c.from.position.y * H}
            x2={c.to.position.x * W} y2={c.to.position.y * H}
            stroke="rgba(12,31,63,0.06)" strokeWidth="1" strokeDasharray="6 4"
          />
        ))}

        {/* Nodes */}
        {terrainNodes.map((node, i) => (
          <TerrainNode key={node.skill.id} node={node} index={i}
            isSelected={selectedSkillId === node.skill.id}
            onSelect={onSelectNode}
            svgWidth={W} svgHeight={H}
          />
        ))}
      </svg>
    </div>
  )
}
