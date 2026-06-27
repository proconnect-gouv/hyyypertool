//

import { afterEach, describe, expect, it } from "bun:test";
import { make_web_view_options } from "bun-webview-dsl";
import { Hono } from "hono";
import { set_config } from "#src/middleware/config";
import { create_asset_router } from "./index";

//

const ASSETS_PATH = "/assets/test-v123";

let server: ReturnType<typeof Bun.serve>;
afterEach(() => server?.stop(true));

function create_test_server() {
  const hono = new Hono()
    .onError((e) => {
      throw e;
    })
    .use(
      set_config({
        ASSETS_PATH,
        NODE_ENV: "development",
        PUBLIC_ASSETS_PATH: `${ASSETS_PATH}/public/built`,
        VERSION: "test-v123",
      }),
    )
    .route(
      ASSETS_PATH,
      create_asset_router({
        assets_path: ASSETS_PATH,
        node_modules_root: ".",
        public_root: "./bin",
      }),
    );

  return Bun.serve({ fetch: hono.fetch });
}

//

describe("asset routes via WebView", () => {
  it("serves /bundle/config.js with injected config", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    await view.navigate(
      `http://localhost:${server.port}${ASSETS_PATH}/bundle/config.js`,
    );
    await Bun.sleep(500);

    const body = (await view.evaluate("document.body.textContent")) as string;
    expect(body).toContain(ASSETS_PATH);
    expect(body).toContain("test-v123");
  });

  it("serves /bundle/env.js with VERSION", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    await view.navigate(
      `http://localhost:${server.port}${ASSETS_PATH}/bundle/env.js`,
    );
    await Bun.sleep(500);

    const body = (await view.evaluate("document.body.textContent")) as string;
    expect(body).toContain("test-v123");
  });

  it("serves htmx.min.js from node_modules", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    await view.navigate(
      `http://localhost:${server.port}${ASSETS_PATH}/node_modules/htmx.org/dist/htmx.min.js`,
    );
    await Bun.sleep(500);

    const body = (await view.evaluate("document.body.textContent")) as string;
    expect(body).toContain("htmx");
  });

  it("serves tailwind.css from public/built", async () => {
    server = create_test_server();

    await using view = new Bun.WebView(make_web_view_options());
    await view.navigate(
      `http://localhost:${server.port}${ASSETS_PATH}/public/built/tailwind.css`,
    );
    await Bun.sleep(500);

    const body = (await view.evaluate("document.body.textContent")) as string;
    expect(body).toContain("tailwindcss");
  });
});
