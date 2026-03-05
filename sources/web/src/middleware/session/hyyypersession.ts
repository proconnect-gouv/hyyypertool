import type { AppEnvContext } from "#src/config";
import { CookieStore, sessionMiddleware } from "hono-sessions";
import { createMiddleware } from "hono/factory";

export const hyyyyyypertool_session = createMiddleware<AppEnvContext>(
  async (c, next) => {
    const session = sessionMiddleware({
      store: new CookieStore(),
      encryptionKey: c.env.COOKIE_ENCRYPTION_KEY,
      expireAfterSeconds: 60 * 60 * 24, // 24 hours
      sessionCookieName: "hyyyyyypertool",
    });
    return session(c, next);
  },
);
