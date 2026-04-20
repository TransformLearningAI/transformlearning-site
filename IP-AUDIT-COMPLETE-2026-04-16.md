# Comprehensive Intellectual Property Audit — Transform Learning Suite
**CONFIDENTIAL — ATTORNEY PREPARATION MATERIAL**

Prepared by: Jeff Ritter, PhD (inventor)
Date: April 16, 2026
Covers: transformlearning.ai, findmyway.today, NewChapter

---

## EXISTING PATENT DRAFTS (Previously Documented)

See `PROVISIONAL-PATENT-DRAFTS.md` for full technical descriptions.

| # | Title | Platform | Status |
|---|-------|----------|--------|
| 1 | Learning Genuineness Score | transformlearning.ai | Draft complete |
| 2 | Governed AI Proficiency Pipeline | transformlearning.ai | Draft complete |
| 3 | Integrated Multi-Source Proficiency Estimation System | transformlearning.ai | Draft complete |

---

## NEW IP IDENTIFIED — transformlearning.ai (Updates Since April 5)

### IP-4: Bayesian Competency Estimation with Adaptive Item Calibration

**What changed:** The scoring methodology was redesigned around a Bayesian estimation framework. The methodology page now describes competency as a hidden state estimated through posterior updating, with item calibration (difficulty, discrimination, guess/slip parameters) controlling how much information each question provides.

**New components:**
- **Difficulty-controlled quiz generation** (`lib/claude/prompts/assessment-generate.js`): System prompt enforces that question difficulty scales WITHIN the skill scope, not beyond it. Every quiz mixes recall + apply + analyze regardless of student's current score. This prevents the difficulty escalation problem discovered during simulation testing.
- **Self-study context awareness** (`lib/claude/prompts/coaching-chat.js`): AI coaching prompt distinguishes between faculty-assigned courses and self-uploaded content, providing transparent provenance about where skill criteria came from.

**Patent relevance:** Extends Patent #3 with the item calibration layer and difficulty-controlled generation constraint.

### IP-5: Access Revocation via Email-Based Blocklist

**What it does:** The AccessGate component validates access keys (base64-encoded emails) against a revocation list. Previously granted access can be revoked per-email without changing the key scheme for other users.

**Where:** `components/AccessGate.jsx`
**Patent relevance:** Low — standard access control pattern. Not recommended for filing.

---

## NEW IP IDENTIFIED — findmyway.today

### IP-6: Multi-Modal Career Assessment Aggregation System (HIGH VALUE)

**What it does:** Coordinates scores from 5 independent assessment modules — each using a different scoring mechanism (binary choice, 5-point sliders, lifestyle selection, financial trade-offs, conversational AI) — to converge on a unified ranking across 6 post-secondary paths.

**Why it's novel:**
- Each game produces scores on the SAME 6 path keys (community college, trades, military, gap year, workforce, entrepreneurship) despite using completely different assessment modalities
- Source-specific weighting: a binary choice in Pick Your World might give {trade: 3}, while a slider position in Your Vibe gives {trade: 1.5} — the weights are context-specific per question
- The aggregation happens client-side via sessionStorage, meaning no server-side state is needed
- The AI conversation (Guide) can incorporate game results when generating its path report, creating a multi-signal triangulation

**Where:**
- `app/games/pick-your-world/page.tsx` (binary choice scoring)
- `app/games/your-vibe/page.tsx` (slider spectrum scoring)
- `app/games/picture-your-future/page.tsx` (lifestyle choice scoring)
- `app/games/money-real-talk/page.tsx` (financial realism scoring)
- `app/games/not-for-everyone/page.tsx` (reaction-based alternative path matching)
- `app/components/ProgressTracker.tsx` (aggregation tracking)
- `app/quiz/page.tsx` (AI report generation incorporating game signals)

**Patent relevance:** HIGH — the combination of 5 different assessment modalities converging on a unified career recommendation through both algorithmic scoring and AI synthesis is non-obvious. Individual components exist in prior art; the integrated system does not.

### IP-7: Contextual AI Career Report Generation with Personalization Constraint (HIGH VALUE)

**What it does:** An 8-exchange structured AI conversation that extracts student-specific details (interests, strengths, constraints, values, fears), then generates a personalized path report with match percentages, year-one expectations, and honest caveats — all explicitly referencing the student's own words and details.

**Why it's novel:**
- The conversation flow is designed as a progressive disclosure sequence (opening → interests → strengths → environment → practical → values → fears → anything else) that mirrors clinical intake methodology adapted for career guidance
- The report generation prompt explicitly requires the AI to "mentally review EVERYTHING the student told you" and "reference their specific details, not generic advice"
- Match percentages are calibrated to be honest (not all 85%+)
- Honest caveats are tailored to the student's specific fears, not generic warnings
- JSON extraction from natural conversation enables structured data output from unstructured dialogue

