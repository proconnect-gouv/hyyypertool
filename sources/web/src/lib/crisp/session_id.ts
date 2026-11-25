//

import { z } from "zod";

//

export const CrispSessionId = z
  .string()
  .trim()
  .startsWith("session_")
  .brand<"CrispSessionId">();
export type CrispSessionId = z.infer<typeof CrispSessionId>;

export function parse_ticket_id(ticket_id: string | null) {
  const parsed = CrispSessionId.safeParse(ticket_id);
  return parsed.success
    ? ({ kind: "crisp_session", session_id: parsed.data } as const)
    : ({ kind: "no_crisp_session" } as const);
}
