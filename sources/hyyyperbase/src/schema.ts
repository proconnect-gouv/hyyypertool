//

import { sql } from "drizzle-orm";
import {
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

//

export const users = pgTable(
  "users",
  {
    created_at: timestamp("created_at").defaultNow().notNull(),
    disabled_at: timestamp("disabled_at"),
    email: text("email").notNull().unique(),
    id: serial("id").primaryKey(),
    role: text("role").default("visitor").notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    pgPolicy("admin_all", {
      for: "all",
      using: sql`current_setting('app.role', true) = 'admin'`,
      withCheck: sql`current_setting('app.role', true) = 'admin'`,
    }),

    pgPolicy("god_all", {
      for: "all",
      using: sql`current_setting('app.role', true) = 'god'`,
      withCheck: sql`current_setting('app.role', true) = 'god'`,
    }),

    pgPolicy("moderator_select", {
      for: "select",
      using: sql`current_setting('app.role', true) = 'moderator' AND ${table.disabled_at} IS NULL`,
    }),

    pgPolicy("no_self_delete", {
      as: "restrictive",
      for: "delete",
      using: sql`NULLIF(current_setting('app.user_id', true), '') IS NULL OR NULLIF(current_setting('app.user_id', true), '')::int != ${table.id}`,
    }),

    pgPolicy("self_select", {
      for: "select",
      using: sql`NULLIF(current_setting('app.user_id', true), '')::int = ${table.id}`,
    }),

    pgPolicy("self_update", {
      for: "update",
      using: sql`NULLIF(current_setting('app.user_id', true), '')::int = ${table.id}`,
      withCheck: sql`NULLIF(current_setting('app.user_id', true), '')::int = ${table.id}`,
    }),
  ],
);
