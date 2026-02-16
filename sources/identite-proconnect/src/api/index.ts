//

import { fetch_mcp_admin_api, type ApiAuthConfig } from "./fetch";

//

export function SendModerationProcessedEmail(config: ApiAuthConfig) {
  return async function send_moderation_processed_email(options: {
    organization_id: number;
    user_id: number;
  }) {
    return fetch_mcp_admin_api(config, {
      endpoint: "/api/admin/send-moderation-processed-email",
      method: "POST",
      searchParams: {
        organization_id: String(options.organization_id),
        user_id: String(options.user_id),
      },
    });
  };
}
