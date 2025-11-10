//

import { NotFoundError } from "@~/core/error";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect.database";

export function GetModerationHeader({ pg }: IdentiteProconnectDatabaseCradle) {
  return async function get_moderation_header(id: number) {
    const moderation = await pg.query.moderations.findFirst({
      columns: {
        comment: true,
        created_at: true,
        id: true,
        moderated_at: true,
        moderated_by: true,
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
  };
}

export type GetModerationHeaderHandler = ReturnType<typeof GetModerationHeader>;
export type GetModerationHeaderOutput = Awaited<
  ReturnType<GetModerationHeaderHandler>
>;
