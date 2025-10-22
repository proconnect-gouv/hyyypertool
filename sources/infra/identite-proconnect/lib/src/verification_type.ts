//

import type { UserOrganizationLinkVerificationType } from "@proconnect-gouv/proconnect.identite/types";
import { UserOrganizationLinkVerificationTypeSchema } from "@proconnect-gouv/proconnect.identite/types";

//

export const Verification_Type_Schema: typeof UserOrganizationLinkVerificationTypeSchema =
  UserOrganizationLinkVerificationTypeSchema;
export type Verification_Type = UserOrganizationLinkVerificationType;
