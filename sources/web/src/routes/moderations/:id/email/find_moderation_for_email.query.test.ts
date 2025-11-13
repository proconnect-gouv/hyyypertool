//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { find_moderation_for_email } from "./find_moderation_for_email.query";

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

  const moderation = await find_moderation_for_email(pg, moderation_id);

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

  const moderation = await find_moderation_for_email(pg, moderation_id);

  expect(moderation).toMatchInlineSnapshot(`
    {
      "ticket_id": null,
      "user": {
        "email": "adora.pony@unicorn.xyz",
      },
    }
  `);
});

test("❎ moderation does not exist", async () => {
  await expect(find_moderation_for_email(pg, 999999)).resolves.toBeUndefined();
});
