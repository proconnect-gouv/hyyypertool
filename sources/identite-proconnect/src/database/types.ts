//

import * as schema from "./drizzle.schema";

//

export type Readonly_Fields = "created_at" | "id" | "updated_at";
export type Moderation = typeof schema.moderations.$inferSelect;
export type User = typeof schema.users.$inferSelect;
export type Writable_User = Omit<
  typeof schema.users.$inferInsert,
  Readonly_Fields | "encrypted_password"
>;
export type Users_Organizations =
  typeof schema.users_organizations.$inferSelect;

export type Writable_Users_Organizations = Omit<
  typeof schema.users_organizations.$inferInsert,
  Readonly_Fields | "user_id" | "organization_id"
>;
