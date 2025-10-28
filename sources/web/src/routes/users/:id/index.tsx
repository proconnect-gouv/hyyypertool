//

import { NotFoundError } from "#src/errors";
import type { Htmx_Header } from "#src/htmx";
import { urls } from "#src/urls";
import { Entity_Schema } from "@~/core/schema";
import { zValidator } from "@hono/zod-validator";
import { Main_Layout } from "@~/app.layout/index";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { CrispApi } from "@~/crisp.lib/api";
import { set_crisp_config } from "@~/crisp.middleware";
import { schema } from "@~/identite-proconnect.database";
import { ResetMFA, ResetPassword } from "@~/users.lib/usecase";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import type { ContextType } from "./context";
import { loadUserPageVariables } from "./context";
import user_moderations_route from "./moderations";
import { UserNotFound } from "./not-found";
import user_organizations_page_route from "./organizations";
import { UserPage } from "./page";

//

export default new Hono<ContextType>()
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("param", Entity_Schema),
    async function set_variables_middleware(
      { render, req, set, status, var: { identite_pg } },
      next,
    ) {
      const { id } = req.valid("param");

      try {
        const variables = await loadUserPageVariables(identite_pg, { id });
        set_variables(set, variables);
        return next();
      } catch (error) {
        if (error instanceof NotFoundError) {
          status(404);
          return render(<UserNotFound user_id={id} />);
        }
        throw error;
      }
    },
    async function GET({ render, set, var: { user } }) {
      set(
        "page_title",
        `Utilisateur ${user.given_name} ${user.family_name} (${user.email})`,
      );
      return render(<UserPage />);
    },
  )
  .delete(
    "/",
    zValidator("param", Entity_Schema),
    async function DELETE({ text, req, var: { identite_pg } }) {
      const { id } = req.valid("param");
      await identite_pg.delete(schema.users).where(eq(schema.users.id, id));
      return text("OK", 200, {
        "HX-Location": urls.users.$url().pathname,
      } as Htmx_Header);
    },
  )
  .patch(
    "/reset/email_verified",
    zValidator("param", Entity_Schema),
    async function PATCH_RESET({ text, req, var: { identite_pg } }) {
      const { id } = req.valid("param");
      await identite_pg
        .update(schema.users)
        .set({
          email_verified: false,
        })
        .where(eq(schema.users.id, id));
      return text("OK", 200, { "HX-Refresh": "true" } as Htmx_Header);
    },
  )
  .patch(
    "/reset/password",
    set_crisp_config(),
    zValidator("param", Entity_Schema),
    async function PATCH_RESET({
      text,
      req,
      var: { config, crisp_config, identite_pg, userinfo },
    }) {
      const { id: user_id } = req.valid("param");

      const reset_password = ResetPassword({
        crisp: CrispApi(crisp_config),
        pg: identite_pg,
        resolve_delay: config.CRISP_RESOLVE_DELAY,
      });
      await reset_password({ moderator: userinfo, user_id });

      return text("OK", 200, { "HX-Refresh": "true" } as Htmx_Header);
    },
  )
  .patch(
    "/reset/mfa",
    set_crisp_config(),
    zValidator("param", Entity_Schema),
    async function PATCH_RESET({
      text,
      req,
      var: { config, crisp_config, identite_pg, userinfo },
    }) {
      const { id: user_id } = req.valid("param");

      const reset_mfa = ResetMFA({
        crisp: CrispApi(crisp_config),
        pg: identite_pg,
        resolve_delay: config.CRISP_RESOLVE_DELAY,
      });
      await reset_mfa({ moderator: userinfo, user_id });

      return text("OK", 200, { "HX-Refresh": "true" } as Htmx_Header);
    },
  )
  //
  .route("/organizations", user_organizations_page_route)
  .route("/moderations", user_moderations_route);

//
