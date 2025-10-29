//

import env from "#src/config";
import { button } from "#src/ui/button";
import { zValidator } from "@hono/zod-validator";
import consola from "consola";
import { Hono } from "hono";
import lodash_sortby from "lodash.sortby";
import { match, P } from "ts-pattern";
import { z } from "zod";

//

export default new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      siret: z.string(),
    }),
  ),
  async function GET({ html, req }) {
    const { siret } = req.valid("query");
    return html(<List_Leaders siret={siret} />);
  },
);

//

async function List_Leaders({ siret }: { siret: string }) {
  const doc = await load_leaders({ siret });
  return match(doc)
    .with({ url: P.string }, ({ url }) => (
      <a
        class={button({ className: "bg-white", size: "sm", type: "tertiary" })}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        Liste dirigeants associations
      </a>
    ))
    .otherwise(() => (
      <a class={button({ size: "sm", type: "tertiary" })}>
        Pas de liste des dirigeants
      </a>
    ));
}

async function load_leaders({ siret }: { siret: string }) {
  const siren = siret.substring(0, 9);
  const query_params = new URLSearchParams({
    context: "Modération IdentiteProconnect",
    object: "Modération IdentiteProconnect",
    recipient: "13002526500013",
  });

  const url = `${env.ENTREPRISE_API_GOUV_URL}/v4/djepva/api-association/associations/${siren}?${query_params}`;
  consola.info(`  <<-- ${"GET"} ${url}`);

  const response = await fetch(url, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${env.ENTREPRISE_API_GOUV_TOKEN}`,
    },
  });

  consola.info(
    `  -->> ${"GET"} ${url} ${response.status} ${response.statusText}`,
  );

  const { data } =
    (await response.json()) as Entreprise_API_Association_Response;

  if (!data) return;
  const docs = data.documents_rna.filter(({ date_depot }) =>
    Boolean(date_depot),
  );
  const sortedDocs = lodash_sortby(docs, ["date_depot"]);
  const doc = sortedDocs.findLast(({ sous_type: { code } }) => code === "LDC");

  return doc;
}

//

interface Entreprise_API_Association_Response {
  data: {
    documents_rna: {
      annee_depot: string;
      date_depot: string;
      sous_type: {
        code: string;
      };
      url: string;
    }[];
  };
}
