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

## PROVISIONAL PATENT #4: Multi-Modal Career Assessment Aggregation System

### Title
System and Method for Aggregating Heterogeneous Career Assessment Modalities into a Unified Post-Secondary Path Recommendation Through Cross-Modal Score Normalization and AI Synthesis

### Field of the Invention
This invention relates to career guidance technology, specifically to a system that combines scores from multiple independent assessment modalities — each using a fundamentally different measurement approach — into a unified career path recommendation.

### Background of the Invention
Existing career guidance tools typically use a single assessment modality: either a questionnaire (Holland codes, Myers-Briggs), a skills inventory, or a conversational advisor. Each modality captures different signals. Questionnaires capture stated preferences. Games capture revealed preferences through behavioral choices. Financial simulations capture risk tolerance and practical constraints. AI conversations capture narrative context, fears, and unstated motivations.

No existing system aggregates all of these modality types into a single recommendation while preserving the distinct signal quality of each. Prior art in career guidance (O*NET, Naviance, Roadtrip Nation) uses single-modality assessment. Multi-modal assessment exists in clinical psychology (MMPI combines scales) but has not been applied to career guidance with this combination of interactive games, financial simulations, and conversational AI.

### Summary of the Invention
The invention implements a multi-modal career assessment system comprising five independent assessment modules, each using a different measurement mechanism, that converge on a unified ranking across a defined set of post-secondary paths:

**Module 1 — Binary Object Choice (Pick Your World):** Presents pairs of career-representative objects. Each choice awards weighted points to multiple path categories. The weighting is non-uniform and context-specific: selecting "toolbox and wrench" scores {trade: 3, work: 1}, while selecting "laptop at a desk" scores {cc: 2, work: 1, entrepreneur: 1}.

**Module 2 — Spectrum Slider Assessment (Your Vibe):** Presents preference dimensions on a 5-point slider. Each slider position maps to a different scoring table for the path categories. Position 1 and position 5 produce completely different path weightings, with intermediate positions producing intermediate weightings. This captures nuance that binary choice cannot.

**Module 3 — Lifestyle Visualization (Picture Your Future):** Presents concrete lifestyle scenarios (living situations, daily routines, social contexts) and maps choices to path categories. This captures aspirational preferences rather than skill-based preferences.

**Module 4 — Financial Realism Simulation (Money Real Talk):** Presents financial trade-offs (immediate income vs. training investment, stability vs. growth potential) and maps choices to path categories. This captures practical constraints and risk tolerance.

**Module 5 — Conversational AI Synthesis (Guide):** An AI-driven 8-exchange structured conversation that extracts narrative details (interests, strengths, fears, values, family constraints, financial situation) and generates a personalized path report with match percentages. The AI can incorporate signals from Modules 1-4 when available, creating a multi-signal triangulation.

**Aggregation Architecture:**
- Modules 1-4 produce path-keyed scores stored in client-side sessionStorage
- Each module's scores are normalized to a common scale
- Module 5 (AI) can access the aggregated scores from Modules 1-4 and incorporate them into its recommendation
- The final output is a ranked set of 2-3 path recommendations with match percentages, year-one expectations, and honest caveats

**Module 6 — Reaction-Based Alternative Path Discovery:** A supplementary module that presents unconventional career paths (small farming, cooperatives, van life, vibe coding, co-housing) and captures emotional reactions (love, curious, not for me) rather than numeric scores. This inverts the scoring paradigm — instead of computing a match, it detects resonance.

### Claims

1. A computer-implemented system for career path recommendation, comprising:
   a. two or more independent assessment modules, each using a fundamentally different measurement modality (binary choice, spectrum slider, lifestyle visualization, financial simulation, or conversational AI);
   b. a common path-keyed scoring format to which all modules contribute, regardless of their measurement mechanism;
   c. a cross-modal aggregation method that normalizes and combines scores from heterogeneous modules;
   d. an AI synthesis module that can incorporate scores from non-AI modules to produce a multi-signal recommendation;
   e. a recommendation output including match percentages, concrete year-one expectations, and honest caveats for each recommended path.

