//

export * from "./api";
export * from "./links";
export * from "./types";

// Re-export from index
import { z } from "zod";
import type { CrispApi } from "./api";

//

export type CrispApiCradle = {
  crisp: CrispApi;
};

export function is_crisp_ticket(session_id: string | number) {
  return z.string().startsWith("session_").safeParse(session_id).success;
}
