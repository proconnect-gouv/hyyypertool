import consola from "consola";

export async function get_banatic_url(
  {
    banatic_base_url,
    fetch = globalThis.fetch,
    http_timout,
  }: {
    banatic_base_url: string;
    fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    http_timout: number;
  },
  siren: string,
) {
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
}
