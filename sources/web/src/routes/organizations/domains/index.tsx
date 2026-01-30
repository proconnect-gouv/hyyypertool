//

import { hyper_ref } from "#src/html";
import { hx_include } from "#src/htmx";
import { Main_Layout } from "#src/layouts";
import type { App_Context } from "#src/middleware/context";
import { hx_urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { PaginationSchema, SearchSchema } from "@~/core/schema";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { get_unverified_domains } from "./get_unverified_domains.query";
import { Page } from "./page";

//

export const query_schema = PaginationSchema.merge(SearchSchema);

//

export default new Hono<App_Context>().use("/", jsxRenderer(Main_Layout)).get(
  "/",
  zValidator("query", query_schema, function hook(result, { redirect }) {
    if (result.success) return undefined;
    consola.error(result.error);
    return redirect(hx_urls.organizations.domains.$url().pathname);
  }),
  async function GET({ render, set, req, var: { identite_pg } }) {
    set("page_title", "Liste des domaines à vérifier");

    // Load variables directly in handler
    const $describedby = hyper_ref();
    const $table = hyper_ref();
    const $search = hyper_ref();

    const hx_domains_query_props = {
      ...hx_urls.organizations.domains.$get({ query: {} }),
      "hx-include": hx_include([
        $search,
        $table,
        query_schema.keyof().enum.page,
      ]),
      "hx-replace-url": true,
      "hx-select": `#${$table} > table`,
      "hx-target": `#${$table}`,
    };

    // Load domain data in handler
    const { q } = req.valid("query");
    const pagination = match(PaginationSchema.safeParse(req.query()))
      .with({ success: true }, ({ data }) => data)
      .otherwise(() => PaginationSchema.parse({}));

    const { count, domains } = await get_unverified_domains(identite_pg, {
      pagination: { ...pagination, page: pagination.page - 1 },
      search: q ? String(q) : undefined,
    });

    return render(
      <Page
        $describedby={$describedby}
        $search={$search}
        $table={$table}
        hx_domains_query_props={hx_domains_query_props}
        query={req.valid("query")}
        pagination={pagination}
        count={count}
        domains={domains}
      />,
    );
  },
);
