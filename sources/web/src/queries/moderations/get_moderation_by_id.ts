import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

type ModerationColumns = keyof typeof schema.moderations._.columns;

export async function get_moderation_by_id<
  TColumns extends Partial<Record<ModerationColumns, true>>,
>(
  pg: IdentiteProconnectPgDatabase,
  { columns, id }: { columns: TColumns; id: number },
) {
  const moderation = await pg.query.moderations.findFirst({
    columns,
    where: eq(schema.moderations.id, id),
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");

  return moderation;
}

export type GetModerationByIdHandler = typeof get_moderation_by_id;
