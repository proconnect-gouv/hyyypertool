//

import { zValidator } from "@hono/zod-validator";
import { NotFoundError } from "@~/app.core/error";
import { Entity_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout/index";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { moderation_type_to_title } from "@~/moderations.lib/moderation_type.mapper";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import moderation_procedures_router from "./$procedures";
import { loadModerationPageVariables, type ContextType } from "./context";
import duplicate_warning_router from "./duplicate_warning";
import moderation_email_router from "./email/index";
import { Moderation_NotFound } from "./not-found";
import Page from "./page";

//

export default new Hono<ContextType>()
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("param", Entity_Schema),
    async function set_variables_middleware(
      { render, req, set, status, var: { identite_pg, config } },
      next,
    ) {
      const { id } = req.valid("param");

      try {
        const variables = await loadModerationPageVariables(
          config,
          identite_pg,
          { id },
        );
        set_variables(set, variables);
        return next();
      } catch (error) {
        if (error instanceof NotFoundError) {
          status(404);
          return render(<Moderation_NotFound moderation_id={id} />);
        }
        throw error;
      }
    },
    function GET({ render, set, var: { moderation } }) {
      set(
        "page_title",
        `Modération ${moderation_type_to_title(moderation.type).toLowerCase()} de ${moderation.user.given_name} ${moderation.user.family_name} pour ${moderation.organization.siret}`,
      );
      return render(<Page />);
    },
  )
  .route("/email", moderation_email_router)
  .route("/duplicate_warning", duplicate_warning_router)
  .route("/$procedures", moderation_procedures_router);
