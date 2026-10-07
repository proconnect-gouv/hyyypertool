//

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, beforeAll, expect, test } from "bun:test";
import "hyperscript.org";
import { disable_until_htmx_afterOnLoad } from "./disable_until_htmx:afterOnLoad";

//

beforeAll(() => GlobalRegistrator.register());
afterAll(() => GlobalRegistrator.unregister());

//

test("disable_until_htmx_afterOnLoad", () => {
  document.body.innerHTML = (
    <button _={disable_until_htmx_afterOnLoad}>My button</button>
  ).toString();

  // hyperscript.org 0.9.93 attaches itself to globalThis as a side effect of the
  // "hyperscript.org" import above; the package ships no type declarations.
  const hyperscript_global = globalThis as unknown as {
    _hyperscript: { processNode(el: Element): void };
  };
  hyperscript_global._hyperscript.processNode(document.body);

  const button = document.querySelector("button")!;
  expect(button?.innerText).toEqual("My button");
  expect(button.getAttribute("disabled")).toBeNull();
  button.click();
  expect(button.getAttribute("disabled")).toBe("true");
  button.dispatchEvent(new Event("htmx:afterOnLoad"));
  expect(button.getAttribute("disabled")).toBeNull();
});
