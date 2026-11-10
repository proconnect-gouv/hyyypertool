//

import { NotFoundError } from "#src/errors";
import type { HtmxHeader } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import { remove_member_from_organization } from "#src/lib/users";
import { editor_guard } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import { EntitySchema } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";
import { Hono } from "hono";
import { match } from "ts-pattern";
import { z } from "zod";

//
const params_schema = EntitySchema.extend({
  user_id: z.string().pipe(z.coerce.number()),
});
export default new Hono<AppContext>()
  .use(editor_guard())
  .patch(
    "/",
    zValidator("param", params_schema),
    zValidator(
      "form",
      z.object({
        verification_type: VerificationTypeSchema.optional(),
        is_external: z.stringbool().optional(),
      }),
    ),
    async function PATCH({ text, req, var: { identite_runtime } }) {
      const { id: organization_id, user_id } = req.valid("param");
      const { verification_type, is_external } = req.valid("form");

      const outcome = await identite_runtime.updateMembership({
        is_external,
        organization_id,
        user_id,
        verification_type,
      });

      match(outcome)
        .with(
          { kind: "member_updated" },
          { kind: "membership_unchanged" },
          () => {},
        )
        .with({ kind: "membership_not_found" }, () => {
          throw new NotFoundError("Membership not found.");
        })
        .exhaustive();

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.enum.MEMBERS_UPDATED,
      } as HtmxHeader);
    },
  )
  .delete(
    "/",
    zValidator(
      "param",
      EntitySchema.extend({ user_id: z.string().pipe(z.coerce.number()) }),
    ),
    async function DELETE({
      text,
      req,
      env: config,
      var: { crisp, identite_pg, identite_runtime, userinfo },
    }) {
      const { id: organization_id, user_id } = req.valid("param");

      await remove_member_from_organization(
        {
          crisp,
          pg: identite_pg,
          resolve_delay: config.CRISP_RESOLVE_DELAY,
          runtime: identite_runtime,
        },
        {
          moderator: userinfo,
          organization_id,
          user_id,
        },
      );

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.enum.MEMBERS_UPDATED,
      } as HtmxHeader);
    },
  );
