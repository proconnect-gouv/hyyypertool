//

import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

//
export const response_templates = pgTable("response_templates", {
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  id: serial("id").primaryKey(),
  label: text("label").notNull().unique(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  updated_by: integer("updated_by").references(() => users.id),
});

export const users = pgTable("users", {
  created_at: timestamp("created_at").defaultNow().notNull(),
  disabled_at: timestamp("disabled_at"),
  email: text("email").notNull().unique(),
  id: serial("id").primaryKey(),
  role: text("role").default("visitor").notNull(),
  sub: text("sub").unique(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  updated_by: integer(),
});
