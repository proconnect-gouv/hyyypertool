//

import { render_html } from "#src/ui/testing";
import { beforeEach, expect, mock, test } from "bun:test";
import { About } from "./About";

//

let uuidCounter = 0;

mock.module("node:crypto", () => ({
  randomUUID: () => {
    return `test-uuid-${++uuidCounter}`;
  },
}));

beforeEach(() => {
  uuidCounter = 0;
});

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
  ).toMatchInlineSnapshot(`
    "<section class="mt-6" id="about_section">
      <h3>
        <a class="bg-none" target="_blank" href="/organizations/42"
          >🏛 Organisation</a
        >
      </h3>
      <dl
        class="grid grid-cols-[222px_1fr] gap-x-3 ps-0 [&amp;_dd]:p-0 [&amp;_dd]:py-1 [&amp;_dd]:font-semibold [&amp;_dt]:border-0 [&amp;_dt]:border-r [&amp;_dt]:border-solid [&amp;_dt]:border-gray-300 [&amp;_dt]:p-0 [&amp;_dt]:py-1 [&amp;_dt]:uppercase"
      >
        <dt>Dénomination</dt>
        <dd>
          <abbr title="cached_nom_complet">cached_libelle</abbr>
          <x-copy-button-island
            ><x-copy-button-root id="test-uuid-1"></x-copy-button-root>
            <script defer="" nonce="" type="module">
              import { render, h } from "preact";
              import { CopyButtonClient } from "/src/ui/button/components/copy.client.js";
              const props = {
                children: "",
                className:
                  "fr-btn bg-transparent text-black hover:bg-(--background-default-grey-hover)! fr-btn--sm fr-btn--tertiary ml-2",
                text: "cached_libelle",
              };
              const __mount = () =>
                render(
                  h(CopyButtonClient, props),
                  document.getElementById("test-uuid-1"),
                );
              if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", __mount);
              } else {
                __mount();
              }
            </script></x-copy-button-island
          >
        </dd>
        <dt>Siret</dt>
        <dd>
          siret
          <a
            href="https://annuaire-entreprises.data.gouv.fr/entreprise/siret"
            class="fr-btn fr-btn--sm fr-btn--tertiary ml-2"
            rel="noopener noreferrer"
            target="_blank"
            >Fiche annuaire</a
          ><x-copy-button-island
            ><x-copy-button-root id="test-uuid-2"></x-copy-button-root>
            <script defer="" nonce="" type="module">
              import { render, h } from "preact";
              import { CopyButtonClient } from "/src/ui/button/components/copy.client.js";
              const props = {
                children: "",
                className:
                  "fr-btn bg-transparent text-black hover:bg-(--background-default-grey-hover)! fr-btn--sm fr-btn--tertiary ml-2",
                text: "siret",
              };
              const __mount = () =>
                render(
                  h(CopyButtonClient, props),
                  document.getElementById("test-uuid-2"),
                );
              if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", __mount);
              } else {
                __mount();
              }
            </script></x-copy-button-island
          >
        </dd>
        <dt>NAF/APE</dt>
        <dd>cached_libelle_activite_principale</dd>
        <dt>Adresse</dt>
        <dd>cached_adresse</dd>
        <dt>Nature juridique</dt>
        <dd>cached_libelle_categorie_juridique (cached_categorie_juridique)</dd>
        <dt>Tranche d effectif</dt>
        <dd>
          cached_libelle_tranche_effectif (code : cached_tranche_effectifs)
          <span class="text-nowrap"
            >(<a
              href="https://www.sirene.fr/sirene/public/variable/tefen"
              rel="noopener noreferrer"
              target="_blank"
              >liste code effectif INSEE</a
            >)</span
          >
        </dd>
      </dl>
      <details class="my-6">
        <summary>Détails de l&#39;organisation</summary>
        <ul>
          <li>id : <b>42</b></li>
          <li>
            Création de l&#39;organisation :
            <b
              ><time
                datetime="2011-11-22T14:34:34.000Z"
                title="Tue Nov 22 2011 15:34:34 GMT+0100 (Central European Standard Time)"
                >22/11/2011 15:34:34
              </time></b
            >
          </li>
          <li>
            Dernière mise à jour :
            <b
              ><time
                datetime="2011-11-15T13:48:00.000Z"
                title="Tue Nov 15 2011 14:48:00 GMT+0100 (Central European Standard Time)"
                >15/11/2011 14:48:00
              </time></b
            >
          </li>
          <li>
            Dernière mise à jour :
            <b
              ><time
                datetime="2011-11-15T13:48:00.000Z"
                title="Tue Nov 15 2011 14:48:00 GMT+0100 (Central European Standard Time)"
                >15/11/2011 14:48:00
              </time></b
            >
          </li>
        </ul>
      </details>
    </section>
    "
  `);
});
