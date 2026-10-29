//

import { parse_activity_row } from "#src/lib/activities";
import type { AppContext } from "#src/middleware/context";
import { EntitySchema } from "#src/schema";
import { ActivityRow } from "#src/ui/activities";
import { table } from "#src/ui/table";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { get_domain_history } from "./get_domain_history.query";

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
    const { id: organization_id } = req.valid("param");

    const activities = (
      await get_domain_history(
        { hyyyper_pg, pg: identite_pg },
        { organization_id },
      )
    ).map(({ action, caused, context, ...activity }) => ({
      ...activity,
      caused: caused.map(({ action, context, ...caused_activity }) => ({
        ...caused_activity,
        parsed: parse_activity_row({ action, context }),
      })),
      parsed: parse_activity_row({ action, context }),
    }));
    for (const { id, parsed } of activities.flatMap((activity) => [
      activity,
      ...activity.caused,
    ])) {
      if (parsed.kind !== "invalid_context") continue;
      sentry.captureException(parsed.error, {
        data: { action: parsed.action, activity_id: id },
      });
    }

    if (activities.length === 0) return render(<p>Aucun historique.</p>);
    return render(
      <table class={table()}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Par</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(({ actor, caused, created_at, id, parsed }) => (
            <ActivityRow
              key={`${id}`}
              actor={actor}
              caused={caused}
              created_at={created_at}
              parsed={parsed}
            />
          ))}
        </tbody>
      </table>,
    );
  },
);
