import { createIsland } from "#src/lib/create-island";
import { AutoGoBack } from "./auto-go-back.client";

//

export const AutoGoBackIsland = createIsland({
  component: AutoGoBack,
  clientPath: "/src/ui/moderations/AutoGoBack/auto-go-back.client.js",
  mode: "render",
  exportName: "AutoGoBack",
  tagName: "x-auto-go-back-island",
  rootTagName: "x-auto-go-back-root",
});
