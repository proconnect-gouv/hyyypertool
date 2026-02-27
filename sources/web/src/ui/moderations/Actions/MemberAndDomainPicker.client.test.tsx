/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup, fireEvent, render } from "@testing-library/preact";
import { afterAll, afterEach, beforeAll, expect, test } from "bun:test";
import { MemberAndDomainPicker } from "./MemberAndDomainPicker.client";

//

beforeAll(() => {
  GlobalRegistrator.register();
});

afterEach(cleanup);

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

test("renders a single add_domain checkbox", () => {
  const { container } = render(
    <MemberAndDomainPicker domain="example.com" given_name="Adora" />,
  );

  const checkboxes = container.querySelectorAll("input[name='add_domain']");
  expect(checkboxes).toHaveLength(1);
});

test("defaults to AS_INTERNAL with domain label 'interne'", () => {
  const { container } = render(
    <MemberAndDomainPicker domain="example.com" given_name="Adora" />,
  );

  const internalRadio = container.querySelector(
    "input[value='AS_INTERNAL']",
  ) as HTMLInputElement;
  expect(internalRadio.checked).toBe(true);
  expect(container.textContent).toContain("interne");
});

test("switching to AS_EXTERNAL updates domain label to 'externe'", () => {
  const { container } = render(
    <MemberAndDomainPicker domain="example.com" given_name="Adora" />,
  );

  const externalRadio = container.querySelector(
    "input[value='AS_EXTERNAL']",
  ) as HTMLInputElement;
  fireEvent.click(externalRadio);

  expect(externalRadio.checked).toBe(true);
  expect(container.textContent).toContain("externe");
});

test("switching radio unchecks the add_domain checkbox", () => {
  const { container } = render(
    <MemberAndDomainPicker domain="example.com" given_name="Adora" />,
  );

  const query_checkbox = () =>
    container.querySelector("input[name='add_domain']") as HTMLInputElement;

  // Check domain, switch to external, domain should be unchecked
  fireEvent.click(query_checkbox());
  expect(query_checkbox().checked).toBe(true);

  fireEvent.click(
    container.querySelector("input[value='AS_EXTERNAL']") as HTMLInputElement,
  );
  expect(query_checkbox().checked).toBe(false);

  // Check again, switch back, should be unchecked again
  fireEvent.click(query_checkbox());
  expect(query_checkbox().checked).toBe(true);

  fireEvent.click(
    container.querySelector("input[value='AS_INTERNAL']") as HTMLInputElement,
  );
  expect(query_checkbox().checked).toBe(false);
});

test("respects default_internal prop", () => {
  const { container } = render(
    <MemberAndDomainPicker
      domain="example.com"
      given_name="Adora"
      default_internal={false}
    />,
  );

  const externalRadio = container.querySelector(
    "input[value='AS_EXTERNAL']",
  ) as HTMLInputElement;
  expect(externalRadio.checked).toBe(true);
  expect(container.textContent).toContain("externe");
});
