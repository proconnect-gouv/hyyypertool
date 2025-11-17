//

import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export type ModerationUpdate = Pick<
  typeof schema.moderations.$inferInsert,
  "comment" | "moderated_by" | "moderated_at" | "ticket_id" | "status"
>;

export function UpdateModerationById({ pg }: IdentiteProconnectDatabaseCradle) {
  return function update_moderation_by_id(
    id: number,
    values: ModerationUpdate,
  ) {
    return pg
      .update(schema.moderations)
      .set(values)
      .where(eq(schema.moderations.id, id));
  };
}

//

export type UpdateModerationByIdHandler = ReturnType<
  typeof UpdateModerationById
>;
