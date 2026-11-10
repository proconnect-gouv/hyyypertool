import { NotFoundError } from "#src/errors";
import type { IdentiteRuntime } from "#src/lib/activities";
import type { CrispApiCradle } from "#src/lib/crisp";
import { z_username } from "#src/schema";
import { to as await_to } from "await-to-js";
import { match } from "ts-pattern";
import { delete_account_message } from "../templates";

export type DeleteUserInput = {
  moderator: { email: string };
  user_id: number;
};

export async function delete_user(
  {
    crisp,
    resolve_delay,
    runtime,
  }: CrispApiCradle & { resolve_delay: number; runtime: IdentiteRuntime },
  { moderator, user_id }: DeleteUserInput,
) {
  const outcome = await runtime.deleteUser({ user_id });

  const { email, family_name, given_name } = match(outcome)
    .with({ kind: "user_deleted" }, ({ previous }) => previous)
    .with({ kind: "user_not_found" }, () => {
      throw new NotFoundError(`User ${user_id} not found.`);
    })
    .exhaustive();
  const nickname = z_username.parse({ given_name, usual_name: family_name });

  const [, found_user] = await await_to(
    crisp.get_user({ email: moderator.email }),
  );
  const user = found_user ?? {
    nickname: z_username.parse(moderator),
    email: moderator.email,
  };

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
