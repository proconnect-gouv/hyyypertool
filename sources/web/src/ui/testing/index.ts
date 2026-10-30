//

import type { Child } from "hono/jsx";
import { jsx } from "hono/jsx";
import { RequestContext } from "hono/jsx-renderer";
import { renderToReadableStream } from "hono/jsx/dom/server";
import { format, type Options } from "prettier";

//

const fakeContext = { var: { nonce: "" } } as any;

export const render_html = pretty_renderer({ parser: "html" });
export const render_md = pretty_renderer({ parser: "mdx" });

//

export function pretty_renderer(options: Options) {
  return async function render_formated(element: Child) {
    if (typeof element === "string") return format(element, options);
    const textDecoder = new TextDecoder();
    const getStringFromStream = async (
      stream: ReadableStream<Uint8Array>,
    ): Promise<string> => {
      const reader = stream.getReader();
      let str = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        str += textDecoder.decode(value);
      }
      return str;
    };
    const wrapped = jsx(RequestContext.Provider, {
      value: fakeContext,
      children: element,
    });
    return format(
      await getStringFromStream(await renderToReadableStream(wrapped)),
      options,
    );
  };
}
