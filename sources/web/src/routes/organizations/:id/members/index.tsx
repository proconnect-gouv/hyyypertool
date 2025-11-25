//

import { zValidator } from "@hono/zod-validator";
import {
  DescribedBySchema,
  EntitySchema,
  PaginationSchema,
} from "@~/core/schema";
import type { App_Context } from "#src/middleware/context";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { z } from "zod/v4";
import organization_member_router from "./:user_id";
import { Table } from "./Table";
import { get_users_by_organization } from "./get_users_by_organization.query";

//

export default new Hono<App_Context>()
  //
  .route("/:user_id", organization_member_router)
  //

  .get(
    "/",
    jsxRenderer(),
    zValidator("param", EntitySchema),
    zValidator(
      "query",
      PaginationSchema.merge(DescribedBySchema).extend({
        page_ref: z.string(),
      }),
    ),
    async function GET({ render, req, var: { identite_pg } }) {
      const { id: organization_id } = req.valid("param");
      const { describedby, page_ref } = req.valid("query");
      const pagination = match(PaginationSchema.safeParse(req.query()))
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => PaginationSchema.parse({}));

      const query_members_collection = await get_users_by_organization(
        identite_pg,
        {
          organization_id,
          pagination: { ...pagination, page: pagination.page - 1 },
        },
      );

      return render(
        <Table
          organization_id={organization_id}
          pagination={pagination}
          query_members_collection={query_members_collection}
          describedby={describedby}
          page_ref={page_ref}
        />,
      );
    },
  );
