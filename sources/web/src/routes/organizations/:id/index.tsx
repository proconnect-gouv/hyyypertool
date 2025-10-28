//

import { Entity_Schema } from "@~/core/schema";
import { zValidator } from "@hono/zod-validator";
import { Main_Layout } from "@~/app.layout";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { loadOrganizationPageVariables, type ContextType } from "./context";
import organization_domains_router from "./domains";
import organization_members_router from "./members";
import Organization_Page from "./page";

//

export default new Hono<ContextType>()
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function set_variables_middleware(
      { req, set, var: { config, identite_pg } },
      next,
    ) {
      const { id } = req.valid("param");
      set_variables(
        set,
        await loadOrganizationPageVariables(config, identite_pg, {
          id,
        }),
      );
      return next();
    },
    async function GET({ render, set, var: { organization } }) {
      set(
        "page_title",
        `Organisation ${organization.cached_libelle} (${organization.siret})`,
      );
      return render(<Organization_Page />);
    },
  )
  //
  .route("/members", organization_members_router)
  .route("/domains", organization_domains_router);
