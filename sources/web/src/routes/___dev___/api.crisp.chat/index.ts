//

import type { AppContext } from "#src/middleware/context";
import { Hono } from "hono";

//

type TrackedRequest = { method: string; path: string };

const tracked: TrackedRequest[] = [];

function match_path(pattern: string, path: string) {
  return new RegExp(`^${pattern}$`).test(path);
}

//

export default new Hono<AppContext>()
  .get("/readyz", (c) => c.text("readyz check passed"))

  .put("/mockserver/reset", (c) => {
    tracked.length = 0;
    return c.json({}, 200);
  })

  .put("/mockserver/verify", async (c) => {
    const body = await c.req.json();
    const { httpRequest, times } = body;
    const { method, path: pattern } = httpRequest;

    const count = tracked.filter(
      (r) => (!method || r.method === method) && match_path(pattern, r.path),
    ).length;

    const atLeast = times?.atLeast ?? 0;
    const atMost = times?.atMost ?? Infinity;

    if (count >= atLeast && count <= atMost) return c.json({}, 202);
    return c.json(
      { message: `Expected ${atLeast}–${atMost} requests, got ${count}` },
      406,
    );
  })

  //

  .get("/v1/website/:website_id/conversation/:session_id", (c) =>
    c.json({ data: { meta: { subjet: "Lorem Ipsum" } } }),
  )

  .post("/v1/website/:website_id/conversation", (c) =>
    c.json({ data: { session_id: "session_123456789" } }),
  )

  .post("/v1/website/:website_id/conversation/:session_id/message", (c) => {
    tracked.push({
      method: "POST",
      path: c.req.path,
    });
    return c.json({ data: { fingerprint: "123456789" } });
  })

  .get("/v1/website/:website_id/conversation/:session_id/messages", (c) => {
    const { session_id, website_id } = c.req.param();
    return c.json({
      data: [
        {
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          type: "text",
          session_id,
          website_id,
          timestamp: 1715097494011,
          user: { user_id: "123456789", nickname: "John User" },
        },
      ],
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
