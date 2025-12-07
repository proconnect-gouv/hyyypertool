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
import { createIsland } from "../../lib/create-island";
import { NotificationContainer } from "./notifications.client";

//

export const NotificationIsland = createIsland({
  component: NotificationContainer,
  clientPath: `${config.PUBLIC_ASSETS_PATH}/ui/notifications/notifications.client.js`,
  mode: "render",
  exportName: "NotificationContainer",
  tagName: "x-notification-island",
  rootTagName: "x-notification-island-root",
});
