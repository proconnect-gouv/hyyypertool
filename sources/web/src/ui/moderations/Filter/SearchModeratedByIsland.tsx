import { createIsland } from "#src/lib/create-island";
import {
  SearchModeratedBy,
  type SearchModeratedByProps,
} from "./search-moderated-by.client";

//

export const SearchModeratedByIsland = createIsland<SearchModeratedByProps>({
  component: SearchModeratedBy,
  clientPath: "/src/ui/moderations/Filter/search-moderated-by.client.js",
  mode: "hydrate",
  exportName: "SearchModeratedBy",
  tagName: "x-search-moderated-by-island",
  rootTagName: "x-search-moderated-by-root",
});
