# Provisional Patent Application Drafts — Arrival / Transform Learning

**CONFIDENTIAL — ATTORNEY-CLIENT PREPARATION MATERIAL**

Prepared by: Jeff Ritter, PhD (inventor)
Date: April 5, 2026
Status: DRAFT for patent attorney review

These are technical descriptions intended to support provisional patent filings. They are not legal documents. A registered patent attorney must review, refine, and file these.

---

## PROVISIONAL PATENT #1: Learning Genuineness Score

### Title
Method and System for Computing a Continuous Genuineness Score to Distinguish Authentic Learning from Noise in AI-Assessed Educational Proficiency Data

### Field of the Invention
This invention relates to educational technology, specifically to methods for evaluating whether changes in student proficiency scores reflect genuine learning rather than statistical noise, lucky guesses, measurement error, or academic dishonesty.

### Background of the Invention
Existing educational assessment systems track student scores over time but lack mechanisms to distinguish between authentic learning progression and spurious score changes. A student whose score jumps from 40% to 80% on consecutive assessments may have genuinely learned the material, may have guessed correctly, or may have obtained the answers through unauthorized means. Current systems treat all score changes equally, leading to unreliable proficiency estimates that mislead both students and educators.

Prior art in adaptive learning (e.g., ALEKS, Knewton) uses binary flags or simple trend analysis (improving/declining/stable) but does not produce a continuous confidence metric for the authenticity of the observed trajectory. Item Response Theory (IRT) models question difficulty but does not model learning trajectory genuineness. Bayesian Knowledge Tracing (BKT) estimates probability of mastery but does not explicitly model the genuineness of transitions between mastery states.

### Summary of the Invention
The invention computes a continuous genuineness score (0 to 1) for each student-skill proficiency trajectory by combining three independent signals:

1. **Directional Consistency** — the proportion of consecutive score deltas aligned with the overall trend direction. A student improving on 8 of 10 consecutive assessments has higher consistency (0.80) than one improving on 5 of 10 (0.50).

2. **Exponentially-Weighted Velocity** — the rate of score change with recent observations weighted more heavily than older ones. A decay factor (preferred embodiment: 0.7 per step) ensures that a student who was declining but recently reversed course is detected, whereas simple arithmetic mean velocity would mask the turnaround. The velocity is computed as:

   ```
   velocity = Σ(delta_i × 0.7^(n-1-i)) / Σ(0.7^(n-1-i))
   ```

   where delta_i is the score change at step i, n is the total number of deltas, and the most recent delta receives weight 1.0.

3. **Adaptive Anomaly Penalty** — a penalty factor applied when suspicious score jumps are detected. Unlike fixed-threshold anomaly detection (e.g., flagging any change > 30 points), the threshold adapts to the student's own score variability:

   ```
   threshold = max(minimum_floor, |mean_delta| + 2σ_delta)
   ```

   where σ_delta is the standard deviation of the student's score deltas. The penalty scales with the number of suspicious anomalies:

   ```
   penalty = max(0.2, 1 - 0.3 × count_suspicious)
   ```

The genuineness score is computed as the product of all three factors:

```
genuineness = consistency × velocity_factor × anomaly_penalty
```

where velocity_factor = min(1, velocity / 8) for positive velocity, and 0 for non-positive velocity.

### Detailed Description

**Input:** An ordered sequence of proficiency scores for a single student on a single skill, each with a timestamp. Minimum two observations required.

**Processing Steps:**

Step 1: Sort observations by timestamp ascending.

Step 2: Compute deltas between consecutive scores:
```
delta_i = score_i - score_(i-1)
```

Step 3: Compute exponentially-weighted velocity using decay factor α (preferred: 0.7):
```
For each delta_i, weight_i = α^(n-1-i)
velocity = Σ(delta_i × weight_i) / Σ(weight_i)
```

Step 4: Compute directional consistency:
```
positive_count = count(delta_i > 0)
negative_count = count(delta_i < 0)
consistency = max(positive_count, negative_count) / total_deltas
```

