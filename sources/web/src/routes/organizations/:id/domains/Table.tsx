//

import { hyper_ref } from "#src/html";
import { button } from "#src/ui/button";
import { GoogleSearchButton } from "#src/ui/button/components";
import { input, input_group, label } from "#src/ui/form";
import { HorizontalMenu, Menu } from "#src/ui/menu/components";
import { table } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import {
  EmailDomainVerificationEnum,
  type EmailDomainVerificationType,
} from "@~/identite-proconnect/types";
import { match } from "ts-pattern";
import { add_params } from "./context";
import type { get_organization_domains } from "./get_organization_domains.query";
//

type Domains = Awaited<ReturnType<typeof get_organization_domains>>;

//

export function Table({
  domains,
  describedby,
  is_editor,
}: {
  domains: Domains;
  describedby: string;
  is_editor: boolean;
}) {
  return (
    <table class={table()} aria-describedby={describedby}>
      <thead>
        <tr>
          <th>Status</th>
          <th>Domain</th>
          <th>Type</th>
          <th>Vérifié le</th>
          <th>Crée le</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {domains.map((domain) => (
          <Row
            key={`${domain.id}`}
            organization_domain={domain}
            is_editor={is_editor}
          />
        ))}
      </tbody>
    </table>
  );
}

export async function AddDomain({
  organization_id,
  is_editor,
}: {
  organization_id: number;
  is_editor: boolean;
}) {
  if (!is_editor) return <></>;
  const $describedby = hyper_ref("add_domain");

  const hx_add_domain_props = urls.organizations[":id"].domains.$hx_put({
    param: {
      id: organization_id,
    },
  });

  return (
    <form {...hx_add_domain_props} hx-swap="none">
      <div class={input_group()}>
        <label class={label()} for={$describedby}>
          Ajouter un domain
        </label>
        <div class="flex items-stretch">
          <input
            aria-describedby={$describedby}
            id={$describedby}
            class={input({ class: "flex-1" })}
            type="text"
            name={add_params.keyof().enum.domain}
            placeholder="Ajouter un domain"
          />
          <button class={button()} type="submit">
            Ajouter
          </button>
        </div>
      </div>
    </form>
  );
}

function TypeToEmoji({ type }: { type: EmailDomainVerificationType }) {
  return match(type)
    .with("blacklisted", () => (
      <span role="img" aria-label="blacklisté" title="blacklisté">
        ☠️
      </span>
    ))
    .with("external", () => (
      <span role="img" aria-label="externe" title="externe">
        ❎
      </span>
    ))
    .with("official_contact", () => (
      <span role="img" aria-label="contact officiel" title="contact officiel">
        ✅
      </span>
    ))
    .with("refused", () => (
      <span role="img" aria-label="postal mail" title="postal mail">
        🚫
      </span>
    ))
    .with("trackdechets_postal_mail", () => (
      <span role="img" aria-label="postal mail" title="postal mail">
        ✅
      </span>
    ))
    .with("verified", () => (
      <span role="img" aria-label="vérifié" title="vérifié">
        ✅
      </span>
    ))
    .otherwise(() => (
      <span role="img" aria-label="inconnu" title="inconnu">
        ❓
      </span>
    ));
}

function Row({
  key,
  organization_domain,
  is_editor,
}: {
  key?: string;
  organization_domain: Domains[number];
  is_editor: boolean;
}) {
  const {
    created_at,
    domain,
    organization,
    updated_at,
    verification_type,
    verified_at,
  } = organization_domain;
  return (
    <tr aria-label={`Domaine ${domain} (${verification_type})`} key={key}>
      <td>
        <TypeToEmoji type={verification_type as EmailDomainVerificationType} />
      </td>
      <td>{domain}</td>
      <td>{verification_type}</td>
      <td>
        <LocalTime date={verified_at} />
      </td>
      <td>
        <LocalTime date={created_at} />
        {created_at !== updated_at ? (
          <>
            <br />
            Modifié le <LocalTime date={updated_at} />
          </>
        ) : null}
      </td>
      <td class="space-x-2 text-end!">
        <GoogleSearchButton
          class={button({ class: "align-bottom", size: "sm" })}
          query={domain}
        >
          Vérifier le nom de domaine
        </GoogleSearchButton>
        <GoogleSearchButton
          class={button({ class: "align-bottom", size: "sm" })}
          query={`${organization.cached_libelle} ${domain}`}
        >
          Vérifier le matching
        </GoogleSearchButton>
        {is_editor ? (
          <RowActions organization_domain={organization_domain} />
        ) : null}
      </td>
    </tr>
  );
}

const DOMAIN_TYPE_LABELS = [
  [EmailDomainVerificationEnum.enum.verified, "✅ Domaine autorisé"],
  [EmailDomainVerificationEnum.enum.external, "❎ Domaine externe"],
  [EmailDomainVerificationEnum.enum.refused, "🚫 Domaine refusé"],
] as const;

function RowActions({
  organization_domain,
}: {
  organization_domain: Domains[number];
}) {
  const { domain, id, organization, organization_id } = organization_domain;
  const param = { domain_id: id, id: organization_id };
  const organization_domain_urls =
    urls.organizations[":id"].domains[":domain_id"];

  return (
    <HorizontalMenu>
      {DOMAIN_TYPE_LABELS.map(([type, label]) => (
        <Menu.Item
          {...organization_domain_urls.$hx_patch({ param, query: { type } })}
          hx-swap="none"
        >
          {label}
        </Menu.Item>
      ))}
      <Menu.Item
        {...organization_domain_urls.$hx_delete({ param })}
        hx-confirm={`Êtes-vous sûr de vouloir supprimer le domaine « ${domain} » de l'organisation « ${organization.cached_libelle} » ?`}
        hx-swap="none"
      >
        🗑️ Supprimer
      </Menu.Item>
    </HorizontalMenu>
  );
}
