// ── Plan helpers — single source of truth ────────────────────────────────────
// When Paddle is ready: read the user's plan from the profiles table here,
// then update getUserPlan() and isVotingEnabled() — nowhere else.
// ─────────────────────────────────────────────────────────────────────────────

export const FREE_BOARD_LIMIT = 3

// Temporary superuser allowlist while Paddle approval is pending.
// Remove this (or leave it, it won't conflict) once real plan checks are live.
const SUPERUSER_EMAILS = ['tenkaro@icloud.com']

export function getUserPlan(email) {
  if (email && SUPERUSER_EMAILS.includes(email)) return 'pro'
  // TODO: read from profiles table once payments are live
  return 'free'
}

export function isVotingEnabled(email) {
  if (email && SUPERUSER_EMAILS.includes(email)) return true
  // TODO: return true when getUserPlan() === 'pro' || 'lifetime'
  return false
}
