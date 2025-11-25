//

import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth";
import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { PaginationSchema } from "@~/core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import user_page_route from "./:id/index";
import { query_schema } from "./context";
import domains_router from "./domains";
import { get_organizations_list } from "./get_organizations_list.query";
import leaders_router from "./leaders";
import Page from "./page";

//

export default new Hono<App_Context>()
  .use(authorized())
  //
  .route("/leaders", leaders_router)
  .route("/domains", domains_router)
  .route("/:id", user_page_route)
  //
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("query", query_schema),
    async function GET({ render, set, req, var: { identite_pg } }) {
      set("page_title", "Liste des organisations");

      const { q } = req.valid("query");
      const pagination = match(PaginationSchema.safeParse(req.query()))
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => PaginationSchema.parse({}));

      const query_result = await get_organizations_list(identite_pg, {
        pagination: { ...pagination, page: pagination.page - 1 },
        search: q ? String(q) : undefined,
      });

      return render(
        <Page q={q} pagination={pagination} query_result={query_result} />,
      );
    },
  );
