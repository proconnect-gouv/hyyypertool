import type { IdentiteProconnect_PgDatabase } from "../..";
import { schema } from "../..";

export async function insert_pierrebon(db: IdentiteProconnect_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: "2022-02-03T12:23:48.375+02:00",
      email: "pierrebon@aldp-asso.fr",
      family_name: "Bon",
      given_name: "Pierre",
      job: "Médiateur sociale et interculturelle",
      email_verified: true,
      phone_number: "0123456789",
      updated_at: "2022-02-03T12:25:06.312+02:00",
      verify_email_sent_at: "2022-02-03T12:25:06.312+02:00",
    })
    .returning();

  return insert.at(0)!;
}
