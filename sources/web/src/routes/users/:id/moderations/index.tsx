//

import type { App_Context } from "#src/middleware/context";
import { zValidator } from "@hono/zod-validator";
import { DescribedBySchema, EntitySchema } from "@~/core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { get_moderations_by_user_id } from "./get_moderations_by_user_id.query";
import { Table } from "./Table";

//

export default new Hono<App_Context>()
  .use("/", jsxRenderer())
  .get(
    "/",
    zValidator("param", EntitySchema),
    zValidator("query", DescribedBySchema),
    async function GET({ render, req, var: { identite_pg } }) {
      const { id: user_id } = req.valid("param");
      const { describedby } = req.valid("query");
      const moderations = await get_moderations_by_user_id(
        identite_pg,
        user_id,
      );

      return render(
        <Table describedby={describedby} moderations={moderations} />,
      );
    },
  );
