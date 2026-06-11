//

import type { AppContext } from "#src/middleware/context";
import { PaginationSchema } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { ParamSchema, QuerySchema } from "./context";
import { get_oidc_clients_by_user_id } from "./get_oidc_clients_by_user_id.query";
import { Table } from "./Table";

//

export default new Hono<AppContext>()
  .use("/", jsxRenderer())
  .get(
    "/",
    zValidator("param", ParamSchema),
    zValidator("query", QuerySchema),
    async function GET({ render, req, var: { identite_pg } }) {
      const { id: user_id } = req.valid("param");
      const { describedby, page_ref } = req.valid("query");

      const pagination = match(PaginationSchema.safeParse(req.query()))
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => PaginationSchema.parse({}));

      const connections_collection = await get_oidc_clients_by_user_id(
        identite_pg,
        {
          user_id,
          pagination: { ...pagination, page: pagination.page - 1 },
        },
      );

      return render(
        <Table
          connections_collection={connections_collection}
          describedby={describedby}
          page_ref={page_ref}
          pagination={pagination}
          user_id={user_id}
        />,
      );
    },
  );
