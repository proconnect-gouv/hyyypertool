import { createIsland } from "#src/lib/create-island";
import { SearchEmail } from "./search-email.client";

//

export const SearchEmailIsland = createIsland({
  component: SearchEmail,
  clientPath: "/src/ui/moderations/Filter/search-email.client.js",
  mode: "hydrate",
  exportName: "SearchEmail",
  tagName: "x-search-email-island",
  rootTagName: "x-search-email-root",
});
