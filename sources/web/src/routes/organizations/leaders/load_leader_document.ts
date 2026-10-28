//

import { to } from "await-to-js";
import consola from "consola";
import lodash_sortby from "lodash.sortby";
import { z } from "zod";

export type LeaderDocumentResult =
  | { readonly kind: "api_error"; readonly http_status: number }
  | { readonly kind: "document"; readonly url: string }
  | { readonly kind: "fetch_error"; readonly error: Error }
  | { readonly kind: "invalid_response" }
  | { readonly kind: "no_document" };

const document_schema = z.object({
  date_depot: z.string().nullable(),
  sous_type: z.object({
    code: z.string(),
  }),
  url: z.string(),
});

const association_response_schema = z.object({
  data: z
    .object({
      documents_rna: z.array(document_schema),
    })
    .nullish(),
});

const api_error_response_schema = z.object({
  errors: z.array(
    z.object({
      code: z.string(),
      detail: z.string().nullish(),
      title: z.string().nullish(),
    }),
  ),
});

export function parse_api_error(
  body: unknown,
): { readonly code: string; readonly message: string } | undefined {
  const parsed = api_error_response_schema.safeParse(body);
  if (!parsed.success) return undefined;
  const [first] = parsed.data.errors;
  const message = first?.detail ?? first?.title;
  if (!first || !message) return undefined;
  return { code: first.code, message };
}

export async function load_leader_document({
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
}): Promise<LeaderDocumentResult> {
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

  if (error) return { kind: "fetch_error", error };

  consola.info(
    `  -->> ${"GET"} ${url} ${response.status} ${response.statusText}${retryLabel}`,
  );

  if (!response.ok) {
    consola.error(`API error ${response.status}:`, await response.text());
    return { kind: "api_error", http_status: response.status };
  }

  const [json_error, body] = await to(response.json());
  if (json_error || !body) return { kind: "invalid_response" };

  const parsed = association_response_schema.safeParse(body);
  if (!parsed.success) return { kind: "invalid_response" };

  const { data } = parsed.data;
  if (!data) return { kind: "no_document" };

  const docs = data.documents_rna.filter(({ date_depot }) =>
    Boolean(date_depot),
  );
  const sortedDocs = lodash_sortby(docs, ["date_depot"]);
  const doc = sortedDocs.findLast(({ sous_type: { code } }) => code === "LDC");

  return doc ? { kind: "document", url: doc.url } : { kind: "no_document" };
}
