//

import { NotFoundError } from "#src/errors";
import { Main_Layout } from "#src/layouts";
import { moderation_type_to_title } from "#src/lib/moderations";
import { GetBanaticUrl } from "#src/lib/organizations/usecase";
import type { App_Context } from "#src/middleware/context";
import { GetModerationWithDetails } from "#src/queries/moderations";
import {
  GetDomainCount,
  GetOrganizationMember,
  GetOrganizationMembersCount,
} from "#src/queries/organizations";
import { zValidator } from "@hono/zod-validator";
import { EntitySchema, z_email_domain } from "@~/core/schema";
import { to } from "await-to-js";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import duplicate_warning_router from "./duplicate_warning";
import moderation_email_router from "./email/index";
import { get_organization_by_id } from "./get_organization_by_id.query";
import { ModerationNotFound } from "./not-found";
import Page from "./page";
import moderation_processed_router from "./processed";
import moderation_rejected_router from "./rejected";
import moderation_reprocess_router from "./reprocess";
import moderation_validate_router from "./validate";

//

export default new Hono<App_Context>()
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("param", EntitySchema),
    async function GET({
      render,
      req,
      set,
      status,
      var: { identite_pg, config },
    }) {
      const { id } = req.valid("param");

      try {
        // Load moderation with full details
        const get_moderation_with_details =
          GetModerationWithDetails(identite_pg);
        const [moderation_error, moderation] = await to(
          get_moderation_with_details(id),
        );

        if (moderation_error) {
          throw moderation_error;
        }

        // Extract domain from user email
        const domain = z_email_domain.parse(moderation.user.email);

        // Load organization member details
        const get_organization_member = GetOrganizationMember(identite_pg);
        const organization_member = await get_organization_member({
          organization_id: moderation.organization_id,
          user_id: moderation.user.id,
        });

        // Load organization details

        const organization_fiche = await get_organization_by_id(
          identite_pg,
          moderation.organization_id,
        );

        // Get Banatic URL for organization
        const siren = organization_fiche.siret.substring(0, 9);
        const get_banatic_url = GetBanaticUrl({
          http_timout: config.HTTP_CLIENT_TIMEOUT,
        });
        const banaticUrl = (await get_banatic_url(siren)).url;

        // Prepare query functions for page components
        const get_organization_members_count =
          GetOrganizationMembersCount(identite_pg);
        const get_domain_count = GetDomainCount(identite_pg);

        const page_data = {
          banaticUrl,
          domain,
          moderation,
          organization_fiche,
          organization_member,
          query_domain_count: get_domain_count(moderation.organization_id),
          query_organization_members_count: get_organization_members_count(
            moderation.organization_id,
          ),
        };

        set(
          "page_title",
          `Modération ${moderation_type_to_title(page_data.moderation.type).toLowerCase()} de ${page_data.moderation.user.given_name} ${page_data.moderation.user.family_name} pour ${page_data.moderation.organization.siret}`,
        );

        return render(<Page {...page_data} identite_pg={identite_pg} />);
      } catch (error) {
        if (error instanceof NotFoundError) {
          status(404);
          return render(<ModerationNotFound moderation_id={id} />);
        }
        throw error;
      }
    },
  )
  .route("/email", moderation_email_router)
  .route("/duplicate_warning", duplicate_warning_router)
  .route("/validate", moderation_validate_router)
  .route("/rejected", moderation_rejected_router)
  .route("/processed", moderation_processed_router)
  .route("/reprocess", moderation_reprocess_router);
