//

import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { EntitySchema } from "@~/core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod/v4";
import { DuplicateWarning } from "./DuplicateWarning";
import { find_duplicate_users } from "./find_duplicate_users.query";
import { get_duplicate_moderations } from "./get_duplicate_moderations.query";
import { get_moderation } from "./get_moderation.query";
import { get_moderation_tickets } from "./get_moderation_tickets.query";
import { get_user_by_id } from "./get_user_by_id.query";

//

// Validation schemas
const QuerySchema = z.object({
  organization_id: z.coerce.number().int().nonnegative(),
  user_id: z.coerce.number().int().nonnegative(),
});

const ParamSchema = EntitySchema;

//

export default new Hono<App_Context>().get(
  "/",
  jsxRenderer(),
  zValidator("param", ParamSchema),
  zValidator("query", QuerySchema),
  async function GET({ render, req, var: { identite_pg } }) {
    const { id: moderation_id } = req.valid("param");
    const { organization_id, user_id } = req.valid("query");

    const moderations = await get_duplicate_moderations(identite_pg, {
      organization_id,
      user_id,
    });
    const user = await get_user_by_id(identite_pg, user_id);
    const moderation = await get_moderation(identite_pg, moderation_id);
    const duplicate_users = await find_duplicate_users(identite_pg, moderation);
    const moderation_tickets = await get_moderation_tickets(moderations);

    return render(
      <DuplicateWarning
        moderation_id={moderation_id}
        moderations={moderations}
        user={user}
        duplicate_users={duplicate_users}
        moderation={moderation}
        moderation_tickets={moderation_tickets}
      />,
    );
  },
);
