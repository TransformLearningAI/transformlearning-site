'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

const NAVY = '#0C1F3F'
const TEAL = '#00A8A8'
const GREEN = '#4F8A5B'
const PLUM = '#5A3E6B'
const CORAL = '#FF6B4A'
const AMBER = '#D4A017'
const WARM_BG = '#FAF8F5'
const WARM_BORDER = '#EBE6E0'
const MUTED = '#6b635a'
const serif = 'Georgia, serif'

/* ─────────────────────────────────────────────────────────
   KNOWLEDGE GRAPH DATA — Human Communication (Intro)
   ───────────────────────────────────────────────────────── */

const NODE_TYPES = {
  core: { color: NAVY, label: 'Core Branch', size: 32 },
  concept: { color: TEAL, label: 'Concept', size: 22 },
  skill: { color: GREEN, label: 'Skill', size: 20 },
  misconception: { color: CORAL, label: 'Misconception', size: 16 },
  connection: { color: PLUM, label: 'Cross-Connection', size: 18 },
}

const nodes = [
  // 5 Core Branches
  { id: 'verbal', label: 'Verbal\nCommunication', type: 'core', x: 250, y: 120 },
  { id: 'nonverbal', label: 'Nonverbal\nCommunication', type: 'core', x: 550, y: 120 },
  { id: 'language', label: 'Language', type: 'core', x: 400, y: 50 },
  { id: 'interpersonal', label: 'Interpersonal\nCommunication', type: 'core', x: 200, y: 350 },
  { id: 'intrapersonal', label: 'Intrapersonal\nCommunication', type: 'core', x: 600, y: 350 },

  // Verbal Communication concepts
  { id: 'tone', label: 'Tone &\nInflection', type: 'concept', x: 100, y: 60 },
  { id: 'word-choice', label: 'Word Choice\n& Diction', type: 'concept', x: 150, y: 170 },
  { id: 'clarity', label: 'Clarity &\nPrecision', type: 'concept', x: 90, y: 130 },
  { id: 'persuasion', label: 'Persuasion\n& Rhetoric', type: 'concept', x: 280, y: 210 },
  { id: 'conversation', label: 'Conversation\nStructure', type: 'concept', x: 180, y: 250 },

  // Nonverbal Communication concepts
  { id: 'body-language', label: 'Body\nLanguage', type: 'concept', x: 650, y: 60 },
  { id: 'facial-expr', label: 'Facial\nExpressions', type: 'concept', x: 700, y: 140 },
  { id: 'proxemics', label: 'Proxemics\n(Space)', type: 'concept', x: 690, y: 210 },
  { id: 'haptics', label: 'Haptics\n(Touch)', type: 'concept', x: 580, y: 210 },
  { id: 'paralanguage', label: 'Paralanguage\n(Vocal Cues)', type: 'concept', x: 470, y: 190 },
  { id: 'chronemics', label: 'Chronemics\n(Time)', type: 'concept', x: 740, y: 280 },

  // Language concepts
  { id: 'semantics', label: 'Semantics\n(Meaning)', type: 'concept', x: 330, y: 10 },
  { id: 'syntax', label: 'Syntax\n(Structure)', type: 'concept', x: 470, y: 10 },
  { id: 'sapir-whorf', label: 'Sapir-Whorf\nHypothesis', type: 'concept', x: 400, y: 120 },
  { id: 'denotation', label: 'Denotation vs.\nConnotation', type: 'concept', x: 320, y: 80 },
  { id: 'language-power', label: 'Language\n& Power', type: 'concept', x: 490, y: 80 },

  // Interpersonal concepts
  { id: 'active-listening', label: 'Active\nListening', type: 'skill', x: 80, y: 320 },
  { id: 'empathy', label: 'Empathy', type: 'skill', x: 100, y: 400 },
  { id: 'conflict-res', label: 'Conflict\nResolution', type: 'skill', x: 200, y: 440 },
  { id: 'feedback', label: 'Giving &\nReceiving Feedback', type: 'skill', x: 300, y: 400 },
  { id: 'relationship-stages', label: 'Relationship\nStages', type: 'concept', x: 130, y: 470 },
  { id: 'self-disclosure', label: 'Self-\nDisclosure', type: 'concept', x: 280, y: 310 },
  { id: 'trust', label: 'Trust\nBuilding', type: 'concept', x: 320, y: 470 },

  // Intrapersonal concepts
  { id: 'self-concept', label: 'Self-\nConcept', type: 'concept', x: 650, y: 280 },
  { id: 'perception', label: 'Perception\n& Filters', type: 'concept', x: 700, y: 380 },
  { id: 'inner-voice', label: 'Inner Voice\n& Self-Talk', type: 'concept', x: 550, y: 440 },
  { id: 'cognitive-bias', label: 'Cognitive\nBiases', type: 'concept', x: 680, y: 460 },
  { id: 'emotional-intel', label: 'Emotional\nIntelligence', type: 'concept', x: 520, y: 300 },
  { id: 'mindfulness', label: 'Mindful\nCommunication', type: 'skill', x: 750, y: 400 },

  // Written Communication — 6th Core Branch
  { id: 'written', label: 'Written\nCommunication', type: 'core', x: 400, y: 500 },

  // Written Communication concepts
  { id: 'thesis', label: 'Thesis\nConstruction', type: 'concept', x: 300, y: 540 },
  { id: 'paragraph', label: 'Paragraph\nStructure', type: 'concept', x: 500, y: 540 },
  { id: 'audience-aware', label: 'Audience\nAwareness', type: 'concept', x: 350, y: 590 },
  { id: 'tone-register', label: 'Tone &\nRegister', type: 'concept', x: 460, y: 590 },
  { id: 'evidence-use', label: 'Evidence\n& Citation', type: 'concept', x: 250, y: 600 },
  { id: 'revision', label: 'Revision\n& Editing', type: 'skill', x: 550, y: 600 },
  { id: 'narrative', label: 'Narrative\nStructure', type: 'concept', x: 200, y: 550 },
  { id: 'argumentation', label: 'Argumentation\n& Logic', type: 'concept', x: 350, y: 650 },
  { id: 'genre', label: 'Genre\nConventions', type: 'concept', x: 500, y: 650 },
  { id: 'voice', label: 'Writer\'s\nVoice', type: 'concept', x: 450, y: 480 },
  { id: 'coherence', label: 'Coherence\n& Cohesion', type: 'skill', x: 300, y: 480 },
  { id: 'digital-writing', label: 'Digital Writing\n(Email/Social)', type: 'concept', x: 550, y: 480 },
  { id: 'ai-writing', label: 'Writing\nWith AI', type: 'concept', x: 600, y: 540 },

  // Written Communication misconceptions
  { id: 'mis-grammar', label: 'Good grammar\n= good writing', type: 'misconception', x: 200, y: 650 },
  { id: 'mis-oneshot', label: 'Good writers\ndon\'t revise', type: 'misconception', x: 600, y: 650 },
  { id: 'mis-formal', label: 'Formal =\nprofessional', type: 'misconception', x: 500, y: 700 },

  // Cross-connections
  { id: 'context', label: 'Context\n& Situation', type: 'connection', x: 400, y: 280 },
  { id: 'culture', label: 'Cultural\nInfluence', type: 'connection', x: 400, y: 400 },
  { id: 'digital-comm', label: 'Digital &\nAI-Mediated', type: 'connection', x: 400, y: 750 },
  { id: 'noise', label: 'Noise &\nBarriers', type: 'connection', x: 400, y: 180 },

  // Misconceptions (original)
  { id: 'mis-words', label: 'Words have\nfixed meanings', type: 'misconception', x: 230, y: 30 },
  { id: 'mis-natural', label: 'Communication\nis natural/easy', type: 'misconception', x: 50, y: 220 },
  { id: 'mis-nonverbal', label: 'Body language\nis universal', type: 'misconception', x: 750, y: 50 },
  { id: 'mis-listening', label: 'Hearing =\nListening', type: 'misconception', x: 30, y: 370 },
  { id: 'mis-objective', label: 'Perception\nis objective', type: 'misconception', x: 760, y: 330 },
]

