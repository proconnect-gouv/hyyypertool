//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { get_moderators_list } from "./get_moderators_list.query";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("returns empty list when no moderations exist", async () => {
  const result = await get_moderators_list(pg);

  expect(result).toEqual([]);
});

test("returns empty list when moderations have no moderated_by", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  await create_adora_pony_moderation(pg, { type: "non_verified_domain" });

  const result = await get_moderators_list(pg);

  expect(result).toEqual([]);
});

test("returns distinct moderators", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  await create_adora_pony_moderation(pg, {
    type: "",
    moderated_at: "2222-01-01T00:00:00.000Z",
    moderated_by: "admin@example.com",
  });
  await create_adora_pony_moderation(pg, {
    type: "",
    moderated_at: "2222-01-01T00:00:00.000Z",
    moderated_by: "admin@example.com",
  });

  const result = await get_moderators_list(pg);

  expect(result).toEqual(["admin@example.com"]);
});

test("returns multiple distinct moderators", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  await create_adora_pony_moderation(pg, {
    type: "",
    moderated_at: "2222-01-01T00:00:00.000Z",
    moderated_by: "admin@example.com",
  });
  await create_adora_pony_moderation(pg, {
    type: "",
    moderated_at: "2222-01-01T00:00:00.000Z",
    moderated_by: "other@example.com",
  });

  const result = await get_moderators_list(pg);

  expect(result).toEqual(
    expect.arrayContaining(["admin@example.com", "other@example.com"]),
  );
  expect(result).toHaveLength(2);
});
