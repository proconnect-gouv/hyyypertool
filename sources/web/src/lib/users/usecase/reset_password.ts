import type { CrispApiCradle } from "#src/lib/crisp";
import { z_username } from "#src/schema";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import { to as await_to } from "await-to-js";
import { eq } from "drizzle-orm";
import { reset_password_message } from "../templates";
import { get_user_info } from "./get_user_info";

export type ResetPasswordInput = {
  moderator: { email: string };
  user_id: number;
};

export async function reset_password(
  {
    crisp,
    pg,
    resolve_delay,
  }: IdentiteProconnectDatabaseCradle &
    CrispApiCradle & { resolve_delay: number },
  { moderator, user_id }: ResetPasswordInput,
) {
  await pg
    .update(schema.users)
    .set({
      encrypted_password: null,
    })
    .where(eq(schema.users.id, user_id));

  const { email, given_name, family_name } = await get_user_info(pg, user_id);
  const nickname = z_username.parse({ given_name, usual_name: family_name });
  const { session_id } = await crisp.create_conversation({
    email,
    subject:
      "[ProConnect] - Instructions pour la réinitialisation du mot de passe",
    nickname,
  });

  const [, found_user] = await await_to(
    crisp.get_user({ email: moderator.email }),
  );
  const user = found_user ?? {
    nickname: z_username.parse(moderator),
    email: moderator.email,
  };

  await crisp.send_message({
    content: reset_password_message(),
    session_id,
    user,
  });

  await new Promise((resolve) => setTimeout(resolve, resolve_delay));

  await crisp.mark_conversation_as_resolved({ session_id });
}

export type ResetPasswordHandler = typeof reset_password;
