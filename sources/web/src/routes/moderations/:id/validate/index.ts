//

import { HTTPError, NotFoundError, is_unique_violation } from "#src/errors";
import type { HtmxHeader } from "#src/htmx";
import {
  MODERATION_EVENTS,
  ValidateSimilarModerations,
  build_moderation_update,
  send_crisp_notification,
  validate_form_schema,
} from "#src/lib/moderations";
import {
  AddVerifiedDomain,
  GetFicheOrganizationById,
} from "#src/lib/organizations/usecase";
import type { AppContext } from "#src/middleware/context";
import {
  GetModerationWithUser,
  UpdateModerationById,
} from "#src/queries/moderations";
import { UpdateUserByIdInOrganization } from "#src/queries/users";
import { EntitySchema, z_email_domain } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import {
  EmailDomainRepository,
  MarkDomainAsVerified,
  OrganizationRepository,
} from "@~/identite-proconnect/sdk";
import {
  EmailDomainApprovedVerificationTypes,
  EmailDomainVerificationTypes,
  LinkTypes,
  type EmailDomain,
} from "@~/identite-proconnect/types";
import { to } from "await-to-js";
import consola from "consola";
import { Hono } from "hono";
import { dedent } from "ts-dedent";
import { P, match } from "ts-pattern";

//

const param_schema = EntitySchema;
const form_schema = validate_form_schema;
//

export default new Hono<AppContext>().patch(
  "/",
  zValidator("param", param_schema),
  zValidator("form", form_schema),
  async function PATCH({
    text,
    req,
    notFound,
    env: config,
    var: { crisp, identite_pg_client, identite_pg, userinfo, sentry },
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
    const link_user_to_organization =
      OrganizationRepository.linkUserToOrganizationFactory({
        pg: identite_pg_client,
      });
    const validate_similar_moderations =
      ValidateSimilarModerations(identite_pg);
    const find_organization_by_id = GetFicheOrganizationById({
      pg: identite_pg,
    });
    const find_email_domains_by_organization_id =
      EmailDomainRepository.findEmailDomainsByOrganizationIdFactory({
        pg: identite_pg_client,
      });
    const update_moderation_by_id = UpdateModerationById({ pg: identite_pg });
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
    const email_domains =
      await find_email_domains_by_organization_id(organization_id);
    const link_verification_type =
      verification_type ??
      deduce_verification_type_from_organization_domains(email_domains, domain);

    const [link_error] = await to(
      link_user_to_organization({
        organization_id,
        user_id,
        is_external,
        verification_type: link_verification_type,
      }),
    );

    if (link_error) {
      if (!is_unique_violation(link_error)) throw link_error;

      await update_user_by_id_in_organization(
        { organization_id, user_id },
        { is_external, verification_type: link_verification_type },
      );
    }
    //#endregion

    //#region ✨ Send notification
    if (send_notification) {
      const { cached_libelle, siret } =
        await find_organization_by_id(organization_id);

      const [, operator] = await to(crisp.get_user({ email: userinfo.email }));
      const sender = operator ?? { nickname: userinfo.email };

      const { session_id } = await send_crisp_notification(crisp, {
        ticket_id: moderation.ticket_id ?? undefined,
        email: moderation.user.email,
        subject: `[ProConnect] Demande pour rejoindre ${cached_libelle || siret}`,
        nickname: moderation.user.email,
        content: ModerationProcessedMessage({
          baseurl: config.API_AUTH_URL,
          email: moderation.user.email,
          libelle: cached_libelle || siret,
        }),
        sender,
      });

      if (!moderation.ticket_id) {
        await update_moderation_by_id(moderation.id, {
          ticket_id: session_id,
        });
      }

      await new Promise((resolve) =>
        setTimeout(resolve, config.CRISP_RESOLVE_DELAY),
      );

      await crisp.mark_conversation_as_resolved({ session_id });
    }
    //#endregion

    //#region ✨ Mark moderation as validated
    const update = build_moderation_update({
      comment: moderation.comment,
      userinfo,
      reason: "[ProConnect] ✨ Modération validée",
      type: "VALIDATED",
    });
    await update_moderation_by_id(moderation.id, update);
    //#endregion

    return text("OK", 200, {
      "HX-Trigger": [MODERATION_EVENTS.enum.MODERATION_UPDATED].join(", "),
    } as HtmxHeader);
  },
);

function deduce_verification_type_from_organization_domains(
  email_domains: EmailDomain[],
  user_domain: string,
) {
  return email_domains.some(
    ({ domain, verification_type }) =>
      domain === user_domain &&
      EmailDomainVerificationTypes.extract(
        EmailDomainApprovedVerificationTypes,
      ).safeParse(verification_type).success,
  )
    ? LinkTypes.enum.domain
    : LinkTypes.enum.no_validation_means_available;
}

export function ModerationProcessedMessage({
  baseurl,
  libelle,
  email,
}: {
  baseurl: string;
  libelle: string;
  email: string;
}) {
  return dedent`
    Bonjour,

    Le rattachement de votre compte ProConnect (${email}) à l'organisation « ${libelle} » a été validée sur ${baseurl}.

    Vous pouvez à présent vous connecter sur le service en ligne souhaité.

    Nous restons à votre disposition pour toute information complémentaire.

    Excellente journée,
    L'équipe ProConnect.
  `;
}
