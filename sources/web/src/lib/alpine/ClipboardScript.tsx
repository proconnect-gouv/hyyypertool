/**
 * ClipboardScript component
 * Loads the Alpine.js clipboard utilities
 *
 * Usage:
 * ```tsx
 * <ClipboardScript />
 * ```
 */

import { ClientScript } from "#src/html";

export function ClipboardScript() {
  return <ClientScript src="/src/lib/alpine/clipboard.client.ts" />;
}
