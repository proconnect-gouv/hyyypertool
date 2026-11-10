import { NotFoundError } from "#src/errors";
import type { IdentiteRuntime } from "#src/lib/activities";
import type { CrispApiCradle } from "#src/lib/crisp";
import { z_username } from "#src/schema";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect/database";
import { to as await_to } from "await-to-js";
import { match } from "ts-pattern";
import { reset_mfa_message } from "../templates";
import { get_user_info } from "./get_user_info";

export type ResetMFAInput = { moderator: { email: string }; user_id: number };

export async function reset_mfa(
  {
    crisp,
    pg,
    resolve_delay,
    runtime,
  }: IdentiteProconnectDatabaseCradle &
    CrispApiCradle & { resolve_delay: number; runtime: IdentiteRuntime },
  { moderator, user_id }: ResetMFAInput,
) {
  const outcome = await runtime.resetMfa({ user_id });

  match(outcome)
    .with({ kind: "mfa_reset" }, () => undefined)
    .with({ kind: "user_not_found" }, () => {
      throw new NotFoundError(`User ${user_id} not found.`);
    })
    .exhaustive();

  const { email, given_name, family_name } = await get_user_info(pg, user_id);
  const nickname = z_username.parse({ given_name, usual_name: family_name });
  const { session_id } = await crisp.create_conversation({
    email,
    subject: "[ProConnect] - Réinitialisation de la validation en deux étapes",
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
    content: reset_mfa_message(),
    session_id,
    user,
  });

  await new Promise((resolve) => setTimeout(resolve, resolve_delay));

  await crisp.mark_conversation_as_resolved({ session_id });
}

export type ResetMFAHandler = typeof reset_mfa;
