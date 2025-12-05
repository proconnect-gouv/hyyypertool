/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup, render, waitFor } from "@testing-library/preact";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  test,
} from "bun:test";
import { CopyButtonClient } from "./copy.client";

//

beforeAll(() => {
  GlobalRegistrator.register();
});

beforeEach(async () => {
  // Clear clipboard between tests
  await window.navigator.clipboard.writeText("");
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

test("renders with children", () => {
  const { container } = render(
    <CopyButtonClient className="test-class" text="Hello">
      Copy
    </CopyButtonClient>,
  );

  expect(container.textContent).toContain("Copy");
  expect(container.querySelector("button")).not.toBeNull();
});

test("copies text to clipboard when clicked", async () => {
  const { container } = render(
    <CopyButtonClient className="test-class" text="Hello World">
      Copy
    </CopyButtonClient>,
  );

  expect(await window.navigator.clipboard.readText()).toBe("");

  const button = container.querySelector("button")!;
  button.click();

  await waitFor(async () => {
    expect(await window.navigator.clipboard.readText()).toBe("Hello World");
  });
});

test("shows check icon after copying", async () => {
  const { container } = render(
    <CopyButtonClient className="test-class" text="Test">
      Copy
    </CopyButtonClient>,
  );

  const clipboardIcon = container.querySelector(".fr-icon-clipboard-line")!;
  const checkIcon = container.querySelector(".fr-icon-check-line")!;

  // Initially clipboard icon visible, check icon hidden
  expect(clipboardIcon.classList.contains("hidden")).toBe(false);
  expect(checkIcon.classList.contains("hidden")).toBe(true);

  const button = container.querySelector("button")!;
  button.click();

  await waitFor(() => {
    // After click, clipboard icon hidden, check icon visible
    expect(clipboardIcon.classList.contains("hidden")).toBe(true);
    expect(checkIcon.classList.contains("hidden")).toBe(false);
  });
});

test("reverts icon after 1 second", async () => {
  const { container } = render(
    <CopyButtonClient className="test-class" text="Test">
      Copy
    </CopyButtonClient>,
  );

  const clipboardIcon = container.querySelector(".fr-icon-clipboard-line")!;
  const checkIcon = container.querySelector(".fr-icon-check-line")!;

  const button = container.querySelector("button")!;
  button.click();

  // Wait for check icon to appear
  await waitFor(() => {
    expect(checkIcon.classList.contains("hidden")).toBe(false);
  });

  // Wait for revert (1000ms + buffer)
  await new Promise((resolve) => setTimeout(resolve, 1100));

  // Should revert to clipboard icon
  expect(clipboardIcon.classList.contains("hidden")).toBe(false);
  expect(checkIcon.classList.contains("hidden")).toBe(true);
});

test("dispatches notify event on copy", async () => {
  const { container } = render(
    <CopyButtonClient className="test-class" text="Notification Test">
      Copy
    </CopyButtonClient>,
  );

  let eventFired = false;
  let eventDetail: any = null;

  window.addEventListener("notify", ((event: CustomEvent) => {
    eventFired = true;
    eventDetail = event.detail;
  }) as EventListener);

  const button = container.querySelector("button")!;
  button.click();

  await waitFor(() => {
    expect(eventFired).toBe(true);
  });

  expect(eventDetail).toEqual({
    variant: "success",
    title: "Copié !",
    message: "Notification Test",
  });
});

test("does not copy if text is empty", async () => {
  const { container } = render(
    <CopyButtonClient className="test-class" text="">
      Copy
    </CopyButtonClient>,
  );

  expect(await window.navigator.clipboard.readText()).toBe("");

  const button = container.querySelector("button")!;
  button.click();

  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Should still be empty
  expect(await window.navigator.clipboard.readText()).toBe("");
});

test("applies className prop", () => {
  const { container } = render(
    <CopyButtonClient className="custom-class another-class" text="Test">
      Copy
    </CopyButtonClient>,
  );

  const button = container.querySelector("button")!;
  expect(button.className).toContain("custom-class");
  expect(button.className).toContain("another-class");
});
