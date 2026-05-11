//

import { createIsland } from "#src/lib/create-island";
import type { AppContext } from "#src/middleware/context";
import { useRequestContext } from "hono/jsx-renderer";
import { ResponseMessageSelectorClient } from "./response-message-selector.client";

//

const ResponseMessageSelectorIsland = createIsland({
  component: ResponseMessageSelectorClient,
  clientPath: "/src/ui/moderations/Actions/response-message-selector.client.js",
  mode: "render",
  exportName: "ResponseMessageSelectorClient",
  tagName: "x-response-message-selector",
  rootTagName: "x-response-message-selector-root",
});

//

export function ResponseMessageSelector({
  moderation_id,
  response_templates,
}: {
  moderation_id: number;
  response_templates: { id: number; label: string }[];
}) {
  const {
    var: { nonce },
  } = useRequestContext<AppContext>();

  return (
    <ResponseMessageSelectorIsland
      nonce={nonce}
      moderation_id={moderation_id}
      response_templates={response_templates}
    />
  );
}
