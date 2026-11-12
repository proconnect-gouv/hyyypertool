import { createIsland } from "#src/lib/create-island";
import { SelectAllMembers } from "./select-all-members.client";

//

export const SelectAllMembersIsland = createIsland({
  component: SelectAllMembers,
  clientPath: "/src/ui/organizations/members/select-all-members.client.js",
  mode: "hydrate",
  exportName: "SelectAllMembers",
  tagName: "x-select-all-members-island",
  rootTagName: "x-select-all-members-root",
});
