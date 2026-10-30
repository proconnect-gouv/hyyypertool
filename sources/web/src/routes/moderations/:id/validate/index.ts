//

import { HTTPError, NotFoundError } from "#src/errors";
import type { HtmxHeader } from "#src/htmx";
import { identite_runtime } from "#src/lib/activities";
import {
  MODERATION_EVENTS,
  build_moderation_update,
  send_crisp_notification,
  validate_form_schema,
  validate_similar_moderations,
} from "#src/lib/moderations";
import {
  change_email_domain_verification,
  get_fiche_organization_by_id,
} from "#src/lib/organizations/usecase";
import type { AppContext } from "#src/middleware/context";
import {
  get_moderation_with_user,
  update_moderation_by_id,
} from "#src/queries/moderations";
import { get_organization_domains } from "#src/queries/organizations";
import { update_user_by_id_in_organization } from "#src/queries/users";
import { EntitySchema, z_email_domain } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import {
  EmailDomainApprovedVerificationEnum,
  LinkEnum,
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
    var: { crisp, identite_pg, userinfo, sentry },
  }) {
    const { id } = req.valid("param");
    const { add_domain, add_member, send_notification, verification_type } =
      req.valid("form");

    const runtime = identite_runtime(identite_pg).as({
      sub: userinfo.sub,
      type: "moderator",
    });

    const [moderation_error, moderation] = await to(
      get_moderation_with_user(identite_pg, id),
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
        change_email_domain_verification(
          {
            pg: identite_pg,
            sub: userinfo.sub,
          },
          {
            domain,
            organization_id,
            verification_type:
              add_member === "AS_INTERNAL" ? "verified" : "external",
          },
        ),
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

      await validate_similar_moderations(identite_pg, {
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
    const email_domains = await get_organization_domains(identite_pg, {
      organization_id,
    });
    const link_verification_type =
      verification_type ??
      deduce_verification_type_from_organization_domains(email_domains, domain);

    const [join_error, outcome] = await to(
      runtime.addMembership({
        organization_id,
        user_id,
        is_external,
        verification_type: link_verification_type,
      }),
    );

    if (join_error) throw join_error;

    if (outcome.kind === "member_already_exists") {
      await update_user_by_id_in_organization(identite_pg, {
        organization_id,
        user_id,
        values: { is_external, verification_type: link_verification_type },
      });
    }
    //#endregion

    //#region ✨ Send notification
    if (send_notification) {
      const { cached_libelle, siret } = await get_fiche_organization_by_id(
        identite_pg,
        organization_id,
      );

      const [, operator] = await to(crisp.get_user({ email: userinfo.email }));
      const sender = operator ?? { nickname: userinfo.email };

      const { session_id } = await send_crisp_notification(crisp, {
        ticket_id: moderation.ticket_id ?? undefined,
        email: moderation.user.email,
        subject: `[ProConnect] Demande pour rejoindre ${cached_libelle || siret}`,
        nickname: moderation.user.email,
        content: moderation_processed_message({
          baseurl: config.API_AUTH_URL,
          email: moderation.user.email,
          libelle: cached_libelle || siret,
        }),
        sender,
      });

      if (moderation.ticket_id !== session_id) {
        await update_moderation_by_id(identite_pg, {
          id: moderation.id,
          values: { ticket_id: session_id },
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
      end_user_reason: moderation.end_user_reason,
      type: "VALIDATED",
    });
    await update_moderation_by_id(identite_pg, {
      id: moderation.id,
      values: update,
    });
    //#endregion

    return text("OK", 200, {
      "HX-Trigger": [MODERATION_EVENTS.enum.MODERATION_UPDATED].join(", "),
    } as HtmxHeader);
  },
);

function deduce_verification_type_from_organization_domains(
  email_domains: { domain: string; verification_type: string }[],
  user_domain: string,
) {
  return email_domains.some(
    ({ domain, verification_type }) =>
      domain === user_domain &&
      EmailDomainApprovedVerificationEnum.safeParse(verification_type).success,
  )
    ? LinkEnum.enum.domain
    : LinkEnum.enum.no_validation_means_available;
}

export function moderation_processed_message({
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

    Le rattachement de votre compte ProConnect (${email}) à l'organisation « ${libelle} » a été validé sur ProConnect ${baseurl}.

    Vous pouvez à présent vous connecter sur le service en ligne souhaité.

    Nous restons à votre disposition pour toute information complémentaire.

    Excellente journée,
    L'équipe ProConnect.
  `;
}
