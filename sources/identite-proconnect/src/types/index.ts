//

import type { UserOrganizationLinkVerificationType } from "@proconnect-gouv/proconnect.identite/types";
import { UserOrganizationLinkVerificationTypeSchema } from "@proconnect-gouv/proconnect.identite/types";
import z from "zod/v4";

//

export * from "@proconnect-gouv/proconnect.identite/types";

export const VerificationTypeSchema: typeof UserOrganizationLinkVerificationTypeSchema =
  UserOrganizationLinkVerificationTypeSchema;
export type VerificationType = UserOrganizationLinkVerificationType;

//
//

export const MODERATION_TYPES = z.enum([
  "authorized",
  "big_organization_join",
  "non_verified_domain",
  "organization_join_block",
]);
export const MODERATION_STATUS = z.enum([
  "accepted",
  "pending",
  "rejected",
  "unknown",
]);

export type ModerationStatus = z.infer<typeof MODERATION_STATUS>;
