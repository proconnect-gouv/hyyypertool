//

import { z } from "zod/v4";

//

export const CLOSED_STATE_ID = "4";
export const ARTICLE_TYPE = z.nativeEnum({ EMAIL: 1 } as const);
export type Article_Type = z.infer<typeof ARTICLE_TYPE>;
export const PRIORITY_TYPE = z.nativeEnum({ NORMAL: 1 } as const);
export type Priority_Type = z.infer<typeof PRIORITY_TYPE>;
export const GROUP_MONCOMPTEPRO = "IdentiteProconnect";
export const GROUP_MONCOMPTEPRO_SENDER_ID = 1;
export const NORMAL_PRIORITY_ID = "1";
