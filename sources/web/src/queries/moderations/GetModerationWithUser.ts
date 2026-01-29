//

import { NotFoundError } from "#src/errors";
import { type IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";

//

export function GetModerationWithUser(pg: IdentiteProconnectPgDatabase) {
  return async function get_moderation_with_user(moderation_id: number) {
    const moderation = await pg.query.moderations.findFirst({
      columns: {
        id: true,
        comment: true,
        organization_id: true,
        user_id: true,
        ticket_id: true,
      },
      with: { user: { columns: { email: true } } },
      where: (table, { eq }) => eq(table.id, moderation_id),
    });

    if (!moderation) throw new NotFoundError("Moderation not found.");

    return moderation;
  };
}

export type GetModerationWithUserHandler = ReturnType<
  typeof GetModerationWithUser
>;
export type GetModerationWithUserDto = Awaited<
  ReturnType<GetModerationWithUserHandler>
>;
