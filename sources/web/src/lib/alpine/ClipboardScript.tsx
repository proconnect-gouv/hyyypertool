/**
 * ClipboardScript component
 * Renders a script tag for the clipboard utilities
 *
 * Usage:
 * ```tsx
 * <ClipboardScript />
 * ```
 *
 * This component uses the query parameter plugin to import the client script.
 * The ?url parameter returns the web-relative path for the script.
 */

// @ts-expect-error - Query parameter imports need plugin support
import clipboardUrl from "./clipboard.ts?url";

export function ClipboardScript() {
  return <script type="module" src={clipboardUrl} />;
}
