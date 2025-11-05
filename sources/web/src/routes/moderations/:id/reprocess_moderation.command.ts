//

import { NotFoundError } from "#src/errors";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { schema } from "@~/identite-proconnect.database";
import {
  append_comment,
  type Comment_Type,
} from "@~/moderations/rules/comment_formatting";
import { can_reprocess } from "@~/moderations/rules/validation_rules";
import { and, eq } from "drizzle-orm";
import { to_domain_state } from "./moderation.adapter";

//

type UserInfo = {
  email: string;
  given_name: string;
  usual_name?: string;
};

//

/**
 * Thin command: Reprocess moderation (reset to pending)
 *
 * Removes user from organization and resets moderation to pending state.
 */
export async function reprocess_moderation(
  pg: IdentiteProconnect_PgDatabase,
  id: number,
  userinfo: UserInfo,
): Promise<void> {
  const moderation = await pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, id),
    columns: {
      comment: true,
      created_at: true,
      id: true,
      moderated_at: true,
      moderated_by: true,
      organization_id: true,
      ticket_id: true,
      type: true,
      user_id: true,
    },
  });

  if (!moderation) {
    throw new NotFoundError("Moderation not found");
  }

  const state = to_domain_state(moderation);

  if (!can_reprocess(state)) {
    throw new Error(`Cannot reprocess moderation in state: ${state.status}`);
  }

  // Remove user from organization
  await pg
    .delete(schema.users_organizations)
    .where(
      and(
        eq(
          schema.users_organizations.organization_id,
          moderation.organization_id,
        ),
        eq(schema.users_organizations.user_id, moderation.user_id),
      ),
    );

  // Reset moderation to pending
  const comment_type: Comment_Type = {
    type: "REPROCESSED",
    created_by: userinfo.email,
  };
  const updated_comment = append_comment(moderation.comment, comment_type);

  await pg
    .update(schema.moderations)
    .set({
      moderated_at: null,
      moderated_by: null,
      comment: updated_comment,
    })
    .where(eq(schema.moderations.id, id));
}

//
