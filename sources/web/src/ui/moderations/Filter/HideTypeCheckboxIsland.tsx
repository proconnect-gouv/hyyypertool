import { createIsland } from "#src/lib/create-island";
import { HideTypeCheckbox } from "./hide-type-checkbox.client";

//

export const HideTypeCheckboxIsland = createIsland({
  component: HideTypeCheckbox,
  clientPath: "/src/ui/moderations/Filter/hide-type-checkbox.client.js",
  mode: "hydrate",
  exportName: "HideTypeCheckbox",
  tagName: "x-hide-type-checkbox-island",
  rootTagName: "x-hide-type-checkbox-root",
});
