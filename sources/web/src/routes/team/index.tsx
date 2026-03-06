//

import type { HtmxHeader } from "#src/htmx";
import { Main_Layout } from "#src/layouts";
import type { AdminAppContext } from "#src/middleware/context";
import { EntitySchema } from "#src/schema";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { schema } from "@~/hyyyperbase";
import consola from "consola";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { z } from "zod";
import { query_schema } from "./context";
import { get_team_list } from "./get_team_list.query";
import Page from "./page";

//

export default new Hono<AdminAppContext>()
  .get(
    "/",
    jsxRenderer(Main_Layout),
    zValidator("query", query_schema, function hook(result, { redirect }) {
      if (result.success) return undefined;
      consola.error(result.error);
      return redirect(urls.admin.team.$url().pathname);
    }),
    async function GET({
      render,
      set,
      req,
      var: { hyyyper_pg, hyyyper_user },
    }) {
      set("page_title", "Gestion de l'equipe");

      const { q } = req.valid("query");
      const pagination = match(query_schema.safeParse(req.query()))
        .with({ success: true }, ({ data }) => data)
        .otherwise(() => query_schema.parse({}));

      const query_result = await get_team_list(hyyyper_pg, {
        search: q ? String(q) : undefined,
        pagination: { ...pagination, page: pagination.page - 1 },
      });

      return render(
        <Page
          current_user_id={hyyyper_user.id}
          q={q}
          pagination={pagination}
          query_result={query_result}
        />,
      );
    },
  )

  .post(
    "/",
    zValidator(
      "form",
      z.object({ email: z.string().email(), role: z.string() }),
    ),
    async function POST({ text, req, var: { hyyyper_pg, hyyyper_user } }) {
      const { email, role } = req.valid("form");

      await hyyyper_pg
        .insert(schema.users)
        .values({ email, role, updated_by: hyyyper_user.id });

      return text("OK", 200, { "HX-Refresh": "true" } as HtmxHeader);
    },
  )

  .patch(
    "/:id",
    zValidator("param", EntitySchema),
    zValidator("form", z.object({ role: z.string() })),
    async function PATCH_ROLE({
      text,
      req,
      var: { hyyyper_pg, hyyyper_user },
    }) {
      const { id } = req.valid("param");
      if (id === hyyyper_user.id) {
        return text("Forbidden: cannot modify your own role", 403);
      }
      const { role } = req.valid("form");

      await hyyyper_pg
        .update(schema.users)
        .set({ role, updated_at: new Date(), updated_by: hyyyper_user.id })
        .where(eq(schema.users.id, id));

      return text("OK", 200, { "HX-Refresh": "true" } as HtmxHeader);
    },
  )

  .patch(
    "/:id/disable",
    zValidator("param", EntitySchema),
    async function PATCH_DISABLE({
      text,
      req,
      var: { hyyyper_pg, hyyyper_user },
    }) {
      const { id } = req.valid("param");
      if (id === hyyyper_user.id) {
        return text("Forbidden: cannot disable yourself", 403);
      }

      await hyyyper_pg
        .update(schema.users)
        .set({
          disabled_at: new Date(),
          updated_at: new Date(),
          updated_by: hyyyper_user.id,
        })
        .where(eq(schema.users.id, id));

      return text("OK", 200, { "HX-Refresh": "true" } as HtmxHeader);
    },
  )

  .patch(
    "/:id/enable",
    zValidator("param", EntitySchema),
    async function PATCH_ENABLE({
      text,
      req,
      var: { hyyyper_pg, hyyyper_user },
    }) {
      const { id } = req.valid("param");

      await hyyyper_pg
        .update(schema.users)
        .set({
          disabled_at: null,
          updated_at: new Date(),
          updated_by: hyyyper_user.id,
        })
        .where(eq(schema.users.id, id));

      return text("OK", 200, { "HX-Refresh": "true" } as HtmxHeader);
    },
  );
