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
import { reprocess_moderation } from "./reprocess_moderation.command";
import { validate_moderation } from "./validate_moderation.command";

//

beforeAll(migrate);
beforeEach(empty_database);
setSystemTime(new Date("2222-01-01T00:00:00.000Z"));

//

test("reprocess_moderation resets to pending", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  await validate_moderation(pg, moderation_id, {
    email: "admin@example.com",
    given_name: "Admin",
  });

  await reprocess_moderation(pg, moderation_id, {
    email: "admin2@example.com",
    given_name: "Admin2",
  });

  const result = await pg.query.moderations.findFirst({
    where: (table, { eq }) => eq(table.id, moderation_id),
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "comment": 
    "7952342400000 admin@example.com | Validé par admin@example.com
    7952342400000 admin2@example.com | Réouverte par admin2@example.com"
    ,
      "created_at": "2222-01-01 00:00:00+00",
      "id": 1,
      "moderated_at": null,
      "moderated_by": null,
      "organization_id": 1,
      "ticket_id": null,
      "type": "",
      "user_id": 1,
    }
  `);
});

//
