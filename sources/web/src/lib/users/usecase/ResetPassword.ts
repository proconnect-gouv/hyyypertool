//

import { z_username } from "@~/core/schema";
import type { CrispApiCradle } from "#src/lib/crisp";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect.database";
import { to as await_to } from "await-to-js";
import { eq } from "drizzle-orm";
import { ResetPassword_Message } from "../templates";
import { GetUserInfo } from "./GetUserInfo";
//

export function ResetPassword({
  crisp,
  resolve_delay,
  pg,
}: IdentiteProconnectDatabaseCradle &
  CrispApiCradle & { resolve_delay: number }) {
  type ResetPassword_Input = {
    moderator: { email: string };
    user_id: number;
  };
  return async function reset_password({
    moderator,
    user_id,
  }: ResetPassword_Input) {
    await pg
      .update(schema.users)
      .set({
        encrypted_password: null,
      })
      .where(eq(schema.users.id, user_id));

    const get_user = GetUserInfo({ pg });
    const { email, given_name, family_name } = await get_user(user_id);
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
      content: ResetPassword_Message(),
      session_id,
      user,
    });

    await new Promise((resolve) => setTimeout(resolve, resolve_delay));

    await crisp.mark_conversation_as_resolved({ session_id });
  };
}

//

export type ResetPasswordHandler = ReturnType<typeof ResetPassword>;
