//

import { z } from "zod";

//

export const z_username = z
  .object({
    given_name: z.string().default(""),
    usual_name: z.string().default(""),
  })
  .transform(({ given_name, usual_name }) => {
    return `${given_name} ${usual_name}`;
  });
