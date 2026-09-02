//

import { button } from "#src/ui/button";
import { card } from "#src/ui/card";
import { input, input_group, label as form_label } from "#src/ui/form";
import { alert } from "#src/ui/notice";
import { About } from "#src/ui/organizations/info";
import { formattedPlural } from "#src/ui/plurial";
import { urls } from "#src/urls";
import { toPartialOrganization } from "@proconnect-gouv/proconnect.identite/managers/organization";
import type { OrganizationInfo } from "@proconnect-gouv/proconnect.identite/types";

//

type ExistingOrganization = {
  id: number;
  siret: string;
  cached_libelle: string | null;
};

type CreatedOrganization = ExistingOrganization;

type FetchError = { siret: string; reason: string };

type PageProps = {
  sirets?: string;
  sirets_error?: string;
  existing_organizations?: ExistingOrganization[];
  new_organization_infos?: OrganizationInfo[];
  fetch_errors?: FetchError[];
  invalid_sirets?: string[];
  created_organizations?: CreatedOrganization[];
  skipped_existing?: number;
};

//

export default function Page({
  sirets,
  sirets_error,
  existing_organizations,
  new_organization_infos,
  fetch_errors,
  invalid_sirets,
  created_organizations,
  skipped_existing,
}: PageProps) {
  return (
    <main class="container mx-auto my-12 px-4">
      <h1>Ajouter une organisation</h1>
      {created_organizations && created_organizations.length > 0 && (
        <CreatedSummary
          created_organizations={created_organizations}
          skipped_existing={skipped_existing}
        />
      )}
      <SiretForm sirets={sirets} sirets_error={sirets_error} />
      {invalid_sirets && invalid_sirets.length > 0 && (
        <InvalidSiretsAlert invalid_sirets={invalid_sirets} />
      )}
      {fetch_errors && fetch_errors.length > 0 && (
        <FetchErrorsAlert fetch_errors={fetch_errors} />
      )}
      <BulkConfirm
        existing_organizations={existing_organizations}
        new_organization_infos={new_organization_infos}
      />
    </main>
  );
}

function SiretForm({
  sirets,
  sirets_error,
}: {
  sirets?: string;
  sirets_error?: string;
}) {
  const intent = sirets_error ? "error" : undefined;

  return (
    <>
      <form
        class="mb-2"
        method="post"
        action={urls.organizations.new.$url().pathname}
      >
        <div class={input_group({ intent })}>
          <label class="sr-only" for="sirets">
            SIRETs
          </label>
          <textarea
            aria-describedby={sirets_error ? "sirets-error" : undefined}
            aria-invalid={sirets_error ? "true" : undefined}
            class={input({ class: "min-h-32", intent })}
            id="sirets"
            name="sirets"
            placeholder="SIRET (14 chiffres)"
          >
            {sirets}
          </textarea>
          {sirets_error && (
            <p
              class={form_label({ class: "mt-2 mb-0", intent: "error" })}
              id="sirets-error"
            >
              {sirets_error}
            </p>
          )}
        </div>
        <p class="text-right">
          <button class={button({ class: "mt-4" })} title="Rechercher">
            Rechercher
          </button>
        </p>
      </form>
      <p class="text-muted mb-6 text-sm">
        Entrez vos siret ici. Veuillez noter que chaque siret doit apparaître
        sur une ligne distincte.
      </p>
    </>
  );
}

function Preview({
  organization_info,
}: {
  organization_info: OrganizationInfo;
}) {
  const { base } = card();
  const organization = toPartialOrganization(organization_info);

  return (
    <div class={base({ class: "mb-6 text-lg" })}>
      <h1 class="text-blue-france dark:text-blue-france-925">
        « {organization.cached_libelle} »
      </h1>
      <About organization={organization} />
    </div>
  );
}

