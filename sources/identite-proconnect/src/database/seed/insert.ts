//

import { MODERATION_TYPES } from "#src/types";
import consola from "consola";
import type { IdentiteProconnectPgDatabase } from "..";
import { schema } from "..";
import { insert_nordPass_authenticator } from "./authenticators/nordPass";
import { insert_1Password_authenticator } from "./authenticators/onePassword";
import { insert_email_deliverability_whitelist } from "./email_deliverability_whitelist";
import { insert_abracadabra } from "./organizations/abracadabra";
import { insert_aldp } from "./organizations/aldp";
import { insert_bosch_france } from "./organizations/bosch_france";
import { insert_bosch_rexroth } from "./organizations/bosch_rexroth";
import { insert_commune_de_pompierre } from "./organizations/commune_de_pompierre";
import { insert_dengi } from "./organizations/dengi";
import { insert_dinum } from "./organizations/dinum";
import { insert_sak } from "./organizations/sak";
import { insert_yes_we_hack } from "./organizations/yes_we_hack";
import { insert_jeanbon } from "./users/jeanbon";
import { insert_jeandre } from "./users/jeandre";
import { insert_mariebon } from "./users/mariebon";
import { insert_pierrebon } from "./users/pierrebon";
import { insert_raphael } from "./users/raphael";
import { insert_raphael_alpha } from "./users/raphael_alpha";
import { insert_richardbon } from "./users/richardbon";

//

