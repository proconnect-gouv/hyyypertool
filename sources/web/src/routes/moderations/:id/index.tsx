//

import { NotFoundError } from "#src/errors";
import { Main_Layout } from "#src/layouts";
import { zValidator } from "@hono/zod-validator";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { Entity_Schema } from "@~/core/schema";
import { moderation_type_to_title } from "@~/moderations.lib/moderation_type.mapper";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { load_moderation_page_variables, type ContextType } from "./context";
import duplicate_warning_router from "./duplicate_warning";
import moderation_email_router from "./email/index";
import { ModerationNotFound } from "./not-found";
import Page from "./page";
import moderation_processed_router from "./processed";
import moderation_rejected_router from "./rejected";
import moderation_reprocess_router from "./reprocess";
import moderation_validate_router from "./validate";

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
        const variables = await load_moderation_page_variables(
          config,
          identite_pg,
          { id },
        );
        set_variables(set, variables);
        return next();
      } catch (error) {
        if (error instanceof NotFoundError) {
          status(404);
          return render(<ModerationNotFound moderation_id={id} />);
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
  .route("/validate", moderation_validate_router)
  .route("/rejected", moderation_rejected_router)
  .route("/processed", moderation_processed_router)
  .route("/reprocess", moderation_reprocess_router);
