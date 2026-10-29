//

import {
  activityContextSchemas,
  type ActivityOf,
  type ContextsOf,
} from "@proconnect-gouv/proconnect.identite.runtime";
import { hyyypertool_activity_context_schemas } from "./contexts";

//

const known_activity_context_schemas = {
  ...activityContextSchemas,
  ...hyyypertool_activity_context_schemas,
};

export type KnownActivityContexts = ContextsOf<
  typeof known_activity_context_schemas
>;
export type KnownAction = keyof KnownActivityContexts;
export type KnownActivity = ActivityOf<KnownActivityContexts>;

function is_known_action(action: string): action is KnownAction {
  return Object.hasOwn(known_activity_context_schemas, action);
}

export function parse_activity_row({
  action,
  context,
}: {
  action: string;
  context: unknown;
}) {
  if (!is_known_action(action)) {
    return { kind: "unknown_action", action, context } as const;
  }

  const parsed = known_activity_context_schemas[action].safeParse(context);
  if (!parsed.success) {
    return {
      kind: "invalid_context",
      action,
      context,
      error: parsed.error,
    } as const;
  }

  // safeParse widens `data` to every context; it was parsed by `action`'s schema
  const activity = { action, context: parsed.data } as KnownActivity;
  return { kind: "known", ...activity } as const;
}

export type ParsedActivityRow = ReturnType<typeof parse_activity_row>;
