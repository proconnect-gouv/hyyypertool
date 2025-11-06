//

import type { Htmx_Header } from "#src/htmx";
import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth/authorized";
import { zValidator } from "@hono/zod-validator";
import { email_deliverability_whitelist } from "@~/identite-proconnect.database/drizzle.schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import z from "zod";
import { type ContextType } from "./context.ts";
import Page from "./page.tsx";

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
      return render(<Page />);
    },
  )
  .put("/", jsxRenderer(Main_Layout), function PUT() {
    return new Response("Not implemented", { status: 501 });
  })
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