Step 5: Compute adaptive anomaly threshold:
```
mean_delta = Σ(delta_i) / n
variance = Σ((delta_i - mean_delta)²) / n
σ = sqrt(variance)
threshold = max(20, |mean_delta| + 2σ)
```

Step 6: Identify suspicious anomalies (positive jumps exceeding threshold):
```
suspicious = {delta_i : delta_i > 0 AND delta_i > threshold}
```

Step 7: Compute anomaly penalty:
```
penalty = max(0.2, 1 - 0.3 × |suspicious|)
```

Step 8: Compute velocity factor:
```
velocity_factor = velocity > 0 ? min(1, velocity / 8) : 0
```

Step 9: Compute genuineness score:
```
genuineness = consistency × velocity_factor × penalty
```

Step 10: Apply genuineness to proficiency adjustment:
```
If genuineness > 0 AND data_points >= 3:
  momentum = genuineness × velocity × 0.3
  adjusted_score = weighted_score + momentum
```

**Output:** A genuineness score between 0 and 1, a boolean isGenuine flag (genuineness >= 0.4), and a momentum-adjusted proficiency score.

### Claims

1. A computer-implemented method for computing a genuineness score for an educational proficiency trajectory, comprising:
   a. receiving a time-ordered sequence of proficiency scores for a student-skill pair;
   b. computing an exponentially-weighted velocity of score change with configurable decay factor;
   c. computing a directional consistency measure as the proportion of consecutive changes aligned with the overall trend;
   d. computing an adaptive anomaly threshold based on the standard deviation of the student's own score deltas;
   e. computing an anomaly penalty that scales with the count of suspicious positive score jumps exceeding said adaptive threshold;
   f. computing a genuineness score as the product of said consistency, a normalized velocity factor, and said anomaly penalty;
   g. using said genuineness score to scale an adjustment to a proficiency estimate.

2. The method of claim 1, wherein the exponentially-weighted velocity uses a decay factor of approximately 0.7 per observation step, such that recent score changes receive greater weight.

3. The method of claim 1, wherein the adaptive anomaly threshold is computed as the maximum of a minimum floor value and the sum of the absolute mean delta plus two standard deviations of the delta distribution.

4. The method of claim 1, wherein the genuineness score is a continuous value between 0 and 1, replacing binary genuine/not-genuine classification.

5. A system for educational proficiency assessment incorporating the method of claims 1-4, wherein the genuineness score is computed in real-time as new assessment evidence is received and used to govern whether automated proficiency adjustments are applied.

### Inventor
Jeff Ritter, PhD

### Priority Date
[Date of filing]

---

## PROVISIONAL PATENT #2: Governed AI Proficiency Pipeline

### Title
Method and System for Governing AI-Generated Educational Proficiency Scores Through Sequential Constraint Layers with Hierarchical Deferral to Human Review

### Field of the Invention
This invention relates to the governance of artificial intelligence systems in educational settings, specifically to a method of ensuring that AI-generated student proficiency scores satisfy fairness, explainability, uncertainty, and risk constraints before being surfaced to users or used to inform automated interventions.

### Background of the Invention
AI-generated scores in educational platforms are increasingly used to inform student-facing dashboards, faculty intervention recommendations, and institutional reporting. However, these scores may be unreliable (insufficient evidence), unexplainable (no evidence summary), unfair (systematic bias across student groups), or unstable (high variance in the underlying data).

Existing educational platforms typically apply no governance constraints to AI-generated scores, or apply simple threshold checks (e.g., "if confidence < 0.5, show warning"). No existing system implements a sequential, hierarchical governance pipeline that enforces multiple constraint types simultaneously and defers to human judgment when constraints are not met.

In medical AI and financial AI, governance pipelines are standard practice. This invention adapts and extends that approach to educational proficiency scoring, where the constraints are fundamentally different (fairness must be measured without demographic data, uncertainty must account for sparse and heterogeneous evidence sources, and deferral must route to a specific human — the course instructor).

