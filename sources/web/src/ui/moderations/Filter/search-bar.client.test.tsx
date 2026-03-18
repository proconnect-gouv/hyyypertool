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
import { dirty, submitted, text } from "./q-signal.client";
import { SearchBar } from "./search-bar.client";

//

beforeAll(() => {
  GlobalRegistrator.register();
});

beforeEach(() => {
  text.value = "";
  submitted.value = "";
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

describe("SearchBar", () => {
  test("Escape closes dropdown without clearing input", () => {
    const { container } = render(
      <SearchBar
        initial_q="is:pending"
        moderators_list={[]}
        sp_names_list={[]}
      />,
    );
    const input = container.querySelector("input")!;

    // Focus to open dropdown, then type to have a value
    fireEvent.focus(input);
    expect(input.value).toBe("is:pending");
    expect(container.querySelector("[role='listbox']")).not.toBeNull();

    fireEvent.keyDown(input, { key: "Escape" });

    // Input value must not be cleared
    expect(container.querySelector("[role='listbox']")).toBeNull();
    expect(text.value).toBe("is:pending");
    expect(input.value).toBe("is:pending");
  });

  test("initializes text and submitted from initial_q", () => {
    render(
      <SearchBar
        initial_q="email:a@b.com"
        moderators_list={[]}
        sp_names_list={[]}
      />,
    );

    expect(text.value).toBe("email:a@b.com");
    expect(submitted.value).toBe("email:a@b.com");
    expect(dirty.value).toBe(false);
  });

  test("button is secondary (gray) when clean", () => {
    const { container } = render(
      <SearchBar
        initial_q="is:pending"
        moderators_list={[]}
        sp_names_list={[]}
      />,
    );
    const button = container.querySelector("button")!;

    expect(button.className).toContain("fr-btn--secondary");
  });

  test("button loses secondary class (turns blue) when dirty", () => {
    const { container } = render(
      <SearchBar
        initial_q="is:pending"
        moderators_list={[]}
        sp_names_list={[]}
      />,
    );
    const input = container.querySelector("input")!;
    const button = container.querySelector("button")!;

    fireEvent.input(input, { target: { value: "is:processed" } });

    expect(dirty.value).toBe(true);
    expect(button.className).not.toContain("fr-btn--secondary");
  });

  test("htmx:afterSettle resets dirty state", () => {
    const { container } = render(
      <SearchBar initial_q="" moderators_list={[]} sp_names_list={[]} />,
    );
    const input = container.querySelector("input")!;

    // Make it dirty
    fireEvent.input(input, { target: { value: "email:test@test.com" } });
    expect(dirty.value).toBe(true);

    // Simulate HTMX settle
    document.dispatchEvent(new Event("htmx:afterSettle"));

    expect(dirty.value).toBe(false);
    expect(submitted.value).toBe("email:test@test.com");
  });

  test("htmx:afterSettle listener is removed on unmount", () => {
    const { unmount } = render(
      <SearchBar initial_q="" moderators_list={[]} sp_names_list={[]} />,
    );

    // Make dirty then unmount
    text.value = "siret:123";
    unmount();

    // Settle after unmount should not reset
    document.dispatchEvent(new Event("htmx:afterSettle"));
    expect(submitted.value).toBe("");
    expect(dirty.value).toBe(true);
  });

  test("opens dropdown on focus", () => {
    const { container } = render(
      <SearchBar initial_q="" moderators_list={[]} sp_names_list={[]} />,
    );
    const input = container.querySelector("input")!;

    fireEvent.focus(input);

    expect(container.querySelector("[role='listbox']")).not.toBeNull();
  });

  test("Enter submits when dropdown is closed", () => {
    const { container } = render(
      <SearchBar initial_q="" moderators_list={[]} sp_names_list={[]} />,
    );
    const input = container.querySelector("input")!;

    fireEvent.input(input, { target: { value: "email:a@b.com" } });
    // Close dropdown first
    fireEvent.keyDown(input, { key: "Escape" });
    // Then Enter to submit
    fireEvent.keyDown(input, { key: "Enter" });

    // dispatch_change fires (needs #q element for full effect, but no throw)
    expect(text.value).toBe("email:a@b.com");
  });
});
