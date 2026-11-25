//

import { NotFoundError } from "#src/errors";
import { parse_ticket_id } from "#src/lib/crisp";
import { get_crisp_conversation } from "#src/lib/moderations";
import type { AppContext } from "#src/middleware/context";
import { DescribedBySchema, EntitySchema } from "#src/schema";
import { Crisp } from "#src/ui/moderations/Crisp";
import { FindCorrespondingEmail } from "#src/ui/moderations/FindCorrespondingEmail";
import { zValidator } from "@hono/zod-validator";
import { to } from "await-to-js";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { find_moderation_for_email } from "./find_moderation_for_email.query";

//

const MAX_ARTICLE_COUNT = 3;

//

export default new Hono<AppContext>().get(
  "/",
  jsxRenderer(),
  zValidator("param", EntitySchema),
  zValidator("query", DescribedBySchema),
  async function GET({
    render,
    req,
    env: config,
    var: { crisp, identite_pg },
  }) {
    const { id } = req.valid("param");
    const { describedby } = req.valid("query");

    const moderation = await find_moderation_for_email(identite_pg, id);
    if (!moderation) throw new NotFoundError("Moderation not found");

    const website_id = config.CRISP_WEBSITE_ID;
    const { ticket_id } = moderation;

    const ticket = parse_ticket_id(ticket_id);
    if (ticket.kind === "no_crisp_session") {
      return render(
        <FindCorrespondingEmail
          describedby={describedby}
          website_id={website_id}
        />,
      );
    }

    const [error, conversation] = await to(
      get_crisp_conversation(crisp, {
        limit: MAX_ARTICLE_COUNT,
        session_id: ticket.session_id,
      }),
    );

    if (error) {
      consola.error(error);
      return render(
        <FindCorrespondingEmail
          describedby={describedby}
          website_id={website_id}
        />,
      );
    }

    return render(
      <Crisp
        crisp={conversation}
        describedby={describedby}
        limit={MAX_ARTICLE_COUNT}
        website_id={website_id}
      />,
    );
  },
);
