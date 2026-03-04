//

import type { HtmxHeader } from "#src/htmx";
import {
  MODERATION_EVENTS,
  build_moderation_update,
} from "#src/lib/moderations";
import type { UserInfoVariablesContext } from "#src/middleware/auth";
import type { IdentiteProconnectPgContext } from "#src/middleware/identite-pg";
import {
  GetModerationWithUser,
  UpdateModerationById,
  type GetModerationWithUserDto,
} from "#src/queries/moderations";
import { EntitySchema } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { Hono } from "hono";

//

async function mark_as_processed(
  pg: IdentiteProconnectPgDatabase,
  moderation: GetModerationWithUserDto,
  userinfo: { email: string; given_name: string; usual_name: string },
) {
  const update = build_moderation_update({
    comment: moderation.comment,
    userinfo,
    reason: "DUPLICATE",
    type: "REJECTED",
  });

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation.id, update);
}

//

export default new Hono<
  IdentiteProconnectPgContext & UserInfoVariablesContext
>().patch(
  "/",
  zValidator("param", EntitySchema),
  async ({ text, req, notFound, var: { identite_pg, userinfo } }) => {
    const { id } = req.valid("param");

    const get_moderation_with_user = GetModerationWithUser(identite_pg);
    const moderation = await get_moderation_with_user(id);

    if (!moderation) return notFound();

    await mark_as_processed(identite_pg, moderation, userinfo);

    return text("OK", 200, {
      "HX-Trigger": [
        MODERATION_EVENTS.enum.MODERATION_EMAIL_UPDATED,
        MODERATION_EVENTS.enum.MODERATION_UPDATED,
      ].join(", "),
    } as HtmxHeader);
  },
);