export async function insert_database(db: IdentiteProconnectPgDatabase) {
  try {
    const raphael = await insert_raphael(db);
    consola.verbose(
      `🌱 INSERT user ${raphael.given_name} ${raphael.family_name}`,
    );
    const raphael_alpha = await insert_raphael_alpha(db);
    consola.verbose(
      `🌱 INSERT user ${raphael_alpha.given_name} ${raphael_alpha.family_name}`,
    );
    const jean_bon = await insert_jeanbon(db);
    consola.verbose(
      `🌱 INSERT user ${jean_bon.given_name} ${jean_bon.family_name}`,
    );
    const jean_dre = await insert_jeandre(db);
    consola.verbose(
      `🌱 INSERT user ${jean_dre.given_name} ${jean_dre.family_name}`,
    );
    const pierre_bon = await insert_pierrebon(db);
    consola.verbose(
      `🌱 INSERT user ${pierre_bon.given_name} ${pierre_bon.family_name}`,
    );
    const richard_bon = await insert_richardbon(db);
    consola.verbose(
      `🌱 INSERT user ${richard_bon.given_name} ${richard_bon.family_name}`,
    );
    const marie_bon = await insert_mariebon(db);
    consola.verbose(`🌱 INSERT user (id: ${marie_bon})`);

    const whitelisted_domains = await insert_email_deliverability_whitelist(db);
    consola.verbose(
      `🌱 INSERT ${whitelisted_domains.length} whitelisted email domains`,
    );

    //

    const dinum = await insert_dinum(db);
    consola.verbose(`🌱 INSERT organization ${dinum.cached_nom_complet}`);
    const aldp = await insert_aldp(db);
    consola.verbose(`🌱 INSERT organization ${aldp.cached_nom_complet}`);
    const abracadabra = await insert_abracadabra(db);
    consola.verbose(`🌱 INSERT organization ${abracadabra.cached_nom_complet}`);
    const dengi = await insert_dengi(db);
    consola.verbose(`🌱 INSERT organization ${dengi.cached_nom_complet}`);
    const bosch_france = await insert_bosch_france(db);
    consola.verbose(`🌱 INSERT organization (id: ${bosch_france})`);
    const bosch_rexroth = await insert_bosch_rexroth(db);
    consola.verbose(`🌱 INSERT organization (id: ${bosch_rexroth})`);

    const sak = await insert_sak(db);
    consola.verbose(`🌱 INSERT organization ${sak.cached_nom_complet}`);
    const yes_we_hack = await insert_yes_we_hack(db);
    consola.verbose(`🌱 INSERT organization yes_we_hack (id: ${yes_we_hack})`);
    const commune_de_pompierre = await insert_commune_de_pompierre(db);
    consola.verbose(
      `🌱 INSERT organization commune_de_pompierre (id: ${commune_de_pompierre})`,
    );

    //

    await insert_users_organizations(db, {
      organization_id: dinum.id,
      user_id: raphael.id,
      verification_type: "domain_not_verified_yet",
    });
    consola.verbose(
      `🌱 INSERT ${raphael.given_name} join ${dinum.cached_libelle} `,
    );

    await insert_users_organizations(db, {
      organization_id: bosch_rexroth,
      user_id: marie_bon,
      verification_type: "domain_not_verified_yet",
    });
    consola.verbose(`🌱 INSERT ${marie_bon} join ${bosch_rexroth}`);

    //

    await insert_moderation(db, {
      created_at: "2011-11-11T12:11:11+02:00",
      organization_id: dinum.id,
      type: MODERATION_TYPES.enum.organization_join_block,
      user_id: jean_bon.id,
      ticket_id: "115793",
      status: "pending",
    });
    consola.verbose(
      `🌱 INSERT ${jean_bon.given_name} wants to join ${dinum.cached_libelle}`,
    );

    await insert_moderation(db, {
      created_at: "2011-11-11T01:02:59+02:00",
      organization_id: abracadabra.id,
      status: "pending",
      ticket_id: "session_456",
      type: MODERATION_TYPES.enum.organization_join_block,
      user_id: jean_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${jean_bon.given_name} wants to join ${abracadabra.cached_libelle}`,
    );

    await insert_moderation(db, {
      created_at: "2011-11-11T01:03:15+02:00",
      organization_id: abracadabra.id,
      status: "pending",
      ticket_id: "session_789",
      type: MODERATION_TYPES.enum.organization_join_block,
      user_id: jean_dre.id,
    });
    consola.verbose(
      `🌱 INSERT ${jean_dre.given_name} wants to join ${abracadabra.cached_libelle}`,
    );

    await insert_moderation(db, {
      organization_id: aldp.id,
      type: MODERATION_TYPES.enum.big_organization_join,
      user_id: pierre_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${pierre_bon.family_name} wants to join  ${aldp.cached_libelle}`,
    );

    await insert_moderation(db, {
      comment: [
        "1687445474000 moderateur@example.com | Validé par moderateur@example.com",
      ].join("\n"),
      moderated_at: "2023-06-22T16:34:34+02:00",
      organization_id: dengi.id,
      status: "accepted",
      ticket_id: "session_789",
      type: MODERATION_TYPES.enum.organization_join_block,
      user_id: richard_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${richard_bon.given_name} wants to join ${dengi.cached_nom_complet}`,
    );

    await insert_moderation(db, {
      organization_id: dengi.id,
      status: "pending",
      ticket_id: "session_321",
      type: MODERATION_TYPES.enum.organization_join_block,
      user_id: richard_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${richard_bon.given_name} wants to join ${dengi.cached_nom_complet} again...`,
    );

    await insert_moderation(db, {
      organization_id: bosch_france,
      status: "pending",
      ticket_id: "session_654",
      type: MODERATION_TYPES.enum.non_verified_domain,
      user_id: marie_bon,
    });
    consola.verbose(
      `🌱 INSERT ${marie_bon} wants to join ${bosch_france} again...`,
    );

    await insert_moderation(db, {
      comment: [
        '1687430000000 support@example.com | Rejeté par support@example.com | Raison : "Documents manquants"',
        "1687438000000 admin@example.com | Réouverte par admin@example.com",
        "1687445474000 moderateur@example.com | Validé par moderateur@example.com",
      ].join("\n"),
      created_at: "2011-11-12T12:11:12+02:00",
      moderated_at: "2023-06-22T16:34:34+02:00",
      moderated_by: "moderateur@example.com",
      organization_id: bosch_rexroth,
      status: "accepted",
      ticket_id: "session_987",
      type: MODERATION_TYPES.enum.non_verified_domain,
      user_id: marie_bon,
    });
    consola.verbose(
      `🌱 INSERT ${marie_bon} wants to join ${bosch_rexroth} again...`,
    );
    await insert_moderation(db, {
      comment:
        '1687445474000 moderateur@example.com | Rejeté par moderateur@example.com | Raison : "Domaine non autorisé"',
      moderated_at: "2023-06-22T16:34:34+02:00",
      organization_id: dinum.id,
      status: "rejected",
      ticket_id: "session_111",
      type: MODERATION_TYPES.enum.non_verified_domain,
      user_id: raphael_alpha.id,
    });
    consola.verbose(
      `🌱 INSERT ${raphael_alpha.given_name} wants to join ${dinum.cached_nom_complet} again...`,
    );
    await insert_1Password_authenticator(db, raphael_alpha.id);
    consola.verbose(
      `🌱 INSERT ${raphael_alpha.given_name} OnePassword setup...`,
    );
    await insert_nordPass_authenticator(db, raphael_alpha.id);
    consola.verbose(`🌱 INSERT ${raphael_alpha.given_name} NordPass setup...`);
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}

//

function insert_moderation(
  db: IdentiteProconnectPgDatabase,
  insert_moderation: typeof schema.moderations.$inferInsert,
) {
  return db.insert(schema.moderations).values(insert_moderation);
}

function insert_users_organizations(
  db: IdentiteProconnectPgDatabase,
  insert_users_organizations: typeof schema.users_organizations.$inferInsert,
) {
  return db
    .insert(schema.users_organizations)
    .values(insert_users_organizations);
}
