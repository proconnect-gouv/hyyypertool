//

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, beforeAll, expect, test } from "bun:test";
import "hyperscript.org";
import "hyperscript.org/ext/hdb.js";
import { hide_on_click_elsewere } from "./hide_on_click_elsewere";

//

beforeAll(() => GlobalRegistrator.register());
afterAll(() => GlobalRegistrator.unregister());

//

test("hide on click elsewere", () => {
  document.body.innerHTML = (
    <>
      <div _={hide_on_click_elsewere("#ike")}></div>
      <div id="ike"></div>
    </>
  ).toString();

  // hyperscript.org 0.9.93 attaches itself to globalThis as a side effect of the
  // "hyperscript.org" import above; the package ships no type declarations.
  const hyperscript_global = globalThis as unknown as {
    _hyperscript: { processNode(el: Element): void };
  };
  hyperscript_global._hyperscript.processNode(document.body);

  const ike = document.querySelector("#ike")!;

  expect(ike.hasAttribute("hidden")).toBeFalse();
  document.body.click();

  expect(ike.hasAttribute("hidden")).toBeTrue();
});
