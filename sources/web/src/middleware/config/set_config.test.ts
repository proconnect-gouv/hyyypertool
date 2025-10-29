//

import { expect, mock, test } from "bun:test";
import { parse } from "dotenv";
import { Hono } from "hono";
import { readFile } from "node:fs/promises";
import { ZodError } from "zod";
import { set_config } from "./set_config";

//

const default_dotenv = parse(await readFile(".env", { encoding: "utf8" }));

test("should set config", async () => {
  const app = new Hono().get(
    "/",
    set_config(),
    async ({ json, var: { config } }) => {
      return json(config);
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(200);
  expect(await res.json()).toEqual(
    expect.objectContaining({
      PUBLIC_ASSETS_PATH: expect.stringContaining("/public/built"),
      ASSETS_PATH: expect.stringContaining("/assets/"),
      DEPLOY_ENV: "preview",
      NODE_ENV: "test",
      PORT: 3000,
    }),
  );
});

test("❌ bubble missing env variable", async () => {
  mock.module("hono/adapter", () => {
    return {
      env: () => ({ ...default_dotenv, NODE_ENV: "🌵" }),
    };
  });

  const app = new Hono()
    .get("/", set_config(), async ({ json, var: { config } }) => {
      return json(config);
    })
    .onError((e) => {
      throw e;
    });

  expect(async () => {
    await app.request("/");
  }).toThrow(
    new ZodError([
      {
        received: "🌵",
        code: "invalid_enum_value",
        options: ["development", "production", "test"],
        path: ["env", "NODE_ENV"],
        message:
          "Invalid enum value. Expected 'development' | 'production' | 'test', received '🌵'",
      },
    ]),
  );
});

test("should set mocked config", async () => {
  const app = new Hono().get(
    "/",
    set_config({ VERSION: "🧌" }),
    async ({ json, var: { config } }) => {
      return json(config);
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ VERSION: "🧌" });
});
