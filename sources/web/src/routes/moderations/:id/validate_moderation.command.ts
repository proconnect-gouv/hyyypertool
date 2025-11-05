//

import { NotFoundError } from "#src/errors";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { schema } from "@~/identite-proconnect.database";
import {
  append_comment,
  type Comment_Type,
} from "@~/moderations/rules/comment_formatting";
import { can_approve } from "@~/moderations/rules/validation_rules";
import { format_moderated_by } from "@~/moderations/utils/user_formatting";
import { eq } from "drizzle-orm";
import { to_database_update, to_domain_state } from "./moderation.adapter";

//

type UserInfo = {
  email: string;
  given_name: string;
  usual_name?: string;
};

//

/**
 * Thin command: Mark moderation as validated
 *
 * Orchestration logic (add domain, join org, etc.) stays in the route.
 * This command only handles the final state transition.
 */
export async function validate_moderation(
  pg: IdentiteProconnect_PgDatabase,
  id: number,
  userinfo: UserInfo,
  reason?: string,
): Promise<void> {
  const moderation = await pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, id),
  });

  if (!moderation) {
    throw new NotFoundError("Moderation not found");
  }

  const state = to_domain_state(moderation);

  if (!can_approve(state)) {
    throw new Error(`Cannot approve moderation in state: ${state.status}`);
  }

  const timestamp = new Date().toISOString();
  const update = to_database_update(
    { approve: true, user: format_moderated_by(userinfo) },
    timestamp,
  );

  const comment_type: Comment_Type = {
    type: "VALIDATED",
    created_by: userinfo.email,
    reason,
  };
  const updated_comment = append_comment(moderation.comment, comment_type);

  await pg
    .update(schema.moderations)
    .set({
      ...update,
      comment: updated_comment,
    })
    .where(eq(schema.moderations.id, id));
}

//
