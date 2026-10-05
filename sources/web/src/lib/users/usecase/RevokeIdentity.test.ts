//

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
import { RevokeIdentity } from "./RevokeIdentity";

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

const revoke_identity = RevokeIdentity({ crisp, pg, resolve_delay: 0 });

const anais_tailhade = { email: "anais.tailhade@omage.gouv.fr" };

//

test("revoke user identity", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  await pg
    .update(schema.users)
    .set({ email_verified: true })
    .where(eq(schema.users.id, pink_diamond_user_id));

  await revoke_identity({
    moderator: anais_tailhade,
    user_id: pink_diamond_user_id,
  });

  const result = await pg.query.users.findFirst({
    columns: { email_verified: true, id: true },
    where: eq(schema.users.id, pink_diamond_user_id),
  });

  expect(result).toEqual({
    email_verified: false,
    id: pink_diamond_user_id,
  });

  expect(crisp.create_conversation).toHaveBeenCalledWith({
    email: "pink.diamond@unicorn.xyz",
    subject:
      "[ProConnect] - Réinitialisation de la vérification de votre adresse email",
    nickname: "Pink Diamond",
  });
  expect(crisp.get_user).toHaveBeenCalledWith({
    email: "anais.tailhade@omage.gouv.fr",
  });
  expect(crisp.send_message).toHaveBeenCalledWith({
    content: expect.stringContaining(
      "Nous avons réinitialisé la vérification de votre adresse email.",
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
