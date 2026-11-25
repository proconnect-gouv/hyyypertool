//

export * from "./api";
export * from "./links";
export * from "./session_id";
export * from "./types";

//
import type { CrispApi } from "./api";

//

export type CrispApiCradle = {
  crisp: CrispApi;
};
