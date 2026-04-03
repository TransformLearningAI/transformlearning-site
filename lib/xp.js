/**
 * XP System — Engagement Units that drive leveling
 *
 * Every meaningful interaction earns XP:
 *   Quiz completed:      +50 XP
 *   Coaching session:    +30 XP
 *   Work uploaded:       +40 XP
 *   Study guide viewed:  +15 XP
 *   Skill mastered (≥80): +100 XP bonus
 *   Daily login streak:  +10 XP per day
 *
 * Levels: 500 XP each, 10 levels total
 *   1: Novice, 2: Explorer, 3: Learner, 4: Scholar,
 *   5: Practitioner, 6: Achiever, 7: Expert, 8: Master,
 *   9: Sage, 10: Luminary
 */

export const XP_REWARDS = {
  quiz_complete: 50,
  coaching_session: 30,
  work_upload: 40,
  study_guide: 15,
  skill_mastered: 100,
  daily_streak: 10,
}

export const LEVELS = [
  'Novice', 'Explorer', 'Learner', 'Scholar', 'Practitioner',
  'Achiever', 'Expert', 'Master', 'Sage', 'Luminary',
]

export const XP_PER_LEVEL = 500

export function getLevel(xp) {
  const level = Math.min(10, Math.floor((xp || 0) / XP_PER_LEVEL) + 1)
  return { level, title: LEVELS[level - 1], xp: xp || 0, progress: ((xp || 0) % XP_PER_LEVEL) / XP_PER_LEVEL }
}

/**
 * Award XP to a student. Call from API routes after actions.
 * Returns the new XP total.
 */
export async function awardXP(supabaseService, userId, amount, reason) {
  // Increment XP
  const { data } = await supabaseService
    .from('profiles')
    .select('xp')
    .eq('id', userId)
    .single()

  const newXP = (data?.xp || 0) + amount

  await supabaseService
    .from('profiles')
    .update({ xp: newXP })
    .eq('id', userId)

  return newXP
}
