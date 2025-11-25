//
import { schema, type IdentiteProconnectPgDatabase } from "..";
//
export async function insert_email_deliverability_whitelist(
  pg: IdentiteProconnectPgDatabase,
) {
  return pg
    .insert(schema.email_deliverability_whitelist)
    .values([
      {
        problematic_email: "test@ch-lehavre.fr",
        email_domain: "ch-lehavre.fr",
        verified_by: "🧟‍♂️ zombie admin",
        verified_at: "2024-01-01T12:00:00Z",
      },
      {
        problematic_email: "test@ccduserein.fr",
        email_domain: "ccduserein.fr",
        verified_by: "🧟‍♂️ zombie admin",
        verified_at: "2024-01-01T12:00:00Z",
      },
      {
        problematic_email: "zombie3@birds-audiovisuel.fr",
        email_domain: "birds-audiovisuel.fr",
        verified_by: "🧟‍♂️ zombie admin",
        verified_at: "2024-01-01T12:00:00Z",
      },
    ])
    .returning();
}
