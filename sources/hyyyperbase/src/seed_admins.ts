//

import { as_god, roles, type HyyyperPgDatabase } from "#src";
import consola from "consola";
import * as schema from "./schema";

//

export async function seed_admins(db: HyyyperPgDatabase, emails: string[]) {
  if (emails.length === 0) return;

  consola.info(`🌱 Seeding ${emails.length} admin user(s)...`);

  await as_god(db, async (tx) => {
    for (const email of emails) {
      const [user] = await tx
        .insert(schema.users)
        .values({ email, role: roles.enum.admin })
        .onConflictDoUpdate({
          target: schema.users.email,
          set: { role: roles.enum.admin, updated_at: new Date() },
        })
        .returning({ id: schema.users.id, email: schema.users.email });

      consola.info(`  ✓ ${user?.email} (id: ${user?.id})`);
    }
  });

  consola.info("🌱 Admin seeding complete.");
}
