//

import type { ParsedActivityRow } from "#src/lib/activities";
import { ActivityItem } from "#src/ui/activities";
import { table } from "#src/ui/table";
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
    <ActivityItem
      action={activity.parsed.action}
      actor={activity.actor}
      cause={activity.cause}
      created_at={activity.created_at}
      parsed={activity.parsed}
    >
      {activity.organization === null ? null : (
        <>
          {" · "}
          <a
            href={
              urls.organizations[":id"].$url({
                param: { id: activity.organization.id },
              }).pathname
            }
          >
            {activity.organization.label}
          </a>
        </>
      )}
    </ActivityItem>
  );
}
