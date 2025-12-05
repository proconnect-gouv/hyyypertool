/**
 * Notification Island Component (Server-side)
 *
 * Renders a placeholder div and an inline script that imports and mounts
 * the Preact NotificationContainer component.
 *
 * Usage:
 * @example
 * ```tsx
 * // In your layout or page
 * <NotificationIsland nonce={nonce} />
 * ```
 */

import config from "#src/config";
import { randomUUID } from "node:crypto";

//

export function NotificationIsland({ nonce = "" }: { nonce?: string } = {}) {
  const clientPath = `${config.PUBLIC_ASSETS_PATH}/ui/notifications/notifications.client.js`;
  const root_id = randomUUID();
  return (
    <x-notification-island>
      <x-notification-island-root id={root_id} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
import { render, h } from "preact";
import { NotificationContainer } from "${clientPath}";
document.addEventListener('DOMContentLoaded', () => {
  render(h(NotificationContainer, null), document.getElementById("${root_id}"));
});
`,
        }}
        defer
        nonce={nonce}
        type="module"
      />
    </x-notification-island>
  );
}
