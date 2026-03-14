/**
 * ExcludeSpNames Island Component (Server-side)
 *
 * Renders a multi-select to exclude moderations by sp_name
 */

import { createIsland } from "#src/lib/create-island";
import { ExcludeSpNames } from "./exclude-sp-names.client";

//

export const ExcludeSpNamesIsland = createIsland({
  component: ExcludeSpNames,
  clientPath: "/src/routes/moderations/exclude-sp-names.client.js",
  mode: "hydrate",
  exportName: "ExcludeSpNames",
  tagName: "x-exclude-sp-names-island",
  rootTagName: "x-exclude-sp-names-root",
});
