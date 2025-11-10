//

import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { DeleteDomainById } from "./DeleteDomainById";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("deletes domain by id", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const delete_domain_by_id = DeleteDomainById(pg);

  const result = await delete_domain_by_id(organization_id);

  expect(result).toMatchInlineSnapshot(`
    {
      "affectedRows": 1,
      "fields": [],
      "rows": [],
    }
  `);
});
