//

import type { AgentConnect_UserInfo } from "@~/app.middleware/context";
import { crisp } from "@~/crisp.lib/api#mock";
import { schema } from "@~/identite-proconnect.database";
import { create_pink_diamond_user } from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { ResetMFA } from "./ResetMFA";

//

beforeAll(migrate);
beforeEach(empty_database);

const reset_mfa = ResetMFA({ crisp, pg, resolve_delay: 0 });

export const anais_tailhade: AgentConnect_UserInfo = {
  email: "anais.tailhade@omage.gouv.fr",
  sub: "anais.tailhade@omage.gouv.fr",
  given_name: "Anais",
  usual_name: "Tailhade",
  uid: "1",
  siret: "21440109300015",
  phone_number: "0123456789",
  idp_id: "71144ab3-ee1a-4401-b7b3-79b44f7daeeb",
  idp_acr: "eidas1",
  aud: "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950",
  exp: 1707821864,
  iat: 1707821804,
  iss: "https://proconnect.gouv.fr/api/v2",
};

//

test("reset user MFA", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  await pg
    .update(schema.users)
    .set({ email_verified: true, encrypted_password: "🔑", force_2fa: true })
    .where(eq(schema.users.id, pink_diamond_user_id));

  await reset_mfa({ moderator: anais_tailhade, user_id: pink_diamond_user_id });

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