2. The system of claim 1, wherein each assessment module uses non-uniform, context-specific scoring weights such that the same choice in different questions produces different path-category contributions.

3. The system of claim 1, further comprising a reaction-based discovery module that captures qualitative emotional responses (love, curious, not for me) to unconventional career paths, producing a non-numeric resonance signal distinct from the scored modules.

4. The system of claim 1, wherein the aggregation occurs entirely client-side without server-side state, using browser sessionStorage as the cross-module communication channel.

5. The system of claim 1, wherein the conversational AI module uses a structured progressive-disclosure conversation flow (opening → interests → strengths → environment → practical constraints → values → fears → synthesis) that mirrors clinical intake methodology adapted for career guidance.

### Inventor
Jeff Ritter, PhD

### Priority Date
[Date of filing]

---

## PROVISIONAL PATENT #5: Scenario-to-Professional-Skill Translation Engine for Reentry Populations

### Title
Method and System for Translating Informal Life Experiences into Recognized Professional Skills with Career Path Mappings, Specifically Designed for Formerly Incarcerated Individuals

### Field of the Invention
This invention relates to workforce development technology, specifically to a method for identifying and articulating transferable professional skills from non-traditional life experiences, particularly those acquired during incarceration, and mapping those skills to viable career paths.

### Background of the Invention
Traditional skills assessment tools (O*NET Skills Search, LinkedIn Skills Assessment, Indeed Assessments) assume the user has formal work experience, educational credentials, or professional certifications to evaluate. These tools systematically exclude populations whose skills were developed through informal, non-credentialed, or non-traditional means — most notably the 600,000+ individuals released from incarceration annually in the United States.

People who have been incarcerated frequently possess demonstrable professional skills acquired through prison work assignments (kitchen management, facility maintenance, library operations), self-directed learning (legal research, tutoring, fitness training), survival skills (conflict de-escalation, resource management under scarcity, crisis decision-making), and informal leadership (mentoring, organizing, advocacy). These skills have direct professional equivalents that are valued by employers, but no existing system translates them into professional language or maps them to career paths.

Prior art in skills assessment does not address this population. Reentry-focused tools (Honest Jobs, 70 Million Jobs) match people to jobs but do not perform skills discovery. General-purpose AI career tools do not have domain knowledge about what skills are actually developed during incarceration.

### Summary of the Invention
The invention implements a scenario-based skills discovery engine comprising:

**Scenario Library:** A curated set of 12 real-life scenarios drawn from experiences common during and after incarceration. Each scenario is written in plain, non-clinical language:
- "Have you ever talked someone down when they were about to do something stupid?"
- "Have you ever run a hustle — managed inventory, tracked what sold, handled money?"
- "Have you ever written grievances, appeals, or legal documents?"
- "Have you ever cooked for a large group and made it work with limited ingredients?"
- "Have you ever helped someone who couldn't read, do math, or understand paperwork?"
- "Have you ever managed your own money when there was barely enough to go around?"

(And 6 additional scenarios covering mechanical aptitude, crisis management, organization/leadership, construction/building, self-discipline, and training/mentoring.)

**Skill Mapping Matrix:** Each scenario maps to 3 or more recognized professional skills. Each skill includes:
- Professional skill name (using standard HR/job-posting terminology)
- Category grouping (e.g., "Leadership," "Technical," "Communication")
- 2-4 specific career paths that value this skill
- Typical pay range for those careers

**De-duplication and Grouping Algorithm:** When a user completes all scenarios, the `buildResults()` function:
1. Collects all skills from affirmed scenarios
2. Groups skills by category
3. De-duplicates skills that appear in multiple scenarios while preserving the source scenario(s) that demonstrated each skill
4. Produces a structured output showing: skill name, which scenario(s) demonstrated it, careers that use it, and pay ranges

**Evidence-Based Skill Resume:** The output constitutes a professional skills inventory derived entirely from lived experience — a document that could support a job application, a conversation with a workforce development counselor, or a self-assessment for career planning.

### Claims

