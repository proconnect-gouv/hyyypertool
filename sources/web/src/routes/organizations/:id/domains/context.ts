//

import { z } from "zod/v4";

//

export const add_params = z.object({ domain: z.string().min(1) });
