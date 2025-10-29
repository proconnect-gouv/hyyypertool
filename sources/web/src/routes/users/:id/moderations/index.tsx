//

import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { set_variables } from "@~/app.middleware/context/set_variables";
import { DescribedBy_Schema, Entity_Schema } from "@~/core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { loadModerationsPageVariables } from "./context";
import { Table } from "./Table";

//

export default new Hono<App_Context>().use("/", jsxRenderer()).get(
  "/",
  zValidator("param", Entity_Schema),
  zValidator("query", DescribedBy_Schema),
  async function set_variables_middleware(
    { req, set, var: { identite_pg } },
    next,
  ) {
    const { id: user_id } = req.valid("param");
    const { describedby } = req.valid("query");
    set_variables(
      set,
      await loadModerationsPageVariables(identite_pg, {
        describedby,
        user_id,
      }),
    );
    return next();
  },
  async function GET({ render }) {
    return render(<Table />);
  },
);
