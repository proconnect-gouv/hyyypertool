import { createIsland } from "#src/lib/create-island";
import { SortHeader, type SortHeaderProps } from "./sort-header.client";

export const SortHeaderIsland = createIsland<SortHeaderProps>({
  component: SortHeader,
  clientPath: "/src/ui/moderations/Filter/sort-header.client.js",
  mode: "hydrate",
  exportName: "SortHeader",
  tagName: "x-sort-header-island",
  rootTagName: "x-sort-header-root",
});