1. A computer-implemented method for identifying professional skills from non-traditional life experiences, comprising:
   a. presenting a curated library of real-life scenarios, each describing an experience common in non-traditional contexts (including but not limited to incarceration, survival situations, informal economies, or self-directed learning);
   b. receiving affirmative or negative responses indicating whether the user has experienced each scenario;
   c. for each affirmed scenario, mapping the experience to one or more recognized professional skills using a pre-defined skill mapping matrix;
   d. de-duplicating and grouping the identified skills by professional category;
   e. for each identified skill, presenting associated career paths and compensation data;
   f. generating a structured professional skills inventory derived entirely from lived experience.

2. The method of claim 1, wherein the scenario library is specifically designed for formerly incarcerated individuals and includes scenarios related to: conflict de-escalation, resource management under scarcity, legal document preparation, group food preparation, peer education, crisis decision-making, mechanical repair, organizational leadership, construction, financial management, self-discipline, and training/mentoring.

3. The method of claim 1, wherein the de-duplication algorithm preserves the source scenario for each skill, creating an evidence-based record that can be used in employment applications or workforce development counseling.

4. The method of claim 1, wherein the career path mappings include background-check-specific information indicating the likelihood of hiring for each career given a criminal record.

5. A system for workforce development incorporating the method of claims 1-4, designed to be used without user accounts, without data persistence, and without requiring disclosure of specific criminal history.

### Inventor
Jeff Ritter, PhD

### Priority Date
[Date of filing]

---

## PROVISIONAL PATENT #6: Background-Check-Aware Career Matching Taxonomy

### Title
System and Data Structure for Career Path Recommendation Incorporating Conviction-Type-Specific Hiring Practice Data and Three-Tier Background Check Friendliness Classification

### Field of the Invention
This invention relates to career guidance and workforce development technology, specifically to a structured taxonomy that annotates career paths with industry-specific background check practices, conviction-type-specific hiring restrictions, and employer-level Fair Chance hiring data.

### Background of the Invention
Approximately 70 million Americans have a criminal record. Background check practices vary dramatically by industry, employer, state, and conviction type. A DUI conviction may disqualify someone from CDL trucking for 3-10 years but have no effect on construction employment. A theft conviction may be problematic for warehouse work but irrelevant to landscaping. Peer support specialist roles in behavioral health explicitly require lived experience with the justice system.

No existing career guidance system encodes this level of conviction-type-specific hiring practice data. Job boards for people with records (Honest Jobs, 70 Million Jobs) match to specific open positions but do not provide career-path-level guidance about which industries are structurally accessible. General career guidance tools (O*NET, BLS Occupational Outlook) do not address background checks at all.

### Summary of the Invention
The invention implements a structured career path taxonomy comprising:

**Three-Tier Background Check Classification:**
- **Friendly:** Industry norm is minimal or no background checks, or explicit Fair Chance hiring policies are widespread. Examples: landscaping, food service, most construction, entrepreneurship.
- **Moderate:** Background checks are common but conviction type and recency matter significantly. Many employers in the industry hire with records. Examples: warehouse/logistics, manufacturing, some tech companies, skilled trades unions.
- **Restrictive:** Industry has structural barriers tied to licensing, regulation, or insurance requirements that limit access based on conviction type. Examples: CDL (DUI restrictions), healthcare (patient contact restrictions), education (proximity to minors).

**Conviction-Type-Specific Annotations:** For each career path, the taxonomy includes specific notes about which conviction categories affect employability:
- DUI/drug convictions and CDL eligibility (3-10 year disqualification periods)
- Theft/fraud convictions and financial/warehouse positions
- Violence-related convictions and healthcare/education positions
- Sex offense registry and employment restrictions
- General felony vs. misdemeanor distinction in employer practices

**Fair Chance Employer Database:** Named employers with documented Fair Chance hiring policies, organized by career path:
- Construction: Turner Construction, Skanska
- Food service: Dave's Hot Chicken, Greyston Bakery
- Retail/warehouse: Target, Walmart, Amazon
- Tech: companies with ban-the-box policies
- Social enterprise: Homeboy Industries, PUSH Buffalo

