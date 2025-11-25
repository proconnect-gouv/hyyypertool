//

import type { HtmxHeader } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import {
  AddAuthorizedDomain,
  RemoveDomainEmailById,
} from "#src/lib/organizations/usecase";
import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { DescribedBySchema, EntitySchema, IdSchema } from "@~/core/schema";
import { schema } from "@~/identite-proconnect/database";
import {
  EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES,
  EMAIL_DOMAIN_REJECTED_VERIFICATION_TYPES,
} from "@~/identite-proconnect/types";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod/v4";
import { get_organization_domains } from "./get_organization_domains.query";
import { AddDomain, Table } from "./Table";

//

const DomainParams_Schema = z.object({ domain_id: IdSchema });
const EMAIL_DOMAIN_VERIFICATION_TYPES =
  EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES.or(
    EMAIL_DOMAIN_REJECTED_VERIFICATION_TYPES,
  );
//

export default new Hono<App_Context>()
  .get(
    "/",
    jsxRenderer(),
    zValidator("param", EntitySchema),
    zValidator("query", DescribedBySchema),
    async function GET({ render, req, var: { identite_pg } }) {
      const { id: organization_id } = req.valid("param");
      const { describedby } = req.valid("query");

      // Load data directly in handler
      const domains = await get_organization_domains(
        { pg: identite_pg },
        { organization_id },
      );

      return render(
        <>
          <Table domains={domains} describedby={describedby} />
          <AddDomain organization_id={organization_id} />
        </>,
      );
    },
  )
  .put(
    "/",
    zValidator("param", EntitySchema),
    zValidator("form", z.object({ domain: z.string().min(1) })),
    async function PUT({ text, req, var: { identite_pg } }) {
      const { id: organization_id } = req.valid("param");
      const { domain } = req.valid("form");

      const add_authorized_domain = AddAuthorizedDomain({
        pg: identite_pg,
      });

      await add_authorized_domain(organization_id, domain);

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.enum.DOMAIN_UPDATED,
      } as HtmxHeader);
    },
  )
  .delete(
    "/:domain_id",
    zValidator("param", EntitySchema.merge(DomainParams_Schema)),
    async function DELETE({ text, req, var: { identite_pg } }) {
      const { domain_id } = req.valid("param");

      const remove_domain_email_by_id = RemoveDomainEmailById({
        pg: identite_pg,
      });
      await remove_domain_email_by_id(domain_id);

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.enum.DOMAIN_UPDATED,
      } as HtmxHeader);
    },
  )
  .patch(
    "/:domain_id",
    zValidator("param", EntitySchema.merge(DomainParams_Schema)),
    zValidator(
      "query",
      z.object({
        type: EMAIL_DOMAIN_VERIFICATION_TYPES.or(
          z.literal("null").transform(() => null),
        ),
      }),
    ),
    async function PATCH({ text, req, var: { identite_pg } }) {
      const { domain_id } = req.valid("param");
      const { type: verification_type } = req.valid("query");

      await identite_pg
        .update(schema.email_domains)
        .set({
          verification_type,
          verified_at:
            verification_type === "verified" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .where(eq(schema.email_domains.id, domain_id));

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.enum.DOMAIN_UPDATED,
      } as HtmxHeader);
    },
  );
