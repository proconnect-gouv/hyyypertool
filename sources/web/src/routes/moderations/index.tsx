//

import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import { PaginationSchema } from "#src/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import moderation_router from "./:id/index";
import { search_schema } from "./context";
import { get_moderations_list } from "./get_moderations_list.query";
import { get_moderators_list } from "./get_moderators_list.query";
import { get_sp_names_list } from "./get_sp_names_list.query";
import { ModerationsPage } from "./page";

//
export default new Hono<AppContext>()
  .use(authorized())

  .route("/:id", moderation_router)
  .get(
    "/",
    jsxRenderer(Main_Layout),
    async function GET({ env, render, req, set, var: { identite_pg, nonce } }) {
      const query = req.query();

      const { q: search } = search_schema.parse(query);

      const pagination = match(PaginationSchema.safeParse(query))
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => PaginationSchema.parse({}));

      const [query_moderations_list, db_moderators, sp_names_list] =
        await Promise.all([
          get_moderations_list(identite_pg, {
            pagination: { ...pagination, page: pagination.page - 1 },
            search,
          }),
          get_moderators_list(identite_pg),
          get_sp_names_list(identite_pg),
        ]);

      const allowed_users_env = (env.ALLOWED_USERS ?? "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      const moderators_list = [
        ...new Set([...allowed_users_env, ...db_moderators]),
      ].sort();

      set("page_title", "Liste des moderations");
      return render(
        <ModerationsPage
          moderators_list={moderators_list}
          pagination={pagination}
          poll_interval={env.POLL_INTERVAL}
          search={search}
          sp_names_list={sp_names_list}
          query_result={query_moderations_list}
          nonce={nonce}
        />,
      );
    },
  );

//
