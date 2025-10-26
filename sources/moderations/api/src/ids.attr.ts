/**
 * Stable HTML attribute IDs for the Moderations domain
 *
 * These IDs are used for:
 * - HTMX out-of-band (oob) swaps: hx-swap="outerHTML" hx-select="#moderation-status"
 * - JavaScript element selection: document.getElementById("moderation-123-status")
 * - HTMX targeting: hx-target="#moderation-123-status"
 *
 * Pattern: `domain-resource-purpose-id` (e.g., "moderation-123-status")
 * Type-safe generation via builder functions
 */

type EntityId = number | string;

// HTML ID builders (without # prefix)
const ids = {
  status: (id: EntityId) => `moderation-${id}-status` as const,
  header: (id: EntityId) => `moderation-${id}-header` as const,
  exchanges: (id: EntityId) => `moderation-${id}-exchanges` as const,
  form: (id: EntityId) => `moderation-${id}-form` as const,
  actions: (id: EntityId) => `moderation-${id}-actions` as const,
} as const;

// CSS selectors (with # prefix for HTMX)
const targets = {
  status: (id: EntityId) => `#${ids.status(id)}` as const,
  header: (id: EntityId) => `#${ids.header(id)}` as const,
  exchanges: (id: EntityId) => `#${ids.exchanges(id)}` as const,
  form: (id: EntityId) => `#${ids.form(id)}` as const,
  actions: (id: EntityId) => `#${ids.actions(id)}` as const,
} as const;

export const moderation_attrs = {
  ids,
  targets,
} as const;
