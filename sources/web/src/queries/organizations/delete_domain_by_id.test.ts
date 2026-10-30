//

import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { delete_domain_by_id } from "./delete_domain_by_id";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("deletes domain by id", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const result = await delete_domain_by_id(pg, organization_id);

  expect(result).toMatchInlineSnapshot(`
    {
      "affectedRows": 1,
      "command": "DELETE",
      "fields": [],
      "rowCount": 1,
      "rows": [],
    }
  `);
});