const edges = [
  // Core to core connections
  { from: 'verbal', to: 'nonverbal', type: 'supports', label: 'complement' },
  { from: 'verbal', to: 'language', type: 'requires', label: 'requires' },
  { from: 'language', to: 'nonverbal', type: 'supports', label: 'shapes' },
  { from: 'interpersonal', to: 'verbal', type: 'requires', label: 'uses' },
  { from: 'interpersonal', to: 'nonverbal', type: 'requires', label: 'uses' },
  { from: 'intrapersonal', to: 'interpersonal', type: 'supports', label: 'shapes' },
  { from: 'intrapersonal', to: 'verbal', type: 'supports', label: 'filters' },

  // Verbal branch
  { from: 'tone', to: 'verbal', type: 'supports' },
  { from: 'word-choice', to: 'verbal', type: 'supports' },
  { from: 'clarity', to: 'verbal', type: 'supports' },
  { from: 'persuasion', to: 'verbal', type: 'supports' },
  { from: 'conversation', to: 'verbal', type: 'supports' },
  { from: 'word-choice', to: 'clarity', type: 'supports' },
  { from: 'tone', to: 'paralanguage', type: 'supports' },
  { from: 'persuasion', to: 'word-choice', type: 'requires' },

  // Nonverbal branch
  { from: 'body-language', to: 'nonverbal', type: 'supports' },
  { from: 'facial-expr', to: 'nonverbal', type: 'supports' },
  { from: 'proxemics', to: 'nonverbal', type: 'supports' },
  { from: 'haptics', to: 'nonverbal', type: 'supports' },
  { from: 'paralanguage', to: 'nonverbal', type: 'supports' },
  { from: 'chronemics', to: 'nonverbal', type: 'supports' },
  { from: 'facial-expr', to: 'body-language', type: 'supports' },
  { from: 'proxemics', to: 'culture', type: 'supports' },

  // Language branch
  { from: 'semantics', to: 'language', type: 'supports' },
  { from: 'syntax', to: 'language', type: 'supports' },
  { from: 'sapir-whorf', to: 'language', type: 'supports' },
  { from: 'denotation', to: 'language', type: 'supports' },
  { from: 'language-power', to: 'language', type: 'supports' },
  { from: 'denotation', to: 'semantics', type: 'requires' },
  { from: 'sapir-whorf', to: 'semantics', type: 'requires' },
  { from: 'language-power', to: 'sapir-whorf', type: 'supports' },

  // Interpersonal branch
  { from: 'active-listening', to: 'interpersonal', type: 'supports' },
  { from: 'empathy', to: 'interpersonal', type: 'supports' },
  { from: 'conflict-res', to: 'interpersonal', type: 'supports' },
  { from: 'feedback', to: 'interpersonal', type: 'supports' },
  { from: 'relationship-stages', to: 'interpersonal', type: 'supports' },
  { from: 'self-disclosure', to: 'interpersonal', type: 'supports' },
  { from: 'trust', to: 'interpersonal', type: 'supports' },
  { from: 'empathy', to: 'active-listening', type: 'requires' },
  { from: 'conflict-res', to: 'active-listening', type: 'requires' },
  { from: 'conflict-res', to: 'empathy', type: 'requires' },
  { from: 'feedback', to: 'active-listening', type: 'requires' },
  { from: 'trust', to: 'self-disclosure', type: 'supports' },
  { from: 'self-disclosure', to: 'relationship-stages', type: 'supports' },

  // Intrapersonal branch
  { from: 'self-concept', to: 'intrapersonal', type: 'supports' },
  { from: 'perception', to: 'intrapersonal', type: 'supports' },
  { from: 'inner-voice', to: 'intrapersonal', type: 'supports' },
  { from: 'cognitive-bias', to: 'intrapersonal', type: 'supports' },
  { from: 'emotional-intel', to: 'intrapersonal', type: 'supports' },
  { from: 'mindfulness', to: 'intrapersonal', type: 'supports' },
  { from: 'cognitive-bias', to: 'perception', type: 'supports' },
  { from: 'inner-voice', to: 'self-concept', type: 'supports' },
  { from: 'emotional-intel', to: 'empathy', type: 'supports' },
  { from: 'mindfulness', to: 'emotional-intel', type: 'requires' },

  // Cross-connections
  { from: 'context', to: 'verbal', type: 'supports' },
  { from: 'context', to: 'nonverbal', type: 'supports' },
  { from: 'context', to: 'interpersonal', type: 'supports' },
  { from: 'culture', to: 'nonverbal', type: 'supports' },
  { from: 'culture', to: 'language', type: 'supports' },
  { from: 'culture', to: 'interpersonal', type: 'supports' },
  { from: 'culture', to: 'intrapersonal', type: 'supports' },
  { from: 'digital-comm', to: 'verbal', type: 'supports' },
  { from: 'digital-comm', to: 'nonverbal', type: 'supports' },
  { from: 'digital-comm', to: 'interpersonal', type: 'supports' },
  { from: 'noise', to: 'verbal', type: 'supports' },
  { from: 'noise', to: 'nonverbal', type: 'supports' },
  { from: 'noise', to: 'active-listening', type: 'supports' },

  // Written Communication branch
  { from: 'thesis', to: 'written', type: 'supports' },
  { from: 'paragraph', to: 'written', type: 'supports' },
  { from: 'audience-aware', to: 'written', type: 'supports' },
  { from: 'tone-register', to: 'written', type: 'supports' },
  { from: 'evidence-use', to: 'written', type: 'supports' },
  { from: 'revision', to: 'written', type: 'supports' },
  { from: 'narrative', to: 'written', type: 'supports' },
  { from: 'argumentation', to: 'written', type: 'supports' },
  { from: 'genre', to: 'written', type: 'supports' },
  { from: 'voice', to: 'written', type: 'supports' },
  { from: 'coherence', to: 'written', type: 'supports' },
  { from: 'digital-writing', to: 'written', type: 'supports' },
  { from: 'ai-writing', to: 'written', type: 'supports' },

  // Written internal prerequisites
  { from: 'argumentation', to: 'thesis', type: 'requires' },
  { from: 'argumentation', to: 'evidence-use', type: 'requires' },
  { from: 'coherence', to: 'paragraph', type: 'requires' },
  { from: 'voice', to: 'tone-register', type: 'supports' },
  { from: 'voice', to: 'audience-aware', type: 'requires' },
  { from: 'revision', to: 'coherence', type: 'supports' },
  { from: 'digital-writing', to: 'tone-register', type: 'requires' },
  { from: 'digital-writing', to: 'audience-aware', type: 'requires' },
  { from: 'ai-writing', to: 'revision', type: 'requires' },
  { from: 'ai-writing', to: 'voice', type: 'requires' },
  { from: 'genre', to: 'audience-aware', type: 'requires' },

  // Written ↔ Verbal connections
  { from: 'written', to: 'verbal', type: 'supports', label: 'parallel channels' },
  { from: 'word-choice', to: 'written', type: 'supports' },
  { from: 'clarity', to: 'written', type: 'supports' },
  { from: 'persuasion', to: 'argumentation', type: 'supports' },
  { from: 'tone', to: 'tone-register', type: 'supports' },

  // Written ↔ Language connections
  { from: 'written', to: 'language', type: 'requires' },
  { from: 'semantics', to: 'written', type: 'supports' },
  { from: 'syntax', to: 'paragraph', type: 'supports' },
  { from: 'denotation', to: 'audience-aware', type: 'supports' },
  { from: 'language-power', to: 'voice', type: 'supports' },

  // Written ↔ Interpersonal connections
  { from: 'feedback', to: 'revision', type: 'supports' },
  { from: 'self-disclosure', to: 'narrative', type: 'supports' },

  // Written ↔ Intrapersonal connections
  { from: 'inner-voice', to: 'voice', type: 'supports' },
  { from: 'self-concept', to: 'written', type: 'supports' },

  // Written ↔ Cross-connections
  { from: 'digital-comm', to: 'digital-writing', type: 'supports' },
  { from: 'digital-comm', to: 'ai-writing', type: 'supports' },
  { from: 'culture', to: 'genre', type: 'supports' },
  { from: 'culture', to: 'tone-register', type: 'supports' },
  { from: 'context', to: 'audience-aware', type: 'supports' },
  { from: 'context', to: 'written', type: 'supports' },

  // Written misconceptions
  { from: 'mis-grammar', to: 'coherence', type: 'blocks' },
  { from: 'mis-grammar', to: 'voice', type: 'blocks' },
  { from: 'mis-oneshot', to: 'revision', type: 'blocks' },
  { from: 'mis-formal', to: 'tone-register', type: 'blocks' },
  { from: 'mis-formal', to: 'audience-aware', type: 'blocks' },

  // Misconceptions — original (blocks relationships)
  { from: 'mis-words', to: 'semantics', type: 'blocks' },
  { from: 'mis-words', to: 'denotation', type: 'blocks' },
  { from: 'mis-natural', to: 'active-listening', type: 'blocks' },
  { from: 'mis-natural', to: 'conversation', type: 'blocks' },
  { from: 'mis-nonverbal', to: 'proxemics', type: 'blocks' },
  { from: 'mis-nonverbal', to: 'culture', type: 'blocks' },
  { from: 'mis-listening', to: 'active-listening', type: 'blocks' },
  { from: 'mis-listening', to: 'empathy', type: 'blocks' },
  { from: 'mis-objective', to: 'perception', type: 'blocks' },
  { from: 'mis-objective', to: 'cognitive-bias', type: 'blocks' },
]

