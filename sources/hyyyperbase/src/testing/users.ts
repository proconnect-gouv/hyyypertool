//

import { roles, type HyyyperPgDatabase } from "#src";
import { sql } from "drizzle-orm";
import * as schema from "../schema";

//

export async function insert_admin(db: HyyyperPgDatabase) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.role', 'god', true)`);
    const insert = await tx
      .insert(schema.users)
      .values({
        created_at: new Date("2018-07-13T17:35:15+02:00"),
        email: "admin@omega.gouv.com",
        role: roles.enum.admin,
        updated_at: new Date("2023-06-22T16:34:34+02:00"),
      })
      .returning();
    return insert.at(0)!;
  });
}

export async function insert_disabled_user(db: HyyyperPgDatabase) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.role', 'god', true)`);
    const insert = await tx
      .insert(schema.users)
      .values({
        created_at: new Date("2018-07-13T17:35:15+02:00"),
        disabled_at: new Date("2023-01-01T00:00:00+00:00"),
        email: "disabled@yopmail.com",
        role: roles.enum.visitor,
        updated_at: new Date("2023-06-22T16:34:34+02:00"),
      })
      .returning();
    return insert.at(0)!;
  });
}

export async function insert_god(db: HyyyperPgDatabase) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.role', 'god', true)`);
    const insert = await tx
      .insert(schema.users)
      .values({
        created_at: new Date("2018-07-13T17:35:15+02:00"),
        email: "god@yopmail.com",
        role: roles.enum.god,
        updated_at: new Date("2023-06-22T16:34:34+02:00"),
      })
      .returning();
    return insert.at(0)!;
  });
}

export async function insert_jeanbon(db: HyyyperPgDatabase) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.role', 'god', true)`);
    const insert = await tx
      .insert(schema.users)
      .values({
        created_at: new Date("2018-07-13T17:35:15+02:00"),
        email: "jeanbon@yopmail.com",
        role: roles.enum.visitor,
        updated_at: new Date("2023-06-22T16:34:34+02:00"),
      })
      .returning();
    return insert.at(0)!;
  });
}

export async function insert_moderateur(db: HyyyperPgDatabase) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.role', 'god', true)`);
    const insert = await tx
      .insert(schema.users)
      .values({
        created_at: new Date("2018-07-17T17:35:15+02:00"),
        email: "moderateur@beta.gouv.fr",
        role: roles.enum.moderator,
        updated_at: new Date("2023-06-22T16:34:34+02:00"),
      })
      .returning();
    return insert.at(0)!;
  });
}
