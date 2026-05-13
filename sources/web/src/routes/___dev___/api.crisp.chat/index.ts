//

import type { AppContext } from "#src/middleware/context";
import { Hono } from "hono";

//

type Message = {
  session_id: string;
  website_id: string;
  content: string;
  type: string;
  from: string;
  origin: string;
  user: Record<string, unknown>;
  fingerprint: number;
  timestamp: number;
  edited: boolean;
  read: string;
  delivered: string;
};
type Conversation = { session_id: string; messages: Message[] };

const websites = new Map<string, Map<string, Conversation>>();

function get_conversations(website_id: string) {
  if (!websites.has(website_id)) websites.set(website_id, new Map());
  return websites.get(website_id)!;
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

  .get("/v1/website/:website_id/conversation/:session_id", (c) => {
    return c.json({
      data: {
        created_at: Date.now(),
        last_message: "",
        meta: {
          avatar: "",
          data: {},
          device: {},
          email: "",
          ip: "",
          nickname: "",
          phone: "",
          segments: [],
          subject: "Lorem Ipsum",
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
      const convs = get_conversations(website_id);
      if (!convs.has(session_id))
        convs.set(session_id, { session_id, messages: [] });
      const fingerprint = Date.now();
      convs.get(session_id)!.messages.push({
        session_id,
        website_id,
        content: body.content ?? "",
        type: body.type ?? "text",
        from: body.from ?? "operator",
        origin: body.origin ?? "",
        user: body.user ?? {},
        fingerprint,
        timestamp: fingerprint,
        edited: false,
        read: "",
        delivered: "",
      });
      return c.json({ data: { fingerprint } });
    },
  )

  .get("/v1/website/:website_id/conversation/:session_id/messages", (c) => {
    const { website_id, session_id } = c.req.param();
    const conv = get_conversations(website_id).get(session_id);
    return c.json({ data: conv?.messages ?? [] });
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
