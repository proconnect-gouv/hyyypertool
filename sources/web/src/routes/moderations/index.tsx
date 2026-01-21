//

import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth";
import type { App_Context } from "#src/middleware/context";
import { PaginationSchema } from "@~/core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match, P } from "ts-pattern";
import moderation_router from "./:id/index";
import { search_schema } from "./context";
import { get_moderations_list } from "./get_moderations_list.query";
import { ModerationsPage } from "./page";

//
export default new Hono<App_Context>()
  .use(authorized())

  .route("/:id", moderation_router)
  .get(
    "/",
    jsxRenderer(Main_Layout),
    async function GET({ render, req, set, var: { identite_pg, nonce } }) {
      const query = req.query();

      const search = match(search_schema.parse(query))
        .with(
          { search_email: P.not("") },
          { search_siret: P.not("") },
          { search_moderated_by: P.not("") },
          (search) => ({
            ...search,
            hide_join_organization: false,
            hide_non_verified_domain: false,
            processed_requests: true,
          }),
        )
        .otherwise((search) => search);

      const pagination = match(PaginationSchema.safeParse(query))
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => PaginationSchema.parse({}));

      const query_moderations_list = await get_moderations_list(identite_pg, {
        pagination: { ...pagination, page: pagination.page - 1 },
        search,
      });

      set("page_title", "Liste des moderations");
      return render(
        <ModerationsPage
          pagination={pagination}
          search={search}
          query_result={query_moderations_list}
          nonce={nonce}
        />,
      );
    },
  );

//
