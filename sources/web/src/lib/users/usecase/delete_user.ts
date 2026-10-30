import type { CrispApiCradle } from "#src/lib/crisp";
import { z_username } from "#src/schema";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import { to as await_to } from "await-to-js";
import { eq } from "drizzle-orm";
import { delete_account_message } from "../templates";
import { get_user_info } from "./get_user_info";

export type DeleteUserInput = {
  moderator: { email: string };
  user_id: number;
};

export async function delete_user(
  {
    crisp,
    pg,
    resolve_delay,
  }: IdentiteProconnectDatabaseCradle &
    CrispApiCradle & { resolve_delay: number },
  { moderator, user_id }: DeleteUserInput,
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

  await pg.delete(schema.users).where(eq(schema.users.id, user_id));

  const { session_id } = await crisp.create_conversation({
    email,
    subject: "[ProConnect] - Suppression de votre compte",
    nickname,
  });

  await crisp.send_message({
    content: delete_account_message(),
    session_id,
    user,
  });

  await new Promise((resolve) => setTimeout(resolve, resolve_delay));

  await crisp.mark_conversation_as_resolved({ session_id });
}

export type DeleteUserHandler = typeof delete_user;
