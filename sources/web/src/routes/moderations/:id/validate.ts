//

import { HTTPError, NotFoundError } from "#src/errors";
import type { Htmx_Header } from "#src/htmx";
import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { Entity_Schema, z_email_domain } from "@~/core/schema";
import { send_moderation_processed_email } from "@~/identite-proconnect.lib/index";
import {
  ForceJoinOrganization,
  MarkDomainAsVerified,
} from "@~/identite-proconnect.lib/sdk";
import { MODERATION_EVENTS } from "#src/lib/moderations";
import { validate_form_schema } from "#src/lib/moderations";
import { mark_moderation_as } from "#src/lib/moderations";
import { MemberJoinOrganization } from "#src/lib/moderations";
import { ValidateSimilarModerations } from "#src/lib/moderations";
import {
  GetModerationById,
  GetModerationWithUser,
} from "#src/queries/moderations";
import {
  AddVerifiedDomain,
  GetFicheOrganizationById,
} from "#src/lib/organizations/usecase";
import { GetMember, UpdateUserByIdInOrganization } from "#src/queries/users";
import { to } from "await-to-js";
import consola from "consola";
import { Hono } from "hono";
import { P, match } from "ts-pattern";

//

export default new Hono<App_Context>().patch(
  "/",
  zValidator("param", Entity_Schema),
  zValidator("form", validate_form_schema),
  async function PATCH({
    text,
    req,
    notFound,
    var: { identite_pg_client, identite_pg, userinfo, sentry },
  }) {
    const { id } = req.valid("param");
    const { add_domain, add_member, send_notification, verification_type } =
      req.valid("form");

    //#region 💉 Inject dependencies
    const add_verified_domain = AddVerifiedDomain({
      get_organization_by_id: GetFicheOrganizationById({ pg: identite_pg }),
      mark_domain_as_verified: MarkDomainAsVerified(identite_pg_client),
    });
    const get_moderation_with_user = GetModerationWithUser(identite_pg);
    const update_user_by_id_in_organization = UpdateUserByIdInOrganization({
      pg: identite_pg,
    });
    const validate_similar_moderations =
      ValidateSimilarModerations(identite_pg);
    //#endregion

    const [moderation_error, moderation] = await to(
      get_moderation_with_user(id),
    );

    if (moderation_error) {
      if (moderation_error instanceof NotFoundError) return notFound();
      throw moderation_error;
    }

    const {
      organization_id,
      user_id,
      user: { email },
    } = moderation;
    const domain = z_email_domain.parse(email);

    //#region ✨ Add verified domain
    if (add_domain) {
      const [domain_error] = await to(
        add_verified_domain({
          organization_id,
          domain,
          domain_verification_type:
            add_member === "AS_INTERNAL" ? "verified" : "external",
        }),
      );

      match(domain_error)
        .with(P.instanceOf(HTTPError), () => {
          consola.error(domain_error);
          sentry.captureException(domain_error, {
            data: { domain, organization_id: id },
          });
        })
        .with(P.instanceOf(Error), () => {
          consola.error(domain_error);
          throw domain_error;
        });

      await validate_similar_moderations({
        organization_id,
        domain,
        domain_verification_type:
          add_member === "AS_INTERNAL" ? "verified" : "external",
        userinfo,
      });
    }
    //#endregion

    //#region ✨ Member join organization
    const is_external = match(add_member)
      .with("AS_INTERNAL", () => false)
      .with("AS_EXTERNAL", () => true)
      .exhaustive();

    const member_join_organization = MemberJoinOrganization({
      force_join_organization: ForceJoinOrganization(identite_pg_client),
      get_member: GetMember({
        pg: identite_pg,
        columns: { updated_at: true },
      }),
      get_moderation_by_id: GetModerationById({ pg: identite_pg }),
    });
    const [join_error] = await to(
      member_join_organization({ is_external, moderation_id: id }),
    );

    match(join_error)
      .with(P.instanceOf(HTTPError), () => {
        consola.error(join_error);
        sentry.captureException(join_error, {
          data: { domain, organization_id: id },
        });
      })
      .with(P.instanceOf(Error), () => {
        consola.error(join_error);
        throw join_error;
      });

    //#endregion

    //#region ✨ Change the verification type of the user in the organization
    if (verification_type) {
      await update_user_by_id_in_organization(
        { organization_id, user_id },
        { verification_type },
      );
    }
    //#endregion

    //#region ✨ Send notification
    if (send_notification) {
      await send_moderation_processed_email({ organization_id, user_id });
    }
    //#endregion

    //#region ✨ Mark moderation as validated
    await mark_moderation_as(
      {
        moderation,
        pg: identite_pg,
        reason: "[ProConnect] ✨ Modeation validée",
        userinfo,
      },
      "VALIDATED",
    );
    //#endregion

    return text("OK", 200, {
      "HX-Trigger": [MODERATION_EVENTS.enum.MODERATION_UPDATED].join(", "),
    } as Htmx_Header);
  },
);
