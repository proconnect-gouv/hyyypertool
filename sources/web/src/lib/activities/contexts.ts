//

import { domain_activities } from "#src/lib/organizations";
import type { ContextsOf } from "@proconnect-gouv/proconnect.identite.runtime";

//

export const hyyypertool_activity_context_schemas = { ...domain_activities };

export type HyyypertoolActivityContexts = ContextsOf<
  typeof hyyypertool_activity_context_schemas
>;
