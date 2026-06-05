//

import { createIsland } from "#src/lib/create-island";
import { ActionsClient } from "./Actions.client";

//

export const ActionsIsland = createIsland({
  component: ActionsClient,
  clientPath: "/src/ui/moderations/Actions/Actions.client.js",
  mode: "render",
  exportName: "ActionsClient",
  tagName: "x-actions-island",
  rootTagName: "x-actions-root",
});
