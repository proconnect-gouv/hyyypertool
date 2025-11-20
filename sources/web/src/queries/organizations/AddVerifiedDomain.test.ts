//

import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { AddVerifiedDomain } from "./AddVerifiedDomain";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("updates domain verification status", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const add_verified_domain = AddVerifiedDomain(pg);

  const result = await add_verified_domain({
    id: organization_id,
    domain: "example.com",
  });

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "id": 1,
      },
    ]
  `);
});
