//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { GetModerationForEmail } from "./GetModerationForEmail";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("get a moderation with minimal email context data", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "",
    ticket_id: "test-ticket-123",
  });

  const get_moderation_for_email = GetModerationForEmail(pg);
  const moderation = await get_moderation_for_email(moderation_id);

  expect(moderation).toMatchInlineSnapshot(`
    {
      "ticket_id": "test-ticket-123",
      "user": {
        "email": "adora.pony@unicorn.xyz",
      },
    }
  `);
});

test("handles null ticket_id", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  const get_moderation_for_email = GetModerationForEmail(pg);
  const moderation = await get_moderation_for_email(moderation_id);

  expect(moderation).toMatchInlineSnapshot(`
    {
      "ticket_id": null,
      "user": {
        "email": "adora.pony@unicorn.xyz",
      },
    }
  `);
});

test("throws NotFoundError when moderation does not exist", async () => {
  const get_moderation_for_email = GetModerationForEmail(pg);

  await expect(get_moderation_for_email(999999)).rejects.toThrow(
    "Moderation not found",
  );
});
