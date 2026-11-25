//

import { z } from "zod";

//

const MessageBase = z.object({
  fingerprint: z.number(),
  from: z.enum(["operator", "user"]),
  origin: z.string().optional(),
  session_id: z.string(),
  timestamp: z.number(),
  user: z.object({ nickname: z.string() }),
  website_id: z.string(),
});

export const CrispMessageSchema = z.union([
  MessageBase.extend({
    content: z.string(),
    type: z.enum(["note", "text"]),
  }),
  MessageBase.extend({
    content: z.object({
      name: z.string(),
      type: z.string(),
      url: z.url({ protocol: /^https?$/ }),
    }),
    type: z.literal("file"),
  }),
  MessageBase.extend({
    content: z.object({ namespace: z.string() }),
    type: z.literal("event"),
  }),
  MessageBase.extend({ type: z.string() }).transform(
    ({ type, ...message }) => ({
      ...message,
      original_type: type,
      type: "unsupported" as const,
    }),
  ),
]);

export type CrispMessage = z.infer<typeof CrispMessageSchema>;
export type CrispMessageWire = z.input<typeof CrispMessageSchema>;

export type CrispMessageAuthor = "operator" | "system" | "user";

function urn_value(value: string | undefined) {
  return value?.startsWith("urn:") ? value.slice(4) : value;
}

export function crisp_message_author(
  { from, origin }: Pick<CrispMessage, "from" | "origin">,
  plugin_urn: string,
): CrispMessageAuthor {
  return urn_value(origin) === urn_value(plugin_urn) ? "system" : from;
}
