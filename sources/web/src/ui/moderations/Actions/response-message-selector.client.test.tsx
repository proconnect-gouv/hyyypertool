/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { afterAll, afterEach, beforeAll, expect, mock, test } from "bun:test";
import { ResponseMessageSelectorClient } from "./response-message-selector.client";

//

beforeAll(() => {
  GlobalRegistrator.register();
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

const templates = [
  {
    id: 1,
    label: "Adresse email invalide",
    end_user_reason: "",
    allow_editing: false,
  },
  {
    id: 2,
    label: "Organisation inconnue",
    end_user_reason: "",
    allow_editing: false,
  },
  { id: 3, label: "Doublon", end_user_reason: "", allow_editing: false },
];

//

test("renders template labels as datalist options", () => {
  const { container } = render(
    <ResponseMessageSelectorClient
      moderation_id={42}
      response_templates={templates}
    />,
  );

  const options = Array.from(container.querySelectorAll("datalist option"));
  const labels = options.map((o) => o.getAttribute("value"));

  expect(labels).toEqual([
    "Adresse email invalide",
    "Organisation inconnue",
    "Doublon",
  ]);
});

test("selecting a template fetches its rendered message by id", async () => {
  const mock_fetch = mock().mockResolvedValue({
    ok: true,
    text: async () => "rendered content",
  });
  globalThis.fetch = mock_fetch as unknown as typeof fetch;

  const { container } = render(
    <ResponseMessageSelectorClient
      moderation_id={42}
      response_templates={templates}
    />,
  );

  const input = container.querySelector(
    "input[type=search]",
  ) as HTMLInputElement;

  input.value = "Organisation inconnue";
  fireEvent.input(input);

  await waitFor(() => expect(mock_fetch).toHaveBeenCalledTimes(1));
  expect(mock_fetch).toHaveBeenCalledWith("/moderations/42/rejected/reason/2");
});

test("selecting a template whose label has surrounding spaces still fetches by id", async () => {
  const mock_fetch = mock().mockResolvedValue({
    ok: true,
    text: async () => "rendered content",
  });
  globalThis.fetch = mock_fetch as unknown as typeof fetch;

  const { container } = render(
    <ResponseMessageSelectorClient
      moderation_id={42}
      response_templates={[
        {
          id: 7,
          label: "  Doublon  ",
          end_user_reason: "",
          allow_editing: false,
        },
      ]}
    />,
  );

  const input = container.querySelector(
    "input[type=search]",
  ) as HTMLInputElement;

  input.value = "Doublon";
  fireEvent.input(input);

  await waitFor(() => expect(mock_fetch).toHaveBeenCalledTimes(1));
  expect(mock_fetch).toHaveBeenCalledWith("/moderations/42/rejected/reason/7");
});

test("selecting a value not in the list does not fetch", async () => {
  const mock_fetch = mock().mockResolvedValue({
    ok: true,
    text: async () => "",
  });
  globalThis.fetch = mock_fetch as unknown as typeof fetch;

  const { container } = render(
    <ResponseMessageSelectorClient
      moderation_id={42}
      response_templates={templates}
    />,
  );

  const input = container.querySelector(
    "input[type=search]",
  ) as HTMLInputElement;

  fireEvent.change(input, { target: { value: "Organisation" } });

  expect(mock_fetch).not.toHaveBeenCalled();
});

test("clearing the input does not fetch", async () => {
  const mock_fetch = mock().mockResolvedValue({
    ok: true,
    text: async () => "",
  });
  globalThis.fetch = mock_fetch as unknown as typeof fetch;

  const { container } = render(
    <ResponseMessageSelectorClient
      moderation_id={42}
      response_templates={templates}
    />,
  );

  const input = container.querySelector(
    "input[type=search]",
  ) as HTMLInputElement;

  fireEvent.change(input, { target: { value: "" } });

  expect(mock_fetch).not.toHaveBeenCalled();
});
