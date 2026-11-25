import type { CrispMessageWire } from "#src/lib/crisp";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { asc, eq } from "drizzle-orm";

//

export const CRISP_MESSAGES_BATCH_SIZE = 10;
export const SEEDED_CRISP_SESSION_ID = "session_jean_dinum";

export async function seeded_crisp_subject(
  pg: IdentiteProconnectPgDatabase,
  session_id: string,
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: {},
    orderBy: asc(schema.moderations.id),
    where: eq(schema.moderations.ticket_id, session_id),
    with: { organization: { columns: { cached_libelle: true } } },
  });
  return moderation
    ? `[ProConnect] Demande pour rejoindre ${moderation.organization.cached_libelle}`
    : "";
}

export function seeded_crisp_messages(
  session_id: string,
  website_id: string,
): CrispMessageWire[] {
  const is_long_conversation = session_id === SEEDED_CRISP_SESSION_ID;
  const count = is_long_conversation ? 42 : 4;

  return Array.from({ length: count }, (_, index) => {
    const label = `Message ${String(index + 1).padStart(2, "0")}`;
    const run = is_long_conversation ? Math.floor(index / 3) : index;
    const by_operator = run % 2 === 1;
    const message = {
      fingerprint: index + 1,
      from: by_operator ? ("operator" as const) : ("user" as const),
      session_id,
      timestamp:
        1_700_000_000_000 +
        run * 12 * 60 * 60_000 +
        (is_long_conversation ? (index % 3) * 5 * 60_000 : 0),
      user: { nickname: by_operator ? "Maude Rateur" : "Jean Bon" },
      website_id,
    };
    if (!is_long_conversation)
      return { ...message, content: label, type: "text" };
    if (index === count - 1)
      return {
        ...message,
        content: { namespace: "state:resolved" },
        type: "event",
      };
    if (index % 3 === 2)
      return {
        ...message,
        content: {
          name: `${label}.pdf`,
          type: "application/pdf",
          url: `https://example.com/${session_id}/${index + 1}.pdf`,
        },
        type: "file",
      };
    return {
      ...message,
      content: label,
      type: by_operator && index % 3 === 1 ? "note" : "text",
    };
  });
}

export function crisp_messages_batch(
  messages: CrispMessageWire[],
  timestamp_before: number | undefined,
) {
  const older =
    timestamp_before === undefined
      ? messages
      : messages.filter(({ timestamp }) => timestamp < timestamp_before);
  return older.slice(-CRISP_MESSAGES_BATCH_SIZE);
}
