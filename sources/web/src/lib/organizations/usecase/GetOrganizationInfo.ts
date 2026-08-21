//

import { createApiEntrepriseClient } from "@proconnect-gouv/proconnect.api_entreprise/api";
import { createApiEntrepriseOpenApiClient } from "@proconnect-gouv/proconnect.api_entreprise/client";
import { getOrganizationInfoFactory } from "@proconnect-gouv/proconnect.identite/managers/organization";
import consola from "consola";

//

export function GetOrganizationInfo({
  entreprise_api_gouv_url,
  entreprise_api_gouv_token,
  http_timeout,
  fetch = globalThis.fetch,
}: {
  entreprise_api_gouv_url: string;
  entreprise_api_gouv_token: string;
  http_timeout: number;
  fetch?: typeof globalThis.fetch;
}) {
  const openapi_client = createApiEntrepriseOpenApiClient(
    entreprise_api_gouv_token,
    { baseUrl: entreprise_api_gouv_url, fetch },
  );
  openapi_client.use({
    onError({ error, request }) {
      consola.info(`  -->> ${request.method} ${request.url}`);
      consola.error(error);
    },
    onRequest({ request }) {
      consola.info(`  <<-- ${request.method} ${request.url}`);
      return new Request(request, {
        signal: AbortSignal.timeout(http_timeout),
      });
    },
    onResponse({ response, request }) {
      consola.info(
        `  -->> ${request.method} ${request.url} ${response.status} ${response.statusText}`,
      );
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    },
  });

  const client = createApiEntrepriseClient(
    openapi_client,
    "Hyyypertool — Ajout d'organisation",
    "13002526500013",
  );

  return getOrganizationInfoFactory(client);
}

export type GetOrganizationInfoHandler = ReturnType<typeof GetOrganizationInfo>;
