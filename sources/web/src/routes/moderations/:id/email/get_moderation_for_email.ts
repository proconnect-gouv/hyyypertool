import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { eq } from "drizzle-orm";

export async function get_moderation_for_email(
  pg: IdentiteProconnect_PgDatabase,
  moderation_id: number,
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: { ticket_id: true },
    where: eq(schema.moderations.id, moderation_id),
    with: { user: { columns: { email: true } } },
  });

  if (!moderation) {
    throw new NotFoundError("Moderation not found");
  }

  return moderation;
}

export type GetModerationForEmailDto = Awaited<
  ReturnType<typeof get_moderation_for_email>
>;
