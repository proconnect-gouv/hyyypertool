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
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { validate_moderation } from "./validate_moderation.command";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

//

test("validate_moderation approves pending moderation", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  await validate_moderation(pg, moderation_id, {
    email: "admin@example.com",
    given_name: "Admin",
    usual_name: "User",
  });

  const result = await pg.query.moderations.findFirst({
    where: (table, { eq }) => eq(table.id, moderation_id),
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "comment": "7952342400000 admin@example.com | Validé par admin@example.com",
      "created_at": "2222-01-01 00:00:00+00",
      "id": 1,
      "moderated_at": "2222-01-01 00:00:00+00",
      "moderated_by": "Admin User <admin@example.com>",
      "organization_id": 1,
      "ticket_id": null,
      "type": "",
      "user_id": 1,
    }
  `);
});

//
