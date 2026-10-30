//

import type { ParsedActivityRow } from "#src/lib/activities";
import { ActivityLabel, Actor } from "#src/ui/activities";
import { table } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import type { get_activities_by_user_id } from "./get_activities_by_user_id.query";

//

type Activities = Awaited<ReturnType<typeof get_activities_by_user_id>>;
type Activity = Activities[number];
type RenderedActivity = Activity & {
  cause:
    (NonNullable<Activity["cause"]> & { parsed: ParsedActivityRow }) | null;
  parsed: ParsedActivityRow;
};

export function Table({
  activities,
}: {
  activities: ReadonlyArray<RenderedActivity>;
}) {
  return (
    <table class={table()}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Par</th>
          <th>Organisation</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <Row activity={activity} key={`${activity.id}`} />
        ))}
      </tbody>
    </table>
  );
}

function Row({ activity }: { activity: RenderedActivity }) {
  return (
    <tr aria-label={`Activité ${activity.parsed.action}`}>
      <td>
        <LocalTime date={activity.created_at} />
      </td>
      <td>
        <Actor actor={activity.actor} />
      </td>
      <td>
        {activity.organization === null ? (
          "—"
        ) : (
          <a
            href={
              urls.organizations[":id"].$url({
                param: { id: activity.organization.id },
              }).pathname
            }
          >
            {activity.organization.label}
          </a>
        )}
      </td>
      <td>
        <ActivityLabel parsed={activity.parsed} />
        {activity.cause !== null && (
          <div>
            ↳ Suite à : <ActivityLabel parsed={activity.cause.parsed} /> par{" "}
            <Actor actor={activity.cause.actor} />
          </div>
        )}
      </td>
    </tr>
  );
}
