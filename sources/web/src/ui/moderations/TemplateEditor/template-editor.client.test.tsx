/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/preact";
import { afterAll, afterEach, beforeAll, expect, test } from "bun:test";
import { TemplateEditor } from "./template-editor.client";

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

test("renders with default empty values", () => {
  const { getByRole, getByLabelText } = render(<TemplateEditor />);

  const titleInput = getByLabelText("Titre du template") as HTMLInputElement;
  const editorPanel = getByRole("tabpanel", { name: "Modifier" });
  const textarea = within(editorPanel).getByRole(
    "textbox",
  ) as HTMLTextAreaElement;

  expect(titleInput.value).toBe("");
  expect(textarea.value).toBe("");
});

test("renders with initial template and label", () => {
  const { getByRole, getByLabelText } = render(
    <TemplateEditor
      initialTemplate="Hello ${ given_name }"
      initialLabel="Welcome Email"
    />,
  );

  const titleInput = getByLabelText("Titre du template") as HTMLInputElement;
  const editorPanel = getByRole("tabpanel", { name: "Modifier" });
  const textarea = within(editorPanel).getByRole(
    "textbox",
  ) as HTMLTextAreaElement;

  expect(titleInput.value).toBe("Welcome Email");
  expect(textarea.value).toBe("Hello ${ given_name }");
});

test("switches between editor and preview tabs", async () => {
  const { getByRole } = render(
    <TemplateEditor initialTemplate="Test content" />,
  );

  const editorTab = getByRole("tab", { name: "Modifier" });
  const previewTab = getByRole("tab", { name: "Apercu" });

  // Initially editor tab is selected
  expect(editorTab.getAttribute("aria-selected")).toBe("true");
  expect(previewTab.getAttribute("aria-selected")).toBe("false");

  // Click preview tab
  previewTab.click();

  await waitFor(() => {
    expect(editorTab.getAttribute("aria-selected")).toBe("false");
    expect(previewTab.getAttribute("aria-selected")).toBe("true");
  });

  // Click back to editor tab
  editorTab.click();

  await waitFor(() => {
    expect(editorTab.getAttribute("aria-selected")).toBe("true");
    expect(previewTab.getAttribute("aria-selected")).toBe("false");
  });
});

test("updates title input value", async () => {
  const { getByLabelText } = render(<TemplateEditor />);

  const titleInput = getByLabelText("Titre du template") as HTMLInputElement;

  // Simulate input
  titleInput.value = "New Title";
  titleInput.dispatchEvent(new Event("input", { bubbles: true }));

  await waitFor(() => {
    expect(titleInput.value).toBe("New Title");
  });
});

test("renders variable insertion buttons", () => {
  const { getByRole } = render(<TemplateEditor />);

  const editorPanel = getByRole("tabpanel", { name: "Modifier" });
  const buttons = within(editorPanel).getAllByRole("button");

  expect(buttons.length).toBeGreaterThan(0);
});

test("shows preview with rendered template", async () => {
  const { getByRole } = render(
    <TemplateEditor initialTemplate="Hello ${ given_name }" />,
  );

  const previewTab = getByRole("tab", { name: "Apercu" });
  previewTab.click();

  await waitFor(() => {
    const previewPanel = getByRole("tabpanel", { name: "Apercu" });
    expect(previewPanel.textContent).toContain("Hello");
  });
});

test("shows content error when submitting with empty content", async () => {
  const { container, findByText } = render(
    <form>
      <TemplateEditor initialLabel="My Template" />
    </form>,
  );

  container
    .querySelector("form")!
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

  expect(await findByText("Le contenu ne peut pas être vide")).toBeTruthy();
});

test("shows label error when submitting with empty label", async () => {
  const { container, findByText } = render(
    <form>
      <TemplateEditor initialTemplate="Some content" />
    </form>,
  );

  container
    .querySelector("form")!
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

  expect(await findByText("Le titre ne peut pas être vide")).toBeTruthy();
});

test("shows both errors when submitting with empty label and content", async () => {
  const { container, findByText } = render(
    <form>
      <TemplateEditor />
    </form>,
  );

  container
    .querySelector("form")!
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

  expect(await findByText("Le titre ne peut pas être vide")).toBeTruthy();
  expect(await findByText("Le contenu ne peut pas être vide")).toBeTruthy();
});

test("clears content error when user types in textarea", async () => {
  const { container, findByText, queryByText, getByRole } = render(
    <form>
      <TemplateEditor initialLabel="My Template" />
    </form>,
  );

  container
    .querySelector("form")!
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

  await findByText("Le contenu ne peut pas être vide");

  const textarea = within(
    getByRole("tabpanel", { name: "Modifier" }),
  ).getByRole("textbox") as HTMLTextAreaElement;
  fireEvent.change(textarea, { target: { value: "Some content" } });

  await waitFor(
    () => {
      expect(queryByText("Le contenu ne peut pas être vide")).toBeNull();
    },
    { timeout: 500 },
  );
});

test("clears label error when user types in title input", async () => {
  const { container, findByText, queryByText, getByLabelText } = render(
    <form>
      <TemplateEditor initialTemplate="Some content" />
    </form>,
  );

  container
    .querySelector("form")!
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

  await findByText("Le titre ne peut pas être vide");

  const titleInput = getByLabelText("Titre du template") as HTMLInputElement;
  fireEvent.input(titleInput, { target: { value: "My Title" } });

  await waitFor(
    () => {
      expect(queryByText("Le titre ne peut pas être vide")).toBeNull();
    },
    { timeout: 500 },
  );
});
