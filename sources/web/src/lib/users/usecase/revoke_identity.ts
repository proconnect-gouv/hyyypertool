import type { CrispApiCradle } from "#src/lib/crisp";
import { z_username } from "#src/schema";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import { to as await_to } from "await-to-js";
import { eq } from "drizzle-orm";
import { revoke_identity_message } from "../templates";
import { get_user_info } from "./get_user_info";

export type RevokeIdentityInput = {
  moderator: { email: string };
  user_id: number;
};

export async function revoke_identity(
  {
    crisp,
    pg,
    resolve_delay,
  }: IdentiteProconnectDatabaseCradle &
    CrispApiCradle & { resolve_delay: number },
  { moderator, user_id }: RevokeIdentityInput,
) {
  const { email, given_name, family_name } = await get_user_info(pg, user_id);
  const nickname = z_username.parse({ given_name, usual_name: family_name });

  const [, found_user] = await await_to(
    crisp.get_user({ email: moderator.email }),
  );
  const user = found_user ?? {
    nickname: z_username.parse(moderator),
    email: moderator.email,
  };

  await pg
    .update(schema.users)
    .set({
      email_verified: false,
    })
    .where(eq(schema.users.id, user_id));

  const { session_id } = await crisp.create_conversation({
    email,
    subject:
      "[ProConnect] - Réinitialisation de la vérification de votre adresse email",
    nickname,
  });

  await crisp.send_message({
    content: revoke_identity_message(),
    session_id,
    user,
  });

  await new Promise((resolve) => setTimeout(resolve, resolve_delay));

  await crisp.mark_conversation_as_resolved({ session_id });
}

export type RevokeIdentityHandler = typeof revoke_identity;
