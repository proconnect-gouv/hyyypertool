import { render_html } from "#src/ui/testing";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import { CopyButton } from "./copy";

//

beforeAll(async () => {
  GlobalRegistrator.register();

  // Import Alpine init (starts Alpine)
  await import("../../../lib/alpine/alpine-init.client.ts");
});

beforeEach(async () => {
  // Clear clipboard between tests
  await window.navigator.clipboard.writeText("");
});

afterAll(() => GlobalRegistrator.unregister());

//

test("copies text to clipboard when clicked", async () => {
  document.body.innerHTML = await render_html(
    <CopyButton text="Hello World">Copy</CopyButton>,
  );

  // Wait for Alpine to process the DOM
  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(await window.navigator.clipboard.readText()).toBe("");

  const button = document.querySelector("button")!;
  button.click();

  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(await window.navigator.clipboard.readText()).toBe("Hello World");
});

test("does not copy if text is empty", async () => {
  document.body.innerHTML = await render_html(
    <CopyButton text="">Copy</CopyButton>,
  );

  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(await window.navigator.clipboard.readText()).toBe("");

  const button = document.querySelector("button")!;
  button.click();

  await new Promise((resolve) => setTimeout(resolve, 100));

  // Should still be empty since data-text is empty
  expect(await window.navigator.clipboard.readText()).toBe("");
});
