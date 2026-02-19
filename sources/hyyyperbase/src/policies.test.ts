//

import { as_user } from "#src";
import * as schema from "#src/schema";
import { hyyyper_pglite, reset } from "#src/testing";
import {
  insert_admin,
  insert_disabled_user,
  insert_jeanbon,
  insert_moderateur,
} from "#src/testing/users";
import { beforeEach, describe, expect, test } from "bun:test";
import { eq } from "drizzle-orm";

//

beforeEach(reset);

describe("visitor", () => {
  test("can read self", async () => {
    const visitor = await insert_jeanbon(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, visitor, (tx) =>
      tx.select().from(schema.users).where(eq(schema.users.id, visitor.id)),
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

  test("can update self", async () => {
    const visitor = await insert_jeanbon(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, visitor, (tx) =>
      tx
        .update(schema.users)
        .set({ email: "jean.bon@yopmail.com" })
        .where(eq(schema.users.id, visitor.id))
        .returning(),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "jean.bon@yopmail.com",
          "id": 1,
          "role": "visitor",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });

  test("cannot read others", async () => {
    const visitor = await insert_jeanbon(hyyyper_pglite);
    const other = await insert_admin(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, visitor, (tx) =>
      tx.select().from(schema.users).where(eq(schema.users.id, other.id)),
    );
    expect(result).toMatchInlineSnapshot(`[]`);
  });

  test("cannot update others", async () => {
    const visitor = await insert_jeanbon(hyyyper_pglite);
    const other = await insert_admin(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, visitor, (tx) =>
      tx
        .update(schema.users)
        .set({ email: "hacked@yopmail.com" })
        .where(eq(schema.users.id, other.id))
        .returning(),
    );
    expect(result).toMatchInlineSnapshot(`[]`);
  });

  test("cannot delete self (restrictive)", async () => {
    const visitor = await insert_jeanbon(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, visitor, (tx) =>
      tx
        .delete(schema.users)
        .where(eq(schema.users.id, visitor.id))
        .returning(),
    );
    expect(result).toMatchInlineSnapshot(`[]`);
  });
});

describe("moderator", () => {
  test("can read active users", async () => {
    const moderator = await insert_moderateur(hyyyper_pglite);
    const active = await insert_jeanbon(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, moderator, (tx) =>
      tx.select().from(schema.users).where(eq(schema.users.id, active.id)),
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

  test("cannot read disabled users", async () => {
    const moderator = await insert_moderateur(hyyyper_pglite);
    const disabled = await insert_disabled_user(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, moderator, (tx) =>
      tx.select().from(schema.users).where(eq(schema.users.id, disabled.id)),
    );
    expect(result).toMatchInlineSnapshot(`[]`);
  });

  test("can read self", async () => {
    const moderator = await insert_moderateur(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, moderator, (tx) =>
      tx.select().from(schema.users).where(eq(schema.users.id, moderator.id)),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-17T15:35:15.000Z,
          "disabled_at": null,
          "email": "moderateur@beta.gouv.fr",
          "id": 1,
          "role": "moderator",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });
});

describe("admin", () => {
  test("can read everyone", async () => {
    const admin = await insert_admin(hyyyper_pglite);
    const disabled = await insert_disabled_user(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, admin, (tx) =>
      tx.select().from(schema.users).where(eq(schema.users.id, disabled.id)),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": 2023-01-01T00:00:00.000Z,
          "email": "disabled@yopmail.com",
          "id": 2,
          "role": "visitor",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });

  test("can update others", async () => {
    const admin = await insert_admin(hyyyper_pglite);
    const visitor = await insert_jeanbon(hyyyper_pglite);
    const result = await as_user(hyyyper_pglite, admin, (tx) =>
      tx
        .update(schema.users)
        .set({ role: "banned" })
        .where(eq(schema.users.id, visitor.id))
        .returning(),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2018-07-13T15:35:15.000Z,
          "disabled_at": null,
          "email": "jeanbon@yopmail.com",
          "id": 2,
          "role": "banned",
          "updated_at": 2023-06-22T14:34:34.000Z,
        },
      ]
    `);
  });

  test("can add moderator", async () => {
    const admin = await insert_admin(hyyyper_pglite);
    await as_user(hyyyper_pglite, admin, (tx) =>
      tx.insert(schema.users).values({
        created_at: new Date("2024-01-15T10:00:00+00:00"),
        email: "pierre@moderator.gouv.fr",
        role: "moderator",
        updated_at: new Date("2024-01-15T10:00:00+00:00"),
      }),
    );
    const result = await as_user(hyyyper_pglite, admin, (tx) =>
      tx
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, "pierre@moderator.gouv.fr")),
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "created_at": 2024-01-15T10:00:00.000Z,
          "disabled_at": null,
          "email": "pierre@moderator.gouv.fr",
          "id": 2,
          "role": "moderator",
          "updated_at": 2024-01-15T10:00:00.000Z,
        },
      ]
    `);
  });

  test("can remove user", async () => {
    const admin = await insert_admin(hyyyper_pglite);
    const jean_bon = await insert_jeanbon(hyyyper_pglite);
    await as_user(hyyyper_pglite, admin, (tx) =>
      tx.delete(schema.users).where(eq(schema.users.id, jean_bon.id)),
    );
    const result = await as_user(hyyyper_pglite, admin, (tx) =>
      tx.select().from(schema.users).where(eq(schema.users.id, jean_bon.id)),
    );
    expect(result).toMatchInlineSnapshot(`[]`);
  });

  test("cannot remove itself", async () => {
    const admin = await insert_admin(hyyyper_pglite);
    await as_user(hyyyper_pglite, admin, (tx) =>
      tx.delete(schema.users).where(eq(schema.users.id, admin.id)),
    );
    const result = await as_user(hyyyper_pglite, admin, (tx) =>
      tx.select().from(schema.users).where(eq(schema.users.id, admin.id)),
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
