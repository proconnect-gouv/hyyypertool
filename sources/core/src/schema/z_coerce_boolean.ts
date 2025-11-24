//

import { z } from "zod/v4";

//

// NOTE(douglasduteil): behold the false positive in z.coerce.boolean
// \see https://github.com/colinhacks/zod/issues/1630
export const z_coerce_boolean = z
  .enum(["true", "false"])
  .transform((v) => v === "true");
