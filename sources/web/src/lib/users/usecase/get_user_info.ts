import { NotFoundError } from "#src/errors";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";

export async function get_user_info(
  pg: IdentiteProconnectPgDatabase,
  id: number,
) {
  const organization = await pg.query.users.findFirst({
    columns: {
      id: true,
      email: true,
      given_name: true,
      family_name: true,
      phone_number: true,
      job: true,
      last_sign_in_at: true,
      created_at: true,
      sign_in_count: true,
    },
    where: (table, { eq }) => eq(table.id, id),
  });

  if (!organization) throw new NotFoundError(`User ${id} not found.`);
  return organization;
}

export type GetUserInfoHandler = typeof get_user_info;
export type GetUserInfoOutput = Awaited<ReturnType<GetUserInfoHandler>>;
