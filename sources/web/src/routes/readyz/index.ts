//

import env from "#src/config";
import { set_identite_pg_database } from "#src/middleware/identite-pg";
import { to } from "await-to-js";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

//

export default new Hono()
  .get("/", ({ text }) => text(`readyz check passed`))
  .get("/sentry", () => {
    throw new Error("Sentry Check " + new Date().toISOString());
  })
  .get(
    "/drizzle/identite",
    set_identite_pg_database({ connectionString: env.DATABASE_URL }),
    async ({ text, var: { identite_pg } }) => {
      const [, is_ok] = await to(identite_pg.execute(sql`SELECT 1`));
      return text("[+]drizzle identite connection " + (is_ok ? "OK" : "FAIL"));
    },
  );
