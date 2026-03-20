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
          cached_tranche_effectifs_unite_legale:
            "cached_tranche_effectifs_unite_legale",
          cached_libelle: "cached_libelle",
          cached_enseigne: "cached_enseigne",
          cached_tranche_effectifs: "cached_tranche_effectifs",
          cached_etat_administratif: "cached_etat_administratif",
        }}
        id="about_section"
      />,
    ),
  ).toMatchInlineSnapshot(`
    "<section id="about_section">
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
                  "inline-flex w-fit items-center font-medium no-underline min-h-8 gap-1 text-sm leading-6 text-blue-france hover:bg-grey-50 bg-transparent shadow-[inset_0_0_0_1px_var(--color-grey-200)] aspect-square justify-center p-0 ml-2",
                text: "cached_libelle",
              };
              let mounted = false;
              const mount_island = () => {
                if (mounted) return;
                const el = document.getElementById("test-uuid-1");
                if (el) {
                  render(h(CopyButtonClient, props), el);
                  mounted = true;
                }
              };
              document.addEventListener("DOMContentLoaded", mount_island);
              document.addEventListener("htmx:load", mount_island);
              mount_island();
            </script></x-copy-button-island
          >
        </dd>
        <dt>Siret</dt>
        <dd>
          siret
          <a
            href="https://annuaire-entreprises.data.gouv.fr/entreprise/siret"
            class="inline-flex w-fit items-center font-medium no-underline min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france hover:bg-grey-50 bg-transparent shadow-[inset_0_0_0_1px_var(--color-grey-200)] ml-2"
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
                  "inline-flex w-fit items-center font-medium no-underline min-h-8 gap-1 text-sm leading-6 text-blue-france hover:bg-grey-50 bg-transparent shadow-[inset_0_0_0_1px_var(--color-grey-200)] aspect-square justify-center p-0 ml-2",
                text: "siret",
              };
              let mounted = false;
              const mount_island = () => {
                if (mounted) return;
                const el = document.getElementById("test-uuid-2");
                if (el) {
                  render(h(CopyButtonClient, props), el);
                  mounted = true;
                }
              };
              document.addEventListener("DOMContentLoaded", mount_island);
              document.addEventListener("htmx:load", mount_island);
              mount_island();
            </script></x-copy-button-island
          >
        </dd>
        <dt>NAF/APE</dt>
        <dd>cached_libelle_activite_principale</dd>
        <dt>Adresse</dt>
        <dd>cached_adresse</dd>
        <dt>Nature juridique</dt>
        <dd>cached_libelle_categorie_juridique (cached_categorie_juridique)</dd>
        <dt>Tranche d&#39;effectif</dt>
        <dd>cached_libelle_tranche_effectif (code : cached_tranche_effectifs)</dd>
        <dt>Tranche d&#39;effectif de l&#39;unité légale</dt>
        <dd>cached_tranche_effectifs_unite_legale</dd>
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
