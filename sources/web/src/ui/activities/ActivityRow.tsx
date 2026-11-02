//

import type {
  ActorLabel,
  KnownAction,
  KnownActivityContexts,
  ParsedActivityRow,
} from "#src/lib/activities";
import type { IconVariants } from "#src/ui/icons";
import { Svg } from "#src/ui/icons/components";
import { tag } from "#src/ui/tag";
import { ActivityTime, LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import type { Child } from "hono/jsx";
import { match } from "ts-pattern";

//

type ActivityGroup = {
  icon: NonNullable<IconVariants["name"]>;
  label: string;
};

const activity_groups: Record<string, ActivityGroup> = {
  domain: { icon: "global", label: "Domaine" },
  franceconnect: { icon: "logout", label: "Connexion" },
  member: { icon: "team", label: "Organisation" },
  moderation: { icon: "clipboard", label: "Modération" },
  user: { icon: "info", label: "Compte" },
};

const activity_overrides: Record<string, ActivityGroup> = {
  "user.deleted": { icon: "delete", label: "Compte" },
  "user.mfa_reset": { icon: "shield", label: "2FA" },
};

//

const known_activity_labels: {
  [Action in KnownAction]: (context: KnownActivityContexts[Action]) => Child;
} = {
  "domain.refused": ({ inputs }) => (
    <>
      Domaine <b>{inputs.domain}</b> refusé
    </>
  ),
  "domain.removed": ({ inputs, outcome }) => (
    <>
      Domaine <b>{inputs.domain}</b> supprimé (
      {outcome.previous_verification_type})
    </>
  ),
  "domain.verified": ({ inputs }) => (
    <>
      Domaine <b>{inputs.domain}</b> vérifié ({inputs.verification_type})
    </>
  ),
  "franceconnect.connected": ({ outcome }) => (
    <>
      FranceConnect lié (<LocalTime date={outcome.connected_at} />)
    </>
  ),
  "franceconnect.disconnected": ({ outcome }) => (
    <>
      FranceConnect délié (<LocalTime date={outcome.connected_at} />)
    </>
  ),
  "member.joined": ({ inputs }) => (
    <>
      Membre ajouté ({inputs.verification_type},{" "}
      {inputs.is_external ? "externe" : "interne"})
    </>
  ),
  "member.promoted": ({ inputs, outcome }) => (
    <>
      Membre promu ({inputs.previous_verification_type} →{" "}
      {outcome.verification_type})
    </>
  ),
  "member.removed": ({ outcome }) => (
    <>
      Membre supprimé ({outcome.verification_type},{" "}
      {outcome.is_external ? "externe" : "interne"})
    </>
  ),
  "member.updated": ({ inputs, outcome }) => (
    <>
      Membre modifié ({outcome.previous.verification_type} →{" "}
      {inputs.verification_type ?? outcome.previous.verification_type})
    </>
  ),
  "moderation.opened": ({ inputs }) => (
    <>
      Modération ouverte ({inputs.type}
      {inputs.sp_name === null ? null : ` · ${inputs.sp_name}`})
    </>
  ),
  "user.deleted": ({ outcome }) => (
    <>
      Utilisateur <b>{outcome.email}</b> supprimé
    </>
  ),
  "user.mfa_reset": () => <>Double authentification réinitialisée</>,
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

export function Actor({ actor }: { actor: ActorLabel }) {
  if (actor.user_id === null) return <>{actor.label}</>;

  return (
    <a href={urls.users[":id"].$url({ param: { id: actor.user_id } }).pathname}>
      {actor.label}
    </a>
  );
}

export function ActivityItem({
  action,
  actor,
  cause,
  children,
  content_colspan = 1,
  created_at,
  parsed,
}: {
  action: string;
  actor: ActorLabel;
  cause: { actor: ActorLabel; parsed: ParsedActivityRow } | null | undefined;
  children?: Child;
  content_colspan?: number;
  created_at: string;
  parsed: ParsedActivityRow;
}) {
  const group: ActivityGroup = activity_overrides[action] ??
    activity_groups[action.split(".")[0] ?? ""] ?? {
      icon: "info",
      label: "Activité",
    };

  return (
    <tr aria-label={`Activité ${action}`}>
      <td class="w-0 align-top">
        <span class="bg-blue-france-925 text-blue-france inline-flex size-10 items-center justify-center rounded text-2xl">
          <Svg name={group.icon} />
        </span>
      </td>
      <td class="w-0 align-top whitespace-nowrap">
        <ActivityTime date={created_at} />
      </td>
      <td class="align-top" colspan={content_colspan}>
        <span class={tag({ size: "sm", static: true })}>{group.label}</span>
        <div class="mt-2 text-base">
          <ActivityLabel parsed={parsed} />
        </div>
        <div class="text-text-muted mt-1 text-sm">
          Par <Actor actor={actor} />
          {children}
        </div>
        {cause === null || cause === undefined ? null : (
          <div class="bg-blue-france-925 text-grey-850 dark:bg-surface-muted dark:text-text-default mt-3 rounded px-4 py-3">
            ↳ Suite à : <ActivityLabel parsed={cause.parsed} /> par{" "}
            <Actor actor={cause.actor} />
          </div>
        )}
      </td>
    </tr>
  );
}

export function ActivityRow({
  actor,
  caused,
  created_at,
  parsed,
}: {
  actor: ActorLabel;
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
      <td>
        <Actor actor={actor} />
      </td>
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
