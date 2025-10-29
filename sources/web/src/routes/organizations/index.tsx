//

import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth/authorized";
import { zValidator } from "@hono/zod-validator";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import user_page_route from "./:id/index";
import {
  loadOrganizationsListPageVariables,
  PageQuery_Schema,
  type ContextType,
} from "./context";
import domains_router from "./domaines";
import leaders_router from "./leaders";
import Page from "./page";

//

export default new Hono<ContextType>()
  .use(authorized())
  //
  .route("/leaders", leaders_router)
  .route("/domains", domains_router)
  .route("/:id", user_page_route)
  //
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("query", PageQuery_Schema),
    async function set_variables_middleware(
      { set, var: { identite_pg } },
      next,
    ) {
      const variables = await loadOrganizationsListPageVariables(identite_pg);
      set_variables(set, variables);
      return next();
    },
    function GET({ render, set }) {
      set("page_title", "Liste des organisations");
      return render(<Page />);
    },
  );
