//

import type { Htmx_Header } from "#src/htmx";
import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { z_username } from "@~/core/schema";
import { email_deliverability_whitelist } from "@~/identite-proconnect/database/drizzle.schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import z from "zod";
import { type ContextType } from "./context";
import Page from "./page";

//

const WhitelistParams_Schema = z.object({
  email_domain: z.string(),
});

//
export default new Hono<ContextType>()
  .use(authorized())
  .get(
    "/",
    jsxRenderer(Main_Layout),

    function GET({ render, set }) {
      set("page_title", "Délivrabilité des domaines");
      return render(
        <>
          <Page />
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
        await identite_pg.insert(email_deliverability_whitelist).values({
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
          .delete(email_deliverability_whitelist)
          .where(eq(email_deliverability_whitelist.email_domain, email_domain));

        return text("OK", 200, {
          "HX-Trigger": "domains-deliverability-updated",
        } as Htmx_Header);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        return text("Erreur lors de la suppression", 500);
      }
    },
  );
