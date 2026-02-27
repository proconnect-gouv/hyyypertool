import { createIsland } from "../../../lib/create-island";
import { TemplateEditor } from "./template-editor.client";

export const TemplateEditorIsland = createIsland({
  component: TemplateEditor,
  clientPath: "/src/ui/moderations/TemplateEditor/template-editor.client.js",
  mode: "hydrate",
  tagName: "x-template-editor-island",
  rootTagName: "x-template-editor-root",
});
