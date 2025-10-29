//

import { button } from "#src/ui/button";
import { hx_urls, urls } from "#src/urls";
import { usePageRequestContext } from "./context";

//

export async function AboutOrganization() {
  const {
    var: {
      moderation: { organization },
    },
  } = usePageRequestContext();

  const hx_organizations_leaders_props =
    await hx_urls.organizations.leaders.$get({
      query: { siret: organization.siret },
    });

  return (
    <section>
      <h3>
        <a
          href={
            urls.organizations[":id"].$url({
              param: {
                id: organization.id.toString(),
              },
            }).pathname
          }
        >
          🏛 Organisation
        </a>
      </h3>

      <ul class="list-none pl-0">
        <li>
          Dénomination : <b>{organization.cached_libelle}</b>
        </li>
        <li>
          <span title="Activité principale de l’établissement">NAF/APE</span> :{" "}
          <b>{organization.cached_libelle_activite_principale}</b>
        </li>
        <li>
          Nature juridique :{" "}
          <b>{organization.cached_libelle_categorie_juridique}</b>
        </li>
        <li>
          Tranche d'effectif :{" "}
          <b>{organization.cached_libelle_tranche_effectif}</b> (code :{" "}
          <span>{organization.cached_tranche_effectifs}</span>) (
          <a
            href="https://www.sirene.fr/sirene/public/variable/tefen"
            rel="noopener noreferrer"
            target="_blank"
          >
            liste code effectif INSEE
          </a>
          )
        </li>
        <li>
          État administratif : <b>{organization.cached_etat_administratif}</b> (
          <a
            href="https://www.sirene.fr/sirene/public/variable/etatAdministratifEtablissement"
            rel="noopener noreferrer"
            target="_blank"
          >
            liste état administratif INSEE
          </a>
          )
        </li>
        <li>
          Adresse : <b>{organization.cached_adresse}</b>
        </li>
        <li>
          Siret : <b>{organization.siret}</b>
        </li>
      </ul>

      <div {...hx_organizations_leaders_props} hx-trigger="load">
        Recherche des dirigeants...
      </div>

      <a
        href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${organization.siret}`}
        class={button({ size: "sm", type: "tertiary" })}
        rel="noopener noreferrer"
        target="_blank"
      >
        Fiche sur l’Annuaire des Entreprises
      </a>

      <a
        href={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${organization.siret.substring(0, 9)}`}
        class={button({ size: "sm", type: "tertiary" })}
        rel="noopener noreferrer"
        target="_blank"
      >
        Liste des Dirigeants - Annuaire des Entreprises
      </a>
    </section>
  );
}
