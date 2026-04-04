/**
 * Arrival Proficiency Scoring Engine
 *
 * A multi-source, trajectory-aware scoring system that combines
 * evidence from quizzes, work uploads, and coaching signals into
 * a single proficiency estimate with confidence intervals.
 *
 * This replaces simple point estimates with a richer model:
 *   - Multiple evidence sources weighted by reliability
 *   - Trajectory analysis detecting genuine learning vs noise
 *   - Confidence intervals (lower, estimate, upper)
 *   - Fairness checks across demographic groups
 */

// ═══════════════════════════════════════════
// 1. MULTI-SOURCE EVIDENCE WEIGHTING
// ═══════════════════════════════════════════

/**
 * Evidence source weights — how much each type contributes to
 * the final proficiency estimate.
 *
 * Quiz scores are most reliable (structured, controlled).
 * Work uploads show applied mastery but are harder to score.
 * Coaching signals are weakest — engagement ≠ mastery.
 */
const SOURCE_WEIGHTS = {
  quiz: 1.0,        // Full weight — controlled assessment
  assessment: 1.0,  // Same as quiz (initial assessment)
  upload: 0.75,     // Applied evidence — strong but noisier
  coaching: 0.35,   // Engagement signal — weakest evidence
}

/**
 * Confidence multipliers — how much a single data point from
 * each source contributes to overall confidence.
 */
const CONFIDENCE_PER_OBSERVATION = {
  quiz: 0.15,       // Each quiz adds 15% toward full confidence
  assessment: 0.20, // Initial assessment is broader
  upload: 0.25,     // Uploads are rich evidence
  coaching: 0.05,   // Coaching is weak signal
}

/**
 * Compute a weighted proficiency score from multiple evidence sources.
 *
 * @param {Array} observations - Array of { score, source, timestamp }
 * @returns {{ score, confidence, sourceBreakdown }}
 */
export function computeWeightedScore(observations) {
  if (!observations || observations.length === 0) {
    return { score: 0, confidence: 0, sourceBreakdown: {} }
  }

  let weightedSum = 0
  let totalWeight = 0
  let rawConfidence = 0
  const breakdown = {}

  for (const obs of observations) {
    const weight = SOURCE_WEIGHTS[obs.source] || 0.5
    // Recent observations count more — decay by age
    const ageMs = Date.now() - new Date(obs.timestamp || obs.scored_at || obs.created_at).getTime()
    const ageDays = ageMs / (1000 * 60 * 60 * 24)
    const recencyWeight = Math.max(0.3, 1 - ageDays * 0.01) // Slow decay over 70 days

    const effectiveWeight = weight * recencyWeight
    weightedSum += obs.score * effectiveWeight
    totalWeight += effectiveWeight

    // Accumulate confidence
    rawConfidence += CONFIDENCE_PER_OBSERVATION[obs.source] || 0.1

    // Track per-source breakdown
    if (!breakdown[obs.source]) breakdown[obs.source] = { count: 0, avgScore: 0, totalScore: 0 }
    breakdown[obs.source].count++
    breakdown[obs.source].totalScore += obs.score
  }

  // Finalize breakdown averages
  for (const src of Object.keys(breakdown)) {
    breakdown[src].avgScore = Math.round(breakdown[src].totalScore / breakdown[src].count)
  }

  const score = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0
  const confidence = Math.min(1, rawConfidence) // Cap at 1.0

  return { score, confidence: Math.round(confidence * 1000) / 1000, sourceBreakdown: breakdown }
}


// ═══════════════════════════════════════════
// 2. TRAJECTORY ANALYSIS
// ═══════════════════════════════════════════

/**
 * Analyze score trajectory to detect genuine learning vs noise.
 *
 * Looks at the sequence of scores over time and computes:
 *   - velocity: rate of change (positive = learning)
 *   - consistency: how stable the improvement is
 *   - isGenuine: true if improvement looks sustained, not lucky
 *   - anomalies: sudden jumps that might be noise
 *
 * @param {Array} history - Sorted array of { score, timestamp }
 * @returns {{ velocity, consistency, isGenuine, anomalies, trend }}
 */
