//

import type { IdentiteProconnectPgDatabase } from "..";
import { schema } from "..";

//

export async function insert_activities(
  db: IdentiteProconnectPgDatabase,
  {
    abracadabra_id,
    bosch_france_id,
    bosch_rexroth_id,
    dengi_id,
    dinum_id,
    jean_bon_dinum_moderation_id,
    jean_bon_id,
    marie_bon_id,
    raphael_alpha_id,
    raphael_id,
  }: {
    abracadabra_id: number;
    bosch_france_id: number;
    bosch_rexroth_id: number;
    dengi_id: number;
    dinum_id: number;
    jean_bon_dinum_moderation_id: number;
    jean_bon_id: number;
    marie_bon_id: number;
    raphael_alpha_id: number;
    raphael_id: number;
  },
) {
  const moderator = {
    actor_ref: "oidc-sub-moderateur",
    actor_type: "moderator",
    app: "hyyypertool",
  };

  const [{ id: domain_verified_id } = { id: NaN }] = await db
    .insert(schema.activity_logs)
    .values({
      action: "domain.verified",
      ...moderator,
      context: {
        inputs: { domain: "beta.gouv.fr", verification_type: "verified" },
        outcome: { email_domain_id: 1, replaced_verification_types: [] },
      },
      created_at: "2024-02-01T09:00:00+01:00",
      organization_id: dinum_id,
    })
    .returning({ id: schema.activity_logs.id });

  const activities = [
    {
      action: "domain.refused",
      ...moderator,
      context: {
        inputs: { domain: "abracadabra.com", verification_type: "refused" },
        outcome: {
          email_domain_id: 2,
          replaced_verification_types: ["not_verified_yet"],
        },
      },
      created_at: "2024-02-02T09:00:00+01:00",
      organization_id: abracadabra_id,
    },
    {
      action: "domain.removed",
      ...moderator,
      context: {
        inputs: { domain: "scapartois.fr" },
        outcome: {
          email_domain_id: 3,
          previous_verification_type: "verified",
        },
      },
      created_at: "2024-02-03T09:00:00+01:00",
      organization_id: dengi_id,
    },
    {
      action: "member.joined",
      ...moderator,
      context: {
        inputs: {
          is_external: false,
          verification_type: "domain_not_verified_yet",
        },
        outcome: {},
      },
      created_at: "2024-02-04T09:00:00+01:00",
      organization_id: dinum_id,
      user_id: raphael_id,
    },
    {
      action: "member.promoted",
      actor_ref: "domain.promote_members",
      actor_type: "app",
      app: "proconnect-identite",
      cause_activity_id: domain_verified_id,
      context: {
        inputs: { previous_verification_type: "domain_not_verified_yet" },
        outcome: { verification_type: "domain" },
      },
      created_at: "2024-02-05T09:00:00+01:00",
      organization_id: dinum_id,
      user_id: raphael_id,
    },
    {
      action: "member.removed",
      ...moderator,
      context: {
        inputs: {},
        outcome: {
          is_external: false,
          verification_type: "domain_not_verified_yet",
        },
      },
      created_at: "2024-02-06T09:00:00+01:00",
      organization_id: bosch_france_id,
      user_id: marie_bon_id,
    },
    {
      action: "member.updated",
      ...moderator,
      context: {
        inputs: { is_external: true, verification_type: "domain" },
        outcome: {
          previous: {
            is_external: false,
            verification_type: "domain_not_verified_yet",
          },
        },
      },
      created_at: "2024-02-07T09:00:00+01:00",
      organization_id: bosch_rexroth_id,
      user_id: marie_bon_id,
    },
    {
      action: "moderation.opened",
      actor_ref: String(jean_bon_id),
      actor_type: "user",
      app: "proconnect-identite",
      context: {
        inputs: {
          sp_name: "Annuaire des entreprises",
          type: "organization_join_block",
        },
        outcome: {},
      },
      created_at: "2024-02-08T09:00:00+01:00",
      moderation_id: jean_bon_dinum_moderation_id,
      organization_id: dinum_id,
      user_id: jean_bon_id,
    },
    {
      action: "user.deleted",
      ...moderator,
      context: {
        inputs: { user_id: 999 },
        outcome: {
          email: "supprime@yopmail.com",
          family_name: "Supprimé",
          given_name: "Jean",
          memberships: [],
        },
      },
      created_at: "2024-02-09T09:00:00+01:00",
    },
    {
      action: "user.mfa_reset",
      ...moderator,
      context: {
        inputs: { user_id: raphael_alpha_id },
        outcome: {
          previous: {
            authenticators: 2,
            email_verified: false,
            force_2fa: true,
            password_configured: false,
            totp_configured: true,
          },
        },
      },
      created_at: "2024-02-10T09:00:00+01:00",
      user_id: raphael_alpha_id,
    },
    {
      action: "franceconnect.connected",
      actor_ref: String(raphael_alpha_id),
      actor_type: "user",
      app: "proconnect-identite",
      context: {
        inputs: {},
        outcome: { connected_at: "2024-02-11T10:00:00+01:00" },
      },
      created_at: "2024-02-11T10:00:00+01:00",
      user_id: raphael_alpha_id,
    },
    {
      action: "franceconnect.disconnected",
      actor_ref: String(raphael_alpha_id),
      actor_type: "user",
      app: "proconnect-identite",
      context: {
        inputs: {},
        outcome: { connected_at: "2024-02-12T10:00:00+01:00" },
      },
      created_at: "2024-02-12T10:00:00+01:00",
      user_id: raphael_alpha_id,
    },
  ] satisfies Array<typeof schema.activity_logs.$inferInsert>;

  await db.insert(schema.activity_logs).values(activities);

  return activities.length + 1;
}
