import type { AgentConnectUserInfo } from "#src/middleware/auth";
import type { Env } from "hono";
import type { Session } from "hono-sessions";

//

interface SessionKeyMapping {
  userinfo?: AgentConnectUserInfo;
  idtoken: string;
  state: string;
  nonce: string;
}

export interface SessionContext extends Env {
  Variables: {
    session: Omit<Session, "get" | "set"> & {
      get<K extends keyof SessionKeyMapping>(key: K): SessionKeyMapping[K];
      set<K extends keyof SessionKeyMapping>(
        key: K,
        value: SessionKeyMapping[K],
      ): void;
    };
  };
}
