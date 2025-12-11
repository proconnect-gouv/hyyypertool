/**
 * ProcessedCheckbox Island Component (Server-side)
 *
 * Renders a checkbox that auto-checks when search inputs have content
 */

import { createIsland } from "../../lib/create-island";
import {
  ProcessedCheckbox,
  type ProcessedCheckboxProps,
} from "./processed-checkbox.client";

//

export const ProcessedCheckboxIsland = createIsland<ProcessedCheckboxProps>({
  component: ProcessedCheckbox,
  clientPath: "/src/routes/moderations/processed-checkbox.client.js",
  mode: "hydrate",
  exportName: "ProcessedCheckbox",
  tagName: "x-processed-checkbox-island",
  rootTagName: "x-processed-checkbox-root",
});
