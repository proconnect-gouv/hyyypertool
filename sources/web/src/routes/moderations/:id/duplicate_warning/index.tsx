//

import { zValidator } from "@hono/zod-validator";
import type { App_Context } from "#src/middleware/context";
import { Entity_Schema } from "@~/core/schema";
import { GetDuplicateModerations } from "#src/queries/moderations";
import { GetUserById } from "#src/queries/users";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import { DuplicateWarning } from "./DuplicateWarning";
import { get_duplicate_users } from "./get-duplicate-users.query";
import { get_moderation } from "./get-moderation.query";
import { get_moderation_tickets } from "./get-moderation-tickets.query";

//

// Validation schemas
const QuerySchema = z.object({
  organization_id: z.coerce.number().int().nonnegative(),
  user_id: z.coerce.number().int().nonnegative(),
});

const ParamSchema = Entity_Schema;

//

export default new Hono<App_Context>().get(
  "/",
  jsxRenderer(),
  zValidator("param", ParamSchema),
  zValidator("query", QuerySchema),
  async function GET({ render, req, var: { identite_pg } }) {
    const { id: moderation_id } = req.valid("param");
    const { organization_id, user_id } = req.valid("query");

    // Load ALL data upfront - clear, explicit, testable
    const get_duplicate_moderations = GetDuplicateModerations(identite_pg);
    const get_user_by_id = GetUserById(identite_pg, {
      columns: {
        id: true,
        email: true,
        given_name: true,
        family_name: true,
      },
    });

    const moderations = await get_duplicate_moderations({
      organization_id,
      user_id,
    });
    const user = await get_user_by_id(user_id);
    const duplicate_users = await get_duplicate_users(identite_pg, moderation_id);
    const moderation = await get_moderation(identite_pg, moderation_id);
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
