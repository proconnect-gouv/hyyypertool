import { createIsland } from "#src/lib/create-island";
import { SearchDate } from "./search-date.client";

//

export const SearchDateIsland = createIsland({
  component: SearchDate,
  clientPath: "/src/ui/moderations/Filter/search-date.client.js",
  mode: "hydrate",
  exportName: "SearchDate",
  tagName: "x-search-date-island",
  rootTagName: "x-search-date-root",
});
