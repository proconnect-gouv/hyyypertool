//

import type { AppEnvContext } from "#src/config";
import type { FetchVariablesContext } from "#src/middleware/fetch";
import { button } from "#src/ui/button";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { to } from "await-to-js";
import consola from "consola";
import { Hono } from "hono";
import lodash_sortby from "lodash.sortby";
import { match, P } from "ts-pattern";
import { z } from "zod";

class FatalError extends Error {}

export default new Hono<FetchVariablesContext & AppEnvContext>().get(
  "/",
  zValidator(
    "query",
    z.object({
      siret: z.string(),
      retry: z.string().optional(),
    }),
  ),
  async function GET({ html, req, env, var: { fetch } }) {
    const { siret, retry } = req.valid("query");
    const useRetry = retry === "true";
    const hx_organizations_leaders_props = urls.organizations.leaders.$hx_get({
      query: { retry: "true", siret },
    });

    const doc = await load_leaders({ siret, fetch, useRetry, env });

    return match(doc)
      .with(P.instanceOf(FatalError), () =>
        html(
          <button class={button({ size: "sm", type: "tertiary" })} disabled>
            Erreur API — contacter l'équipe tech
          </button>,
        ),
      )
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
          <button class={button({ size: "sm", type: "tertiary" })} disabled>
            Pas de liste des dirigeants
          </button>,
        ),
      );
  },
);

//

async function load_leaders({
  siret,
  fetch,
  useRetry = false,
  env,
}: {
  siret: string;
  fetch: typeof globalThis.fetch;
  useRetry?: boolean;
  env: {
    ENTREPRISE_API_GOUV_URL: string;
    ENTREPRISE_API_GOUV_TOKEN: string;
    HTTP_CLIENT_TIMEOUT: number;
  };
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

  if (!response.ok) {
    consola.error(`API error ${response.status}:`, await response.text());
    return new FatalError(`HTTP ${response.status}`);
  }

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
