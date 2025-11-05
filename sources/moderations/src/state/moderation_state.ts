/**
 * Domain state machine for moderation status.
 *
 * This represents the business concept of moderation state,
 * independent of database schema.
 */

export type ModerationState =
  | { status: "pending" }
  | {
      status: "approved";
      approved_at: Date;
      approved_by: string;
    }
  | {
      status: "rejected";
      rejected_at: Date;
      rejected_by: string;
      reason: string;
    };
