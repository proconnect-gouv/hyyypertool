import { schema, type IdentiteProconnectPgDatabase } from "../..";

export function insert_1Password_authenticator(
  db: IdentiteProconnectPgDatabase,
  user_id: number,
) {
  return db.insert(schema.authenticators).values({
    created_at: "2023-06-23T03:33:33+02:00",
    display_name: "1Password",
    last_used_at: "2023-06-24T04:44:44+02:00",
    usage_count: 5,
    credential_id: "1",
    credential_public_key: Buffer.from("mock-credential-key-data", "utf8"),
    counter: 0,
    credential_backed_up: false,
    user_id,
  });
}