**Where:** `app/api/chat/route.ts`, `app/quiz/page.tsx`

**Patent relevance:** HIGH — the structured conversation → personalized report pipeline with explicit back-referencing constraint is a novel method.

### IP-8: Reaction-Based Alternative Path Discovery (MEDIUM VALUE)

**What it does:** Instead of scoring paths numerically, the Not for Everyone game presents unconventional lifestyles (small farming, van life, cooperatives, vibe coding, co-housing, portfolio careers, helping professions) and captures emotional reactions (love, curious, not for me). Results surface paths the student resonated with without reducing them to numbers.

**Why it's novel:** Inverts the traditional career assessment model. Most assessments score; this one detects resonance. The output is qualitative (loved vs. curious) rather than quantitative (82% match).

**Where:** `app/games/not-for-everyone/page.tsx`

**Patent relevance:** MEDIUM — the approach is novel but the implementation is simple enough that the defensibility window is narrower.

### IP-9: Bilingual Scoring Parity System (LOW VALUE)

**What it does:** Maintains identical scoring algorithms across English and Spanish versions of all games, using parallel data arrays that guarantee language choice does not affect algorithmic results.

**Where:** All game files (parallel EN/ES arrays)

**Patent relevance:** LOW — standard i18n pattern. Not recommended for filing.

### IP-10: Counselor Auto-Delivery Integration (MEDIUM VALUE)

**What it does:** When a student generates a path report through the Guide AI conversation, results are automatically emailed to a pre-configured counselor without requiring student action. The counselor link is stored in sessionStorage from the initial share URL.

**Where:** `app/quiz/page.tsx`, `app/api/send-results/route.ts`

**Patent relevance:** MEDIUM — the auto-delivery pattern connected to AI-generated career recommendations is useful but not deeply novel.

---

## NEW IP IDENTIFIED — NewChapter

### IP-11: Scenario-to-Professional-Skill Translation Engine (HIGH VALUE)

**What it does:** Translates lived experiences — specifically those common during incarceration — into recognized professional skills with career mappings. 12 scenarios (e.g., "talked someone down," "ran a commissary," "wrote grievances") each map to 3+ professional skills with associated careers and pay ranges.

**Why it's novel:**
- **The mapping itself is the IP.** No existing system translates incarceration-specific experiences into professional skill language. The insight that "managing a commissary" = "inventory management + sales + accounting" is domain knowledge embedded in an algorithm.
- **De-duplication logic** groups skills by category while preserving which scenario demonstrated each skill — creating an evidence-based skill resume from informal experience
- **Career-skill bidirectional linking** connects each skill to specific careers that actually hire people with records

**Where:** `app/discover/hidden-skills/page.tsx` — `scenarios[]` array + `buildResults()` function

**Patent relevance:** HIGH — this is a novel method with no direct prior art. The experience-to-skill mapping for the reentry population is non-obvious and commercially valuable.

### IP-12: Background-Check-Aware Career Matching Taxonomy (HIGH VALUE)

**What it does:** A structured taxonomy of 17+ career paths, each annotated with a 3-level background-check friendliness rating (friendly, moderate, restrictive) and specific, honest information about which conviction types affect which industries.

**Why it's novel:**
- **Conviction-type specificity:** Not just "friendly/unfriendly" but "DUI disqualifying for CDL for 3-10 years," "theft records problematic for warehouse," "peer support roles explicitly require lived experience"
- **Fair Chance employer database:** Names specific companies with second-chance hiring policies
- **Non-traditional path inclusion:** Legitimizes unconventional paths (urban agriculture, co-housing, worker cooperatives, portfolio careers) as viable alternatives with their own background-check realities
- **Industry-specific hiring norm documentation:** Captures real-world hiring practices that aren't documented anywhere in a structured, searchable format

**Where:** `app/paths/page.tsx` — `paths[]` + `altPaths[]` arrays

**Patent relevance:** HIGH — the structured taxonomy linking career paths to conviction-type-specific hiring realities is novel and has no direct prior art in career guidance technology.

### IP-13: Tiered Situation Assessment & Action Plan Generator (HIGH VALUE)

**What it does:** 6-question practical assessment (housing, transportation, urgency, education, certifications, parole restrictions) that generates a 3-tiered action plan: "Start This Week," "Start This Month," "Build Toward (1-3 months)."

**Why it's novel:**
- **Multi-variable conditional recommendations:** Job recommendations change based on the intersection of housing stability, transportation availability, income urgency, education level, and parole restrictions — not just a single variable
- **Tiered timeline structure:** Same person's situation generates different options at different time horizons — acknowledging that someone who needs money Friday faces different options than someone who can invest 3 months in training
- **Certificate bridging awareness:** Recognizes that certifications earned during incarceration may need verification/transfer and recommends specific resources for this

