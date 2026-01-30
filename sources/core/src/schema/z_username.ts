//

import { z } from "zod";

//

export const z_username = z
  .object({
    given_name: z.string().nullable().default(""),
    usual_name: z.string().nullable().default(""),
  })
  .transform(({ given_name, usual_name }) => {
    return `${given_name ?? ""} ${usual_name ?? ""}`.trim();
  });
