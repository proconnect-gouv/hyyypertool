//

import { zValidator } from "@hono/zod-validator";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { DuplicateWarning } from "./DuplicateWarning";
import {
  load_duplicate_warning_page_variables,
  ParamSchema,
  QuerySchema,
  type ContextType,
} from "./context";

//

export default new Hono<ContextType>().get(
  "/",
  jsxRenderer(),
  zValidator("param", ParamSchema),
  zValidator("query", QuerySchema),
  async function set_variables_middleware(
    { req, set, var: { identite_pg } },
    next,
  ) {
    const { id: moderation_id } = req.valid("param");
    const { organization_id, user_id } = req.valid("query");
    const variables = await load_duplicate_warning_page_variables(identite_pg, {
      moderation_id,
      organization_id,
      user_id,
    });
    set_variables(set, variables);
    return next();
  },
  async function GET({ render, var: variables }) {
    return render(
      <DuplicateWarning.Context.Provider value={variables}>
        <DuplicateWarning />
      </DuplicateWarning.Context.Provider>,
    );
  },
);
