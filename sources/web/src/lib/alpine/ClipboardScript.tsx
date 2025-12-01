/**
 * ClipboardScript component
 * Renders a script tag for the clipboard utilities
 *
 * Usage:
 * ```tsx
 * <ClipboardScript />
 * ```
 */

import config from "#src/config";
export function ClipboardScript() {
  return (
    <script
      type="module"
      src={`${config.PUBLIC_ASSETS_PATH}/lib/alpine/clipboard.client.js`}
    />
  );
}
