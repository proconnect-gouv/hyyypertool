//

import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth";
import type { App_Context } from "#src/middleware/context";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import user_id_router from "./:id";
import { query_schema } from "./context";
import { get_users_list } from "./get_users_list.query";
import Page from "./page";

//

export default new Hono<App_Context>()
  .use(authorized())
  //
  .route("/:id", user_id_router)
  //
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("query", query_schema, function hook(result, { redirect }) {
      if (result.success) return undefined;
      consola.error(result.error);
      return redirect(urls.users.$url().pathname);
    }),
    async function GET({ render, set, req, var: { identite_pg } }) {
      set("page_title", "Liste des utilisateurs");

      const { q } = req.valid("query");
      const pagination = match(query_schema.safeParse(req.query()))
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => query_schema.parse({}));

      const query_result = await get_users_list(identite_pg, {
        search: q ? String(q) : undefined,
        pagination: { ...pagination, page: pagination.page - 1 },
      });

      return render(
        <Page q={q} pagination={pagination} query_result={query_result} />,
      );
    },
  );
