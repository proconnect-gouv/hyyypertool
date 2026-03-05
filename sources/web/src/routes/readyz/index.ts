//

import type { AppEnvContext } from "#src/config";
import type { IdentiteProconnect_Pg_Context } from "#src/middleware/identite-pg";
import { set_identite_pg_database } from "#src/middleware/identite-pg";
import { to } from "await-to-js";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

//

export default new Hono<AppEnvContext & IdentiteProconnect_Pg_Context>()
  .get("/", ({ text }) => text(`readyz check passed`))
  .get("/sentry", () => {
    throw new Error("Sentry Check " + new Date().toISOString());
  })
  .get(
    "/drizzle/identite",
    async (c, next) => {
      const mw = set_identite_pg_database({
        connectionString: c.env.DATABASE_URL,
      });
      return mw(c as any, next);
    },
    async ({ text, var: { identite_pg } }) => {
      const [, is_ok] = await to(identite_pg.execute(sql`SELECT 1`));
      return text("[+]drizzle identite connection " + (is_ok ? "OK" : "FAIL"));
    },
  );
