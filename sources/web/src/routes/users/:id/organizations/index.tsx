//

import { zValidator } from "@hono/zod-validator";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { Pagination_Schema } from "@~/core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { Table } from "./Table";
import {
  loadOrganizationsPageVariables,
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
    const { id: user_id } = req.valid("param");

    const pagination = match(
      Pagination_Schema.safeParse(req.query(), { path: ["query"] }),
    )
      .with({ success: true }, ({ data }) => data)
      .otherwise(() => Pagination_Schema.parse({}));

    const variables = await loadOrganizationsPageVariables(identite_pg, {
      pagination,
      user_id,
    });
    set_variables(set, variables);
    return next();
  },
  async function GET({ render }) {
    return render(<Table />);
  },
);
