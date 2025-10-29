//

import { set_variables } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import {
  DescribedBy_Schema,
  Entity_Schema,
  Pagination_Schema,
} from "@~/core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { z } from "zod";
import organization_member_router from "./:user_id";
import { Table } from "./Table";
import { loadMembersPageVariables, type ContextType } from "./context";

//

export default new Hono<ContextType>()
  //
  .route("/:user_id", organization_member_router)
  //

  .get(
    "/",
    jsxRenderer(),
    zValidator("param", Entity_Schema),
    zValidator(
      "query",
      Pagination_Schema.merge(DescribedBy_Schema).extend({
        page_ref: z.string(),
      }),
    ),
    async function set_variables_middleware(
      { req, set, var: { identite_pg } },
      next,
    ) {
      const { id: organization_id } = req.valid("param");
      const pagination = match(Pagination_Schema.safeParse(req.query()))
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => Pagination_Schema.parse({}));
      const variables = await loadMembersPageVariables(identite_pg, {
        organization_id,
        pagination,
      });
      set_variables(set, variables);
      return next();
    },
    async function GET({ render }) {
      return render(<Table />);
    },
  );
