//

import consola from "consola";

export function GetBanaticUrl({
  banatic_base_url,
  http_timout,
  fetch = globalThis.fetch,
}: {
  banatic_base_url: string;
  http_timout: number;
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}) {
  return async function get_banatic_url(siren: string) {
    const banaticUrl = `${banatic_base_url}/intercommunalite/${siren}`;
    const defaultBanaticUrl = `${banatic_base_url}/consultation/intercommunalite?siren=${siren}&page=1`;
    consola.info(`  <<-- HEAD ${banaticUrl}`);
    try {
      const response = await fetch(banaticUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(http_timout),
      });
      consola.info(
        `  -->> HEAD ${banaticUrl} ${response.status} ${response.statusText}`,
      );
      return response.ok ? { url: banaticUrl } : { url: defaultBanaticUrl };
    } catch (error) {
      consola.info(
        `  -->> HEAD ${banaticUrl} ${error instanceof Error ? error.name : "error"}`,
      );
      return { url: defaultBanaticUrl, error };
    }
  };
}
