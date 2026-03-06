//

import type { AppEnvContext } from "#src/config";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import type { HyyyperbasePgContext } from "#src/middleware/hyyyperbase";
import type { IdentiteProconnectPgContext } from "#src/middleware/identite-pg";
import { set_identite_pg_database } from "#src/middleware/identite-pg";
import { schema } from "@~/hyyyperbase";
import { to } from "await-to-js";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";

//

export default new Hono<
  AppEnvContext & HyyyperbasePgContext & IdentiteProconnectPgContext
>()
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
  )
  .get(
    "/drizzle/hyyyperbase",
    async (c, next) => {
      const mw = set_hyyyper_pg(
        drizzle(c.env.HYYYPERBASE_DATABASE_URL, { schema }),
      );
      return mw(c as any, next);
    },
    async ({ text, var: { hyyyper_pg } }) => {
      const [, is_ok] = await to(hyyyper_pg.execute(sql`SELECT 1`));
      return text(
        "[+]drizzle hyyyperbase connection " + (is_ok ? "OK" : "FAIL"),
      );
    },
  );
