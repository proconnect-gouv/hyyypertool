//

import type { HtmxHeader } from "#src/htmx";
import { MODERATION_EVENTS, append_comment } from "#src/lib/moderations";
import type { AppContext } from "#src/middleware/context";
import {
  get_moderation_by_id,
  remove_user_from_organization,
  update_moderation_by_id,
} from "#src/queries/moderations";
import { EntitySchema } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { ModerationStatusSchema } from "@~/identite-proconnect/types";
import { Hono } from "hono";

//

async function mark_as_reprocessed(
  pg: IdentiteProconnectPgDatabase,
  id: number,
  userinfo: { email: string },
) {
  const moderation = await get_moderation_by_id(pg, {
    columns: { comment: true, organization_id: true, user_id: true },
    id,
  });

  const comment = append_comment(moderation.comment, {
    type: "REPROCESSED",
    created_by: userinfo.email,
  });

  await remove_user_from_organization(pg, {
    organization_id: moderation.organization_id,
    user_id: moderation.user_id,
  });

  await update_moderation_by_id(pg, {
    id,
    values: {
      comment,
      moderated_at: null,
      moderated_by: null,
      status: ModerationStatusSchema.enum.reopened,
    },
  });
}

//

export default new Hono<AppContext>().patch(
  "/",
  zValidator("param", EntitySchema),
  async ({ text, req, var: { identite_pg, userinfo } }) => {
    const { id } = req.valid("param");

    await mark_as_reprocessed(identite_pg, id, userinfo);

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.enum.MODERATION_UPDATED,
    } as HtmxHeader);
  },
);
