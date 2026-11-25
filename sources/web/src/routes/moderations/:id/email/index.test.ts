//

import { NotFoundError } from "#src/errors";
import { crisp_api, type CrispApi } from "#src/lib/crisp";
import { set_config } from "#src/middleware/config";
import { set_crisp_client } from "#src/middleware/crisp";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";

import { set_userinfo } from "#src/middleware/auth";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, mock, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /moderations/:id/email", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);

  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  //

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "good@captain.yargs" }))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .route("/:id/email", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/email?describedby=🐘`);

  if (response.status >= 400) throw await response.text();

  expect(response.status).toBe(200);
  expect(await response.text()).toContain('aria-describedby="🐘"');
});

test("GET /moderations/:id/email throws NotFoundError for an unknown moderation", async () => {
  await expect(
    new Hono()
      .use(set_config({ ALLOWED_USERS: "good@captain.yargs" }))
      .use(set_identite_pg(pg))
      .use(set_nonce("nonce"))
      .use(set_userinfo({ email: "good@captain.yargs" }))
      .route("/:id/email", app)
      .onError((error) => {
        throw error;
      })
      .request(`/42/email?describedby=🐘`),
  ).rejects.toThrow(NotFoundError);
});

test("GET /moderations/:id/email shows the Crisp exchange described by its heading", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);

  const moderation_id = await create_adora_pony_moderation(pg, {
    ticket_id: "  session_test  ",
    type: "",
  });

  const get_conversation = mock<CrispApi["get_conversation"]>(async () => ({
    created_at: 1_700_000_000_000,
    last_message: "",
    meta: {
      avatar: "",
      data: {},
      device: {},
      email: "user@example.com",
      ip: "",
      nickname: "User",
      phone: "",
      segments: ["email"],
      subject: "Conversation de test",
    },
  }));
  const crisp = {
    create_conversation: mock(),
    get_conversation,
    get_messages: mock<CrispApi["get_messages"]>(async () => []),
    get_user: mock(),
    mark_conversation_as_resolved: mock(),
    send_message: mock(),
  };

  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "good@captain.yargs",
        CRISP_WEBSITE_ID: "test",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .use(set_crisp_client(crisp))
    .route("/:id/email", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/email?describedby=🐘`);

  if (response.status >= 400) throw await response.text();

  const body = await response.text();
  expect(body).toContain('aria-describedby="🐘"');
  expect(body).toContain("Conversation de test");
  expect(get_conversation).toHaveBeenCalledWith({ session_id: "session_test" });
});

test("GET /moderations/:id/email shows a hostile Crisp conversation as inert text", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    ticket_id: "session_hostile",
    type: "",
  });

  const payload = `<script>alert(1)</script><img src=x onerror=alert(1)>`;
  const message = {
    fingerprint: 1,
    from: "user",
    session_id: "session_hostile",
    timestamp: 1_700_000_000_000,
    user: { nickname: payload },
    website_id: "test",
  };
  const messages = [
    {
      ...message,
      content: `${payload} [lien](javascript:alert(1))`,
      type: "text",
    },
    {
      ...message,
      content: `${payload} ![](javascript:alert(1))`,
      type: "note",
    },
    {
      ...message,
      content: { name: payload, type: "text/html", url: "javascript:alert(1)" },
      type: "file",
    },
    { ...message, content: { namespace: payload }, type: "event" },
    { ...message, type: payload },
  ].map((hostile, index) => ({ ...hostile, fingerprint: index + 1 }));
  using crisp_server = Bun.serve({
    fetch: ({ url }) =>
      Response.json({
        data: url.endsWith("/messages")
          ? messages
          : { meta: { nickname: payload, subject: payload } },
      }),
    port: 0,
  });

  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "good@captain.yargs",
        CRISP_WEBSITE_ID: "test",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .use(
      set_crisp_client(
        crisp_api({
          base_url: crisp_server.url.origin,
          identifier: "",
          key: "",
          plugin_urn: "urn:test",
          user_nickname: "",
          website_id: "test",
        }),
      ),
    )
    .route("/:id/email", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/email?describedby=🐘`);
  const html = await response.text();

  expect(response.status).toBe(200);
  expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  expect(html).not.toContain("<script>alert");
  expect(html).not.toContain("<img");
  expect(html).not.toContain("javascript:");
});

test("POST /moderations/:id/email/reply sends the moderator note to the Crisp conversation", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    ticket_id: "session_reply",
    type: "",
  });

  const send_message = mock<CrispApi["send_message"]>();
  const crisp = {
    create_conversation: mock(),
    get_conversation: mock(),
    get_messages: mock(),
    get_user: mock<CrispApi["get_user"]>(async () => ({
      nickname: "Good C.",
      user_id: "operator",
    })),
    mark_conversation_as_resolved: mock(),
    send_message,
  };

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "good@captain.yargs" }))
    .use(set_identite_pg(pg))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .use(set_crisp_client(crisp))
    .route("/:id/email", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/email/reply`, {
      body: new URLSearchParams({ content: "  Bonjour !  ", type: "note" }),
      method: "POST",
    });

  expect(response.status).toBe(200);
  expect(send_message).toHaveBeenCalledWith({
    content: "Bonjour !",
    session_id: "session_reply",
    type: "note",
    user: { nickname: "Good C.", user_id: "operator" },
  });
});
