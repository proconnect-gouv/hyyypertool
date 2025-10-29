//

import type { Config } from "@proconnect-gouv/proconnect.crisp/types";

//

export function create_link(config: Pick<Config, "base_url" | "website_id">) {
  return {
    inbox() {
      return `${config.base_url}/website/${config.website_id}/inbox`;
    },
    session(session_id: string) {
      return `${config.base_url}/website/${config.website_id}/inbox/${session_id}`;
    },
  };
}
