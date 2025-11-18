//

import env from "@~/core/config";
import z from "zod/v4";
import { fetch_mcp_admin_api, type ApiAuthConfig } from "./fetch";

//

// HACK(douglasduteil): dirty export type
// waiting for full identity types exports from @proconnect-gouv/proconnect.identite
export * from "@proconnect-gouv/proconnect.identite/types";

//

export const MODERATION_STATUS = z.enum([
  "accepted",
  "pending",
  "rejected",
  "unknown",
]);

export type ModerationStatus = z.infer<typeof MODERATION_STATUS>;

//

export function ForceJoinOrganization(config: ApiAuthConfig) {
  return async function force_join_organization(options: {
    is_external: boolean;
    organization_id: number;
    user_id: number;
  }) {
    return fetch_mcp_admin_api(config, {
      endpoint: "/api/admin/join-organization",
      method: "POST",
      searchParams: {
        is_external: options.is_external ? "true" : "false",
        organization_id: String(options.organization_id),
        user_id: String(options.user_id),
      },
    });
  };
}

export type ForceJoinOrganizationHandler = ReturnType<
  typeof ForceJoinOrganization
>;

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

export type SendModerationProcessedEmailHandler = ReturnType<
  typeof SendModerationProcessedEmail
>;

//

/**
 * @deprecated - use ForceJoinOrganization factory instead
 */
export type JoinOrganizationHandler = (options: {
  is_external: boolean;
  organization_id: number;
  user_id: number;
}) => Promise<{}>;

/**
 * @deprecated - use ForceJoinOrganization factory instead
 */
export const join_organization: JoinOrganizationHandler = ForceJoinOrganization(
  {
    baseUrl: env.API_AUTH_URL,
    username: env.API_AUTH_USERNAME,
    password: env.API_AUTH_PASSWORD,
  },
);

/**
 * @deprecated - use SendModerationProcessedEmail factory instead
 */
export const send_moderation_processed_email = SendModerationProcessedEmail({
  baseUrl: env.API_AUTH_URL,
  username: env.API_AUTH_USERNAME,
  password: env.API_AUTH_PASSWORD,
});
