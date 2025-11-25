//

import { get_zammad_attachment } from "#src/lib/zammad";
import { zValidator } from "@hono/zod-validator";
import { IdSchema } from "@~/core/schema";
import { Hono } from "hono";
import { P, match } from "ts-pattern";
import { z } from "zod/v4";

//

export default new Hono()
  .get(
    "/attachment/:ticket_id/:article_id/:attachment_id",
    zValidator(
      "param",
      z.object({
        article_id: IdSchema,
        attachment_id: IdSchema,
        ticket_id: IdSchema,
      }),
    ),
    async ({ req }) => {
      const { article_id, attachment_id, ticket_id } = req.valid("param");
      const image = await get_zammad_attachment({
        article_id,
        attachment_id,
        ticket_id,
      });

      return new Response(image.body);
    },
  )
  .onError((err, { notFound }) => {
    return match(err)
      .with(P.instanceOf(TypeError), P.instanceOf(SyntaxError), () => {
        return notFound();
      })
      .otherwise(() => {
        throw err;
      });
  });
