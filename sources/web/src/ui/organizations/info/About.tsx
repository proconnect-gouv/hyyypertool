//

import type { GetFicheOrganizationByIdHandler } from "#src/lib/organizations/usecase";
import { button } from "#src/ui/button";
import { CopyButton } from "#src/ui/button/components";
import { description_list } from "#src/ui/list";
import { LocalTime } from "#src/ui/time";
import { type JSX } from "hono/jsx";
import { InactiveWarning } from "./InactiveWarning";

//

type Props = JSX.IntrinsicElements["section"] & {
  organization: Awaited<ReturnType<GetFicheOrganizationByIdHandler>>;
  nonce?: string;
};

export function About(props: Props) {
  const { organization, nonce = "", ...section_props } = props;

  const EFFECTIFS_UNITE_LEGALE_LABELS: Record<string, string> = {
    NN: "Unité non employeuse",
    "00": "0 salarié",
    "01": "1 ou 2 salariés",
    "02": "3 à 5 salariés",
    "03": "6 à 9 salariés",
    "11": "10 à 19 salariés",
    "12": "20 à 49 salariés",
    "21": "50 à 99 salariés",
    "22": "100 à 199 salariés",
    "31": "200 à 249 salariés",
    "32": "250 à 499 salariés",
    "41": "500 à 999 salariés",
    "42": "1 000 à 1 999 salariés",
    "51": "2 000 à 4 999 salariés",
    "52": "5 000 à 9 999 salariés",
    "53": "10 000 salariés et plus",
  };

  const getLabelTrancheEffectifs = (code: string | null): string => {
    if (!code) return "Non renseigné";
    return EFFECTIFS_UNITE_LEGALE_LABELS[code] ?? "Non renseigné";
  };

  return (
    <section {...section_props}>
      <InactiveWarning organization={organization} />
      <dl class={description_list()}>
        <dt>Dénomination </dt>
        <dd>
          <abbr title={organization.cached_nom_complet ?? ""}>
            {organization.cached_libelle}
          </abbr>{" "}
          <CopyButton
            class="ml-2"
            nonce={nonce}
            text={organization.cached_libelle ?? ""}
            variant={{ size: "sm", type: "tertiary" }}
          ></CopyButton>
        </dd>

        <dt>Siret </dt>
        <dd>
          {organization.siret}{" "}
          <a
            href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${organization.siret}`}
            class={`${button({ size: "sm", type: "tertiary" })} ml-2`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Fiche annuaire
          </a>
          <CopyButton
            class="ml-2"
            nonce={nonce}
            text={organization.siret}
            variant={{ size: "sm", type: "tertiary" }}
          ></CopyButton>
        </dd>

        <dt>NAF/APE </dt>
        <dd>{organization.cached_libelle_activite_principale} </dd>

        <dt>Adresse </dt>
        <dd>{organization.cached_adresse} </dd>

        <dt>Nature juridique </dt>
        <dd>
          {organization.cached_libelle_categorie_juridique} (
          {organization.cached_categorie_juridique})
        </dd>

        <dt>Tranche d'effectif </dt>
        <dd>
          {organization.cached_libelle_tranche_effectif} (code :{" "}
          {organization.cached_tranche_effectifs}){" "}
        </dd>
        <dt>Tranche d'effectif de l'unité légale </dt>
        <dd>
          {getLabelTrancheEffectifs(
            organization.cached_tranche_effectifs_unite_legale,
          ) ?? "Non renseigné"}
          {organization.cached_tranche_effectifs_unite_legale && (
            <> (code : {organization.cached_tranche_effectifs_unite_legale})</>
          )}
        </dd>
      </dl>
      <details class="my-6">
        <summary>Détails de l'organisation</summary>
        <ul>
          <li>
            id : <b>{organization.id}</b>
          </li>
          <li>
            Création de l'organisation :{" "}
            <b>
              <LocalTime date={organization.created_at} />
            </b>
          </li>
          <li>
            Dernière mise à jour :{" "}
            <b>
              <LocalTime date={organization.updated_at} />
            </b>
          </li>
          <li>
            Dernière mise à jour :{" "}
            <b>
              <LocalTime date={organization.updated_at} />
            </b>
          </li>
        </ul>
      </details>
    </section>
  );
}
