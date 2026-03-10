//

import type { AppContext } from "#src/middleware/context";
import { DescribedBySchema, EntitySchema } from "#src/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { get_moderations_by_user_id } from "./get_moderations_by_user_id.query";
import { Table } from "./Table";

//

export default new Hono<AppContext>()
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
