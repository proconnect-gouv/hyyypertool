//

import { parse_activity_row } from "#src/lib/activities";
import type { AppContext } from "#src/middleware/context";
import { EntitySchema } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { get_activities_by_user_id } from "./get_activities_by_user_id.query";
import { Table } from "./Table";

//

export default new Hono<AppContext>().get(
  "/",
  jsxRenderer(),
  zValidator("param", EntitySchema),
  async function GET({
    render,
    req,
    var: { hyyyper_pg, identite_pg, sentry },
  }) {
    const { id: user_id } = req.valid("param");

    const activities = (
      await get_activities_by_user_id(
        { hyyyper_pg, pg: identite_pg },
        { user_id },
      )
    ).map((activity) => ({
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

    if (activities.length === 0) return render(<p>Aucune activité.</p>);
    return render(<Table activities={activities} />);
  },
);
