//

import consola from "consola";
import { sql } from "drizzle-orm";
import type { IdentiteProconnectPgDatabase } from "..";
import { schema } from "..";

//

export async function delete_database(db: IdentiteProconnectPgDatabase) {
  try {
    const activities = await db.delete(schema.activity_logs).returning();
    await db.execute(sql`ALTER SEQUENCE activity_logs_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${activities.length} activity_logs`);

    const authenticators = await db.delete(schema.authenticators).returning();
    consola.info(`🚮 DELETE ${authenticators.length} authenticators`);

    const users_organizations = await db
      .delete(schema.users_organizations)
      .returning();
    consola.info(`🚮 DELETE ${users_organizations.length} users_organizations`);

    const users_oidc_clients = await db
      .delete(schema.users_oidc_clients)
      .returning();
    await db.execute(
      sql`ALTER SEQUENCE users_oidc_clients_id_seq RESTART WITH 1`,
    );
    consola.info(`🚮 DELETE ${users_oidc_clients.length} users_oidc_clients`);

    const oidc_clients = await db.delete(schema.oidc_clients).returning();
    await db.execute(sql`ALTER SEQUENCE oidc_clients_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${oidc_clients.length} oidc_clients`);

    const users = await db.delete(schema.users).returning();
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${users.length} users`);

    const organizations = await db.delete(schema.organizations).returning();
    await db.execute(sql`ALTER SEQUENCE organizations_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${organizations.length} organizations`);

    const moderations = await db.delete(schema.moderations).returning();
    await db.execute(sql`ALTER SEQUENCE moderations_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${moderations.length} moderations`);

    const email_domains = await db.delete(schema.email_domains).returning();
    await db.execute(sql`ALTER SEQUENCE email_domains_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${email_domains.length} moderations`);

    const email_deliverability_whitelist = await db
      .delete(schema.email_deliverability_whitelist)
      .returning();
    consola.info(
      `🚮 DELETE ${email_deliverability_whitelist.length} email delivrability in whitelist`,
    );
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}
