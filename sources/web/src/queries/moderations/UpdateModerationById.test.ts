//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/identite-proconnect/testing";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { UpdateModerationById } from "./UpdateModerationById";

//

beforeAll(migrate);
beforeAll(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

const update_moderation_by_id = UpdateModerationById({ pg });

//

test("update a moderation", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  setSystemTime(new Date("2222-01-02T00:00:00.000Z"));
  await update_moderation_by_id(moderation_id, {
    comment: "Adora is a good pony",
    moderated_at: new Date().toISOString(),
    moderated_by: "Captain Midnight",
    status: "accepted",
  });

  expect(
    await pg.query.moderations.findFirst({
      where: (table, { eq }) => eq(table.id, moderation_id),
    }),
  ).toEqual({
    comment: "Adora is a good pony",
    created_at: "2222-01-01 00:00:00+00",
    id: expect.any(Number),
    moderated_at: "2222-01-02 00:00:00+00",
    moderated_by: "Captain Midnight",
    organization_id,
    status: "accepted",
    ticket_id: null,
    type: "",
    user_id,
  });
});
