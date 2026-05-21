//

import { createIsland } from "#src/lib/create-island";
import { AcceptForm } from "./AcceptForm.client";

//

export const AcceptFormIsland = createIsland({
  component: AcceptForm,
  clientPath: "/src/ui/moderations/Actions/AcceptForm.client.js",
  mode: "render",
  exportName: "AcceptForm",
  tagName: "x-accept-form-island",
  rootTagName: "x-accept-form-root",
});
