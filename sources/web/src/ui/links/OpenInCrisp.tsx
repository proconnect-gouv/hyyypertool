//

import type { Child } from "hono/jsx";
import { CRISP_APP_BASE_URL, create_link } from "#src/lib/crisp";

//
/**
 *
 * @example
 * ```tsx
 * <OpenInCrisp session_id={moderation.session_id}>
 *   #{moderation.session_id}
 * </OpenInCrisp>
 * ```
 */

export function OpenInCrisp({
  base_url = CRISP_APP_BASE_URL,
  children,
  session_id,
  website_id,
}: {
  base_url?: string;
  children: Child;
  session_id: string;
  website_id: string;
}) {
  return (
    <a
      href={create_link({ base_url, website_id }).session(session_id)}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

export function short_session_id(session_id: string) {
  return session_id.replace("session_", "").slice(0, 7);
}
