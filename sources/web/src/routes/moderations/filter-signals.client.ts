/**
 * Shared Signals for Moderation Filter Components
 *
 * These signals are shared across SearchEmail, SearchSiret, and ProcessedCheckbox
 * components to enable reactive auto-checking behavior.
 */

import { signal } from "@preact/signals";

export const searchEmail = signal("");
export const searchSiret = signal("");
