export const ROLES = { FACULTY: 'faculty', STUDENT: 'student' }

export function isFaculty(profile) { return profile?.role === ROLES.FACULTY }
export function isStudent(profile) { return profile?.role === ROLES.STUDENT }

export function requireFaculty(profile) {
  if (!isFaculty(profile)) throw new Error('Faculty access required')
}