export function analyzeTrajectory(history) {
  if (!history || history.length < 2) {
    return {
      velocity: 0,
      consistency: 0,
      isGenuine: false,
      anomalies: [],
      trend: 'insufficient_data',
      description: 'Need at least 2 data points to analyze trajectory.',
    }
  }

  // Sort by time ascending
  const sorted = [...history].sort((a, b) =>
    new Date(a.timestamp || a.scored_at || a.created_at) - new Date(b.timestamp || b.scored_at || b.created_at)
  )

  // Compute deltas between consecutive scores
  const deltas = []
  for (let i = 1; i < sorted.length; i++) {
    const delta = sorted[i].score - sorted[i - 1].score
    const timeDiff = (new Date(sorted[i].timestamp || sorted[i].scored_at || sorted[i].created_at) -
      new Date(sorted[i - 1].timestamp || sorted[i - 1].scored_at || sorted[i - 1].created_at)) / (1000 * 60 * 60 * 24) || 1
    deltas.push({ delta, perDay: delta / timeDiff, index: i })
  }

  // Velocity: average score change per observation
  const velocity = Math.round((deltas.reduce((a, d) => a + d.delta, 0) / deltas.length) * 10) / 10

  // Consistency: what % of deltas are in the same direction as overall trend
  const positiveDeltas = deltas.filter(d => d.delta > 0).length
  const negativeDeltas = deltas.filter(d => d.delta < 0).length
  const consistency = Math.round((Math.max(positiveDeltas, negativeDeltas) / deltas.length) * 100) / 100

  // Anomaly detection: any single jump > 30 points
  const anomalies = deltas
    .filter(d => Math.abs(d.delta) > 30)
    .map(d => ({
      fromScore: sorted[d.index - 1].score,
      toScore: sorted[d.index].score,
      delta: d.delta,
      suspicious: d.delta > 30, // Large positive jump is suspicious
    }))

  // Genuine learning: sustained improvement with consistency > 0.6 and no suspicious anomalies
  const suspiciousAnomalies = anomalies.filter(a => a.suspicious)
  const isGenuine = velocity > 0 && consistency >= 0.6 && suspiciousAnomalies.length === 0

  // Trend classification
  let trend = 'stable'
  if (velocity > 5) trend = 'accelerating'
  else if (velocity > 1) trend = 'improving'
  else if (velocity < -5) trend = 'declining'
  else if (velocity < -1) trend = 'slipping'

  // Human-readable description
  const descriptions = {
    accelerating: `Strong upward trajectory. Gaining ${velocity} points per assessment. Learning appears genuine and sustained.`,
    improving: `Steady improvement. Gaining ${velocity} points per assessment. ${consistency >= 0.7 ? 'Consistent progress.' : 'Some variability in scores.'}`,
    stable: `Scores are stable. ${velocity >= 0 ? 'No significant growth detected.' : 'Slight decline detected.'} May need a different approach.`,
    slipping: `Scores are declining by ${Math.abs(velocity)} points per assessment. Intervention recommended.`,
    declining: `Significant decline. Losing ${Math.abs(velocity)} points per assessment. Immediate support needed.`,
    insufficient_data: 'Need more data points.',
  }

  return {
    velocity,
    consistency,
    isGenuine,
    anomalies,
    trend,
    description: descriptions[trend],
    dataPoints: sorted.length,
    firstScore: sorted[0].score,
    lastScore: sorted[sorted.length - 1].score,
    totalGain: sorted[sorted.length - 1].score - sorted[0].score,
  }
}


// ═══════════════════════════════════════════
// 3. CONFIDENCE INTERVALS
// ═══════════════════════════════════════════

/**
 * Compute confidence interval for a proficiency estimate.
 *
 * Instead of "you're at 72%", we say "you're at 72% (65–79)".
 * Width of the interval depends on:
 *   - Number of observations (more = narrower)
 *   - Consistency of scores (consistent = narrower)
 *   - Source quality (quizzes = narrower than coaching)
 *
 * Uses a simplified Bayesian approach rather than frequentist CI.
 *
 * @param {number} score - Point estimate (0-100)
 * @param {number} confidence - 0-1 confidence from evidence
 * @param {Array} observations - Raw score observations
 * @returns {{ lower, estimate, upper, width, reliability }}
 */
export function computeConfidenceInterval(score, confidence, observations = []) {
  if (!observations.length) {
    return { lower: 0, estimate: score, upper: 100, width: 100, reliability: 'none' }
  }

  // Base half-width: starts at 25, narrows with more data
  const observationFactor = Math.min(1, observations.length / 8) // 8 observations = minimum width
  const baseHalfWidth = 25 * (1 - observationFactor * 0.7) // Narrows from 25 to 7.5

  // Variance factor: inconsistent scores = wider interval
  const scores = observations.map(o => o.score)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length
  const stdDev = Math.sqrt(variance)
  const varianceFactor = 1 + (stdDev / 50) // Higher variance = wider

  // Source quality factor: more quiz data = narrower
  const quizCount = observations.filter(o => o.source === 'quiz' || o.source === 'assessment').length
  const qualityFactor = quizCount >= 3 ? 0.8 : 1.0

  const halfWidth = Math.round(baseHalfWidth * varianceFactor * qualityFactor)

  const lower = Math.max(0, score - halfWidth)
  const upper = Math.min(100, score + halfWidth)

  // Reliability label
  let reliability = 'low'
  if (confidence >= 0.8 && halfWidth <= 10) reliability = 'high'
  else if (confidence >= 0.5 && halfWidth <= 18) reliability = 'moderate'

  return {
    lower,
    estimate: score,
    upper,
    width: upper - lower,
    reliability,
  }
}


// ═══════════════════════════════════════════
// 4. FAIRNESS COMPUTATION
// ═══════════════════════════════════════════

