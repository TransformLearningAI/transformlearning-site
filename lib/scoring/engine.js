/**
 * Transform Learning Proficiency Scoring Engine
 *
 * A multi-source, trajectory-aware scoring system that combines
 * evidence from quizzes, work uploads, and coaching signals into
 * a single proficiency estimate with confidence intervals.
 *
 * Key accuracy properties:
 *   - Source-normalized weighting (prevents count imbalance across sources)
 *   - Exponential recency decay (45-day half-life)
 *   - Diminishing-returns confidence accumulation
 *   - Exponentially-weighted trajectory velocity (recent changes prioritized)
 *   - Adaptive anomaly detection (2σ, not fixed threshold)
 *   - Standard-error-based confidence intervals with t-correction
 *   - Genuineness-scaled trajectory adjustments
 */

// ═══════════════════════════════════════════
// 1. MULTI-SOURCE EVIDENCE WEIGHTING
// ═══════════════════════════════════════════

/**
 * Evidence source weights — how much each type contributes to
 * the final proficiency estimate.
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

/** Half-life for exponential recency decay (in days) */
const RECENCY_HALF_LIFE = 45

/**
 * Compute a weighted proficiency score from multiple evidence sources.
 *
 * Two-phase approach for accuracy:
 *   Phase 1 — Within each source, compute a recency-weighted average.
 *             This prevents source count imbalance (10 coaching signals
 *             no longer overwhelm 1 quiz).
 *   Phase 2 — Combine per-source averages using source reliability weights.
 *
 * Recency uses exponential decay (half-life: 45 days) instead of linear,
 * so recent observations dominate naturally without a hard cutoff.
 *
 * @param {Array} observations - Array of { score, source, timestamp }
 * @returns {{ score, confidence, sourceBreakdown }}
 */
export function computeWeightedScore(observations) {
  if (!observations || observations.length === 0) {
    return { score: 0, confidence: 0, sourceBreakdown: {} }
  }

  // Phase 1: Group by source, compute recency-weighted average per source
  const bySource = {}
  for (const obs of observations) {
    const src = obs.source || 'quiz'
    if (!bySource[src]) bySource[src] = []
    bySource[src].push(obs)
  }

  const sourceAverages = {}
  const breakdown = {}

  for (const [src, obs] of Object.entries(bySource)) {
    let weightedSum = 0
    let totalWeight = 0

    for (const o of obs) {
      const ageMs = Date.now() - new Date(o.timestamp || o.scored_at || o.created_at).getTime()
      const ageDays = Math.max(0, ageMs / (1000 * 60 * 60 * 24))
      // Exponential decay: weight halves every RECENCY_HALF_LIFE days
      const recencyWeight = Math.pow(2, -ageDays / RECENCY_HALF_LIFE)

      weightedSum += o.score * recencyWeight
      totalWeight += recencyWeight
    }

    sourceAverages[src] = totalWeight > 0 ? weightedSum / totalWeight : 0

    breakdown[src] = {
      count: obs.length,
      avgScore: Math.round(obs.reduce((a, o) => a + o.score, 0) / obs.length),
      weightedScore: Math.round(sourceAverages[src]),
    }
  }

  // Phase 2: Combine per-source averages by reliability weight
  let finalSum = 0
  let finalWeight = 0

  for (const [src, avg] of Object.entries(sourceAverages)) {
    const w = SOURCE_WEIGHTS[src] || 0.5
    finalSum += avg * w
    finalWeight += w
  }

  const score = finalWeight > 0 ? Math.round(finalSum / finalWeight) : 0

  // Confidence: diminishing returns via geometric accumulation
  // P(confident from source) = 1 - (1 - perObs)^n
  let rawConfidence = 0
  for (const [src, obs] of Object.entries(bySource)) {
    const perObs = CONFIDENCE_PER_OBSERVATION[src] || 0.1
    const sourceConf = 1 - Math.pow(1 - perObs, obs.length)
    rawConfidence += sourceConf * (SOURCE_WEIGHTS[src] || 0.5)
  }
  const confidence = Math.min(1, rawConfidence)

  return { score, confidence: Math.round(confidence * 1000) / 1000, sourceBreakdown: breakdown }
}


