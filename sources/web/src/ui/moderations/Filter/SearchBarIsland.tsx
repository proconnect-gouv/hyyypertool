/**
 * SearchBar Island Component (Server-side)
 *
 * Renders the unified search bar with token-based filtering
 */

import { createIsland } from "#src/lib/create-island";
import { SearchBar } from "./search-bar.client";

//

export const SearchBarIsland = createIsland({
  component: SearchBar,
  clientPath: "/src/ui/moderations/Filter/search-bar.client.js",
  mode: "hydrate",
  exportName: "SearchBar",
  tagName: "x-search-bar-island",
  rootTagName: "x-search-bar-root",
});
