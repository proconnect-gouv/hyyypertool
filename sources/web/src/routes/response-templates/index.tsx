//

import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth";
import type { App_Context } from "#src/middleware/context";
import {
  getTemplatesMetadata,
  loadTemplates,
} from "#src/ui/moderations/TemplateEditor";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import DetailPage from "./detail.page";
import Page from "./page";

//

export default new Hono<App_Context>()
  .use(authorized())
  .get("/", jsxRenderer(Main_Layout), async function GET({ render, set, req }) {
    set("page_title", "Templates de réponse");
    const templates = await loadTemplates();
    const searchQuery = req.query("q") ?? "";

    return render(
      <Page
        templates={getTemplatesMetadata(templates)}
        searchQuery={searchQuery}
      />,
    );
  })
  .get(
    "/:id",
    jsxRenderer(Main_Layout),
    async function GET({ render, set, req, var: { nonce }, notFound }) {
      const id = req.param("id");
      const templates = await loadTemplates();
      const template = templates.find((t) => t.id === id);

      if (!template) {
        return notFound();
      }

      set("page_title", template.label);
      return render(<DetailPage nonce={nonce} template={template} />);
    },
  );
