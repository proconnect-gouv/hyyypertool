//

import type { HtmxHeader } from "#src/htmx";
import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth";
import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { z_username } from "@~/core/schema";
import { schema } from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import z from "zod";
import { get_email_deliverability_whitelist } from "./get_email_deliverability_whitelist.query";
import Page from "./page";

//

const WhitelistParams_Schema = z.object({
  email_domain: z.string(),
});

//
export default new Hono<App_Context>()
  .use(authorized())
  .get(
    "/",
    jsxRenderer(Main_Layout),

    async function GET({ render, set, var: { identite_pg } }) {
      const whitelist = await get_email_deliverability_whitelist(identite_pg);

      set("page_title", "Délivrabilité des domaines");
      return render(
        <>
          <Page whitelist={whitelist} />
        </>,
      );
    },
  )
  .put(
    "/",
    zValidator("form", z.object({ problematic_email: z.string().min(1) })),
    async function PUT({ req, var: { identite_pg, userinfo } }) {
      const { problematic_email } = req.valid("form");

      const email_domain = problematic_email.split("@")[1];

      if (!email_domain) {
        return new Response("Domaine invalide", { status: 400 });
      }

      const username = z_username.parse(userinfo);

      try {
        await identite_pg.insert(schema.email_deliverability_whitelist).values({
          problematic_email,
          email_domain,
          verified_by: username,
          verified_at: new Date().toISOString(),
        });
        return new Response(null, {
          status: 201,
          headers: {
            "HX-Trigger": "domains-deliverability-updated",
          },
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout du domaine:", error);
        return new Response("Erreur lors de l'ajout", { status: 500 });
      }
    },
  )
  .delete(
    "/:email_domain",
    zValidator("param", WhitelistParams_Schema),
    async function DELETE({ text, req, var: { identite_pg } }) {
      const { email_domain } = req.valid("param");

      try {
        await identite_pg
          .delete(schema.email_deliverability_whitelist)
          .where(
            eq(
              schema.email_deliverability_whitelist.email_domain,
              email_domain,
            ),
          );

        return text("OK", 200, {
          "HX-Trigger": "domains-deliverability-updated",
        } as HtmxHeader);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        return text("Erreur lors de la suppression", 500);
      }
    },
  );
