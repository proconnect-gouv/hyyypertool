/* @jsxImportSource preact */
import { MODERATION_EVENTS } from "#src/lib/moderations/event";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { afterAll, afterEach, beforeAll, expect, mock, test } from "bun:test";
import { RefusalForm } from "./RefusalForm.client";
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

const now = new Date();
const templates = [
  {
    id: 1,
    label: "Adresse email invalide",
    end_user_reason: "Adresse invalide",
    allow_editing: false,
    content: "",
    created_at: now,
    updated_at: now,
  },
];

const default_props = {
  moderation_id: 1,
  user_email: "adora@example.com",
  organization_name: "Example Org",
  response_templates: templates,
};

//

test("modal is hidden when toolbar_open is null", () => {
  toolbar_open.value = null;
  const { container } = render(<RefusalForm {...default_props} />);
  const modal = container.querySelector("[aria-label='la modale de refus']");
  expect(modal?.classList.contains("hidden")).toBe(true);
});

test("modal is visible when toolbar_open is 'refusal'", () => {
  toolbar_open.value = "refusal";
  const { container } = render(<RefusalForm {...default_props} />);
  const modal = container.querySelector("[aria-label='la modale de refus']");
  expect(modal?.classList.contains("hidden")).toBe(false);
});

test("close button sets toolbar_open to null", () => {
  toolbar_open.value = "refusal";
  const { container } = render(<RefusalForm {...default_props} />);
  const close = container.querySelector(
    "button[type='button']",
  ) as HTMLButtonElement;
  fireEvent.click(close);
  expect(toolbar_open.value).toBeNull();
});

test("submitting with empty message shows field error", async () => {
  toolbar_open.value = "refusal";
  const { container } = render(<RefusalForm {...default_props} />);
  const form = container.querySelector("form") as HTMLFormElement;
  fireEvent.submit(form);

  await waitFor(() => {
    expect(container.textContent).toContain("Le message est obligatoire.");
  });
});

test("submitting without end_user_reason shows field error", async () => {
  toolbar_open.value = "refusal";
  const { container } = render(<RefusalForm {...default_props} />);

  const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
  textarea.value = "Un message de refus.";

  const form = container.querySelector("form") as HTMLFormElement;
  fireEvent.submit(form);

  await waitFor(() => {
    expect(container.textContent).toContain(
      "Veuillez sélectionner un motif de refus.",
    );
  });
});

test("successful submit closes modal and dispatches MODERATION_UPDATED", async () => {
  toolbar_open.value = "refusal";

  globalThis.fetch = mock()
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve("Email template content"),
      }),
    )
    .mockResolvedValue({ ok: true }) as unknown as typeof fetch;

  const dispatched: string[] = [];
  document.body.addEventListener(
    MODERATION_EVENTS.enum.MODERATION_UPDATED,
    () => dispatched.push(MODERATION_EVENTS.enum.MODERATION_UPDATED),
  );

  const { container } = render(<RefusalForm {...default_props} />);
  const search_input = container.querySelector(
    "input[type='search']",
  ) as HTMLInputElement;
  search_input.value = "Adresse email invalide";
  fireEvent.input(search_input);
  const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
  await waitFor(() => expect(textarea.value).not.toBe(""));

  fireEvent.submit(container.querySelector("form") as HTMLFormElement);

  await waitFor(() => {
    expect(toolbar_open.value).toBeNull();
    expect(dispatched).toHaveLength(1);
  });
});

test("non-ok response dispatches notify danger event", async () => {
  toolbar_open.value = "refusal";

  globalThis.fetch = mock()
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve("Email template content"),
      }),
    )
    .mockResolvedValue({ ok: false, status: 422 }) as unknown as typeof fetch;

  const notified: CustomEvent[] = [];
  window.addEventListener("notify", (e) => notified.push(e as CustomEvent));

  const { container } = render(<RefusalForm {...default_props} />);
  const search_input = container.querySelector(
    "input[type='search']",
  ) as HTMLInputElement;
  search_input.value = "Adresse email invalide";
  fireEvent.input(search_input);
  const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
  await waitFor(() => expect(textarea.value).not.toBe(""));

  fireEvent.submit(container.querySelector("form") as HTMLFormElement);

  await waitFor(() => {
    expect(notified).toHaveLength(1);
    expect(notified[0]!.detail.variant).toBe("danger");
  });
});
