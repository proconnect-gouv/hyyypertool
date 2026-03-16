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
import { parsed, text } from "./q-signal.client";
import { SearchDate } from "./search-date.client";

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

describe("SearchDate", () => {
  test("renders a date input", () => {
    const { container } = render(<SearchDate />);
    const input = container.querySelector(
      "input[type='date']",
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
  });

  test("empty value when no date in q", () => {
    const { container } = render(<SearchDate />);
    const input = container.querySelector(
      "input[type='date']",
    ) as HTMLInputElement;
    expect(input.value).toBe("");
  });

  test("reflects date from q", () => {
    text.value = "date:2025-06-15";
    const { container } = render(<SearchDate />);
    const input = container.querySelector(
      "input[type='date']",
    ) as HTMLInputElement;
    expect(input.value).toBe("2025-06-15");
  });

  test("updates q when date is selected", () => {
    const { container } = render(<SearchDate />);
    const input = container.querySelector(
      "input[type='date']",
    ) as HTMLInputElement;

    fireEvent.input(input, { target: { value: "2025-03-10" } });
    expect(text.value).toContain("date:2025-03-10");
    expect(parsed.value.day).toBeInstanceOf(Date);
  });

  test("clears date from q when emptied", () => {
    text.value = "date:2025-06-15 email:test@test.com";
    const { container } = render(<SearchDate />);
    const input = container.querySelector(
      "input[type='date']",
    ) as HTMLInputElement;

    fireEvent.input(input, { target: { value: "" } });
    expect(text.value).not.toContain("date:");
    expect(parsed.value.day).toBeUndefined();
    expect(parsed.value.search_email).toBe("test@test.com");
  });

  test("has max attribute set to today", () => {
    const { container } = render(<SearchDate />);
    const input = container.querySelector(
      "input[type='date']",
    ) as HTMLInputElement;
    expect(input.max).toBeTruthy();
    // Should be a valid date string
    expect(input.max).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
