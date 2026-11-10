//

import { NotFoundError } from "#src/errors";
import { identite_runtime } from "#src/lib/activities";
import { type CrispApi } from "#src/lib/crisp";
import { schema } from "@~/identite-proconnect/database";
import { create_pink_diamond_user } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, mock, test } from "bun:test";
import { eq } from "drizzle-orm";
import { reset_mfa } from "./reset_mfa";

//

beforeAll(migrate);
beforeEach(empty_database);

const crisp: CrispApi = {
  create_conversation: mock().mockResolvedValue({
    session_id: "🗨️",
  }),
  get_user: mock().mockResolvedValue({
    nickname: "👩‍🚀",
  }),
  mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
  send_message: mock().mockResolvedValue(undefined),
};

const deps = {
  crisp,
  pg,
  resolve_delay: 0,
  runtime: identite_runtime(pg).as({ sub: "moderator-sub", type: "moderator" }),
};

export const anais_tailhade: { email: string } = {
  email: "anais.tailhade@omage.gouv.fr",
};

//

test("reset user MFA", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  await pg
    .update(schema.users)
    .set({ email_verified: true, encrypted_password: "🔑", force_2fa: true })
    .where(eq(schema.users.id, pink_diamond_user_id));

  await reset_mfa(deps, {
    moderator: anais_tailhade,
    user_id: pink_diamond_user_id,
  });

  const result = await pg.query.users.findFirst({
    columns: {
      email_verified: true,
      encrypted_password: true,
      encrypted_totp_key: true,
      force_2fa: true,
      id: true,
      totp_key_verified_at: true,
    },
    where: eq(schema.users.id, pink_diamond_user_id),
  });

  expect(result).toEqual({
    email_verified: false,
    encrypted_password: null,
    encrypted_totp_key: null,
    force_2fa: false,
    id: pink_diamond_user_id,
    totp_key_verified_at: null,
  });
  expect(await pg.query.activity_logs.findMany()).toMatchObject([
    {
      action: "user.mfa_reset",
      actor_ref: "moderator-sub",
      actor_type: "moderator",
      app: "hyyypertool",
      context: { inputs: { user_id: pink_diamond_user_id } },
      user_id: pink_diamond_user_id,
    },
  ]);

  expect(crisp.create_conversation).toHaveBeenCalledWith({
    email: "pink.diamond@unicorn.xyz",
    subject: "[ProConnect] - Réinitialisation de la validation en deux étapes",
    nickname: "Pink Diamond",
  });
  expect(crisp.get_user).toHaveBeenCalledWith({
    email: "anais.tailhade@omage.gouv.fr",
  });
  expect(crisp.send_message).toHaveBeenCalledWith({
    content: expect.stringContaining(
      "Nous avons réinitialisé votre mot de passe et vos clés d'accès.",
    ),
    session_id: "🗨️",
    user: {
      nickname: "👩‍🚀",
    },
  });
  expect(crisp.mark_conversation_as_resolved).toHaveBeenCalledWith({
    session_id: "🗨️",
  });
});

test("reject an unknown user", async () => {
  const create_conversation = mock();

  await expect(
    reset_mfa(
      { ...deps, crisp: { ...crisp, create_conversation } },
      { moderator: anais_tailhade, user_id: 42 },
    ),
  ).rejects.toThrow(NotFoundError);
  expect(create_conversation).not.toHaveBeenCalled();
});
