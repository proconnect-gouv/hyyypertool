/**
 * SearchSiret Island Component (Server-side)
 *
 * Renders a SIRET search input that auto-enables processed requests when typing
 */

import { createIsland } from "#src/lib/create-island";
import { SearchSiret, type SearchSiretProps } from "./search-siret.client";

//

export const SearchSiretIsland = createIsland<SearchSiretProps>({
  component: SearchSiret,
  clientPath: "/src/routes/moderations/search-siret.client.js",
  mode: "hydrate", // SSR required for HTMX to find the input on page load
  exportName: "SearchSiret",
  tagName: "x-search-siret-island",
  rootTagName: "x-search-siret-root",
});
