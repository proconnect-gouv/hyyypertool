//

import { hc } from "hono/client";
import type { Router } from "../routes";

//

export { hx_urls } from "./hx_urls";

//
export const urls = hc<Router>("http://localhost:3000", {
  fetch(input: string | URL | Request) {
    // NOTE(douglasduteil): do not fetch
    // This is a hack to make the type system happy
    // One does not simply fetch the server while servering the response
    //
    // Should be use to link internal urls with
    // urls.api.posts.$url() // `/api/posts`
    //
    // see https://hono.dev/guides/rpc#url
    const url =
      input instanceof URL
        ? input
        : input instanceof Request
          ? new URL(input.url)
          : new URL(input);
    return Promise.resolve(new Response(url.href));
  },
});
