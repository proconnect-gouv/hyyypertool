//

import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { Main_Layout } from "@~/web/layouts";
import { authorized } from "@~/app.middleware/authorized";
import { set_variables } from "@~/app.middleware/context/set_variables";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import user_id_router from "./:id";
import {
  loadUsersListPageVariables,
  PageInput_Schema,
  type ContextType,
} from "./context";
import Page from "./page";

//

export default new Hono<ContextType>()
  .use(authorized())
  //
  .route("/:id", user_id_router)
  //
  .get(
    "/",
    jsxRenderer(Main_Layout),
    async function set_variables_middleware(
      { set, var: { identite_pg } },
      next,
    ) {
      const variables = await loadUsersListPageVariables(identite_pg);
      set_variables(set, variables);
      return next();
    },
    zValidator("query", PageInput_Schema, function hook(result, { redirect }) {
      if (result.success) return undefined;
      consola.error(result.error);
      return redirect(urls.users.$url().pathname);
    }),
    async function GET({ render, set }) {
      set("page_title", "Liste des utilisateurs");
      return render(<Page />);
    },
  );