function BulkConfirm({
  existing_organizations,
  new_organization_infos,
}: {
  existing_organizations?: ExistingOrganization[];
  new_organization_infos?: OrganizationInfo[];
}) {
  const new_count = new_organization_infos?.length ?? 0;

  return (
    <>
      {existing_organizations && existing_organizations.length > 0 && (
        <>
          <ExistingOrganizationsList
            existing_organizations={existing_organizations}
          />
          <hr />
        </>
      )}
      {new_count > 0 && (
        <form
          class="mt-6"
          method="post"
          action={urls.organizations.new.confirm.$url().pathname}
        >
          {new_organization_infos!.map((organization_info) => (
            <Preview
              key={organization_info.siret}
              organization_info={organization_info}
            />
          ))}
          {new_organization_infos!.map((organization_info) => (
            <input
              key={organization_info.siret}
              type="hidden"
              name="sirets[]"
              value={organization_info.siret}
            />
          ))}
          <p class="text-right">
            <button class={button()} type="submit">
              Créer{" "}
              {formattedPlural(new_count, {
                one: "1 organisation",
                other: `${new_count} organisations`,
              })}
            </button>
          </p>
        </form>
      )}
    </>
  );
}

function ExistingOrganizationsList({
  existing_organizations,
}: {
  existing_organizations: ExistingOrganization[];
}) {
  const count = existing_organizations.length;

  return (
    <details class="my-6">
      <summary class="cursor-pointer font-bold">
        {formattedPlural(count, {
          one: "ℹ️ 1 déjà en base",
          other: `${count} déjà en base`,
        })}
      </summary>
      <ul class="mt-4 list-disc pl-5">
        {existing_organizations.map((organization) => (
          <li key={organization.id} class="mb-2">
            <a
              class="text-blue-france dark:text-blue-france-sun-113-625 hover:underline"
              href={
                urls.organizations[":id"].$url({
                  param: { id: organization.id },
                }).pathname
              }
            >
              {organization.cached_libelle ?? organization.siret} (
              {organization.siret})
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

function FetchErrorsAlert({ fetch_errors }: { fetch_errors: FetchError[] }) {
  const { base, title } = alert({ intent: "error" });

  return (
    <div class={base()} role="alert">
      <p class={title()}>
        {formattedPlural(fetch_errors.length, {
          one: "1 SIRET n'a pas pu être vérifié",
          other: `${fetch_errors.length} SIRETs n'ont pas pu être vérifiés`,
        })}
      </p>
      <ul class="mb-0 list-disc pl-5">
        {fetch_errors.map(({ siret, reason }) => (
          <li key={siret}>
            {siret} — {reason}
          </li>
        ))}
      </ul>
      <p class="mt-2 mb-0">Réessayez dans quelques instants.</p>
    </div>
  );
}

function InvalidSiretsAlert({ invalid_sirets }: { invalid_sirets: string[] }) {
  const { base, title } = alert({ intent: "warning" });
  const excel_zero_strip_hint = invalid_sirets.some(
    (siret) => siret.length === 13 && siret.startsWith("0"),
  );

  return (
    <div class={base()} role="alert">
      <p class={title()}>
        {formattedPlural(invalid_sirets.length, {
          one: "1 SIRET invalide",
          other: `${invalid_sirets.length} SIRETs invalides`,
        })}
      </p>
      <p class="mb-2">
        {invalid_sirets.length === 1
          ? "Ce SIRET n'est pas valide (14 chiffres) :"
          : "Ces SIRETs ne sont pas valides (14 chiffres) :"}
      </p>
      <ul class="mb-0 list-disc pl-5">
        {invalid_sirets.map((siret) => (
          <li key={siret}>{siret}</li>
        ))}
      </ul>
      {excel_zero_strip_hint && (
        <p class="mt-2 mb-0">
          Un zéro de tête a peut-être été supprimé (Excel) ? Vérifiez le SIRET.
        </p>
      )}
    </div>
  );
}

function CreatedSummary({
  created_organizations,
  skipped_existing,
}: {
  created_organizations: CreatedOrganization[];
  skipped_existing?: number;
}) {
  const { base, title } = alert({ intent: "success" });
  const created_count = created_organizations.length;

  return (
    <div class={base()} role="status">
      <p class={title()}>
        {formattedPlural(created_count, {
          one: "1 organisation créée",
          other: `${created_count} organisations créées`,
        })}
        {skipped_existing
          ? ` · ${formattedPlural(skipped_existing, {
              one: "1 déjà existante",
              other: `${skipped_existing} déjà existantes`,
            })}`
          : ""}
      </p>
      <ul class="mb-0 list-disc pl-5">
        {created_organizations.map((organization) => (
          <li key={organization.id}>
            <a
              class="text-blue-france dark:text-blue-france-sun-113-625 hover:underline"
              href={
                urls.organizations[":id"].$url({
                  param: { id: organization.id },
                }).pathname
              }
            >
              {organization.cached_libelle ?? organization.siret}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
