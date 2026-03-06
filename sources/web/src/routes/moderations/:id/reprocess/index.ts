//

import type { HtmxHeader } from "#src/htmx";
import { MODERATION_EVENTS, append_comment } from "#src/lib/moderations";
import type { AppContext } from "#src/middleware/context";
import {
  GetModerationById,
  RemoveUserFromOrganization,
  UpdateModerationById,
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
  const get_moderation_by_id = GetModerationById({ pg });
  const remove_user_from_organization = RemoveUserFromOrganization({ pg });
  const update_moderation_by_id = UpdateModerationById({ pg });

  const moderation = await get_moderation_by_id(id, {
    columns: { comment: true, organization_id: true, user_id: true },
  });

  const comment = append_comment(moderation.comment, {
    type: "REPROCESSED",
    created_by: userinfo.email,
  });

  await remove_user_from_organization({
    organization_id: moderation.organization_id,
    user_id: moderation.user_id,
  });

  await update_moderation_by_id(id, {
    comment,
    moderated_at: null,
    moderated_by: null,
    status: ModerationStatusSchema.enum.reopened,
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
