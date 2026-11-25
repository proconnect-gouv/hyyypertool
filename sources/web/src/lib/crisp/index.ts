//

export * from "./api";
export * from "./links";
export * from "./session_id";
export * from "./types";

// Re-export from index
import type { CrispApi } from "./api";
import { CrispSessionId } from "./session_id";

//

export type CrispApiCradle = {
  crisp: CrispApi;
};

export function is_crisp_ticket(session_id: string) {
  return CrispSessionId.safeParse(session_id).success;
}
