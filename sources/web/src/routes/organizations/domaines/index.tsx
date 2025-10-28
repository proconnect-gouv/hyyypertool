//

import { zValidator } from "@hono/zod-validator";
import { Main_Layout } from "@~/app.layout";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { urls } from "#src/urls";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import {
  loadDomainesPageVariables,
  query_schema,
  type ContextType,
} from "./context";
import { Page } from "./Page";

//

export default new Hono<ContextType>().use("/", jsxRenderer(Main_Layout)).get(
  "/",
  zValidator("query", query_schema, function hook(result, { redirect }) {
    if (result.success) return undefined;
    consola.error(result.error);
    return redirect(urls.organizations.domains.$url().pathname);
  }),
  async function set_variables_middleware({ set }, next) {
    const variables = await loadDomainesPageVariables();
    set_variables(set, variables);
    return next();
  },
  async function GET({ render, set }) {
    set("page_title", "Liste des domaines à vérifier");
    return render(<Page />);
  },
);
