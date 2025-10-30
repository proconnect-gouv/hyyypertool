//

import { Main_Layout } from "#src/layouts";
import { authorized } from "#src/middleware/auth/authorized";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { PageQuery_Schema, type ContextType } from "./context.ts";
import Page from "./page.tsx";
//

export default new Hono<ContextType>().use(authorized()).get(
  "/",
  jsxRenderer(Main_Layout),
  zValidator("query", PageQuery_Schema),

  function GET({ render, set }) {
    set("page_title", "Délivrabilité des domaines");
    return render(<Page />);
  },
);
