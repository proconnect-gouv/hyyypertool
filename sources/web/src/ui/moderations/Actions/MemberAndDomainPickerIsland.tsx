//

import { createIsland } from "#src/lib/create-island";
import { MemberAndDomainPicker } from "./MemberAndDomainPicker.client";

//

export const MemberAndDomainPickerIsland = createIsland({
  component: MemberAndDomainPicker,
  clientPath: "/src/ui/moderations/Actions/MemberAndDomainPicker.client.js",
  mode: "render",
  exportName: "MemberAndDomainPicker",
  tagName: "x-member-domain-picker-island",
  rootTagName: "x-member-domain-picker-root",
});