**Non-Traditional Path Inclusion:** The taxonomy extends beyond traditional career paths to include:
- Urban agriculture and small farming (zero background checks in most contexts)
- Worker cooperatives (collective hiring decisions, many explicitly second-chance)
- Portfolio/gig careers (platform-specific check policies documented)
- Co-housing and intentional communities (survival strategy, not career)
- Seasonal work (historically the least restrictive hiring)

### Claims

1. A computer-implemented career guidance system comprising:
   a. a structured taxonomy of career paths annotated with background check practice data at the industry level;
   b. a three-tier classification system (friendly, moderate, restrictive) indicating the structural accessibility of each career path for individuals with criminal records;
   c. conviction-type-specific annotations indicating which categories of criminal history affect employability in each career path;
   d. a database of named employers with documented Fair Chance hiring policies, organized by career path;
   e. a recommendation engine that uses said taxonomy, classification, annotations, and database to generate career recommendations tailored to an individual's situation.

2. The system of claim 1, wherein the conviction-type-specific annotations include temporal qualifiers (e.g., "DUI disqualifying for CDL for 3-10 years depending on state") reflecting the time-sensitive nature of hiring restrictions.

3. The system of claim 1, wherein the taxonomy includes non-traditional career paths (urban agriculture, worker cooperatives, portfolio careers, seasonal work, intentional communities) annotated with the same background check classification and conviction-type data as traditional career paths.

4. The system of claim 1, wherein the taxonomy is integrated with an AI career coaching system that uses the background check data to filter recommendations, provide honest barrier information, and suggest specific Fair Chance employers relevant to the user's indicated career interest.

5. A method for generating background-check-aware career recommendations, comprising:
   a. receiving an indication of a user's career interests and optionally their general conviction category;
   b. querying the taxonomy of claim 1 to identify career paths matching those interests;
   c. filtering or annotating results based on the background check classification and conviction-type-specific data;
   d. presenting recommended career paths with explicit, honest information about hiring barriers and named Fair Chance employers.

### Inventor
Jeff Ritter, PhD

### Priority Date
[Date of filing]

---

## PROVISIONAL PATENT #7: Tiered Situation Assessment and Action Plan Generator for Workforce Reentry

### Title
Method and System for Generating Multi-Tiered Employment Action Plans Based on Real-Time Situational Assessment of Housing, Transportation, Education, Legal Restrictions, and Income Urgency

### Field of the Invention
This invention relates to workforce development technology, specifically to a method for assessing an individual's current practical situation across multiple dimensions and generating a tiered employment action plan with recommendations calibrated to different time horizons.

### Background of the Invention
Individuals reentering the workforce after incarceration face intersecting barriers that existing career guidance tools assess independently or not at all. Housing instability affects which jobs are reachable. Transportation limitations constrain geographic range. Parole restrictions may prohibit certain work hours or locations. Income urgency determines whether a 3-month training program is feasible or whether immediate employment is necessary for survival.

Existing reentry tools (workforce development one-stops, reentry case management software) assess these dimensions through intake interviews conducted by case managers. The assessment is manual, time-consuming, and dependent on case manager availability and expertise. No existing automated system combines multi-dimensional situational assessment with tiered, timeline-specific employment recommendations.

### Summary of the Invention
The invention implements a six-question situational assessment that produces a three-tiered employment action plan:

**Assessment Dimensions:**
1. **Housing stability:** Stable / Transitional / Shelter / Uncertain
2. **Transportation access:** Personal vehicle / Rides available / Public transit / Walking distance only
3. **Income urgency:** This week / This month / Can wait 1-3 months / Flexible
4. **Education level:** No GED / GED / High school diploma / Some college / Degree
5. **Certifications:** Yes (with text input for specifics) / No / Unsure
6. **Legal restrictions:** Yes, some work restrictions / No restrictions / Unsure

**Tiered Action Plan Generation:**
The `buildPlan()` function generates three tiers of recommendations based on the intersection of all six assessment dimensions:

**Tier 1 — "Start This Week":** Jobs available with minimal barriers and immediate start dates. Content is conditional:
- If transportation = personal vehicle or rides: includes delivery, day labor, wide-radius construction
- If transportation = walking only: limits to local options (nearby restaurants, warehouses within transit range)
- If urgency = this week: prioritizes daily-pay and same-week-start options

