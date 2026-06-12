// ── Plan helpers — single source of truth ────────────────────────────────────
// When Paddle is ready: read the user's plan from the profiles table here,
// then update getUserPlan() and isVotingEnabled() — nowhere else.
// ─────────────────────────────────────────────────────────────────────────────

export const FREE_BOARD_LIMIT = 3

export function getUserPlan() {
  // TODO: read from profiles table once payments are live
  return 'free'
}

export function isVotingEnabled() {
  // TODO: return true when getUserPlan() === 'pro' || 'lifetime'
  return false
}
