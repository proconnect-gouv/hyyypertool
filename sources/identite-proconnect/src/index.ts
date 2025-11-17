//

import z from "zod/v4";
import { fetch_mcp_admin_api } from "./fetch";

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

/**
 * @deprecated - use sdk ForceJoinOrganization instead
 */
export type JoinOrganizationHandler = (options: {
  is_external: boolean;
  organization_id: number;
  user_id: number;
}) => Promise<{}>;

/**
 * @deprecated - use sdk ForceJoinOrganization instead
 */
export const join_organization: JoinOrganizationHandler = async ({
  is_external,
  organization_id,
  user_id,
}) => {
  return fetch_mcp_admin_api({
    endpoint: "/api/admin/join-organization",
    method: "POST",
    searchParams: {
      is_external: is_external ? "true" : "false",
      organization_id: String(organization_id),
      user_id: String(user_id),
    },
  });
};

export async function send_moderation_processed_email({
  organization_id,
  user_id,
}: {
  organization_id: number;
  user_id: number;
}): Promise<{}> {
  return fetch_mcp_admin_api({
    endpoint: "/api/admin/send-moderation-processed-email",
    method: "POST",
    searchParams: {
      organization_id: String(organization_id),
      user_id: String(user_id),
    },
  });
}