/* ─── Force-directed simulation ─── */
function useForceSimulation(initialNodes, edges, width, height) {
  const [simNodes, setSimNodes] = useState(() =>
    initialNodes.map(n => ({
      ...n,
      x: (n.x / 800) * width,
      y: (n.y / 750) * height,
      vx: 0,
      vy: 0,
    }))
  )

  useEffect(() => {
    let frame
    let iteration = 0
    const maxIterations = 200
    const ns = simNodes.map(n => ({ ...n }))

    function tick() {
      if (iteration >= maxIterations) return
      iteration++
      const alpha = 1 - iteration / maxIterations
      const k = alpha * 0.3

      // Repulsion
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          let dx = ns[j].x - ns[i].x
          let dy = ns[j].y - ns[i].y
          let dist = Math.sqrt(dx * dx + dy * dy) || 1
          let force = (80 * k) / dist
          ns[i].vx -= (dx / dist) * force
          ns[i].vy -= (dy / dist) * force
          ns[j].vx += (dx / dist) * force
          ns[j].vy += (dy / dist) * force
        }
      }

      // Attraction along edges
      edges.forEach(e => {
        const a = ns.find(n => n.id === e.from)
        const b = ns.find(n => n.id === e.to)
        if (!a || !b) return
        let dx = b.x - a.x
        let dy = b.y - a.y
        let dist = Math.sqrt(dx * dx + dy * dy) || 1
        let force = (dist - 100) * k * 0.01
        a.vx += (dx / dist) * force
        a.vy += (dy / dist) * force
        b.vx -= (dx / dist) * force
        b.vy -= (dy / dist) * force
      })

      // Center gravity
      ns.forEach(n => {
        n.vx += (width / 2 - n.x) * k * 0.005
        n.vy += (height / 2 - n.y) * k * 0.005
        n.vx *= 0.8
        n.vy *= 0.8
        n.x += n.vx
        n.y += n.vy
        n.x = Math.max(40, Math.min(width - 40, n.x))
        n.y = Math.max(25, Math.min(height - 25, n.y))
      })

      setSimNodes(ns.map(n => ({ ...n })))
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, []) // eslint-disable-line

  return simNodes
}

