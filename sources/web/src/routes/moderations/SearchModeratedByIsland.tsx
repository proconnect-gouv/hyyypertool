/**
 * SearchModeratedBy Island Component (Server-side)
 *
 * Renders a moderated by search input that auto-enables processed requests when typing
 */

import { createIsland } from "#src/lib/create-island";
import {
  SearchModeratedBy,
  type SearchModeratedByProps,
} from "./search-moderated-by.client";

//

export const SearchModeratedByIsland = createIsland<SearchModeratedByProps>({
  component: SearchModeratedBy,
  clientPath: "/src/routes/moderations/search-moderated-by.client.js",
  mode: "hydrate", // SSR required for HTMX to find the input on page load
  exportName: "SearchModeratedBy",
  tagName: "x-search-moderated-by-island",
  rootTagName: "x-search-moderated-by-root",
});
