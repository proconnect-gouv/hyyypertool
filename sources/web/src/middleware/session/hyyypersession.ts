import config from "#src/config";
import type { MiddlewareHandler } from "hono";
import { CookieStore, sessionMiddleware } from "hono-sessions";

export const hyyyyyypertool_session: MiddlewareHandler = sessionMiddleware({
  store: new CookieStore(),
  encryptionKey: config.COOKIE_ENCRYPTION_KEY,
  expireAfterSeconds: 60 * 60 * 24, // 24 hours
  sessionCookieName: "hyyyyyypertool",
});
