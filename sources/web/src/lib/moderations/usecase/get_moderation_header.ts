import { NotFoundError } from "#src/errors";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";

export async function get_moderation_header(
  pg: IdentiteProconnectPgDatabase,
  id: number,
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: {
      comment: true,
      created_at: true,
      id: true,
      moderated_at: true,
      moderated_by: true,
      sp_name: true,
      status: true,
      type: true,
    },
    where: (table, { eq }) => eq(table.id, id),
    with: {
      organization: {
        columns: {
          cached_libelle: true,
          id: true,
        },
      },
      user: {
        columns: {
          email: true,
          family_name: true,
          given_name: true,
          id: true,
        },
      },
    },
  });
  if (!moderation) throw new NotFoundError("Moderaion not found.");
  return moderation;
}

export type GetModerationHeaderHandler = typeof get_moderation_header;
export type GetModerationHeaderOutput = Awaited<
  ReturnType<GetModerationHeaderHandler>
>;
