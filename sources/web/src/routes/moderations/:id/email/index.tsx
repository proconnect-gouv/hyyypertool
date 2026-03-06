//

import { NotFoundError } from "#src/errors";
import { get_crisp_mail } from "#src/lib/crisp";
import { GetCripsFromSessionId } from "#src/lib/moderations";
import type { AppContext } from "#src/middleware/context";
import { DescribedBySchema, EntitySchema } from "#src/schema";
import { Crisp } from "#src/ui/moderations/Crisp";
import { FindCorrespondingEmail } from "#src/ui/moderations/FindCorrespondingEmail";
import { zValidator } from "@hono/zod-validator";
import { to } from "await-to-js";
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
  async function GET({ render, req, env: config, var: { identite_pg } }) {
    const { id } = req.valid("param");
    const { describedby } = req.valid("query");

    const moderation = await find_moderation_for_email(identite_pg, id);
    const ticket_id = moderation?.ticket_id ?? "";

    const crisp_config = {
      base_url: config.CRISP_BASE_URL,
      identifier: config.CRISP_IDENTIFIER,
      key: config.CRISP_KEY,
      plugin_urn: config.CRISP_PLUGIN_URN,
      user_nickname: config.CRISP_USER_NICKNAME,
      website_id: config.CRISP_WEBSITE_ID,
      debug: false,
    };

    const [, crisp] = await to(
      GetCripsFromSessionId({
        crisp_config,
        fetch_crisp_mail: get_crisp_mail,
      })({
        session_id: ticket_id,
        limit: MAX_ARTICLE_COUNT,
      }),
    );

    if (!moderation) throw new NotFoundError("Moderation not found");

    if (crisp) {
      return render(
        <Crisp.Provider value={{ crisp_config, limit: 3, crisp }}>
          <Crisp />
        </Crisp.Provider>,
      );
    }

    return render(
      <FindCorrespondingEmail website_id={crisp_config.website_id} />,
    );
  },
);