**Where:** `app/discover/reality-check/page.tsx` — `buildPlan()` function

**Patent relevance:** HIGH — the multi-variable tiered recommendation engine for reentry is a novel method.

### IP-14: Values-First Career Matching for Reentry Population (MEDIUM VALUE)

**What it does:** 6-pair forced-choice values assessment (money vs. meaning, independence vs. stability, service vs. craft, acceptance vs. growth, freedom vs. structure, immediate income vs. skill investment) that matches to career paths based on motivational alignment rather than skills.

**Why it's novel:** Career matching typically starts with skills or interests. This starts with values — what actually matters to someone — and finds careers that satisfy those values. For the reentry population, this is particularly important because many have been in environments where their values were suppressed.

**Where:** `app/discover/what-drives-you/page.tsx` — `pairs[]` + `getDriverProfile()`

**Patent relevance:** MEDIUM — values-based matching exists in career guidance literature, but the specific implementation for the reentry population with record-aware recommendations adds novelty.

### IP-15: Reentry-Specific AI Career Coaching System (HIGH VALUE)

**What it does:** An AI career coaching conversation specifically designed for formerly incarcerated people, with:
- 8-exchange progressive disclosure flow adapted for reentry (skills from inside, barrier awareness, restriction assessment)
- Safety guardrails (crisis detection, no charge disclosure, no judgment)
- 19+ career paths the AI can recommend, each with background-check-specific knowledge
- Report generation with barriers field and specific next steps (not just "look into trades" but "contact your local IBEW chapter, mention the Fair Chance program")

**Why it's novel:** No existing career guidance AI has been designed for this population with this level of domain-specific knowledge about background checks, hiring practices, and reentry-specific resources.

**Where:** `app/api/chat/route.ts` — full SYSTEM prompt

**Patent relevance:** HIGH — the domain-specific AI coaching system for reentry is novel and commercially valuable.

---

## IP PORTFOLIO SUMMARY

### By Platform

| Platform | IP Assets | High Value | Medium | Low |
|----------|-----------|-----------|--------|-----|
| transformlearning.ai | 5 (IP 1-5) | 3 | 1 | 1 |
| findmyway.today | 5 (IP 6-10) | 2 | 2 | 1 |
| NewChapter | 5 (IP 11-15) | 4 | 1 | 0 |
| **Total** | **15** | **9** | **4** | **2** |

### Recommended Filing Priority

**Tier 1 — File provisionals immediately (highest novelty + commercial value):**
1. IP-1: Learning Genuineness Score *(already drafted)*
2. IP-2: Governed AI Proficiency Pipeline *(already drafted)*
3. IP-3: Integrated Multi-Source Proficiency Estimation *(already drafted)*
4. IP-6: Multi-Modal Career Assessment Aggregation
5. IP-11: Scenario-to-Professional-Skill Translation Engine
6. IP-12: Background-Check-Aware Career Matching Taxonomy
7. IP-13: Tiered Situation Assessment & Action Plan Generator

**Tier 2 — File within 3 months (strong novelty, moderate urgency):**
8. IP-7: Contextual AI Career Report with Personalization Constraint
9. IP-15: Reentry-Specific AI Career Coaching System
10. IP-4: Bayesian Competency Estimation with Item Calibration (extends IP-3)

**Tier 3 — File if budget allows (moderate novelty):**
11. IP-8: Reaction-Based Alternative Path Discovery
12. IP-10: Counselor Auto-Delivery Integration
13. IP-14: Values-First Career Matching for Reentry

**Do not file:**
- IP-5: Access Revocation (standard pattern)
- IP-9: Bilingual Scoring Parity (standard i18n)

### Cross-Platform Patent Strategy

The strongest portfolio position combines IP from all three platforms into a unified filing strategy:

**Umbrella patent concept:** "System and Method for AI-Powered Career Guidance Across Populations Using Multi-Modal Assessment, Competency Estimation, and Governed Recommendation Generation"

This umbrella would cover:
- The assessment methodology (games, quizzes, AI conversations) → IP-6, IP-7
- The scoring/estimation engine (Bayesian, genuineness, governance) → IP-1, IP-2, IP-3
- The recommendation generation (personalized, barrier-aware, tiered) → IP-11, IP-12, IP-13, IP-15
- The population-specific adaptation (students, high schoolers, reentry) → all platforms

### Critical Deadlines

| Event | Date | Deadline |
|-------|------|----------|
| transformlearning.ai methodology first public | ~April 4, 2026 | File by April 3, 2027 |
| findmyway.today launched | ~March 2026 | File by March 2027 |
| NewChapter deployed | April 15, 2026 | File by April 14, 2027 |

**Recommendation:** File Tier 1 provisionals within 60 days. The one-year clock is running on all public disclosures.
