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

// Strength: 1.0 = strongest prerequisite/foundation, 0.3 = weak/tangential
const edges = [
  // Core to core — strongest structural connections
  { from: 'verbal', to: 'nonverbal', type: 'supports', label: 'complement', strength: 0.9 },
  { from: 'verbal', to: 'language', type: 'requires', label: 'requires', strength: 1.0 },
  { from: 'language', to: 'nonverbal', type: 'supports', label: 'shapes', strength: 0.7 },
  { from: 'interpersonal', to: 'verbal', type: 'requires', label: 'uses', strength: 1.0 },
  { from: 'interpersonal', to: 'nonverbal', type: 'requires', label: 'uses', strength: 0.9 },
  { from: 'intrapersonal', to: 'interpersonal', type: 'supports', label: 'shapes', strength: 0.8 },
  { from: 'intrapersonal', to: 'verbal', type: 'supports', label: 'filters', strength: 0.6 },

  // Verbal branch
  { from: 'tone', to: 'verbal', type: 'supports', strength: 0.8 },
  { from: 'word-choice', to: 'verbal', type: 'supports', strength: 0.9 },
  { from: 'clarity', to: 'verbal', type: 'supports', strength: 0.8 },
  { from: 'persuasion', to: 'verbal', type: 'supports', strength: 0.7 },
  { from: 'conversation', to: 'verbal', type: 'supports', strength: 0.7 },
  { from: 'word-choice', to: 'clarity', type: 'supports', strength: 0.9 },
  { from: 'tone', to: 'paralanguage', type: 'supports', strength: 0.8 },
  { from: 'persuasion', to: 'word-choice', type: 'requires', strength: 0.8 },

  // Nonverbal branch
  { from: 'body-language', to: 'nonverbal', type: 'supports', strength: 0.9 },
  { from: 'facial-expr', to: 'nonverbal', type: 'supports', strength: 0.9 },
  { from: 'proxemics', to: 'nonverbal', type: 'supports', strength: 0.7 },
  { from: 'haptics', to: 'nonverbal', type: 'supports', strength: 0.5 },
  { from: 'paralanguage', to: 'nonverbal', type: 'supports', strength: 0.8 },
  { from: 'chronemics', to: 'nonverbal', type: 'supports', strength: 0.4 },
  { from: 'facial-expr', to: 'body-language', type: 'supports', strength: 0.7 },
  { from: 'proxemics', to: 'culture', type: 'supports', strength: 0.8 },

  // Language branch
  { from: 'semantics', to: 'language', type: 'supports', strength: 1.0 },
  { from: 'syntax', to: 'language', type: 'supports', strength: 0.8 },
  { from: 'sapir-whorf', to: 'language', type: 'supports', strength: 0.7 },
  { from: 'denotation', to: 'language', type: 'supports', strength: 0.8 },
  { from: 'language-power', to: 'language', type: 'supports', strength: 0.6 },
  { from: 'denotation', to: 'semantics', type: 'requires', strength: 0.9 },
  { from: 'sapir-whorf', to: 'semantics', type: 'requires', strength: 0.8 },
  { from: 'language-power', to: 'sapir-whorf', type: 'supports', strength: 0.5 },

  // Interpersonal branch
  { from: 'active-listening', to: 'interpersonal', type: 'supports', strength: 1.0 },
  { from: 'empathy', to: 'interpersonal', type: 'supports', strength: 0.9 },
  { from: 'conflict-res', to: 'interpersonal', type: 'supports', strength: 0.8 },
  { from: 'feedback', to: 'interpersonal', type: 'supports', strength: 0.7 },
  { from: 'relationship-stages', to: 'interpersonal', type: 'supports', strength: 0.6 },
  { from: 'self-disclosure', to: 'interpersonal', type: 'supports', strength: 0.6 },
  { from: 'trust', to: 'interpersonal', type: 'supports', strength: 0.7 },
  { from: 'empathy', to: 'active-listening', type: 'requires', strength: 1.0 },
  { from: 'conflict-res', to: 'active-listening', type: 'requires', strength: 0.9 },
  { from: 'conflict-res', to: 'empathy', type: 'requires', strength: 0.9 },
  { from: 'feedback', to: 'active-listening', type: 'requires', strength: 0.8 },
  { from: 'trust', to: 'self-disclosure', type: 'supports', strength: 0.8 },
  { from: 'self-disclosure', to: 'relationship-stages', type: 'supports', strength: 0.6 },

  // Intrapersonal branch
  { from: 'self-concept', to: 'intrapersonal', type: 'supports', strength: 1.0 },
  { from: 'perception', to: 'intrapersonal', type: 'supports', strength: 0.9 },
  { from: 'inner-voice', to: 'intrapersonal', type: 'supports', strength: 0.8 },
  { from: 'cognitive-bias', to: 'intrapersonal', type: 'supports', strength: 0.7 },
  { from: 'emotional-intel', to: 'intrapersonal', type: 'supports', strength: 0.8 },
  { from: 'mindfulness', to: 'intrapersonal', type: 'supports', strength: 0.5 },
  { from: 'cognitive-bias', to: 'perception', type: 'supports', strength: 0.9 },
  { from: 'inner-voice', to: 'self-concept', type: 'supports', strength: 0.8 },
  { from: 'emotional-intel', to: 'empathy', type: 'supports', strength: 0.9 },
  { from: 'mindfulness', to: 'emotional-intel', type: 'requires', strength: 0.6 },

  // Cross-connections
  { from: 'context', to: 'verbal', type: 'supports', strength: 0.7 },
  { from: 'context', to: 'nonverbal', type: 'supports', strength: 0.7 },
  { from: 'context', to: 'interpersonal', type: 'supports', strength: 0.6 },
  { from: 'culture', to: 'nonverbal', type: 'supports', strength: 0.8 },
  { from: 'culture', to: 'language', type: 'supports', strength: 0.8 },
  { from: 'culture', to: 'interpersonal', type: 'supports', strength: 0.7 },
  { from: 'culture', to: 'intrapersonal', type: 'supports', strength: 0.5 },
  { from: 'digital-comm', to: 'verbal', type: 'supports', strength: 0.5 },
  { from: 'digital-comm', to: 'nonverbal', type: 'supports', strength: 0.4 },
  { from: 'digital-comm', to: 'interpersonal', type: 'supports', strength: 0.6 },
  { from: 'noise', to: 'verbal', type: 'supports', strength: 0.6 },
  { from: 'noise', to: 'nonverbal', type: 'supports', strength: 0.5 },
  { from: 'noise', to: 'active-listening', type: 'supports', strength: 0.7 },

  // Written Communication branch
  { from: 'thesis', to: 'written', type: 'supports', strength: 0.9 },
  { from: 'paragraph', to: 'written', type: 'supports', strength: 0.8 },
  { from: 'audience-aware', to: 'written', type: 'supports', strength: 0.9 },
  { from: 'tone-register', to: 'written', type: 'supports', strength: 0.7 },
  { from: 'evidence-use', to: 'written', type: 'supports', strength: 0.7 },
  { from: 'revision', to: 'written', type: 'supports', strength: 0.8 },
  { from: 'narrative', to: 'written', type: 'supports', strength: 0.6 },
  { from: 'argumentation', to: 'written', type: 'supports', strength: 0.8 },
  { from: 'genre', to: 'written', type: 'supports', strength: 0.5 },
  { from: 'voice', to: 'written', type: 'supports', strength: 0.7 },
  { from: 'coherence', to: 'written', type: 'supports', strength: 0.9 },
  { from: 'digital-writing', to: 'written', type: 'supports', strength: 0.5 },
  { from: 'ai-writing', to: 'written', type: 'supports', strength: 0.4 },

  // Written internal prerequisites
  { from: 'argumentation', to: 'thesis', type: 'requires', strength: 1.0 },
  { from: 'argumentation', to: 'evidence-use', type: 'requires', strength: 0.9 },
  { from: 'coherence', to: 'paragraph', type: 'requires', strength: 0.9 },
  { from: 'voice', to: 'tone-register', type: 'supports', strength: 0.7 },
  { from: 'voice', to: 'audience-aware', type: 'requires', strength: 0.8 },
  { from: 'revision', to: 'coherence', type: 'supports', strength: 0.8 },
  { from: 'digital-writing', to: 'tone-register', type: 'requires', strength: 0.7 },
  { from: 'digital-writing', to: 'audience-aware', type: 'requires', strength: 0.7 },
  { from: 'ai-writing', to: 'revision', type: 'requires', strength: 0.9 },
  { from: 'ai-writing', to: 'voice', type: 'requires', strength: 0.8 },
  { from: 'genre', to: 'audience-aware', type: 'requires', strength: 0.7 },

  // Written ↔ Verbal connections
  { from: 'written', to: 'verbal', type: 'supports', label: 'parallel channels', strength: 0.8 },
  { from: 'word-choice', to: 'written', type: 'supports', strength: 0.8 },
  { from: 'clarity', to: 'written', type: 'supports', strength: 0.7 },
  { from: 'persuasion', to: 'argumentation', type: 'supports', strength: 0.8 },
  { from: 'tone', to: 'tone-register', type: 'supports', strength: 0.6 },

  // Written ↔ Language connections
  { from: 'written', to: 'language', type: 'requires', strength: 1.0 },
  { from: 'semantics', to: 'written', type: 'supports', strength: 0.7 },
  { from: 'syntax', to: 'paragraph', type: 'supports', strength: 0.8 },
  { from: 'denotation', to: 'audience-aware', type: 'supports', strength: 0.5 },
  { from: 'language-power', to: 'voice', type: 'supports', strength: 0.6 },

  // Written ↔ Interpersonal connections
  { from: 'feedback', to: 'revision', type: 'supports', strength: 0.7 },
  { from: 'self-disclosure', to: 'narrative', type: 'supports', strength: 0.5 },

  // Written ↔ Intrapersonal connections
  { from: 'inner-voice', to: 'voice', type: 'supports', strength: 0.7 },
  { from: 'self-concept', to: 'written', type: 'supports', strength: 0.4 },

  // Written ↔ Cross-connections
  { from: 'digital-comm', to: 'digital-writing', type: 'supports', strength: 0.8 },
  { from: 'digital-comm', to: 'ai-writing', type: 'supports', strength: 0.6 },
  { from: 'culture', to: 'genre', type: 'supports', strength: 0.6 },
  { from: 'culture', to: 'tone-register', type: 'supports', strength: 0.5 },
  { from: 'context', to: 'audience-aware', type: 'supports', strength: 0.7 },
  { from: 'context', to: 'written', type: 'supports', strength: 0.5 },

  // Written misconceptions
  { from: 'mis-grammar', to: 'coherence', type: 'blocks', strength: 0.9 },
  { from: 'mis-grammar', to: 'voice', type: 'blocks', strength: 0.8 },
  { from: 'mis-oneshot', to: 'revision', type: 'blocks', strength: 1.0 },
  { from: 'mis-formal', to: 'tone-register', type: 'blocks', strength: 0.7 },
  { from: 'mis-formal', to: 'audience-aware', type: 'blocks', strength: 0.8 },

  // Misconceptions — original (blocks relationships)
  { from: 'mis-words', to: 'semantics', type: 'blocks', strength: 0.9 },
  { from: 'mis-words', to: 'denotation', type: 'blocks', strength: 0.8 },
  { from: 'mis-natural', to: 'active-listening', type: 'blocks', strength: 1.0 },
  { from: 'mis-natural', to: 'conversation', type: 'blocks', strength: 0.7 },
  { from: 'mis-nonverbal', to: 'proxemics', type: 'blocks', strength: 0.8 },
  { from: 'mis-nonverbal', to: 'culture', type: 'blocks', strength: 0.9 },
  { from: 'mis-listening', to: 'active-listening', type: 'blocks', strength: 1.0 },
  { from: 'mis-listening', to: 'empathy', type: 'blocks', strength: 0.8 },
  { from: 'mis-objective', to: 'perception', type: 'blocks', strength: 1.0 },
  { from: 'mis-objective', to: 'cognitive-bias', type: 'blocks', strength: 0.9 },
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

  // Analysis state
  const [analyzeInput, setAnalyzeInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null) // { summary, connections: [{nodeId, type, description}] }

  async function handleAnalyze(e) {
    e.preventDefault()
    if (!analyzeInput.trim() || analyzing) return
    setAnalyzing(true)
    setAnalysis(null)
    setSelectedNode(null)
    setFilter('all')
    try {
      const res = await fetch('/api/knowledge-graph-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: analyzeInput.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalysis(data)
    } catch (err) {
      console.error(err)
    }
    setAnalyzing(false)
  }

  function clearAnalysis() {
    setAnalysis(null)
    setAnalyzeInput('')
  }

  // Build lookup for analysis connections
  const analysisMap = {}
  if (analysis?.connections) {
    analysis.connections.forEach(c => { analysisMap[c.nodeId] = c })
  }
  const analysisIds = analysis ? new Set(analysis.connections.map(c => c.nodeId)) : null
  const directIds = analysis ? new Set(analysis.connections.filter(c => c.type === 'direct').map(c => c.nodeId)) : null

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

      {/* Analyze Input */}
      <div className="max-w-2xl mx-auto px-6 mb-6">
        <form onSubmit={handleAnalyze} className="flex gap-2">
          <input
            type="text"
            value={analyzeInput}
            onChange={e => setAnalyzeInput(e.target.value)}
            placeholder="Enter a device, medium, or concept (e.g., TikTok, business email, podcast, body camera)..."
            className="flex-1 px-4 py-3 rounded-lg border text-sm outline-none transition-all focus:ring-2"
            style={{ borderColor: WARM_BORDER, backgroundColor: 'white', color: NAVY, '--tw-ring-color': TEAL }}
          />
          <button
            type="submit"
            disabled={analyzing || !analyzeInput.trim()}
            className="px-5 py-3 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: TEAL }}
          >
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </button>
          {analysis && (
            <button
              type="button"
              onClick={clearAnalysis}
              className="px-3 py-3 rounded-lg text-sm border transition-all hover:opacity-70"
              style={{ borderColor: WARM_BORDER, color: MUTED }}
            >
              Clear
            </button>
          )}
        </form>

        {/* Analysis summary */}
        {analysis && (
          <div className="mt-3 rounded-lg border p-4" style={{ borderColor: TEAL + '40', backgroundColor: TEAL + '06' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TEAL }} />
              <h3 className="text-sm font-bold" style={{ color: NAVY }}>{analysis.analysis}</h3>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>{analysis.summary}</p>
            <div className="flex gap-3 text-xs">
              <span style={{ color: TEAL }}>
                <span className="font-bold">{analysis.connections.filter(c => c.type === 'direct').length}</span> direct
              </span>
              <span style={{ color: PLUM }}>
                <span className="font-bold">{analysis.connections.filter(c => c.type === 'indirect').length}</span> indirect
              </span>
              <span style={{ color: MUTED }}>
                {nodes.length - analysis.connections.length} unrelated
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Graph */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div
          ref={containerRef}
          className="rounded-xl overflow-hidden relative"
          style={{ backgroundColor: NAVY, height: dims.h }}
        >
          <svg width={dims.w} height={dims.h} className="absolute inset-0">
            {/* Edge glow layer — strong connections get a soft glow behind them */}
            {filteredEdges.filter(e => (e.strength || 0.5) >= 0.8).map((e, i) => {
              const a = simNodes.find(n => n.id === e.from)
              const b = simNodes.find(n => n.id === e.to)
              if (!a || !b) return null
              const isHighlighted = connectedIds && (connectedIds.has(e.from) && connectedIds.has(e.to))
              const isDimmed = connectedIds && !isHighlighted
              if (isDimmed) return null
              const color = e.type === 'blocks' ? CORAL : e.type === 'requires' ? AMBER : TEAL
              return (
                <line
                  key={`glow-${i}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={color}
                  strokeWidth={(e.strength || 0.5) * 6}
                  strokeDasharray={e.type === 'blocks' ? '4 3' : 'none'}
                  opacity={isHighlighted ? 0.12 : 0.04}
                  strokeLinecap="round"
                />
              )
            })}

            {/* Edges — width and opacity driven by strength */}
            {filteredEdges.map((e, i) => {
              const a = simNodes.find(n => n.id === e.from)
              const b = simNodes.find(n => n.id === e.to)
              if (!a || !b) return null
              const s = e.strength || 0.5
              const isHighlighted = connectedIds && (connectedIds.has(e.from) && connectedIds.has(e.to))
              const isDimmed = connectedIds && !isHighlighted
              const baseColor = e.type === 'blocks' ? CORAL : e.type === 'requires' ? AMBER : 'rgba(255,255,255,0.5)'
              const width = e.type === 'blocks' ? 0.8 + s * 2 : 0.3 + s * 2
              const baseOpacity = 0.1 + s * 0.4
              return (
                <line
                  key={`edge-${i}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={baseColor}
                  strokeWidth={width}
                  strokeDasharray={e.type === 'blocks' ? '4 3' : 'none'}
                  opacity={isDimmed ? 0.03 : isHighlighted ? 0.6 + s * 0.4 : baseOpacity}
                  strokeLinecap="round"
                />
              )
            })}

            {/* Animated pulses on strong edges (strength >= 0.8) */}
            {filteredEdges.filter(e => (e.strength || 0.5) >= 0.8 && e.type !== 'blocks').map((e, i) => {
              const a = simNodes.find(n => n.id === e.from)
              const b = simNodes.find(n => n.id === e.to)
              if (!a || !b) return null
              const isHighlighted = connectedIds && (connectedIds.has(e.from) && connectedIds.has(e.to))
              const isDimmed = connectedIds && !isHighlighted
              if (isDimmed) return null
              const color = e.type === 'requires' ? AMBER : TEAL
              const dur = 2 + (i % 5) * 0.7
              return (
                <circle key={`pulse-${i}`} r={2} fill={color} opacity={isHighlighted ? 0.7 : 0.3}>
                  <animateMotion
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                    path={`M${a.x},${a.y} L${b.x},${b.y}`}
                  />
                </circle>
              )
            })}

            {/* Nodes */}
            {filteredNodes.map(node => {
              const nt = NODE_TYPES[node.type]
              const isSelected = selectedNode === node.id
              const isConnected = connectedIds?.has(node.id)
              const isDimmedBySelection = connectedIds && !isConnected

              // Analysis highlighting
              const isAnalyzed = analysisIds?.has(node.id)
              const isDirect = directIds?.has(node.id)
              const isDimmedByAnalysis = analysisIds && !isAnalyzed
              const isDimmed = isDimmedBySelection || isDimmedByAnalysis
              const analysisInfo = analysisMap[node.id]

              const isHovered = hoveredNode === node.id
              const baseSize = isAnalyzed ? (isDirect ? 1.3 : 1.1) : 1
              const r = (nt.size / 2) * (isSelected ? 1.3 : isHovered ? 1.15 : baseSize)

              // Color override for analysis
              const nodeColor = isAnalyzed ? (isDirect ? TEAL : PLUM) : nt.color

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer', opacity: isDimmed ? 0.1 : 1, transition: 'opacity 0.3s' }}
                >
                  {/* Analysis glow — larger for direct connections */}
                  {isAnalyzed && (
                    <circle cx={node.x} cy={node.y} r={r + (isDirect ? 14 : 8)} fill={isDirect ? TEAL : PLUM} opacity={isDirect ? 0.2 : 0.1}>
                      {isDirect && <animate attributeName="opacity" values="0.2;0.08;0.2" dur="2s" repeatCount="indefinite" />}
                    </circle>
                  )}
                  {/* Selection/hover glow */}
                  {(isSelected || isHovered) && !isAnalyzed && (
                    <circle cx={node.x} cy={node.y} r={r + 8} fill={nt.color} opacity={0.15} />
                  )}
                  {/* Node */}
                  <circle
                    cx={node.x} cy={node.y} r={r}
                    fill={nodeColor + (node.type === 'misconception' ? '40' : isAnalyzed ? '80' : '60')}
                    stroke={nodeColor}
                    strokeWidth={isSelected || isAnalyzed ? 2 : 1}
                  />
                  {/* Direct/Indirect badge */}
                  {isAnalyzed && (
                    <text
                      x={node.x} y={node.y + 3}
                      textAnchor="middle" fill="white" fontSize="6" fontWeight="800" fontFamily="sans-serif"
                    >
                      {isDirect ? 'D' : 'I'}
                    </text>
                  )}
                  {/* Label */}
                  {node.label.split('\n').map((line, li) => (
                    <text
                      key={li}
                      x={node.x}
                      y={node.y + r + 10 + li * 10}
                      textAnchor="middle"
                      fill={isAnalyzed ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)'}
                      fontSize={node.type === 'core' ? 8 : 7}
                      fontWeight={node.type === 'core' || isAnalyzed ? 700 : 400}
                      fontFamily="sans-serif"
                    >
                      {line}
                    </text>
                  ))}
                  {/* Hover tooltip with analysis description */}
                  {isHovered && analysisInfo && (
                    <foreignObject
                      x={node.x + r + 6} y={node.y - 20}
                      width={180} height={60}
                      style={{ pointerEvents: 'none', overflow: 'visible' }}
                    >
                      <div style={{
                        background: 'rgba(12,31,63,0.95)',
                        border: `1px solid ${isDirect ? TEAL : PLUM}`,
                        borderRadius: 6,
                        padding: '5px 8px',
                        backdropFilter: 'blur(8px)',
                      }}>
                        <p style={{ color: isDirect ? TEAL : PLUM, fontSize: 8, fontWeight: 700, marginBottom: 2 }}>
                          {isDirect ? 'DIRECT' : 'INDIRECT'}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 9, lineHeight: 1.3 }}>
                          {analysisInfo.description}
                        </p>
                      </div>
                    </foreignObject>
                  )}
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
          <div className="absolute bottom-3 right-3 flex gap-4">
            <div className="flex items-center gap-1.5">
              <svg width="24" height="6"><line x1="0" y1="3" x2="24" y2="3" stroke={AMBER} strokeWidth="2.5" /></svg>
              <span className="text-white/40" style={{ fontSize: 9 }}>requires (strong)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="24" height="6"><line x1="0" y1="3" x2="24" y2="3" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" /></svg>
              <span className="text-white/40" style={{ fontSize: 9 }}>supports (weak)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="24" height="6"><line x1="0" y1="3" x2="24" y2="3" stroke={CORAL} strokeWidth="2" strokeDasharray="4 3" /></svg>
              <span className="text-white/40" style={{ fontSize: 9 }}>blocks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="24" height="6"><circle cx="4" cy="3" r="2" fill={TEAL} opacity="0.6"><animate attributeName="cx" values="4;20;4" dur="2s" repeatCount="indefinite" /></circle></svg>
              <span className="text-white/40" style={{ fontSize: 9 }}>pulse = strong</span>
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
                        className="text-xs px-3 py-1.5 rounded-full border hover:opacity-80 transition-opacity flex items-center gap-1.5"
                        style={{
                          borderColor: e.type === 'blocks' ? CORAL + '40' : WARM_BORDER,
                          color: e.type === 'blocks' ? CORAL : NAVY,
                          backgroundColor: e.type === 'blocks' ? CORAL + '08' : 'white',
                          borderWidth: (e.strength || 0.5) >= 0.8 ? 2 : 1,
                        }}
                      >
                        {direction} {other?.label.replace('\n', ' ')}
                        <span className="opacity-50">({e.type})</span>
                        <span style={{
                          display: 'inline-block',
                          width: 6 + (e.strength || 0.5) * 20,
                          height: 3,
                          borderRadius: 2,
                          backgroundColor: e.type === 'blocks' ? CORAL : (e.strength || 0.5) >= 0.8 ? TEAL : '#ccc',
                          opacity: 0.4 + (e.strength || 0.5) * 0.6,
                        }} />
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

      {/* Sources */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-center" style={{ color: NAVY }}>Sources & Foundational Works</h2>

        {[
          {
            branch: 'Core Textbooks',
            color: NAVY,
            sources: [
              'DeVito, J.A. — The Interpersonal Communication Book (Pearson, 16th ed.)',
              'Adler, R.B. & Proctor, R.F. — Looking Out, Looking In (Cengage, 16th ed.)',
              'Wood, J.T. — Communication in Our Lives (Cengage, 9th ed.)',
              'Floyd, K. — Communication Matters (McGraw-Hill, 4th ed.)',
            ],
          },
          {
            branch: 'Verbal Communication',
            color: TEAL,
            sources: [
              'Hayakawa, S.I. — Language in Thought and Action (1949, Harcourt). Abstraction, semantics.',
              'Tannen, D. — You Just Don\'t Understand (1990, William Morrow). Conversational styles, gender.',
              'Aristotle — Rhetoric. Ethos, pathos, logos — the original persuasion framework.',
            ],
          },
          {
            branch: 'Nonverbal Communication',
            color: TEAL,
            sources: [
              'Mehrabian, A. — Silent Messages (1971, Wadsworth). The 7-38-55 rule.',
              'Hall, E.T. — The Hidden Dimension (1966, Doubleday). Proxemics. The Silent Language (1959). Chronemics.',
              'Ekman, P. — Emotions Revealed (2003, Holt). Facial expressions, universal vs. cultural.',
              'Knapp, M.L. & Hall, J.A. — Nonverbal Communication in Human Interaction (Cengage, 8th ed.).',
            ],
          },
          {
            branch: 'Language',
            color: TEAL,
            sources: [
              'Sapir, E. (1929) & Whorf, B.L. (1956) — Linguistic relativity hypothesis.',
              'Lakoff, R. — Language and Woman\'s Place (1975, Harper). Language and power.',
              'Pinker, S. — The Language Instinct (1994, William Morrow). Language in the brain.',
              'Ogden, C.K. & Richards, I.A. — The Meaning of Meaning (1923). Semantic triangle — denotation/connotation.',
            ],
          },
          {
            branch: 'Interpersonal Communication',
            color: GREEN,
            sources: [
              'Knapp, M.L. & Vangelisti, A.L. — Interpersonal Communication and Human Relationships (Pearson, 8th ed.). Relationship stages.',
              'Jourard, S.M. — The Transparent Self (1971). Self-disclosure theory.',
              'Altman, I. & Taylor, D. — Social Penetration Theory (1973). The onion model.',
              'Rogers, C. — On Becoming a Person (1961, Houghton Mifflin). Active listening, empathy.',
              'Gottman, J. — The Science of Trust (2011, W.W. Norton). Conflict resolution.',
              'Fisher, R. & Ury, W. — Getting to Yes (1981, Penguin). Interest-based negotiation.',
            ],
          },
          {
            branch: 'Intrapersonal Communication',
            color: PLUM,
            sources: [
              'Cooley, C.H. — Human Nature and the Social Order (1902). The "looking glass self."',
              'Mead, G.H. — Mind, Self, and Society (1934, U of Chicago Press). The "I" and "me."',
              'Kahneman, D. — Thinking, Fast and Slow (2011, Farrar Straus). Cognitive biases.',
              'Goleman, D. — Emotional Intelligence (1995, Bantam).',
              'Kabat-Zinn, J. — Wherever You Go, There You Are (1994, Hyperion). Mindfulness.',
              'Vygotsky, L. — Thought and Language (1934/1962, MIT Press). Inner speech.',
            ],
          },
          {
            branch: 'Written Communication',
            color: CORAL,
            sources: [
              'Strunk, W. & White, E.B. — The Elements of Style (1959, Macmillan). Clarity, brevity.',
              'Elbow, P. — Writing Without Teachers (1973, Oxford). Freewriting, writer\'s voice.',
              'Flower, L. & Hayes, J.R. — "A Cognitive Process Theory of Writing" (1981, College Composition and Communication). Revision as cognition.',
              'Toulmin, S. — The Uses of Argument (1958, Cambridge UP). Claim, evidence, warrant.',
              'Lunsford, A. — The St. Martin\'s Handbook (Bedford/St. Martin\'s, 10th ed.).',
              'Swales, J. — Genre Analysis (1990, Cambridge UP). Genre conventions.',
              'Baron, N.S. — Always On (2008, Oxford). Digital writing, social media norms.',
            ],
          },
          {
            branch: 'Cross-Connections & Theory',
            color: PLUM,
            sources: [
              'Hall, E.T. — Beyond Culture (1976, Anchor). High-context vs. low-context.',
              'Shannon, C. & Weaver, W. — The Mathematical Theory of Communication (1949, U of Illinois Press). Noise/barriers model.',
              'McLuhan, M. — Understanding Media (1964, McGraw-Hill). "The medium is the message."',
              'Barrett, L.F. — How Emotions Are Made (2017, Houghton Mifflin). Challenges Ekman\'s universality.',
              'Hartwell, P. — "Grammar, Grammars, and the Teaching of Grammar" (1985, College English). Grammar instruction doesn\'t improve writing.',
            ],
          },
        ].map(section => (
          <div key={section.branch} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: section.color }} />
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: section.color }}>{section.branch}</h3>
            </div>
            <div className="rounded-lg border bg-white p-4" style={{ borderColor: WARM_BORDER }}>
              {section.sources.map((src, i) => (
                <p key={i} className="text-xs leading-relaxed mb-1.5 last:mb-0" style={{ color: MUTED }}>
                  {src}
                </p>
              ))}
            </div>
          </div>
        ))}
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
