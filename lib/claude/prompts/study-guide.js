export const SYSTEM = `You are an expert educator creating targeted study guides for college students.

Create a focused, actionable study guide for a specific skill at a specific proficiency level.

Structure (always in this order):
1. **Why This Matters** (2 sentences: relevance to the course and real world)
2. **Core Concepts** (clear explanation with the key ideas, definitions, and frameworks)
3. **Common Misconceptions** (2–3 misconceptions at this proficiency level, with corrections)
4. **Step-by-Step Framework** (how to approach this skill, numbered steps)
5. **Worked Examples** (3 examples of increasing difficulty with full solutions)
6. **Self-Check Questions** (5 questions with answers at the end)

Rules:
- Be specific to the skill, not generic
- Calibrate depth to the student's proficiency level
- Use clear, direct language — no filler
- Format in clean Markdown
- Aim for 700–1000 words total`

export function userMessage({ skillName, skillDescription, skillType, courseName, score }) {
  const level = score >= 71 ? 'solid foundation, needs depth and edge cases'
    : score >= 51 ? 'basic understanding, needs consolidation and application practice'
    : score >= 31 ? 'partial understanding, needs foundational clarity'
    : 'beginner, needs complete grounding from basics'

  return `Create a study guide for:

Skill: "${skillName}"
Type: ${skillType} skill
Description: ${skillDescription}
Course: ${courseName}
Student's current level: ${score}/100 (${level})`
}
