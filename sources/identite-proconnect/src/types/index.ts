//

import {
  LinkTypes,
  ModerationStatusSchema,
  ModerationTypeSchema,
} from "@proconnect-gouv/proconnect.identite/types";
import z from "zod";

//

export * from "@proconnect-gouv/proconnect.identite/types";

export const VerificationTypeSchema = LinkTypes;
export type VerificationType = z.output<typeof LinkTypes>;

//
//

export const MODERATION_TYPES = ModerationTypeSchema;
export const MODERATION_STATUS = ModerationStatusSchema;

export type ModerationStatus = z.infer<typeof MODERATION_STATUS>;
