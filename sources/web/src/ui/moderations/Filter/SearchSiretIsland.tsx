import { createIsland } from "#src/lib/create-island";
import { SearchSiret } from "./search-siret.client";

//

export const SearchSiretIsland = createIsland({
  component: SearchSiret,
  clientPath: "/src/ui/moderations/Filter/search-siret.client.js",
  mode: "hydrate",
  exportName: "SearchSiret",
  tagName: "x-search-siret-island",
  rootTagName: "x-search-siret-root",
});
