export function GetBanaticUrl({ http_timout }: { http_timout: number }) {
  return async function get_banatic_url(siren: string) {
    const banaticUrl = `https://www.banatic.interieur.gouv.fr/intercommunalite/${siren}`;
    const defaultBanaticUrl = `https://www.banatic.interieur.gouv.fr/consultation/intercommunalite?siren=${siren}&page=1`;
    try {
      const response = await fetch(banaticUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(http_timout),
      });
      return response.ok ? { url: banaticUrl } : { url: defaultBanaticUrl };
    } catch (error) {
      return { url: defaultBanaticUrl, error };
    }
  };
}
