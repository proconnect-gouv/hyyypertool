//

import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

//

export const users = pgTable("users", {
  created_at: timestamp("created_at").defaultNow().notNull(),
  disabled_at: timestamp("disabled_at"),
  email: text("email").notNull().unique(),
  id: serial("id").primaryKey(),
  role: text("role").default("visitor").notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  updated_by: integer(),
});
