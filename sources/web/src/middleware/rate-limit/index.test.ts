//

import { pglite_client } from "@~/hyyyperbase/testing";
import { beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import type { Pool } from "pg";
import { rate_limit } from "./index";

//

const store_client = {
  query({ text, values }: { name?: string; text: string; values?: any[] }) {
    return pglite_client.query(text, values);
  },
} as unknown as Pool;

function make_app(points: number) {
  return new Hono()
    .use(
      rate_limit({
        storeClient: store_client,
        storeType: "pool",
        points,
        duration: 60,
      }),
    )
    .get("/", ({ text }) => text("ok"));
}

beforeEach(async () => {
  await pglite_client.query("DELETE FROM rate_limiter");
});

//

test("allows requests under the limit", async () => {
  const app = make_app(3);

  for (let i = 0; i < 3; i++) {
    const res = await app.request("/", {
      headers: { "x-forwarded-for": "1.2.3.4" },
    });
    expect(res.status).toBe(200);
  }
});

test("blocks requests over the limit with 429", async () => {
  const app = make_app(2);

  await app.request("/", { headers: { "x-forwarded-for": "1.2.3.5" } });
  await app.request("/", { headers: { "x-forwarded-for": "1.2.3.5" } });
  const res = await app.request("/", {
    headers: { "x-forwarded-for": "1.2.3.5" },
  });

  expect(res.status).toBe(429);
  expect(res.headers.get("X-RateLimit-Remaining")).toBe("0");
});

test("counts IPs separately", async () => {
  const app = make_app(1);

  await app.request("/", { headers: { "x-forwarded-for": "10.0.0.1" } });
  const res = await app.request("/", {
    headers: { "x-forwarded-for": "10.0.0.2" },
  });

  expect(res.status).toBe(200);
});
