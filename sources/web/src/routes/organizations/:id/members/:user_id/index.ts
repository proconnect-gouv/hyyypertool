//

import type { HtmxHeader } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import type { App_Context } from "#src/middleware/context";
import { RemoveUserFromOrganization } from "#src/queries/moderations";
import { zValidator } from "@hono/zod-validator";
import { EntitySchema, z_coerce_boolean } from "@~/core/schema";
import { schema } from "@~/identite-proconnect/database";
import { ForceJoinOrganization } from "@~/identite-proconnect/sdk";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod/v4";

//
const params_schema = EntitySchema.extend({
  user_id: z.string().pipe(z.coerce.number()),
});
export default new Hono<App_Context>()
  //
  .post(
    "/",
    zValidator(
      "form",
      z.object({
        is_external: z.string().pipe(z_coerce_boolean),
      }),
    ),
    zValidator("param", params_schema),
    async function POST({ text, req, var: { identite_pg_client } }) {
      const { id: organization_id, user_id } = req.valid("param");
      const { is_external } = req.valid("form");

      const join_organization = ForceJoinOrganization(identite_pg_client);
      await join_organization({
        is_external,
        organization_id,
        user_id,
      });

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.enum.MEMBERS_UPDATED,
      } as HtmxHeader);
    },
  )
  .patch(
    "/",
    zValidator("param", params_schema),
    zValidator(
      "form",
      z.object({
        verification_type: VerificationTypeSchema.or(z.literal("")).optional(),
        is_external: z.string().pipe(z_coerce_boolean).optional(),
      }),
    ),
    async function PATCH({ text, req, var: { identite_pg } }) {
      const { id: organization_id, user_id } = req.valid("param");
      const { verification_type, is_external } = req.valid("form");
      const no_verification_type = verification_type === "";

      await identite_pg
        .update(schema.users_organizations)
        .set({
          is_external,
          verification_type: no_verification_type ? null : verification_type,
          verified_at: no_verification_type ? null : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .where(
          and(
            eq(schema.users_organizations.organization_id, organization_id),
            eq(schema.users_organizations.user_id, user_id),
          ),
        );

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
    async function DELETE({ text, req, var: { identite_pg } }) {
      const { id: organization_id, user_id } = req.valid("param");

      const remove_user_from_organization = RemoveUserFromOrganization({
        pg: identite_pg,
      });
      await remove_user_from_organization({
        organization_id,
        user_id,
      });

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.enum.MEMBERS_UPDATED,
      } as HtmxHeader);
    },
  );