**Tier 2 — "Start This Month":** Jobs requiring a brief application process. Content is conditional:
- Includes Fair Chance employers (Amazon, Target, FedEx) with specific application links
- If education >= GED: includes options requiring basic credential verification
- If certifications present: includes jobs that leverage those certifications

**Tier 3 — "Build Toward (1-3 months)":** Training programs and apprenticeships. Content is conditional:
- If urgency allows: includes paid apprenticeships, CDL training, coding bootcamps
- If education < GED: recommends GED + career training combo programs
- If certifications from incarceration: recommends verification/transfer resources
- Always includes American Job Centers and Federal Bonding Program information

**Conditional Logic:** The plan is not a static template. Each tier's content changes based on the interaction of multiple assessment variables. A person with stable housing, a car, and a GED who can wait 3 months receives fundamentally different Tier 3 recommendations than a person in a shelter, walking distance only, who needs money this week.

### Claims

1. A computer-implemented method for generating tiered employment action plans, comprising:
   a. assessing an individual's current situation across multiple dimensions including housing stability, transportation access, income urgency, education level, existing certifications, and legal work restrictions;
   b. generating a multi-tiered action plan with recommendations at different time horizons (immediate, short-term, medium-term);
   c. conditionally varying the content of each tier based on the intersection of multiple assessment dimensions, such that the same tier produces different recommendations for different situational profiles;
   d. including specific, actionable next steps in each tier (named employers, program links, resource contacts) rather than generic category recommendations.

2. The method of claim 1, wherein the assessment is designed specifically for individuals reentering the workforce after incarceration and includes dimensions relevant to that population (parole/probation work restrictions, certifications earned during incarceration, housing instability common during reentry).

3. The method of claim 1, wherein the conditional logic accounts for the interaction between dimensions, such that transportation limitations modify which employment options appear in each tier, and income urgency determines which tiers are emphasized.

4. The method of claim 1, wherein the medium-term tier includes specific guidance on verifying and transferring certifications earned during incarceration to civilian equivalents.

5. A system for workforce reentry planning incorporating the method of claims 1-4, designed to operate without user accounts, without data persistence, and with results generated entirely client-side to protect user privacy.

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

1. **File all seven provisionals simultaneously** — establishes priority date for all claims. Cost: ~$14,000-$35,000 total.
2. **Conduct prior art searches** in parallel — helps refine claims before utility filing. Cost: ~$10,500-$21,000 total.
3. **Within 12 months of provisional filing**, decide which provisionals to convert to full utility patent applications.
4. **Consider PCT (international) filing** if you plan to operate outside the US.
5. **Consider an umbrella utility patent** that combines the integrated system (Patents #3, #4, #6, #7) into a single comprehensive filing covering the full platform architecture.

### Patent Portfolio Summary

| # | Title | Platform | Filed |
|---|-------|----------|-------|
| 1 | Learning Genuineness Score | transformlearning.ai | Pending |
| 2 | Governed AI Proficiency Pipeline | transformlearning.ai | Pending |
| 3 | Integrated Multi-Source Proficiency Estimation | transformlearning.ai | Pending |
| 4 | Multi-Modal Career Assessment Aggregation | findmyway.today | Pending |
| 5 | Scenario-to-Professional-Skill Translation | NewChapter | Pending |
| 6 | Background-Check-Aware Career Matching Taxonomy | NewChapter | Pending |
| 7 | Tiered Situation Assessment & Action Plan Generator | NewChapter | Pending |

### CRITICAL DEADLINES

| Platform | First Public Disclosure | File By |
|----------|------------------------|---------|
| transformlearning.ai | ~April 4, 2026 | April 3, 2027 |
| findmyway.today | ~March 2026 | March 2027 |
| NewChapter | April 15, 2026 | April 14, 2027 |

Under US patent law (35 USC §102(b)), you have **one year from public disclosure** to file a patent application.

**Recommended: File all seven provisionals by June 15, 2026** — well within all deadlines and establishes earliest possible priority dates.
