/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup, fireEvent, render } from "@testing-library/preact";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { ProcessedCheckbox } from "./processed-checkbox.client";
import { text } from "./q-signal.client";

//

beforeAll(() => {
  GlobalRegistrator.register();
});

beforeEach(() => {
  text.value = "";
  const input = document.createElement("input");
  input.id = "q";
  document.body.appendChild(input);
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

describe("ProcessedCheckbox", () => {
  test("unchecked when q has is:pending", () => {
    text.value = "is:pending";
    const { container } = render(<ProcessedCheckbox />);
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  test("checked when q has no is: filter (show all)", () => {
    text.value = "";
    const { container } = render(<ProcessedCheckbox />);
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("auto-checks when email is present in q", () => {
    text.value = "is:pending email:test@example.com";
    const { container } = render(<ProcessedCheckbox />);
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("auto-checks when siret is present in q", () => {
    text.value = "is:pending siret:12345";
    const { container } = render(<ProcessedCheckbox />);
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("auto-checks when moderated_by is present in q", () => {
    text.value = "is:pending by:moderator@test.com";
    const { container } = render(<ProcessedCheckbox />);
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("removes is:pending when toggled on", () => {
    text.value = "is:pending -type:organization_join_block";
    const { container } = render(<ProcessedCheckbox />);
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;

    fireEvent.change(checkbox, { target: { checked: true } });
    expect(text.value).not.toContain("is:pending");
    expect(text.value).not.toContain("is:processed");
    expect(text.value).toContain("-type:organization_join_block");
  });

  test("restores is:pending when toggled off", () => {
    text.value = "-type:organization_join_block";
    const { container } = render(<ProcessedCheckbox />);
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;

    fireEvent.change(checkbox, { target: { checked: false } });
    expect(text.value).toContain("is:pending");
  });
});
