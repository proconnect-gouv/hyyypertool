//

import { NotFoundError } from "#src/errors";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { schema } from "@~/identite-proconnect.database";
import { append_comment } from "@~/moderations/rules/comment_formatting";
import { eq } from "drizzle-orm";

//

type UserInfo = {
  email: string;
  given_name: string;
  usual_name?: string;
};

//

/**
 * Thin command: Mark moderation as rejected (duplicate)
 *
 * This handles the state transition only.
 * The route handles any business logic around duplicate detection.
 */
export async function mark_as_rejected(
  pg: IdentiteProconnect_PgDatabase,
  id: number,
  userinfo: UserInfo,
  reason: string = "DUPLICATE",
): Promise<void> {
  // Fetch moderation
  const moderation = await pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, id),
  });

  if (!moderation) {
    throw new NotFoundError("Moderation not found");
  }

  // Build rejection update with comment
  const timestamp = new Date().toISOString();
  const moderated_by = `${userinfo.given_name} ${userinfo.usual_name || ""} <${userinfo.email}>`;

  const comment_type = {
    type: "REJECTED" as const,
    created_by: userinfo.email,
    reason,
  };
  const updated_comment = append_comment(moderation.comment, comment_type);

  // Update moderation
  await pg
    .update(schema.moderations)
    .set({
      moderated_by,
      moderated_at: timestamp,
      comment: updated_comment,
    })
    .where(eq(schema.moderations.id, id));
}
