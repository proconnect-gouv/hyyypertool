//

import env from "#src/config";
import type { FetchVariables_Context } from "#src/middleware/fetch";
import { button } from "#src/ui/button";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { to } from "await-to-js";
import consola from "consola";
import { Hono } from "hono";
import lodash_sortby from "lodash.sortby";
import { match, P } from "ts-pattern";
import { z } from "zod";

//

export default new Hono<FetchVariables_Context>().get(
  "/",
  zValidator(
    "query",
    z.object({
      siret: z.string(),
      retry: z.string().optional(),
    }),
  ),
  async function GET({ html, req, var: { fetch } }) {
    const { siret, retry } = req.valid("query");
    const useRetry = retry === "true";
    const hx_organizations_leaders_props = urls.organizations.leaders.$hx_get({
      query: { retry: "true", siret },
    });

    const doc = await load_leaders({ siret, fetch, useRetry });

    return match(doc)
      .with(P.instanceOf(Error), () =>
        html(
          <button
            class={button({ size: "sm", type: "tertiary" })}
            {...hx_organizations_leaders_props}
            hx-swap="outerHTML"
          >
            Liste dirigeants associations (Réessayer)
          </button>,
        ),
      )
      .with({ url: P.string }, ({ url }) =>
        html(
          <a
            class={button({
              className: "bg-white",
              size: "sm",
              type: "tertiary",
            })}
            href={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Liste dirigeants associations
          </a>,
        ),
      )
      .otherwise(() =>
        html(
          <a class={button({ size: "sm", type: "tertiary" })}>
            Pas de liste des dirigeants
          </a>,
        ),
      );
  },
);

//

async function load_leaders({
  siret,
  fetch,
  useRetry = false,
}: {
  siret: string;
  fetch: typeof globalThis.fetch;
  useRetry?: boolean;
}) {
  const siren = siret.substring(0, 9);
  const query_params = new URLSearchParams({
    context: "Modération IdentiteProconnect",
    object: "Modération IdentiteProconnect",
    recipient: "13002526500013",
  });

  const url = `${env.ENTREPRISE_API_GOUV_URL}/v4/djepva/api-association/associations/${siren}?${query_params}`;

  const timeout = useRetry
    ? env.HTTP_CLIENT_TIMEOUT * 2
    : env.HTTP_CLIENT_TIMEOUT;
  const retryLabel = useRetry ? " (with longer timeout)" : "";

  consola.info(`  <<-- ${"GET"} ${url}${retryLabel}`);
  const [error, response] = await to(
    fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${env.ENTREPRISE_API_GOUV_TOKEN}`,
      },
      signal: AbortSignal.timeout(timeout),
    }),
  );

  if (error) return error;

  consola.info(
    `  -->> ${"GET"} ${url} ${response.status} ${response.statusText}${retryLabel}`,
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
