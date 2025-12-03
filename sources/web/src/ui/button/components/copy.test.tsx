//

import { render_html } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { CopyButton } from "./copy";

test("renders CopyButton with text", async () => {
  const html = await render_html(
    <CopyButton text="Copy me" variant={{ size: "sm", type: "tertiary" }} />,
  );

  expect(html).toMatchSnapshot();
});

test("renders CopyButton with children", async () => {
  const html = await render_html(
    <CopyButton text="Copy me">
      <span>Custom label</span>
    </CopyButton>,
  );

  expect(html).toMatchSnapshot();
});

test("renders CopyButton with custom class", async () => {
  const html = await render_html(
    <CopyButton text="Copy me" class="custom-class" />,
  );

  expect(html).toMatchSnapshot();
});

test("renders CopyButton with title attribute", async () => {
  const html = await render_html(
    <CopyButton text="Copy me" title="Copy to clipboard" />,
  );

  expect(html).toMatchSnapshot();
});

test("renders CopyButton with data-text attribute", async () => {
  const html = await render_html(<CopyButton text="Copy me" />);

  expect(html).toContain('data-text="Copy me"');
});
