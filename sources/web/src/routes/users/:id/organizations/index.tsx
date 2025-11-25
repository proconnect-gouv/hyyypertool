//

import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { PaginationSchema } from "@~/core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { ParamSchema, QuerySchema } from "./context";
import { get_organizations_by_user_id } from "./get_organizations_by_user_id.query";
import { Table } from "./Table";

//

export default new Hono<App_Context>().get(
  "/",
  jsxRenderer(),
  zValidator("param", ParamSchema),
  zValidator("query", QuerySchema),
  async function GET({ req, var: { identite_pg }, render }) {
    const { id: user_id } = req.valid("param");
    const { describedby, page_ref } = req.valid("query");

    const pagination = match(PaginationSchema.safeParse(req.query()))
      .with({ success: true }, ({ data }) => data)
      .otherwise(() => PaginationSchema.parse({}));

    const organizations_collection = await get_organizations_by_user_id(
      identite_pg,
      {
        user_id,
        pagination: { ...pagination, page: pagination.page - 1 },
      },
    );
    return render(
      <Table
        pagination={pagination}
        organizations_collection={organizations_collection}
        user_id={user_id}
        describedby={describedby}
        page_ref={page_ref}
      />,
    );
  },
);
