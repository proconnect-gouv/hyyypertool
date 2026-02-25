//

import {
  moderation_type_to_emoji,
  moderation_type_to_title,
} from "#src/lib/moderations";
import { date_to_string } from "#src/time";
import { urls } from "#src/urls";
import type { get_moderations_by_user_id } from "./get_moderations_by_user_id.query";

//

type ModerationList = Awaited<ReturnType<typeof get_moderations_by_user_id>>;

export function Table({
  describedby,
  moderations,
}: {
  describedby: string;
  moderations: ModerationList;
}) {
  return (
    <div class="fr-table *:table!">
      <table aria-describedby={describedby}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Date de création</th>
            <th>Modéré le</th>
            <th>Commentaire</th>
          </tr>
        </thead>

        <tbody>
          {moderations.map((moderation) => (
            <Row key={`${moderation.id}`} moderation={moderation} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

//

export function Row({
  key,
  moderation,
}: {
  key?: string;
  moderation: ModerationList[number];
}) {
  const href = urls.moderations[":id"].$url({
    param: { id: moderation.id },
  }).pathname;

  return (
    <tr
      class="relative focus-within:outline focus-within:outline-2 focus-within:outline-blue-500 hover:bg-gray-100"
      key={key}
    >
      <td>
        <a
          class="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          href={href}
          aria-label={`Modération ${moderation_type_to_title(moderation.type).toLowerCase()} (ID ${moderation.id})`}
        >
          {moderation.id}
        </a>
      </td>
      <td>
        <span title={moderation.type}>
          {moderation_type_to_emoji(moderation.type)}
          {moderation_type_to_title(moderation.type)}
        </span>
      </td>
      <td>{date_to_string(new Date(moderation.created_at))}</td>
      <td>
        {moderation.moderated_at
          ? date_to_string(new Date(moderation.moderated_at))
          : null}
      </td>
      <td>{moderation.comment}</td>
    </tr>
  );
}
