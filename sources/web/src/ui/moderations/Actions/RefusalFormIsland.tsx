//

import { createIsland } from "#src/lib/create-island";
import { RefusalForm } from "./RefusalForm.client";

//

export const RefusalFormIsland = createIsland({
  component: RefusalForm,
  clientPath: "/src/ui/moderations/Actions/RefusalForm.client.js",
  mode: "render",
  exportName: "RefusalForm",
  tagName: "x-refusal-form-island",
  rootTagName: "x-refusal-form-root",
});
