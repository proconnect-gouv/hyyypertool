//

import type { Context, Env } from "hono";
import { createMiddleware } from "hono/factory";
import type { SentryVariablesContext } from "../sentry";
import type { SessionContext } from "../session";
import type { AgentConnectUserInfo } from "./AgentConnectUserInfo";

//

export function set_userinfo(value?: Partial<AgentConnectUserInfo>) {
  if (value)
    return createMiddleware<UserInfoVariablesContext>(({ set }, next) => {
      set("userinfo", value as AgentConnectUserInfo);
      return next();
    });

  return createMiddleware<UserInfoVariablesContext>(
    async function set_userinfo_middleware(c, next) {
      const { req, set } = c;

      const {
        var: { session, sentry },
      } = c as Context as Context<SessionContext & SentryVariablesContext>;
      const userinfo = session.get("userinfo");

      if (userinfo) {
        sentry.setUser({
          email: userinfo.email,
          id: userinfo.sub,
          username: userinfo.given_name,
          ip_address: req.header("x-forwarded-for") ?? "",
        });
        set("userinfo", userinfo);
      }

      await next();

      sentry.setUser(null);
      return Promise.resolve();
    },
  );
}

export interface UserInfoVariablesContext extends Env {
  Variables: {
    userinfo: AgentConnectUserInfo;
  };
}
