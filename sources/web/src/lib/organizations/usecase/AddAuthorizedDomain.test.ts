//

import { BadRequestError } from "#src/errors";
import { create_unicorn_organization } from "@~/identite-proconnect/database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/identite-proconnect/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { AddAuthorizedDomain } from "./AddAuthorizedDomain";

//

beforeAll(migrate);
beforeEach(empty_database);

const add_authorized_domain = AddAuthorizedDomain({ pg });

//

test("add polycorn.xyz", async () => {
  const organization_id = await create_unicorn_organization(pg);

  await add_authorized_domain(organization_id, "polycorn.xyz");

  expect(
    await pg.query.email_domains.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.domain, "polycorn.xyz"),
    }),
  ).toEqual({ id: expect.any(Number) });
});

//

test("❎ fails with @ character", async () => {
  const organization_id = await create_unicorn_organization(pg);

  await expect(() =>
    add_authorized_domain(organization_id, "🪀@polycorn.xyz"),
  ).toThrow(BadRequestError);
});