// ═══════════════════════════════════════════
// 2. TRAJECTORY ANALYSIS
// ═══════════════════════════════════════════

/**
 * Analyze score trajectory to detect genuine learning vs noise.
 *
 * Improvements over naive approach:
 *   - Exponentially-weighted velocity: recent deltas weighted 1/0.7/0.49/…
 *     so a student who was declining but recently improved is detected
 *   - Adaptive anomaly threshold: 2σ from mean delta (min 20 points)
 *     instead of a fixed 30-point cutoff
 *   - Continuous genuineness score (0–1) replacing binary isGenuine
 *
 * @param {Array} history - Sorted array of { score, timestamp }
 * @returns {{ velocity, consistency, genuineness, isGenuine, anomalies, trend }}
 */
export function analyzeTrajectory(history) {
  if (!history || history.length < 2) {
    return {
      velocity: 0,
      consistency: 0,
      genuineness: 0,
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

  // Exponentially-weighted velocity — recent changes carry more weight
  // Decay factor 0.7: each older delta carries 70% of the next one's weight
  const n = deltas.length
  let weightedVelSum = 0
  let velWeightTotal = 0
  for (let i = 0; i < n; i++) {
    const weight = Math.pow(0.7, n - 1 - i)
    weightedVelSum += deltas[i].delta * weight
    velWeightTotal += weight
  }
  const velocity = Math.round((weightedVelSum / velWeightTotal) * 10) / 10

  // Consistency: what % of deltas are in the same direction as overall trend
  const positiveDeltas = deltas.filter(d => d.delta > 0).length
  const negativeDeltas = deltas.filter(d => d.delta < 0).length
  const consistency = Math.round((Math.max(positiveDeltas, negativeDeltas) / deltas.length) * 100) / 100

  // Adaptive anomaly detection: 2σ from mean delta, with minimum threshold
  const meanDelta = deltas.reduce((a, d) => a + d.delta, 0) / deltas.length
  const deltaVariance = deltas.reduce((a, d) => a + Math.pow(d.delta - meanDelta, 2), 0) / deltas.length
  const deltaStdDev = Math.sqrt(deltaVariance)
  const anomalyThreshold = Math.max(20, Math.abs(meanDelta) + 2 * deltaStdDev)

  const anomalies = deltas
    .filter(d => Math.abs(d.delta) > anomalyThreshold)
    .map(d => ({
      fromScore: sorted[d.index - 1].score,
      toScore: sorted[d.index].score,
      delta: d.delta,
      suspicious: d.delta > 0 && d.delta > anomalyThreshold,
    }))

  // Continuous genuineness score (0–1)
  // Combines direction consistency, velocity magnitude, and anomaly penalty
  const suspiciousAnomalies = anomalies.filter(a => a.suspicious)
  const velocityFactor = velocity > 0 ? Math.min(1, velocity / 8) : 0
  const anomalyPenalty = suspiciousAnomalies.length > 0
    ? Math.max(0.2, 1 - suspiciousAnomalies.length * 0.3)
    : 1
  const genuineness = Math.round(consistency * velocityFactor * anomalyPenalty * 100) / 100
  const isGenuine = genuineness >= 0.4

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
    genuineness,
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
 * Uses standard error of the mean with t-distribution correction
 * for small samples, replacing the prior heuristic half-width formula.
 *
 * Width narrows with:
 *   - More observations (√n in denominator of std error)
 *   - Lower score variance (tighter agreement across evidence)
 *   - Higher proportion of reliable sources (quiz/assessment)
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

  const scores = observations.map(o => o.score)
  const n = scores.length
  const mean = scores.reduce((a, b) => a + b, 0) / n

  // Sample variance (Bessel-corrected); fall back to high variance for n=1
  const sampleVariance = n > 1
    ? scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1)
    : 400 // stddev ~20 when we have only one observation
  const stdErr = Math.sqrt(sampleVariance / n)

  // t-values for 90% CI (two-tailed, df = n-1)
  const tTable = [0, 6.314, 2.920, 2.353, 2.132, 2.015, 1.943, 1.895, 1.860, 1.833, 1.812]
  const t = n <= 10 ? (tTable[n] || 1.645) : 1.645

  let halfWidth = Math.ceil(stdErr * t)

  // Source quality: continuous narrowing based on quiz/assessment ratio
  const quizCount = observations.filter(o => o.source === 'quiz' || o.source === 'assessment').length
  const qualityRatio = quizCount / n
  const qualityFactor = 1 - 0.15 * qualityRatio // up to 15% narrower when all high-reliability sources
  halfWidth = Math.max(3, Math.round(halfWidth * qualityFactor))

  // Floor for very small sample sizes
  if (n === 1) halfWidth = Math.max(halfWidth, 15)
  else if (n === 2) halfWidth = Math.max(halfWidth, 10)

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
 * The governance engine uses epsilon = 0.10 as the threshold.
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
      description: 'Insufficient data for fairness analysis (need >=10 scores, >=4 students).',
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

  const compliant = fairnessScore <= 0.10 // epsilon threshold

  return {
    fairnessScore,
    groupComparison: {
      groupA: { label: 'Early enrollees', count: groupA.size, avgScore: Math.round(avgA), passRate: Math.round(passRateA * 100) },
      groupB: { label: 'Late enrollees', count: groupB.size, avgScore: Math.round(avgB), passRate: Math.round(passRateB * 100) },
    },
    compliant,
    description: compliant
      ? `Fairness check passed (${fairnessScore} <= 0.10). Score distributions are equitable across enrollment cohorts.`
      : `Fairness violation detected (${fairnessScore} > 0.10). Pass rate differs by ${Math.round(fairnessScore * 100)}% between early and late enrollees. Flagged for review.`,
  }
}


// ═══════════════════════════════════════════
// 5. FULL SCORING PIPELINE
// ═══════════════════════════════════════════

/**
 * Run the complete scoring pipeline for a student-skill pair.
 *
 * Combines all components:
 *   1. Multi-source weighted scoring (source-normalized, exponential decay)
 *   2. Trajectory analysis (weighted velocity, adaptive anomalies)
 *   3. Confidence intervals (standard-error-based)
 *   4. Fairness check (at cohort level)
 *   5. Trajectory-informed adjustment (genuineness-scaled)
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

  // 5. Trajectory-informed score adjustment
  let adjustedScore = weighted.score

  // Only adjust with sufficient data and meaningful trajectory signal
  if (trajectory.dataPoints >= 3 && trajectory.genuineness > 0) {
    // Scale momentum by genuineness confidence (0–1) and velocity magnitude
    // A genuineness of 0.8 with velocity +6 → adjustment of +1.4 points
    const momentum = trajectory.genuineness * trajectory.velocity * 0.3
    adjustedScore = Math.min(100, Math.max(0, Math.round(adjustedScore + momentum)))
  }

  // Anomaly dampening: only for suspicious positive jumps, proportional to severity
  const suspiciousAnomalies = trajectory.anomalies.filter(a => a.suspicious)
  if (suspiciousAnomalies.length > 0) {
    const maxJump = Math.max(...suspiciousAnomalies.map(a => a.delta))
    // Dampening scales with jump severity: 30pt → ~3%, 60pt → ~6%, capped at 10%
    const dampenFactor = Math.max(0.90, 1 - (maxJump / 1000))
    adjustedScore = Math.round(adjustedScore * dampenFactor)
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
