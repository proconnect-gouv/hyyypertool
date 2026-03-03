//

import { BadRequestError, NotFoundError } from "#src/errors";
import type { HtmxHeader } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import {
  AddVerifiedDomain,
  GetFicheOrganizationById,
  RemoveDomainEmailById,
} from "#src/lib/organizations/usecase";
import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { DescribedBySchema, EntitySchema, IdSchema } from "@~/core/schema";
import { MarkDomainAsVerified } from "@~/identite-proconnect/sdk";
import { EmailDomainVerificationTypes } from "@~/identite-proconnect/types";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import { patch_query } from "./context";
import { get_organization_domains } from "./get_organization_domains.query";
import { AddDomain, Table } from "./Table";

//

const DomainParams_Schema = z.object({ domain_id: IdSchema });

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
    async function PUT({
      text,
      req,
      var: { identite_pg, identite_pg_client },
    }) {
      const { id: organization_id } = req.valid("param");
      const { domain } = req.valid("form");

      if (domain.includes("@"))
        throw new BadRequestError(
          "Domain should not contain the '@' character",
        );

      const add_verified_domain = AddVerifiedDomain({
        get_organization_by_id: GetFicheOrganizationById({ pg: identite_pg }),
        mark_domain_as_verified: MarkDomainAsVerified(identite_pg_client),
      });

      await add_verified_domain({
        domain,
        domain_verification_type: EmailDomainVerificationTypes.enum.verified,
        organization_id,
      });

      return text("OK", 200, {
        "HX-Trigger": [
          ORGANISATION_EVENTS.enum.DOMAIN_UPDATED,
          ORGANISATION_EVENTS.enum.MEMBERS_UPDATED,
        ].join(", "),
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
    zValidator("query", patch_query),
    async function PATCH({
      text,
      req,
      var: { identite_pg, identite_pg_client },
    }) {
      const { domain_id } = req.valid("param");
      const { type: verification_type } = req.valid("query");
      const mark_domain_as_verified = MarkDomainAsVerified(identite_pg_client);

      const email_domain = await identite_pg.query.email_domains.findFirst({
        columns: { domain: true, organization_id: true },
        where: (fields, { eq }) => eq(fields.id, domain_id),
      });
      if (!email_domain) throw new NotFoundError("Domain not found");
      const { domain, organization_id } = email_domain;

      await mark_domain_as_verified({
        domain: domain,
        domain_verification_type: verification_type,
        organization_id,
      });

      return text("OK", 200, {
        "HX-Trigger": [
          ORGANISATION_EVENTS.enum.DOMAIN_UPDATED,
          ORGANISATION_EVENTS.enum.MEMBERS_UPDATED,
        ].join(", "),
      } as HtmxHeader);
    },
  );
