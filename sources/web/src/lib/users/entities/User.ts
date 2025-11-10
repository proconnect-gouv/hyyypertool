//

import type { schema } from "@~/identite-proconnect.database";

//

export type User = typeof schema.users.$inferSelect;
