/**
 * Business rules for moderation state transitions.
 *
 * These are pure functions that encode business logic
 * without any database or I/O dependencies.
 */

import type { ModerationState } from "#src/state/moderation_state";

/**
 * Determines if a moderation can be approved.
 *
 * Business rule: Only pending moderations can be approved.
 */
export function can_approve(state: ModerationState): boolean {
  return state.status === "pending";
}

/**
 * Determines if a moderation can be rejected.
 *
 * Business rule: Only pending moderations can be rejected.
 */
export function can_reject(state: ModerationState): boolean {
  return state.status === "pending";
}

/**
 * Determines if a moderation can be reprocessed.
 *
 * Business rule: Only approved or rejected moderations can be reprocessed.
 */
export function can_reprocess(state: ModerationState): boolean {
  return state.status === "approved" || state.status === "rejected";
}
