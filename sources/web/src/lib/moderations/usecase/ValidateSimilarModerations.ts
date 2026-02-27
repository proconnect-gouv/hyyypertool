//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, eq, ilike, isNull } from "drizzle-orm";
import { build_moderation_update } from "@~/moderations/build_moderation_update";
import { UpdateModerationById } from "#src/queries/moderations";

//

export function ValidateSimilarModerations(pg: IdentiteProconnectPgDatabase) {
  return async function validate_similar_moderations({
    domain_verification_type,
    domain,
    organization_id,
    userinfo,
  }: {
    domain_verification_type: "verified" | "external";
    domain: string;
    organization_id: number;
    userinfo: { email: string; given_name: string; usual_name: string };
  }) {
    // Auto-validate the matching moderations following PCI rules
    const reason =
      domain_verification_type === "verified"
        ? "[ProConnect] ✨ Validation automatique - domaine vérifié"
        : "[ProConnect] ✨ Validation automatique - domaine externe vérifié";

    // Find all pending moderations with matching domain using modern query builder
    const matching_moderations = await pg
      .select({
        comment: schema.moderations.comment,
        id: schema.moderations.id,
        user_id: schema.moderations.user_id,
        user_email: schema.users.email,
      })
      .from(schema.moderations)
      .innerJoin(schema.users, eq(schema.moderations.user_id, schema.users.id))
      .where(
        and(
          eq(schema.moderations.organization_id, organization_id),
          isNull(schema.moderations.moderated_at),
          ilike(schema.users.email, `%@${domain}`),
        ),
      );

    // Early return for empty results
    if (!matching_moderations.length) return [];

    // Atomic batch validation using transaction and Promise.all
    return pg.transaction(async (tx) => {
      const update_moderation_by_id = UpdateModerationById({ pg: tx });
      const validation_promises = matching_moderations.map(
        async (moderation) => {
          const update = build_moderation_update({
            comment: moderation.comment,
            userinfo,
            reason,
            type: "VALIDATED",
          });
          await update_moderation_by_id(moderation.id, update);
          return moderation.id;
        },
      );

      return Promise.all(validation_promises);
    });
  };
}

export type ValidateSimilarModerationsHandler = ReturnType<
  typeof ValidateSimilarModerations
>;
export type ValidateSimilarModerationsDto = Awaited<
  ReturnType<ValidateSimilarModerationsHandler>
>;
