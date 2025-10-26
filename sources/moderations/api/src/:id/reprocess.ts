//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { ReprocessModerationById } from "@~/moderations.lib/usecase/ReprocessModerationById";
import {
  GetModerationById,
  RemoveUserFromOrganization,
  UpdateModerationById,
} from "@~/moderations.repository";
import { Hono } from "hono";

//

export default new Hono<App_Context>().patch(
  "/",
  zValidator("param", Entity_Schema),
  async ({ text, req, var: { identite_pg, userinfo } }) => {
    const { id } = req.valid("param");

    const reprocess_moderation_by_id = ReprocessModerationById({
      get_moderation_by_id: GetModerationById({ pg: identite_pg }),
      remove_user_from_organization: RemoveUserFromOrganization({
        pg: identite_pg,
      }),
      update_moderation_by_id: UpdateModerationById({ pg: identite_pg }),
      userinfo,
    });

    await reprocess_moderation_by_id(id);

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);
