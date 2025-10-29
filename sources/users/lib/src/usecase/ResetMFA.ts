//

import type { AgentConnect_UserInfo } from "@~/app.middleware/context";
import { z_username } from "@~/core/schema";
import type { CrispApiCradle } from "@~/crisp.lib";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect.database";
import { to as await_to } from "await-to-js";
import { eq } from "drizzle-orm";
import { ResetMFA_Message } from "../templates";
import { GetUserInfo } from "./GetUserInfo";

//

export function ResetMFA({
  crisp,
  pg,
  resolve_delay,
}: IdentiteProconnectDatabaseCradle &
  CrispApiCradle & { resolve_delay: number }) {
  type ResetMFA_Input = { moderator: AgentConnect_UserInfo; user_id: number };
  return async function reset_mfa({ moderator, user_id }: ResetMFA_Input) {
    await pg
      .delete(schema.authenticators)
      .where(eq(schema.authenticators.user_id, user_id));

    await pg
      .update(schema.users)
      .set({
        email_verified: false,
        encrypted_password: null,
        encrypted_totp_key: null,
        force_2fa: false,
        totp_key_verified_at: null,
      })
      .where(eq(schema.users.id, user_id));

    const get_user = GetUserInfo({ pg });
    const { email, given_name, family_name } = await get_user(user_id);
    const nickname = z_username.parse({ given_name, usual_name: family_name });
    const { session_id } = await crisp.create_conversation({
      email,
      subject:
        "[ProConnect] - Réinitialisation de la validation en deux étapes",
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
      content: ResetMFA_Message(),
      session_id,
      user,
    });

    await new Promise((resolve) => setTimeout(resolve, resolve_delay));

    await crisp.mark_conversation_as_resolved({ session_id });
  };
}

//

export type ResetMFAHandler = ReturnType<typeof ResetMFA>;
