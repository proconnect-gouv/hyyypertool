//

import { create_troll_organization } from "@~/identite-proconnect/database/seed/troll";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_pink_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import { migrate, pg } from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { get_duplicate_moderations } from "./get_duplicate_moderations.query";

//

beforeEach(migrate);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get duplicate moderations for the same user and organization", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  // Create multiple moderations for the same user and organization
  const moderation_id_1 = await create_adora_pony_moderation(pg, {
    type: "type_a",
  });
  const moderation_id_2 = await create_adora_pony_moderation(pg, {
    type: "type_b",
  });
  const moderation_id_3 = await create_adora_pony_moderation(pg, {
    type: "type_c",
  });

  const moderations = await get_duplicate_moderations(pg, {
    organization_id,
    user_id,
  });

  expect(moderations).toHaveLength(3);
  expect(moderations.map((m) => m.id)).toEqual([
    moderation_id_1,
    moderation_id_2,
    moderation_id_3,
  ]);

  // Verify they are ordered by created_at (ascending)
  const created_dates = moderations.map((m) => m.created_at);
  expect(created_dates).toEqual([...created_dates].sort());
});

test("returns empty array when no moderations found", async () => {
  const moderations = await get_duplicate_moderations(pg, {
    organization_id: 999999,
    user_id: 999999,
  });

  expect(moderations).toEqual([]);
});

test("filters by specific user and organization", async () => {
  const org1_id = await create_unicorn_organization(pg);
  await create_troll_organization(pg);
  const user1_id = await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);

  await create_adora_pony_moderation(pg, { type: "for_user1_org1" });

  // Should only return moderations for specific user+org combination
  const moderations = await get_duplicate_moderations(pg, {
    organization_id: org1_id,
    user_id: user1_id,
  });

  expect(moderations).toMatchInlineSnapshot(`
    [
      {
        "comment": null,
        "created_at": "2222-01-01 00:00:00+00",
        "id": 1,
        "moderated_at": null,
        "moderated_by": null,
        "organization_id": 1,
        "ticket_id": null,
        "type": "for_user1_org1",
        "user_id": 1,
      },
    ]
  `);
});
