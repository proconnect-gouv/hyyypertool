//

import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export function GetModerationById({
  pg,
}: {
  pg: IdentiteProconnectPgDatabase;
}) {
  type ModerationColumns = keyof typeof schema.moderations._.columns;
  return async function get_moderation_by_id<
    TColumns extends Partial<Record<ModerationColumns, true>>,
  >(moderation_id: number, { columns }: { columns: TColumns }) {
    const moderation = await pg.query.moderations.findFirst({
      columns,
      where: eq(schema.moderations.id, moderation_id),
    });

    if (!moderation) throw new NotFoundError("Moderation not found.");

    return moderation;
  };
}

export type GetModerationByIdHandler = ReturnType<typeof GetModerationById>;
