/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup, render, waitFor, within } from "@testing-library/preact";
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
