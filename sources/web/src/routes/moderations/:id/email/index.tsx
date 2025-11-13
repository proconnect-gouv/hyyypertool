//

import { NotFoundError } from "#src/errors";
import { get_crisp_mail } from "#src/lib/crisp";
import {
  GetCripsFromSessionId,
  GetZammadFromTicketId,
} from "#src/lib/moderations";
import { get_zammad_mail } from "#src/lib/zammad";
import type { App_Context } from "#src/middleware/context";
import { set_crisp_config } from "#src/middleware/crisp";
import { Crisp } from "#src/ui/moderations/Crisp";
import { FindCorrespondingEmail } from "#src/ui/moderations/FindCorrespondingEmail";
import { zValidator } from "@hono/zod-validator";
import { DescribedBy_Schema, Entity_Schema } from "@~/core/schema";
import { to } from "await-to-js";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match, P } from "ts-pattern";
import Zammad from "./Zammad";
import { find_moderation_for_email } from "./find_moderation_for_email.query";

//

const MAX_ARTICLE_COUNT = 3;

//

export default new Hono<App_Context>().get(
  "/",
  jsxRenderer(),
  zValidator("param", Entity_Schema),
  zValidator("query", DescribedBy_Schema),
  set_crisp_config(),
  async function GET({ render, req, var: { identite_pg, crisp_config } }) {
    const { id } = req.valid("param");
    const { describedby } = req.valid("query");

    const moderation = await find_moderation_for_email(identite_pg, id);
    const ticket_id = moderation?.ticket_id ?? "";
    const [[, zammad], [, crisp]] = await Promise.all([
      to(
        GetZammadFromTicketId({ fetch_zammad_mail: get_zammad_mail })({
          ticket_id,
          limit: MAX_ARTICLE_COUNT,
        }),
      ),
      to(
        GetCripsFromSessionId({
          crisp_config,
          fetch_crisp_mail: get_crisp_mail,
        })({
          session_id: ticket_id,
          limit: MAX_ARTICLE_COUNT,
        }),
      ),
    ]);

    if (!moderation) throw new NotFoundError("Moderation not found");

    return render(
      match({ crisp, zammad })
        .with({ crisp: P.nonNullable }, (value) => (
          <Crisp.Provider
            value={{ crisp_config, limit: 3, crisp: value.crisp }}
          >
            <Crisp />
          </Crisp.Provider>
        ))
        .with({ zammad: P.nonNullable }, (value) => (
          <Zammad
            describedby={describedby}
            zammad={value.zammad}
            max_article_count={MAX_ARTICLE_COUNT}
          />
        ))
        .otherwise(() => (
          <FindCorrespondingEmail
            email={moderation.user.email}
            website_id={crisp_config.website_id}
          />
        )),
    );
  },
);
