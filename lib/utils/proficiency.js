export function proficiencyLabel(score) {
  if (score === null || score === undefined) return 'Not assessed'
  if (score >= 86) return 'Expert'
  if (score >= 71) return 'Proficient'
  if (score >= 51) return 'Developing'
  if (score >= 31) return 'Emerging'
  return 'Novice'
}

export function proficiencyColor(score) {
  if (score === null || score === undefined) return '#9CA3AF'
  if (score >= 86) return '#4F8A5B'
  if (score >= 71) return '#00A8A8'
  if (score >= 51) return '#5A3E6B'
  if (score >= 31) return '#FF6B4A'
  return '#EF4444'
}

export function proficiencyBg(score) {
  if (score === null || score === undefined) return 'rgba(156,163,175,0.1)'
  if (score >= 86) return 'rgba(79,138,91,0.1)'
  if (score >= 71) return 'rgba(0,168,168,0.1)'
  if (score >= 51) return 'rgba(90,62,107,0.1)'
  if (score >= 31) return 'rgba(255,107,74,0.1)'
  return 'rgba(239,68,68,0.1)'
}

export function isAtRisk(score) {
  return score !== null && score < 51
}

export function overallScore(scores) {
  if (!scores || scores.length === 0) return null
  const valid = scores.filter(s => s.score !== null)
  if (valid.length === 0) return null
  return Math.round(valid.reduce((sum, s) => sum + s.score, 0) / valid.length)
}
