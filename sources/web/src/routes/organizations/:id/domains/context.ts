//

import { z } from "zod";

//

export const add_params = z.object({ domain: z.string().min(1) });
