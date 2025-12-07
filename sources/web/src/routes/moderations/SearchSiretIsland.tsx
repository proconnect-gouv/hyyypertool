/**
 * SearchSiret Island Component (Server-side)
 *
 * Renders a SIRET search input that auto-enables processed requests when typing
 */

import config from "#src/config";
import { createIsland } from "../../lib/create-island";
import { SearchSiret, type SearchSiretProps } from "./search-siret.client";

//

export const SearchSiretIsland = createIsland<SearchSiretProps>({
  component: SearchSiret,
  clientPath: `${config.PUBLIC_ASSETS_PATH}/routes/moderations/search-siret.client.js`,
  mode: "hydrate", // SSR required for HTMX to find the input on page load
  exportName: "SearchSiret",
  tagName: "x-search-siret-island",
  rootTagName: "x-search-siret-root",
});
