//

import type {
  KnownAction,
  KnownActivityContexts,
  ParsedActivityRow,
} from "#src/lib/activities";
import { LocalTime } from "#src/ui/time";
import type { Child } from "hono/jsx";
import { match } from "ts-pattern";

//

const known_activity_labels: {
  [Action in KnownAction]: (context: KnownActivityContexts[Action]) => Child;
} = {
  "domain.refused": ({ inputs }) => (
    <>
      🚫 Domaine <b>{inputs.domain}</b> refusé
    </>
  ),
  "domain.removed": ({ inputs, outcome }) => (
    <>
      🗑️ Domaine <b>{inputs.domain}</b> supprimé (
      {outcome.previous_verification_type})
    </>
  ),
  "domain.verified": ({ inputs }) => (
    <>
      ✅ Domaine <b>{inputs.domain}</b> vérifié ({inputs.verification_type})
    </>
  ),
  "member.promoted": ({ inputs, outcome }) => (
    <>
      ⬆️ Membre promu ({inputs.previous_verification_type} →{" "}
      {outcome.verification_type})
    </>
  ),
};

// generic `Action` keeps the label and its context correlated
function known_activity_label<Action extends KnownAction>(
  action: Action,
  context: KnownActivityContexts[Action],
) {
  return known_activity_labels[action](context);
}

function GenericActivityLabel({
  action,
  context,
}: {
  action: string;
  context: unknown;
}) {
  return (
    <>
      <code>{action}</code> <code>{JSON.stringify(context)}</code>
    </>
  );
}

export function ActivityLabel({ parsed }: { parsed: ParsedActivityRow }) {
  return match(parsed)
    .with({ kind: "known" }, ({ action, context }) => (
      <>{known_activity_label(action, context)}</>
    ))
    .with({ kind: "unknown_action" }, ({ action, context }) => (
      <GenericActivityLabel action={action} context={context} />
    ))
    .with({ kind: "invalid_context" }, ({ action, context }) => (
      <>
        ⚠️ Contexte invalide :{" "}
        <GenericActivityLabel action={action} context={context} />
      </>
    ))
    .exhaustive();
}

export function ActivityRow({
  actor,
  caused,
  created_at,
  parsed,
}: {
  actor: string;
  caused: ReadonlyArray<{
    id: number;
    parsed: ParsedActivityRow;
    target: string;
  }>;
  created_at: string;
  parsed: ParsedActivityRow;
}) {
  return (
    <tr aria-label={`Activité ${parsed.action}`}>
      <td>
        <LocalTime date={created_at} />
      </td>
      <td>{actor}</td>
      <td>
        <ActivityLabel parsed={parsed} />
        {caused.length > 0 && (
          <ul>
            {caused.map(({ id, parsed, target }) => (
              <li aria-label={`Conséquence ${parsed.action}`} key={`${id}`}>
                {target} : <ActivityLabel parsed={parsed} />
              </li>
            ))}
          </ul>
        )}
      </td>
    </tr>
  );
}
