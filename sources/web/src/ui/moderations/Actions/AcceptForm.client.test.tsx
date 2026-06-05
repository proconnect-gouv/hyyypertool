/* @jsxImportSource preact */
import { MODERATION_EVENTS } from "#src/lib/moderations/event";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { afterAll, afterEach, beforeAll, expect, mock, test } from "bun:test";
import { AcceptForm } from "./AcceptForm.client";
import { toolbar_open } from "./toolbar-modal.signal";

//

beforeAll(() => {
  GlobalRegistrator.register();
});

afterEach(() => {
  toolbar_open.value = null;
  cleanup();
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

const default_props = {
  moderation_id: 1,
  domain: "example.com",
  given_name: "Adora",
  user_email: "adora@example.com",
  organization_name: "Example Org",
  moderation_type: "organization_join_block",
};

//

test("modal is hidden when toolbar_open is null", () => {
  toolbar_open.value = null;
  const { container } = render(<AcceptForm {...default_props} />);
  const modal = container.querySelector(
    "[aria-label='la modale de validation']",
  );
  expect(modal?.classList.contains("hidden")).toBe(true);
});

test("modal is visible when toolbar_open is 'accept'", () => {
  toolbar_open.value = "accept";
  const { container } = render(<AcceptForm {...default_props} />);
  const modal = container.querySelector(
    "[aria-label='la modale de validation']",
  );
  expect(modal?.classList.contains("hidden")).toBe(false);
});

test("close button sets toolbar_open to null", () => {
  toolbar_open.value = "accept";
  const { container } = render(<AcceptForm {...default_props} />);
  const close = container.querySelector(
    "button[type='button']",
  ) as HTMLButtonElement;
  fireEvent.click(close);
  expect(toolbar_open.value).toBeNull();
});

test("submitting without add_member shows field error", async () => {
  toolbar_open.value = "accept";
  const { container } = render(<AcceptForm {...default_props} />);

  // Uncheck the controlled radio so add_member is absent from FormData
  (
    container.querySelector("input[value='AS_INTERNAL']") as HTMLInputElement
  ).checked = false;

  const form = container.querySelector("form") as HTMLFormElement;
  fireEvent.submit(form);

  await waitFor(() => {
    expect(container.textContent).toContain(
      "Veuillez sélectionner un type de membre.",
    );
  });
});

test("successful submit closes modal and dispatches MODERATION_UPDATED", async () => {
  toolbar_open.value = "accept";
  globalThis.fetch = mock().mockResolvedValue({
    ok: true,
  }) as unknown as typeof fetch;

  const dispatched: string[] = [];
  document.body.addEventListener(
    MODERATION_EVENTS.enum.MODERATION_UPDATED,
    () => dispatched.push(MODERATION_EVENTS.enum.MODERATION_UPDATED),
  );

  const { container } = render(<AcceptForm {...default_props} />);
  const form = container.querySelector("form") as HTMLFormElement;
  fireEvent.submit(form);

  await waitFor(() => {
    expect(toolbar_open.value).toBeNull();
    expect(dispatched).toHaveLength(1);
  });
});

test("non-ok response dispatches notify danger event", async () => {
  toolbar_open.value = "accept";
  globalThis.fetch = mock().mockResolvedValue({
    ok: false,
    status: 500,
  }) as unknown as typeof fetch;

  const notified: CustomEvent[] = [];
  window.addEventListener("notify", (e) => notified.push(e as CustomEvent));

  const { container } = render(<AcceptForm {...default_props} />);
  const form = container.querySelector("form") as HTMLFormElement;
  fireEvent.submit(form);

  await waitFor(() => {
    expect(notified).toHaveLength(1);
    expect(notified[0]!.detail.variant).toBe("danger");
  });
});

test("network error dispatches notify danger event", async () => {
  toolbar_open.value = "accept";
  globalThis.fetch = mock().mockRejectedValue(
    new Error("network failure"),
  ) as unknown as typeof fetch;

  const notified: CustomEvent[] = [];
  window.addEventListener("notify", (e) => notified.push(e as CustomEvent));

  const { container } = render(<AcceptForm {...default_props} />);
  const form = container.querySelector("form") as HTMLFormElement;
  fireEvent.submit(form);

  await waitFor(() => {
    expect(notified).toHaveLength(1);
    expect(notified[0]!.detail.variant).toBe("danger");
  });
});
