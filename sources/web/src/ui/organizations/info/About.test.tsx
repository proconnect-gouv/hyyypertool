//

import { render_html } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { About } from "./About";

test("render about section", async () => {
  expect(
    await render_html(
      <About
        organization={{
          cached_activite_principale: "cached_activite_principale",
          cached_adresse: "cached_adresse",
          cached_categorie_juridique: "cached_categorie_juridique",
          cached_code_postal: "cached_code_postal",
          cached_est_active: true,
          cached_nom_complet: "cached_nom_complet",
          created_at: "2011-11-22 14:34:34.000Z",
          id: 42,
          siret: "siret",
          cached_code_officiel_geographique:
            "cached_code_officiel_geographique",
          updated_at: "2011-11-15T13:48:00.000Z",
          cached_libelle_activite_principale:
            "cached_libelle_activite_principale",
          cached_libelle_categorie_juridique:
            "cached_libelle_categorie_juridique",
          cached_libelle_tranche_effectif: "cached_libelle_tranche_effectif",
          cached_libelle: "cached_libelle",
          cached_enseigne: "cached_enseigne",
          cached_tranche_effectifs: "cached_tranche_effectifs",
          cached_etat_administratif: "cached_etat_administratif",
        }}
        id="about_section"
      />,
    ),
  ).toMatchSnapshot();
});