### Summary of the Invention
The invention implements a four-layer governance pipeline (L0 through L3) with continuous monitoring (L4), through which every AI-generated proficiency score must pass before being persisted, surfaced, or acted upon:

**L0 — Input Validation:** Verifies consent (student identity present), provenance (score tied to specific skill and enrollment), and data minimization (only necessary fields propagated).

**L1 — Score Audit:** Enforces explainability (score must include an evidence summary exceeding a minimum length) and confidence thresholds.

**L2 — Uncertainty Estimation:** Computes the variance of the student's score distribution, normalized to [0, 1], and checks against an uncertainty threshold (δ). Stability requires both sufficient data points AND variance below threshold.

**L3 — Decision Governance:** Evaluates all constraints in a defined hierarchy:
```
Privacy ≻ Fairness ≻ Risk ≻ Confidence
```
Automated action is permitted only when ALL constraints pass AND sufficient assessment history exists. Otherwise, the system defers to human review.

**L4 — Continuous Monitoring:** Evaluates drift and anomalies across all scored assessments, independently of the per-score pipeline. Score changes exceeding a defined threshold (preferred: 40 points) are flagged for review regardless of whether individual score governance passed.

The governance thresholds are defined as:
```
ε = 0.10 (fairness — maximum equalized odds deviation)
δ = 0.25 (uncertainty — maximum normalized variance)
τ = 0.50 (risk — maximum composite risk score)
```

### Detailed Description

**Architecture:** The governance pipeline is implemented as a pure function that receives a score context object and returns a governance decision. The pipeline is stateless and deterministic — given the same inputs, it always produces the same decision.

**L0 Implementation:**
```
Input: { studentId, skillId, enrollmentId }
Checks: studentId present (consent), skillId OR enrollmentId present (provenance)
Action: If invalid, reject with violation details. If valid, minimize data to allowlisted fields only.
```

**L1 Implementation:**
```
Input: { score, confidence, evidenceSummary }
Checks: evidenceSummary present AND length > 10 (explainability), confidence >= (1 - δ) (confidence threshold)
Action: If explainability fails, mark score as inadmissible. If confidence fails, attach warning but allow continuation.
```

**L2 Implementation:**
```
Input: { scores[], historyCount }
Computation: mean = Σ(scores) / n; variance = Σ((score_i - mean)²) / n / 10000
Checks: historyCount >= minDataPoints AND variance <= δ
Output: { stable: boolean, variance: number, reason: string }
```

**L3 Implementation:**
```
Input: { score, confidence, fairnessScore, riskScore, historyCount }
Constraints:
  privacy: true (always, in-platform)
  fairness: fairnessScore <= ε
  risk: riskScore <= τ
  confidence: confidence >= (1 - δ)
Hierarchy: All must pass (AND). If any fails, action = 'defer'.
Additional: sufficientData = historyCount >= minDataPoints. If insufficient, always defer regardless of constraint satisfaction.
Output: { action: 'execute' | 'defer', constraints: {}, reason: string }
```

**L4 Implementation:**
```
Input: { currentScores[], previousScores[] }
For each skill: if |currentScore - previousScore| > 40, emit anomaly alert.
Output: { valid: boolean, alerts: [] }
```

**Full Pipeline Execution Order:**
```
1. L0: validateInput() → if invalid, return { allowed: false, layer: 'L0' }
2. L1: auditScore() → produce audit record
3. L2: estimateUncertainty() → produce stability assessment
4. L3: governDecision() → produce execute/defer decision
5. Return { allowed, layers: {L0, L1, L2, L3}, decision, audit, uncertainty }
```

### Claims

1. A computer-implemented method for governing AI-generated educational proficiency scores, comprising:
   a. validating input data through a consent, provenance, and data minimization layer (L0);
   b. auditing the score through an explainability and confidence threshold layer (L1);
   c. estimating uncertainty through a variance-based stability assessment layer (L2);
   d. applying a decision governance layer (L3) that evaluates multiple constraint types in a defined hierarchy (Privacy ≻ Fairness ≻ Risk ≻ Confidence);
   e. deferring to human review when any constraint in said hierarchy is not satisfied;
   f. continuously monitoring scored assessments for drift and anomalies (L4) independently of per-score governance.

