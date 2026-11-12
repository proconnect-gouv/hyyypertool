//

import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { createIdentiteRuntime } from "@proconnect-gouv/proconnect.identite.runtime";

//

export function identite_runtime(db: IdentiteProconnectPgDatabase) {
  return createIdentiteRuntime({
    app: "hyyypertool",
    db,
  });
}

export type IdentiteRuntime = ReturnType<
  ReturnType<typeof identite_runtime>["as"]
>;
