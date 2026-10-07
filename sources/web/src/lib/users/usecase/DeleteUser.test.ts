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
import { DeleteUser } from "./DeleteUser";

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

const delete_user = DeleteUser({ crisp, pg, resolve_delay: 0 });

const anais_tailhade = { email: "anais.tailhade@omage.gouv.fr" };

//

test("delete user account", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);

  await delete_user({
    moderator: anais_tailhade,
    user_id: pink_diamond_user_id,
  });

  const result = await pg.query.users.findFirst({
    where: eq(schema.users.id, pink_diamond_user_id),
  });

  expect(result).toBeUndefined();

  expect(crisp.create_conversation).toHaveBeenCalledWith({
    email: "pink.diamond@unicorn.xyz",
    subject: "[ProConnect] - Suppression de votre compte",
    nickname: "Pink Diamond",
  });
  expect(crisp.get_user).toHaveBeenCalledWith({
    email: "anais.tailhade@omage.gouv.fr",
  });
  expect(crisp.send_message).toHaveBeenCalledWith({
    content: expect.stringContaining(
      "Nous avons supprimé votre compte ProConnect.",
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
