//

import { Main_Layout } from "#src/layouts";
import { authorized, editor_guard } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { schema } from "@~/hyyyperbase";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import DetailPage from "./detail.page";
import { get_response_template } from "./get_response_template.query";
import { get_response_templates } from "./get_response_templates.query";
import Page from "./page";

//

const TemplateFormSchema = z.object({
  label: z.string().trim().min(1),
  content: z.string().trim().min(1),
  end_user_reason: z.string().trim().min(1),
  allow_editing: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

//

export default new Hono<AppContext>()
  .use(authorized())
  .get(
    "/",
    jsxRenderer(Main_Layout),
    async function GET({ render, set, req, var: { hyyyper_pg, hyyyper_user } }) {
      set("page_title", "Templates de réponse");
      const searchQuery = req.query("q") ?? "";
      const templates = await get_response_templates(hyyyper_pg, searchQuery);
      const is_editor = hyyyper_user.role !== "visitor";
      return render(
        <Page templates={templates} searchQuery={searchQuery} is_editor={is_editor} />,
      );
    },
  )
  .get(
    "/new",
    jsxRenderer(Main_Layout),
    function GET({ render, set, var: { hyyyper_user } }) {
      set("page_title", "Nouveau template");
      const is_editor = hyyyper_user.role !== "visitor";
      return render(<DetailPage is_editor={is_editor} />);
    },
  )
  .get(
    "/:id",
    jsxRenderer(Main_Layout),
    async function GET({ render, set, req, var: { hyyyper_pg, hyyyper_user }, notFound }) {
      const id = parseInt(req.param("id"), 10);
      if (isNaN(id)) return notFound();

      const template = await get_response_template(hyyyper_pg, id);
      if (!template) return notFound();

      set("page_title", template.label);
      const status =
        req.query("status") === "created" ? ("created" as const) : undefined;
      const is_editor = hyyyper_user.role !== "visitor";
      return render(<DetailPage template={template} status={status} is_editor={is_editor} />);
    },
  )
  .use(editor_guard())
  .post(
    "/",
    zValidator("form", TemplateFormSchema),
    async function POST({ req, redirect, var: { hyyyper_pg } }) {
      const { label, content, end_user_reason, allow_editing } =
        req.valid("form");
      const [inserted] = await hyyyper_pg
        .insert(schema.response_templates)
        .values({ label, content, end_user_reason, allow_editing })
        .returning({ id: schema.response_templates.id });
      return redirect(
        `/response-templates/${inserted!.id}?status=created`,
        303,
      );
    },
  )
  .patch(
    "/:id",
    zValidator("form", TemplateFormSchema),
    async function PATCH({ req, text, var: { hyyyper_pg } }) {
      const id = parseInt(req.param("id"), 10);
      const { label, content, end_user_reason, allow_editing } =
        req.valid("form");
      await hyyyper_pg
        .update(schema.response_templates)
        .set({
          label,
          content,
          end_user_reason,
          allow_editing,
          updated_at: new Date(),
        })
        .where(eq(schema.response_templates.id, id));
      return text("", 200, {
        "HX-Reswap": "none",
        "HX-Trigger": JSON.stringify({
          notify: { variant: "success", title: "Template mis à jour !" },
        }),
      });
    },
  )
  .delete("/:id", async function DELETE({ req, var: { hyyyper_pg } }) {
    const id = parseInt(req.param("id"), 10);
    await hyyyper_pg
      .delete(schema.response_templates)
      .where(eq(schema.response_templates.id, id));
    return new Response(null, {
      status: 200,
      headers: { "HX-Redirect": "/response-templates" },
    });
  });