/**
 * Compute equalized odds fairness metric across groups.
 *
 * Checks whether AI scoring produces similar score distributions
 * across different groups (e.g., by institution, by enrollment date).
 *
 * Returns a fairness score (0 = perfect fairness, 1 = extreme bias).
 * The governance engine uses ε = 0.10 as the threshold.
 *
 * Since we don't collect race/gender data (by design — privacy first),
 * we use proxy groupings: enrollment cohort, institution, XP level.
 *
 * @param {Array} allScores - All scores with enrollment_id
 * @param {Array} enrollments - Enrollment data with student profiles
 * @returns {{ fairnessScore, groupComparison, compliant, description }}
 */
export function computeFairness(allScores, enrollments) {
  if (!allScores || allScores.length < 10 || !enrollments || enrollments.length < 4) {
    return {
      fairnessScore: 0,
      groupComparison: null,
      compliant: true,
      description: 'Insufficient data for fairness analysis (need ≥10 scores, ≥4 students).',
    }
  }

  // Group students by enrollment order (early vs late enrollees as proxy)
  const sorted = [...enrollments].sort((a, b) =>
    new Date(a.enrolled_at) - new Date(b.enrolled_at)
  )
  const midpoint = Math.floor(sorted.length / 2)
  const groupA = new Set(sorted.slice(0, midpoint).map(e => e.id)) // Early enrollees
  const groupB = new Set(sorted.slice(midpoint).map(e => e.id))    // Late enrollees

  // Compute average scores per group
  const scoresA = allScores.filter(s => groupA.has(s.enrollment_id))
  const scoresB = allScores.filter(s => groupB.has(s.enrollment_id))

  if (scoresA.length === 0 || scoresB.length === 0) {
    return { fairnessScore: 0, groupComparison: null, compliant: true, description: 'One group has no scores.' }
  }

  const avgA = scoresA.reduce((a, s) => a + s.score, 0) / scoresA.length
  const avgB = scoresB.reduce((a, s) => a + s.score, 0) / scoresB.length

  // Compute pass rates (score >= 70 = "pass")
  const passRateA = scoresA.filter(s => s.score >= 70).length / scoresA.length
  const passRateB = scoresB.filter(s => s.score >= 70).length / scoresB.length

  // Equalized odds: difference in pass rates between groups
  const fairnessScore = Math.round(Math.abs(passRateA - passRateB) * 1000) / 1000

  const compliant = fairnessScore <= 0.10 // ε threshold

  return {
    fairnessScore,
    groupComparison: {
      groupA: { label: 'Early enrollees', count: groupA.size, avgScore: Math.round(avgA), passRate: Math.round(passRateA * 100) },
      groupB: { label: 'Late enrollees', count: groupB.size, avgScore: Math.round(avgB), passRate: Math.round(passRateB * 100) },
    },
    compliant,
    description: compliant
      ? `Fairness check passed (${fairnessScore} ≤ 0.10). Score distributions are equitable across enrollment cohorts.`
      : `Fairness violation detected (${fairnessScore} > 0.10). Pass rate differs by ${Math.round(fairnessScore * 100)}% between early and late enrollees. Flagged for review.`,
  }
}


// ═══════════════════════════════════════════
// 5. FULL SCORING PIPELINE
// ═══════════════════════════════════════════

/**
 * Run the complete scoring pipeline for a student-skill pair.
 *
 * Combines all four improvements:
 *   1. Multi-source weighted scoring
 *   2. Trajectory analysis
 *   3. Confidence intervals
 *   4. Fairness check (at cohort level)
 *
 * @param {Object} params
 * @returns {Object} Complete proficiency assessment
 */
export function computeProficiency({ observations, history, allCohortScores, enrollments }) {
  // 1. Weighted score from all evidence sources
  const weighted = computeWeightedScore(observations)

  // 2. Trajectory analysis from history
  const trajectory = analyzeTrajectory(history)

  // 3. Confidence interval
  const interval = computeConfidenceInterval(weighted.score, weighted.confidence, observations)

  // 4. Fairness (cohort level — optional)
  const fairness = allCohortScores && enrollments
    ? computeFairness(allCohortScores, enrollments)
    : { fairnessScore: 0, compliant: true, description: 'Cohort data not provided.' }

  // Adjusted score: if trajectory shows genuine learning, boost slightly
  // If anomalies detected, apply a dampening factor
  let adjustedScore = weighted.score
  if (trajectory.isGenuine && trajectory.velocity > 3) {
    adjustedScore = Math.min(100, adjustedScore + Math.round(trajectory.velocity * 0.5))
  }
  if (trajectory.anomalies.some(a => a.suspicious)) {
    adjustedScore = Math.round(adjustedScore * 0.95) // 5% dampening for suspicious jumps
  }

  return {
    score: adjustedScore,
    rawScore: weighted.score,
    confidence: weighted.confidence,
    interval,
    trajectory,
    fairness,
    sourceBreakdown: weighted.sourceBreakdown,
    governed: true,
    timestamp: new Date().toISOString(),
  }
}
