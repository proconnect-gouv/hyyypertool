//

import { createIsland } from "#src/lib/create-island";
import { ReplyForm } from "./ReplyForm.client";

//

export const ReplyFormIsland = createIsland({
  component: ReplyForm,
  clientPath: "/src/ui/moderations/Crisp/ReplyForm.client.js",
  mode: "render",
  exportName: "ReplyForm",
  tagName: "x-reply-form-island",
  rootTagName: "x-reply-form-root",
});
