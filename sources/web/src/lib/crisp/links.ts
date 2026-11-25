//

import type { Config } from "@proconnect-gouv/proconnect.crisp/types";

export const CRISP_APP_BASE_URL = "https://app.crisp.chat";

//

export function create_link(config: Pick<Config, "base_url" | "website_id">) {
  const inbox = `${config.base_url}/website/${config.website_id}/inbox/`;
  return {
    inbox: () => inbox,
    session: (session_id: string) => `${inbox}${session_id}`,
  };
}
