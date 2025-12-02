//

import { NotFoundError } from "#src/errors";
import type { HtmxHeader } from "#src/htmx";
import { Main_Layout } from "#src/layouts";
import { ResetMFA, ResetPassword } from "#src/lib/users";
import type { App_Context } from "#src/middleware/context";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { EntitySchema } from "@~/core/schema";
import { schema } from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { get_authenticators_by_user_id } from "./get_authenticators_by_user_id.query";
import { get_user_by_id } from "./get_user_by_id.query";
import user_moderations_route from "./moderations";
import { UserNotFound } from "./not-found";
import user_organizations_page_route from "./organizations";
import { UserPage } from "./page";

//

export default new Hono<App_Context>()
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("param", EntitySchema),
    async function GET({ render, req, set, status, var: { identite_pg } }) {
      const { id } = req.valid("param");

      try {
        const user = await get_user_by_id(identite_pg, id);
        const authenticators = await get_authenticators_by_user_id(
          identite_pg,
          id,
        );

        set(
          "page_title",
          `Utilisateur ${user.given_name} ${user.family_name} (${user.email})`,
        );

        return render(<UserPage user={user} authenticators={authenticators} />);
      } catch (error) {
        if (error instanceof NotFoundError) {
          status(404);
          return render(<UserNotFound user_id={id} />);
        }
        throw error;
      }
    },
  )
  .delete(
    "/",
    zValidator("param", EntitySchema),
    async function DELETE({ text, req, var: { identite_pg } }) {
      const { id } = req.valid("param");
      await identite_pg.delete(schema.users).where(eq(schema.users.id, id));
      return text("OK", 200, {
        "HX-Location": urls.users.$url().pathname,
      } as HtmxHeader);
    },
  )
  .patch(
    "/reset/email_verified",
    zValidator("param", EntitySchema),
    async function reset_email_verified({ text, req, var: { identite_pg } }) {
      const { id } = req.valid("param");
      await identite_pg
        .update(schema.users)
        .set({
          email_verified: false,
        })
        .where(eq(schema.users.id, id));
      return text("OK", 200, { "HX-Refresh": "true" } as HtmxHeader);
    },
  )
  .patch(
    "/reset/france_connect",
    zValidator("param", EntitySchema),
    async function reset_email_verified({ text, req, var: { identite_pg } }) {
      const { id } = req.valid("param");
      await identite_pg
        .delete(schema.franceconnect_userinfo)
        .where(eq(schema.franceconnect_userinfo.user_id, id));
      return text("OK", 200, { "HX-Refresh": "true" } as HtmxHeader);
    },
  )
  .patch(
    "/reset/password",
    zValidator("param", EntitySchema),
    async function reset_password({
      text,
      req,
      var: { config, crisp, identite_pg, userinfo },
    }) {
      const { id: user_id } = req.valid("param");

      const reset_password = ResetPassword({
        crisp,
        pg: identite_pg,
        resolve_delay: config.CRISP_RESOLVE_DELAY,
      });
      await reset_password({ moderator: userinfo, user_id });

      return text("OK", 200, { "HX-Refresh": "true" } as HtmxHeader);
    },
  )
  .patch(
    "/reset/mfa",
    zValidator("param", EntitySchema),
    async function reset_mfa({
      text,
      req,
      var: { config, crisp, identite_pg, userinfo },
    }) {
      const { id: user_id } = req.valid("param");

      const reset_mfa = ResetMFA({
        crisp,
        pg: identite_pg,
        resolve_delay: config.CRISP_RESOLVE_DELAY,
      });
      await reset_mfa({ moderator: userinfo, user_id });

      return text("OK", 200, { "HX-Refresh": "true" } as HtmxHeader);
    },
  )
  //
  .route("/organizations", user_organizations_page_route)
  .route("/moderations", user_moderations_route);

//
