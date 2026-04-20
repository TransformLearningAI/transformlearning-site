'use client'
import { useState, useEffect, useMemo } from 'react'
import { proficiencyColor, proficiencyLabel, isAtRisk } from '@/lib/utils/proficiency'

// Deterministic position from skill ID — stable across renders
function hashPosition(id, index, total) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  const angle = (index / total) * Math.PI * 2 + (hash % 100) * 0.01
  const radius = 0.28 + (Math.abs(hash % 50) / 50) * 0.18
  return {
    x: 0.5 + Math.cos(angle) * radius,
    y: 0.5 + Math.sin(angle) * radius,
  }
}

function computeSignal(skills, scoreMap, history) {
  // Find the most actionable insight
  const sorted = [...skills].sort((a, b) => (scoreMap[a.id]?.score ?? -1) - (scoreMap[b.id]?.score ?? -1))
  const weakest = sorted[0]
  if (!weakest) return { message: 'Select a skill to measure. See where you actually stand.', urgency: 'calm' }

  const ws = scoreMap[weakest.id]?.score ?? 0
  const daysSince = history.length > 0
    ? Math.floor((Date.now() - new Date(history[0]?.created_at || history[0]?.scored_at).getTime()) / 86400000)
    : null

  if (daysSince !== null && daysSince > 3) {
    return { message: `${daysSince} days since your last session. Your momentum is cooling.`, skillId: weakest.id, urgency: 'attentive' }
  }

  if (ws === 0) {
    return { message: `${weakest.name} is uncharted territory. Start here.`, skillId: weakest.id, urgency: 'calm' }
  }

  const toNext = ws < 40 ? 40 - ws : ws < 80 ? 80 - ws : 0
  if (toNext > 0) {
    const label = ws < 40 ? 'emerging' : 'proficiency'
    return { message: `${toNext} points to ${label} in ${weakest.name}.`, skillId: weakest.id, urgency: ws < 20 ? 'attentive' : 'calm' }
  }

  return { message: 'All skills on track. Keep going.', urgency: 'calm' }
}

function computePulse(history) {
  const now = Date.now()
  const week = 7 * 86400000
  const recent = history.filter(h => now - new Date(h.created_at || h.scored_at).getTime() < week).length
  const prior = history.filter(h => {
    const t = now - new Date(h.created_at || h.scored_at).getTime()
    return t >= week && t < week * 2
  }).length

  const momentum = Math.min(1, recent / 5) // 5 interactions/week = full momentum
  const trend = recent > prior ? 'rising' : recent === prior ? 'steady' : 'cooling'

  return { momentum, trend, recentCount: recent, daysSinceLastActivity: history.length > 0
    ? Math.floor((now - new Date(history[0]?.created_at || history[0]?.scored_at).getTime()) / 86400000) : null }
}

export default function useWayfinding(enrollmentId) {
  const [enrollment, setEnrollment] = useState(null)
  const [scores, setScores] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!enrollmentId) return
    Promise.all([
      fetch(`/api/enrollments/${enrollmentId}`).then(r => r.json()),
      fetch(`/api/proficiency?enrollmentId=${enrollmentId}`).then(r => r.json()),
    ]).then(([e, p]) => {
      setEnrollment(e)
      setScores(p.scores || [])
      setHistory((p.history || []).sort((a, b) => new Date(b.created_at || b.scored_at) - new Date(a.created_at || a.scored_at)))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [enrollmentId])

  const derived = useMemo(() => {
    if (!enrollment) return null

    const skills = enrollment?.courses?.skills?.filter(s => s.is_approved) || []
    const scoreMap = Object.fromEntries(scores.map(s => [s.skill_id, s]))

    // Terrain nodes
    const terrainNodes = skills.map((skill, i) => {
      const ps = scoreMap[skill.id]
      const score = ps?.score ?? 0
      const status = score >= 80 ? 'explored' : score >= 40 ? 'emerging' : 'uncharted'
      const pos = hashPosition(skill.id, i, skills.length)
      return { skill, score, confidence: ps?.confidence, evidenceSummary: ps?.evidence_summary, status, position: pos }
    })

    // Signal
    const signal = computeSignal(skills, scoreMap, history)

    // Pulse
    const pulse = computePulse(history)

    // Pain points — 3 weakest
    const painPoints = [...terrainNodes]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)

    // Activity events
    const activityEvents = history.map(h => {
      const skill = skills.find(s => s.id === h.skill_id)
      return {
        type: h.source || 'quiz',
        skillName: skill?.name || 'Assessment',
        skillType: skill?.skill_type,
        score: h.score,
        confidence: h.confidence,
        timestamp: h.created_at || h.scored_at,
      }
    })

    // Milestones — check localStorage for mastery threshold crossings
    const milestones = []
    if (typeof window !== 'undefined') {
      const prev = JSON.parse(localStorage.getItem('mastery_scores') || '{}')
      terrainNodes.forEach(n => {
        if (n.score >= 80 && (prev[n.skill.id] ?? 0) < 80) {
          milestones.push({ skill: n.skill, previousScore: prev[n.skill.id] ?? 0, newScore: n.score })
        }
      })
      // Save current scores
      const current = {}
      terrainNodes.forEach(n => { current[n.skill.id] = n.score })
      localStorage.setItem('mastery_scores', JSON.stringify(current))
    }

    return {
      skills, scoreMap, terrainNodes, signal, pulse, painPoints, activityEvents, milestones,
      courseName: enrollment?.courses?.title,
      courseCode: enrollment?.courses?.course_code,
      term: enrollment?.courses?.term,
    }
  }, [enrollment, scores, history])

  return { ...derived, loading, enrollmentId }
}
