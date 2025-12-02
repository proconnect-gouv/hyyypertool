//

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import _hyperscript from "hyperscript.org";
import { copy_value_to_clipboard } from "./copy_value_to_clipboard";

//

beforeAll(() => GlobalRegistrator.register());
afterAll(() => GlobalRegistrator.unregister());

beforeEach(async () => {
  await window.navigator.clipboard.write([]);
});

test("copy textarea value", async () => {
  const selector = "message";
  document.body.innerHTML = (
    <>
      <button _={copy_value_to_clipboard(`#${selector}`)}>My button</button>
      <textarea id={selector}>foo</textarea>
    </>
  ).toString();

  _hyperscript.processNode(document.body);

  expect(await window.navigator.clipboard.readText()).toBe("");

  const button = document.querySelector("button")!;
  button.click();

  expect(await window.navigator.clipboard.readText()).toBe("foo");
});

test("copy input value", async () => {
  const selector = "message";
  document.body.innerHTML = (
    <>
      <button _={copy_value_to_clipboard(`#${selector}`)}>My button</button>
      <input id={selector} value="foo" />
    </>
  ).toString();

  _hyperscript.processNode(document.body);

  expect(await window.navigator.clipboard.readText()).toBe("");

  const button = document.querySelector("button")!;
  button.click();

  expect(await window.navigator.clipboard.readText()).toBe("foo");
});
