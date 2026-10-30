//

import { MainLayout } from "#src/layouts";
import { parse_activity_row } from "#src/lib/activities";
import { authorized } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { query_schema } from "./context";
import {
  get_activities,
  get_activity_categories,
} from "./get_activities.query";
import { Page } from "./page";

//

const PAGE_SIZE = 50;

export default new Hono<AppContext>()
  .use(authorized())
  .get(
    "/",
    jsxRenderer(MainLayout),
    zValidator("query", query_schema),
    async function GET({
      render,
      req,
      set,
      var: { hyyyper_pg, identite_pg, sentry },
    }) {
      const { live, page } = req.valid("query");
      const categories = req.queries("category") ?? [];
      const pagination = { page, page_size: PAGE_SIZE };

      const [{ activities: rows, count }, all_categories] = await Promise.all([
        get_activities(
          { hyyyper_pg, pg: identite_pg },
          { categories, pagination: { ...pagination, page: page - 1 } },
        ),
        get_activity_categories(identite_pg),
      ]);

      const activities = rows.map((activity) => ({
        ...activity,
        cause:
          activity.cause === null
            ? null
            : {
                ...activity.cause,
                parsed: parse_activity_row({
                  action: activity.cause.action,
                  context: activity.cause.context,
                }),
              },
        parsed: parse_activity_row({
          action: activity.action,
          context: activity.context,
        }),
      }));

      for (const { id, parsed } of activities.flatMap((activity) =>
        activity.cause === null ? [activity] : [activity, activity.cause],
      )) {
        if (parsed.kind !== "invalid_context") continue;
        sentry.captureException(parsed.error, {
          data: { action: parsed.action, activity_id: id },
        });
      }

      set("page_title", "Liste des activités");
      return render(
        <Page
          activities={activities}
          categories={all_categories}
          count={count}
          live={live}
          pagination={pagination}
          selected={categories}
        />,
      );
    },
  );
