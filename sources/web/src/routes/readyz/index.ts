//

import env from "#src/config";
import { get_zammad_me } from "#src/lib/zammad";
import { set_hyyyperbase_database } from "#src/middleware/hyyyperbase";
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
  .get("/zammad", async ({ text }) => {
    const [, user] = await to(get_zammad_me());
    const is_ok = user !== undefined;
    return text(
      [
        `[${is_ok ? "+" : "-"}]zammad identite connection ${user ? "OK" : "FAIL"}`,
        `[${is_ok ? "+" : "-"}]zammad connected as ${user ? user.email : "FAIL"}`,
      ].join("\n"),
    );
  })
  .get(
    "/drizzle/identite",
    set_identite_pg_database({ connectionString: env.DATABASE_URL }),
    async ({ text, var: { identite_pg } }) => {
      const [, is_ok] = await to(identite_pg.execute(sql`SELECT 1`));
      return text("[+]drizzle identite connection " + (is_ok ? "OK" : "FAIL"));
    },
  )
  .get(
    "/drizzle/hyyyperbase",
    set_hyyyperbase_database({
      connectionString: env.HYYYPERBASE_DATABASE_URL,
    }),
    async ({ text, var: { hyyyper_pg } }) => {
      const [, is_ok] = await to(hyyyper_pg.execute(sql`SELECT 1`));
      return text(
        "[+]drizzle hyyyperbase connection " + (is_ok ? "OK" : "FAIL"),
      );
    },
  );
