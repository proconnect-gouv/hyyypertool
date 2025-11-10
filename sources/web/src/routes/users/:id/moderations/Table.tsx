//

import { date_to_string } from "#src/time";
import { urls } from "#src/urls";
import {
  moderation_type_to_emoji,
  moderation_type_to_title,
} from "#src/lib/moderations";
import { usePageRequestContext, type ModerationList } from "./context";

//

export function Table() {
  const {
    var: { describedby, moderations },
  } = usePageRequestContext();

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
            <th>Lien</th>
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
  return (
    <tr
      aria-label={`Modération ${moderation_type_to_title(moderation.type).toLowerCase()} (ID ${moderation.id})`}
      key={key}
    >
      <td>{moderation.id}</td>
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
      <td>
        <a
          class="p-3"
          href={
            urls.moderations[":id"].$url({
              param: { id: moderation.id.toString() },
            }).pathname
          }
        >
          ➡️
        </a>
      </td>
    </tr>
  );
}
