//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "#src/htmx";
import {
  DescribedBy_Schema,
  Entity_Schema,
  Id_Schema,
} from "@~/app.core/schema";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { EmailDomain_Type_Schema } from "@~/identite-proconnect.lib/email_domain";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import {
  AddAuthorizedDomain,
  RemoveDomainEmailById,
} from "@~/organizations.lib/usecase";
import { update_domain_by_id } from "@~/organizations.repository/update_domain_by_id";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import { loadDomainsPageVariables, type ContextType } from "./context";
import { Add_Domain, Table } from "./Table";

//

const DomainParams_Schema = z.object({ domain_id: Id_Schema });

//

export default new Hono<ContextType>()
  .get(
    "/",
    jsxRenderer(),
    zValidator("param", Entity_Schema),
    zValidator("query", DescribedBy_Schema),
    async function set_variables_middleware(
      { req, set, var: { identite_pg } },
      next,
    ) {
      const { id: organization_id } = req.valid("param");
      const variables = await loadDomainsPageVariables(identite_pg, {
        organization_id,
      });
      set_variables(set, variables);
      return next();
    },
    async function GET({ render }) {
      return render(
        <>
          <Table />
          <Add_Domain />
        </>,
      );
    },
  )
  .put(
    "/",
    zValidator("param", Entity_Schema),
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
      } as Htmx_Header);
    },
  )
  .delete(
    "/:domain_id",
    zValidator("param", Entity_Schema.merge(DomainParams_Schema)),
    async function DELETE({ text, req, var: { identite_pg } }) {
      const { domain_id } = req.valid("param");

      const remove_domain_email_by_id = RemoveDomainEmailById({
        pg: identite_pg,
      });
      await remove_domain_email_by_id(domain_id);

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.enum.DOMAIN_UPDATED,
      } as Htmx_Header);
    },
  )
  .patch(
    "/:domain_id",
    zValidator("param", Entity_Schema.merge(DomainParams_Schema)),
    zValidator(
      "query",
      z.object({
        type: EmailDomain_Type_Schema.or(
          z.literal("null").transform(() => null),
        ),
      }),
    ),
    async function PATCH({ text, req, var: { identite_pg } }) {
      const { domain_id } = req.valid("param");
      const { type: verification_type } = req.valid("query");

      await update_domain_by_id(identite_pg, domain_id, {
        verification_type: EmailDomain_Type_Schema.parse(
          verification_type,
        ) as any,
        verified_at:
          verification_type === "verified"
            ? new Date().toISOString()
            : undefined,
      });

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.enum.DOMAIN_UPDATED,
      } as Htmx_Header);
    },
  );
