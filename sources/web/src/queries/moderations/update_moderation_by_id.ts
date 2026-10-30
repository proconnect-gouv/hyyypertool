import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

export type ModerationUpdate = Pick<
  typeof schema.moderations.$inferInsert,
  | "comment"
  | "moderated_at"
  | "moderated_by"
  | "sp_name"
  | "status"
  | "ticket_id"
  | "end_user_reason"
  | "allow_editing"
>;

export function update_moderation_by_id(
  pg: IdentiteProconnectPgDatabase,
  { id, values }: { id: number; values: ModerationUpdate },
) {
  return pg
    .update(schema.moderations)
    .set(values)
    .where(eq(schema.moderations.id, id));
}

export type UpdateModerationByIdHandler = typeof update_moderation_by_id;
