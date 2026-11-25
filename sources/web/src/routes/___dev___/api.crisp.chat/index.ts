//

import type { CrispMessageWire } from "#src/lib/crisp";
import type { AppContext } from "#src/middleware/context";
import { Hono } from "hono";
import {
  crisp_messages_batch,
  seeded_crisp_messages,
  seeded_crisp_subject,
} from "./messages";

//

type Conversation = { session_id: string; messages: CrispMessageWire[] };

const websites = new Map<string, Map<string, Conversation>>();

function get_conversations(website_id: string) {
  if (!websites.has(website_id)) websites.set(website_id, new Map());
  return websites.get(website_id)!;
}

function get_conversation(website_id: string, session_id: string) {
  const conversations = get_conversations(website_id);
  if (!conversations.has(session_id)) {
    conversations.set(session_id, {
      session_id,
      messages: seeded_crisp_messages(session_id, website_id),
    });
  }
  return conversations.get(session_id)!;
}

//

export default new Hono<AppContext>()
  .get("/readyz", (c) => c.text("readyz check passed"))

  .delete("/v1/website/:website_id/conversations", (c) => {
    websites.delete(c.req.param("website_id"));
    return c.json({}, 200);
  })

  .get("/v1/website/:website_id/conversations", (c) => {
    const convs = get_conversations(c.req.param("website_id"));
    return c.json({ data: [...convs.values()] });
  })

  .get("/v1/website/:website_id/conversation/:session_id", async (c) => {
    const { website_id, session_id } = c.req.param();
    const last = get_conversation(website_id, session_id).messages.at(-1);
    return c.json({
      data: {
        created_at: Date.now(),
        last_message:
          last && "content" in last && typeof last.content === "string"
            ? last.content
            : "",
        meta: {
          avatar: "",
          data: {},
          device: {},
          email: "",
          ip: "",
          nickname: "",
          phone: "",
          segments: [],
          subject: await seeded_crisp_subject(c.var.identite_pg, session_id),
        },
      },
    });
  })

  .post("/v1/website/:website_id/conversation", (c) => {
    const { website_id } = c.req.param();
    const session_id = `session_${Date.now()}`;
    get_conversations(website_id).set(session_id, { session_id, messages: [] });
    return c.json({ data: { session_id } });
  })

  .post(
    "/v1/website/:website_id/conversation/:session_id/message",
    async (c) => {
      const { website_id, session_id } = c.req.param();
      const body = await c.req.json().catch(() => ({}));
      const conversation = get_conversation(website_id, session_id);
      const fingerprint = Date.now();
      conversation.messages.push({
        content: String(body.content ?? ""),
        fingerprint,
        from: "operator",
        session_id,
        timestamp: fingerprint,
        type: "text",
        user: { nickname: String(body.user?.nickname ?? "") },
        website_id,
      });
      return c.json({ data: { fingerprint } });
    },
  )

  .get("/v1/website/:website_id/conversation/:session_id/messages", (c) => {
    const { website_id, session_id } = c.req.param();
    const timestamp_before = c.req.query("timestamp_before");
    const conversation = get_conversation(website_id, session_id);
    return c.json({
      data: crisp_messages_batch(
        conversation.messages,
        timestamp_before === undefined ? undefined : Number(timestamp_before),
      ),
    });
  })

  .patch("/v1/website/:website_id/conversation/:session_id/meta", (c) =>
    c.json({}),
  )

  .patch("/v1/website/:website_id/conversation/:session_id/state", (c) =>
    c.json({}),
  )

  .get("/v1/website/:website_id/operators/list", (c) =>
    c.json({
      data: [
        {
          details: {
            email: "user@yopmail.com",
            first_name: "John",
            last_name: "User",
            user_id: "123456789",
          },
        },
        {
          details: {
            email: "moderateur@beta.gouv.fr",
            first_name: "Maude",
            last_name: "Rateur",
            user_id: "135792468",
          },
        },
      ],
    }),
  );
