//

import { match } from "ts-pattern";
import { z } from "zod";

//

const BUILTIN_COMMENT = z.object({
  created_by: z.string().email(),
});
const VALIDATED_COMMENT = BUILTIN_COMMENT.extend({
  reason: z.string().optional(),
  type: z.literal("VALIDATED"),
});
const REJECTED_COMMENT = BUILTIN_COMMENT.extend({
  reason: z.string(),
  type: z.literal("REJECTED"),
});
const REPROCESSED_COMMENT = BUILTIN_COMMENT.extend({
  type: z.literal("REPROCESSED"),
});

export type Comment_Type =
  | z.TypeOf<typeof REJECTED_COMMENT>
  | z.TypeOf<typeof REPROCESSED_COMMENT>
  | z.TypeOf<typeof VALIDATED_COMMENT>;

//

export function comment_message(comment_type: Comment_Type) {
  const comment_message = match(comment_type)
    .with({ type: "VALIDATED" }, ({ created_by, reason }) =>
      [`Validé par ${created_by}`, reason ? `Raison : "${reason}"` : false]
        .filter(Boolean)
        .join(" | "),
    )
    .with(
      { type: "REPROCESSED" },
      ({ created_by }) => `Réouverte par ${created_by}`,
    )
    .with(
      { type: "REJECTED" },
      ({ created_by, reason }) =>
        `Rejeté par ${created_by} | Raison : "${reason}"`,
    )
    .exhaustive();
  return `${Number(new Date())} ${comment_type.created_by} | ${comment_message}`;
}

export function append_comment(
  comment: string | null,
  comment_type: Comment_Type,
) {
  return [...(comment ? [comment] : []), comment_message(comment_type)].join(
    "\n",
  );
}
