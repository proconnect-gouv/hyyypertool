//

import { Main_Layout } from "#src/layouts";
import { GetBanaticUrl } from "#src/lib/organizations/usecase";
import type { App_Context } from "#src/middleware/context";
import {
  GetDomainCount,
  GetOrganizationMembersCount,
} from "#src/queries/organizations";
import { zValidator } from "@hono/zod-validator";
import { EntitySchema } from "@~/core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import organization_domains_router from "./domains";
import { get_organization_by_id } from "./get_organization_by_id.query";
import organization_members_router from "./members";
import Organization_Page from "./page";

//

export default new Hono<App_Context>()
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator("param", EntitySchema),
    async function GET({ render, req, set, var: { config, identite_pg } }) {
      const { id } = req.valid("param");

      const organization = await get_organization_by_id(identite_pg, id);

      const siren = organization.siret.substring(0, 9);
      const get_banatic_url = GetBanaticUrl({
        http_timout: config.HTTP_CLIENT_TIMEOUT,
      });

      const { url: banaticUrl } = await get_banatic_url(siren);
      const domains_count = await GetDomainCount(identite_pg)(id);
      const members_count = await GetOrganizationMembersCount(identite_pg)(id);

      set(
        "page_title",
        `Organisation ${organization.cached_libelle} (${organization.siret})`,
      );
      return render(
        <Organization_Page
          banaticUrl={banaticUrl}
          organization={organization}
          domains_count={domains_count}
          members_count={members_count}
        />,
      );
    },
  )
  //
  .route("/members", organization_members_router)
  .route("/domains", organization_domains_router);
