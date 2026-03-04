//

import { as_user } from "#src";
import * as schema from "#src/schema";
import { hyyyper_pglite, reset } from "#src/testing";
import * as pg from "#src/testing/pg";
import { insert_admin, insert_jeanbon } from "#src/testing/users";
import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { eq } from "drizzle-orm";

//

describe("pglite", () => {
  beforeEach(reset);

  test("admin can see all users", async () => {
    const admin = await insert_admin(hyyyper_pglite);
    await insert_jeanbon(hyyyper_pglite);

    const result = await as_user(hyyyper_pglite, admin, (tx) =>
      tx.select().from(schema.users),
    );

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "admin@omega.gouv.com",
          "id": 1,
          "role": "admin",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "jeanbon@yopmail.com",
          "id": 2,
          "role": "visitor",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });

  test("visitor can ONLY see self", async () => {
    await insert_admin(hyyyper_pglite);
    const visitor = await insert_jeanbon(hyyyper_pglite);

    const result = await as_user(hyyyper_pglite, visitor, (tx) =>
      tx.select().from(schema.users),
    );

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "jeanbon@yopmail.com",
          "id": 2,
          "role": "visitor",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });

  test("admin can add a moderator", async () => {
    const admin = await insert_admin(hyyyper_pglite);

    await as_user(hyyyper_pglite, admin, (tx) =>
      tx.insert(schema.users).values({
        created_at: new Date("2222-11-11T00:00:00.000Z"),
        email: "pierre@moderator.gouv.fr",
        role: "moderator",
        updated_at: new Date("2222-11-11T00:00:00.000Z"),
      }),
    );

    const result = await as_user(hyyyper_pglite, admin, (tx) =>
      tx.select().from(schema.users),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "admin@omega.gouv.com",
          "id": 1,
          "role": "admin",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
        {
          "created_at": 2222-11-11T00:00:00.000Z,
          "disabled_at": null,
          "email": "pierre@moderator.gouv.fr",
          "id": 2,
          "role": "moderator",
          "updated_at": 2222-11-11T00:00:00.000Z,
        },
      ]
    `);
  });

  test("admin can remove a user", async () => {
    const admin = await insert_admin(hyyyper_pglite);
    const jean_bon = await insert_jeanbon(hyyyper_pglite);

    await as_user(hyyyper_pglite, admin, (tx) =>
      tx.delete(schema.users).where(eq(schema.users.id, jean_bon.id)),
    );

    const result = await as_user(hyyyper_pglite, admin, (tx) =>
      tx.select().from(schema.users),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "admin@omega.gouv.com",
          "id": 1,
          "role": "admin",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });

  test("admin can not remove itself", async () => {
    const admin = await insert_admin(hyyyper_pglite);

    await as_user(hyyyper_pglite, admin, (tx) =>
      tx.delete(schema.users).where(eq(schema.users.id, admin.id)),
    );

    const result = await as_user(hyyyper_pglite, admin, (tx) =>
      tx.select().from(schema.users),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "admin@omega.gouv.com",
          "id": 1,
          "role": "admin",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });
});

//

describe.skipIf(!pg.url)("node-postgres", () => {
  beforeAll(pg.setup);
  beforeEach(pg.reset);

  test("admin can see all users", async () => {
    const admin = await insert_admin(pg.hyyyper_pg);
    await insert_jeanbon(pg.hyyyper_pg);

    const result = await as_user(pg.hyyyper_pg, admin, (tx) =>
      tx.select().from(schema.users),
    );

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "admin@omega.gouv.com",
          "id": 1,
          "role": "admin",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "jeanbon@yopmail.com",
          "id": 2,
          "role": "visitor",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });

  test("visitor can ONLY see self", async () => {
    const visitor = await insert_jeanbon(pg.hyyyper_pg);
    await insert_admin(pg.hyyyper_pg);

    const result = await as_user(pg.hyyyper_pg, visitor, (tx) =>
      tx.select().from(schema.users),
    );

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "jeanbon@yopmail.com",
          "id": 1,
          "role": "visitor",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });

  test("admin can add a moderator", async () => {
    const admin = await insert_admin(pg.hyyyper_pg);

    await as_user(pg.hyyyper_pg, admin, (tx) =>
      tx.insert(schema.users).values({
        created_at: new Date("2222-11-11T00:00:00.000Z"),
        email: "pierre@moderator.gouv.fr",
        role: "moderator",
        updated_at: new Date("2222-11-11T00:00:00.000Z"),
      }),
    );

    const result = await as_user(pg.hyyyper_pg, admin, (tx) =>
      tx.select().from(schema.users),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "admin@omega.gouv.com",
          "id": 1,
          "role": "admin",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
        {
          "created_at": 2222-11-11T00:00:00.000Z,
          "disabled_at": null,
          "email": "pierre@moderator.gouv.fr",
          "id": 2,
          "role": "moderator",
          "updated_at": 2222-11-11T00:00:00.000Z,
        },
      ]
    `);
  });

  test("admin can remove a user", async () => {
    const admin = await insert_admin(pg.hyyyper_pg);
    const jean_bon = await insert_jeanbon(pg.hyyyper_pg);

    await as_user(pg.hyyyper_pg, admin, (tx) =>
      tx.delete(schema.users).where(eq(schema.users.id, jean_bon.id)),
    );

    const result = await as_user(pg.hyyyper_pg, admin, (tx) =>
      tx.select().from(schema.users),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "admin@omega.gouv.com",
          "id": 1,
          "role": "admin",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });

  test("admin can not remove itself", async () => {
    const admin = await insert_admin(pg.hyyyper_pg);

    await as_user(pg.hyyyper_pg, admin, (tx) =>
      tx.delete(schema.users).where(eq(schema.users.id, admin.id)),
    );

    const result = await as_user(pg.hyyyper_pg, admin, (tx) =>
      tx.select().from(schema.users),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "admin@omega.gouv.com",
          "id": 1,
          "role": "admin",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });
});