2. The method of claim 1, wherein the fairness constraint is evaluated using equalized odds measured through proxy groupings that do not require collection of protected demographic attributes.

3. The method of claim 1, wherein the deferral mechanism routes the decision to the course instructor rather than to a system administrator, preserving the faculty-student relationship.

4. The method of claim 1, wherein the governance pipeline is stateless and deterministic, such that given identical inputs, the same governance decision is always produced.

5. A system for educational AI governance incorporating the method of claims 1-4, wherein the governance pipeline is executed in real-time for every AI-generated proficiency score before said score is persisted to a database, surfaced to a student dashboard, or used to generate automated intervention recommendations.

### Inventor
Jeff Ritter, PhD

### Priority Date
[Date of filing]

---

## PROVISIONAL PATENT #3: Integrated Multi-Source Proficiency Estimation System

### Title
System and Method for Estimating Student Proficiency Through Source-Normalized Multi-Evidence Weighting with Trajectory-Aware Adjustment and Governed Output

### Field of the Invention
This invention relates to educational assessment technology, specifically to an integrated system that converts heterogeneous learning evidence from multiple source types into a single governed proficiency estimate with confidence intervals and trajectory metadata.

### Background of the Invention
Traditional educational assessment produces a single grade per student per course, computed as a weighted average of assignment scores. This approach suffers from three fundamental limitations: source blindness (all evidence types treated equally regardless of reliability), temporal flatness (old scores weighted equally to recent ones), and false precision (no mechanism to express uncertainty in the estimate).

Existing adaptive learning platforms (ALEKS, Knewton, DreamBox) partially address some of these limitations but do not combine all of the following in a single integrated pipeline: (1) source-normalized weighting that prevents evidence count imbalance, (2) exponential recency decay, (3) diminishing-returns confidence accumulation, (4) trajectory genuineness assessment, (5) standard-error-based confidence intervals, and (6) governance constraints with human deferral.

### Summary of the Invention
The invention is an integrated proficiency estimation system comprising six sequential processing stages:

**Stage 1 — Two-Phase Source-Normalized Weighting:**
Phase 1: For each evidence source type (quiz, assessment, upload, coaching), compute a recency-weighted average independently using exponential decay with a configurable half-life (preferred: 45 days).
Phase 2: Combine the per-source averages using source reliability weights (preferred: quiz 1.0, assessment 1.0, upload 0.75, coaching 0.35).

This two-phase approach prevents source count imbalance. Ten coaching observations (reliability 0.35 each) cannot overwhelm one quiz observation (reliability 1.0) because coaching observations are first averaged within their source type, producing a single coaching signal, which is then combined with the quiz signal proportionally.

**Stage 2 — Diminishing-Returns Confidence Accumulation:**
For each source type, confidence is accumulated geometrically:
```
source_confidence = 1 - (1 - rate)^n
```
where rate is the per-observation confidence contribution (quiz: 0.15, assessment: 0.20, upload: 0.25, coaching: 0.05) and n is the observation count. Total confidence is the sum of source confidences weighted by source reliability, capped at 1.0.

**Stage 3 — Trajectory Analysis with Genuineness Score:**
As described in Provisional Patent #1.

**Stage 4 — Confidence Interval Computation:**
Standard error of the mean with t-distribution correction for small samples. The interval width is further adjusted by a source quality factor (up to 15% narrower when all evidence comes from high-reliability sources).

**Stage 5 — Trajectory-Informed Score Adjustment:**
The weighted score is adjusted by a momentum factor scaled by the genuineness score:
```
If genuineness > 0 AND data_points >= 3:
  momentum = genuineness × velocity × 0.3
  adjusted_score = clip(weighted_score + momentum, 0, 100)
If suspicious_anomalies detected:
  dampen_factor = max(0.90, 1 - max_jump / 1000)
  adjusted_score = adjusted_score × dampen_factor
```