/* ─── Main Component ─── */
export default function KnowledgeGraphPage() {
  const [filter, setFilter] = useState('all')
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const containerRef = useRef(null)
  const [dims, setDims] = useState({ w: 800, h: 520 })

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth
        setDims({ w, h: Math.min(w * 0.85, 750) })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const simNodes = useForceSimulation(nodes, edges, dims.w, dims.h)

  const filteredNodes = filter === 'all' ? simNodes : simNodes.filter(n => n.type === filter)
  const filteredIds = new Set(filteredNodes.map(n => n.id))
  const filteredEdges = edges.filter(e => filteredIds.has(e.from) && filteredIds.has(e.to))

  const activeNode = selectedNode ? simNodes.find(n => n.id === selectedNode) : null
  const connectedIds = selectedNode ? new Set([
    selectedNode,
    ...edges.filter(e => e.from === selectedNode || e.to === selectedNode).flatMap(e => [e.from, e.to])
  ]) : null

  const nodeInfo = selectedNode ? nodes.find(n => n.id === selectedNode) : null
  const nodeEdges = selectedNode ? edges.filter(e => e.from === selectedNode || e.to === selectedNode) : []

  return (
    <div className="min-h-screen" style={{ backgroundColor: WARM_BG }}>
      <nav className="border-b bg-white" style={{ borderColor: WARM_BORDER }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: NAVY }}>
            transform<span style={{ color: TEAL }}>learning</span>
          </Link>
          <Link href="/campus-os/demo" className="text-sm font-medium hover:underline" style={{ color: NAVY }}>&larr; Campus OS</Link>
        </div>
      </nav>

      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: TEAL }}>Knowledge Graph</p>
        <h1 className="tracking-tight leading-tight mb-3" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em' }}>
          Human Communication
        </h1>
        <p className="text-sm max-w-xl mx-auto" style={{ color: MUTED }}>
          57 nodes. 100+ edges. Six core branches — verbal, nonverbal, language, interpersonal, intrapersonal, written — with concepts, skills, misconceptions, and cross-connections.
        </p>
      </header>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 mb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: 'all', label: 'All', color: NAVY },
            ...Object.entries(NODE_TYPES).map(([id, t]) => ({ id, label: t.label, color: t.color })),
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setSelectedNode(null) }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                backgroundColor: filter === f.id ? f.color : 'white',
                color: filter === f.id ? 'white' : f.color,
                border: `1px solid ${filter === f.id ? f.color : WARM_BORDER}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div
          ref={containerRef}
          className="rounded-xl overflow-hidden relative"
          style={{ backgroundColor: NAVY, height: dims.h }}
        >
          <svg width={dims.w} height={dims.h} className="absolute inset-0">
            {/* Edges */}
            {filteredEdges.map((e, i) => {
              const a = simNodes.find(n => n.id === e.from)
              const b = simNodes.find(n => n.id === e.to)
              if (!a || !b) return null
              const isHighlighted = connectedIds && (connectedIds.has(e.from) && connectedIds.has(e.to))
              const isDimmed = connectedIds && !isHighlighted
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={e.type === 'blocks' ? CORAL : e.type === 'requires' ? AMBER : 'rgba(255,255,255,0.12)'}
                  strokeWidth={e.type === 'blocks' ? 1.5 : e.type === 'requires' ? 1.2 : 0.7}
                  strokeDasharray={e.type === 'blocks' ? '4 3' : 'none'}
                  opacity={isDimmed ? 0.05 : isHighlighted ? 0.8 : 0.3}
                />
              )
            })}

            {/* Nodes */}
            {filteredNodes.map(node => {
              const nt = NODE_TYPES[node.type]
              const isSelected = selectedNode === node.id
              const isConnected = connectedIds?.has(node.id)
              const isDimmed = connectedIds && !isConnected
              const isHovered = hoveredNode === node.id
              const r = (nt.size / 2) * (isSelected ? 1.3 : isHovered ? 1.15 : 1)

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer', opacity: isDimmed ? 0.15 : 1, transition: 'opacity 0.3s' }}
                >
                  {/* Glow */}
                  {(isSelected || isHovered) && (
                    <circle cx={node.x} cy={node.y} r={r + 8} fill={nt.color} opacity={0.15} />
                  )}
                  {/* Node */}
                  <circle
                    cx={node.x} cy={node.y} r={r}
                    fill={nt.color + (node.type === 'misconception' ? '40' : '60')}
                    stroke={nt.color}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {/* Label */}
                  {node.label.split('\n').map((line, li) => (
                    <text
                      key={li}
                      x={node.x}
                      y={node.y + r + 10 + li * 10}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.7)"
                      fontSize={node.type === 'core' ? 8 : 7}
                      fontWeight={node.type === 'core' ? 700 : 400}
                      fontFamily="sans-serif"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              )
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex gap-3">
            {Object.entries(NODE_TYPES).map(([id, t]) => (
              <div key={id} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-white/40" style={{ fontSize: 9 }}>{t.label}</span>
              </div>
            ))}
          </div>

          {/* Edge legend */}
          <div className="absolute bottom-3 right-3 flex gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0 border-t" style={{ borderColor: AMBER }} />
              <span className="text-white/40" style={{ fontSize: 9 }}>requires</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0 border-t border-dashed" style={{ borderColor: CORAL }} />
              <span className="text-white/40" style={{ fontSize: 9 }}>blocks (misconception)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {nodeInfo && (
        <div className="max-w-4xl mx-auto px-6 pb-12">
          <div className="rounded-xl border bg-white p-6" style={{ borderColor: NODE_TYPES[nodeInfo.type].color + '40' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: NODE_TYPES[nodeInfo.type].color }} />
              <h3 className="text-lg font-bold" style={{ color: NAVY }}>{nodeInfo.label.replace('\n', ' ')}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: NODE_TYPES[nodeInfo.type].color + '15', color: NODE_TYPES[nodeInfo.type].color }}>
                {NODE_TYPES[nodeInfo.type].label}
              </span>
            </div>

            {nodeEdges.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: MUTED }}>Connections</p>
                <div className="flex flex-wrap gap-2">
                  {nodeEdges.map((e, i) => {
                    const otherId = e.from === selectedNode ? e.to : e.from
                    const other = nodes.find(n => n.id === otherId)
                    const direction = e.from === selectedNode ? '→' : '←'
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedNode(otherId)}
                        className="text-xs px-3 py-1.5 rounded-full border hover:opacity-80 transition-opacity"
                        style={{
                          borderColor: e.type === 'blocks' ? CORAL + '40' : WARM_BORDER,
                          color: e.type === 'blocks' ? CORAL : NAVY,
                          backgroundColor: e.type === 'blocks' ? CORAL + '08' : 'white',
                        }}
                      >
                        {direction} {other?.label.replace('\n', ' ')}
                        <span className="ml-1 opacity-50">({e.type})</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(NODE_TYPES).map(([id, t]) => {
            const count = nodes.filter(n => n.type === id).length
            return (
              <div key={id} className="rounded-lg border bg-white p-4 text-center" style={{ borderColor: WARM_BORDER }}>
                <p className="text-2xl font-bold" style={{ color: t.color }}>{count}</p>
                <p className="text-xs" style={{ color: MUTED }}>{t.label}s</p>
              </div>
            )
          })}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="rounded-lg border bg-white p-4 text-center" style={{ borderColor: WARM_BORDER }}>
            <p className="text-2xl font-bold" style={{ color: NAVY }}>{edges.filter(e => e.type === 'supports').length}</p>
            <p className="text-xs" style={{ color: MUTED }}>support edges</p>
          </div>
          <div className="rounded-lg border bg-white p-4 text-center" style={{ borderColor: WARM_BORDER }}>
            <p className="text-2xl font-bold" style={{ color: AMBER }}>{edges.filter(e => e.type === 'requires').length}</p>
            <p className="text-xs" style={{ color: MUTED }}>prerequisite edges</p>
          </div>
          <div className="rounded-lg border bg-white p-4 text-center" style={{ borderColor: WARM_BORDER }}>
            <p className="text-2xl font-bold" style={{ color: CORAL }}>{edges.filter(e => e.type === 'blocks').length}</p>
            <p className="text-xs" style={{ color: MUTED }}>misconception blocks</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <p className="text-sm leading-relaxed" style={{ fontFamily: serif, color: NAVY }}>
          This graph was built from a single conversation about a Human Communication course.
          The AI interviewed the instructor. The instructor never saw a node or an edge — just answered questions about their curriculum.
        </p>
        <p className="text-xs mt-3" style={{ color: MUTED }}>
          The graph is the product, not the chat.
        </p>
      </div>
    </div>
  )
}