**Stage 6 — Governance Pipeline:**
As described in Provisional Patent #2.

**Output:** A governed proficiency assessment containing:
- adjusted score (0-100)
- raw score (pre-adjustment)
- confidence (0-1)
- confidence interval {lower, estimate, upper, width, reliability}
- trajectory {velocity, consistency, genuineness, isGenuine, trend, anomalies}
- fairness assessment
- source breakdown
- governance metadata {timestamp, governed: true}

### Claims

1. A computer-implemented system for estimating student proficiency, comprising:
   a. a two-phase source-normalized weighting module that computes recency-weighted averages within each evidence source type independently, then combines per-source averages using source reliability weights;
   b. a diminishing-returns confidence accumulation module using geometric accumulation per source type;
   c. a trajectory analysis module that computes a continuous genuineness score for the learning trajectory;
   d. a confidence interval module using standard error with t-distribution correction and source quality adjustment;
   e. a trajectory-informed adjustment module that scales proficiency adjustments by the genuineness score;
   f. a governance pipeline module that enforces fairness, explainability, uncertainty, and risk constraints with deferral to human review.

2. The system of claim 1, wherein the two-phase source normalization prevents evidence count imbalance by computing a single aggregate signal per source type before cross-source combination.

3. The system of claim 1, wherein the exponential recency decay uses a configurable half-life parameter to control the rate at which older observations lose influence.

4. The system of claim 1, wherein all six processing stages are executed in real-time for every new piece of evidence received, producing an updated proficiency assessment immediately.

5. The system of claim 1, wherein the output includes a machine-readable governance metadata record that documents which constraints were checked, which passed, and whether the score was approved for automated use or deferred to human review.

6. A method for converting heterogeneous educational evidence into a governed proficiency estimate, comprising the processing stages of the system of claims 1-5, wherein said method is triggered by the receipt of any new evidence observation (quiz score, assessment result, work upload analysis, or coaching interaction signal) for any student-skill pair.

### Inventor
Jeff Ritter, PhD

### Priority Date
[Date of filing]

---

## RECOMMENDED PATENT ATTORNEYS — PITTSBURGH AREA

### Software/AI Patent Specialists

1. **The Webb Law Firm** — Specializes in software and technology patents. Pittsburgh office.
   - webblaw.com
   - 412-471-8815

2. **K&L Gates LLP** — Large firm with dedicated IP practice, AI and software patent experience.
   - klgates.com
   - 412-355-6500

3. **Reed Smith LLP** — Pittsburgh-based global firm with strong IP/patent practice.
   - reedsmith.com
   - 412-288-3131

4. **Buchanan Ingersoll & Rooney** — Pittsburgh firm, IP and patent prosecution practice.
   - bipc.com
   - 412-562-8800

5. **Fox Rothschild LLP** — IP practice with software patent experience.
   - foxrothschild.com
   - 412-391-1334

### Estimated Costs

| Filing Type | Cost Range | Timeline |
|------------|-----------|----------|
| Provisional patent (each) | $2,000 - $5,000 | File within days |
| Utility patent (each) | $12,000 - $25,000 | Must file within 12 months of provisional |
| Prior art search (each) | $1,500 - $3,000 | 2-4 weeks |
| Patent prosecution (responses to USPTO) | $2,000 - $5,000 per response | 1-3 years total |

### Filing Strategy

1. **File all three provisionals simultaneously** — establishes priority date for all claims. Cost: ~$6,000-$15,000 total.
2. **Conduct prior art searches** in parallel — helps refine claims before utility filing. Cost: ~$4,500-$9,000 total.
3. **Within 12 months of provisional filing**, decide which provisionals to convert to full utility patent applications.
4. **Consider PCT (international) filing** if you plan to operate outside the US.

### CRITICAL DEADLINE

The methodology white paper was first publicly accessible on approximately **April 4, 2026**. Under US patent law (35 USC §102(b)), you have **one year from public disclosure** to file a patent application.

**File provisionals no later than April 3, 2027.**

Filing sooner is better — it establishes an earlier priority date in case of competing filings.
