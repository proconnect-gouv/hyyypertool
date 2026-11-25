//

import { NotFoundError } from "#src/errors";
import {
  CrispOutgoingMessageTypeSchema,
  parse_ticket_id,
} from "#src/lib/crisp";
import {
  get_crisp_conversation,
  get_crisp_messages,
  type CrispMessagesPage,
} from "#src/lib/moderations";
import type { AppContext } from "#src/middleware/context";
import { DescribedBySchema, EntitySchema } from "#src/schema";
import { Crisp, CrispMessages, message_run } from "#src/ui/moderations/Crisp";
import { FindCorrespondingEmail } from "#src/ui/moderations/FindCorrespondingEmail";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { to } from "await-to-js";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import { find_moderation_for_email } from "./find_moderation_for_email.query";

//

export default new Hono<AppContext>()
  .get(
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
      const ticket = parse_ticket_id(moderation.ticket_id);
      if (ticket.kind === "no_crisp_session") {
        return render(
          <FindCorrespondingEmail
            describedby={describedby}
            website_id={website_id}
          />,
        );
      }

      const [error, conversation] = await to(
        get_crisp_conversation(crisp, { session_id: ticket.session_id }),
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
          older={older_messages_request(
            id,
            conversation.page,
            config.CRISP_PLUGIN_URN,
          )}
          plugin_urn={config.CRISP_PLUGIN_URN}
          reply={{
            action: urls.moderations[":id"].email.reply.$url({ param: { id } })
              .pathname,
            moderation_id: id,
          }}
          website_id={website_id}
        />,
      );
    },
  )
  .get(
    "/older",
    jsxRenderer(),
    zValidator("param", EntitySchema),
    zValidator(
      "query",
      z.object({
        before: z.coerce.number().int().positive(),
        run: z.string(),
      }),
    ),
    async function GET({
      render,
      req,
      env: config,
      var: { crisp, identite_pg },
    }) {
      const { id } = req.valid("param");
      const { before, run } = req.valid("query");

      const moderation = await find_moderation_for_email(identite_pg, id);
      if (!moderation) throw new NotFoundError("Moderation not found");

      const ticket = parse_ticket_id(moderation.ticket_id);
      if (ticket.kind === "no_crisp_session") {
        throw new NotFoundError("Moderation has no Crisp conversation");
      }

      const page = await get_crisp_messages(crisp, {
        before,
        session_id: ticket.session_id,
      });

      return render(
        <CrispMessages
          next={{ run, timestamp: before }}
          older={older_messages_request(id, page, config.CRISP_PLUGIN_URN)}
          page={page}
          plugin_urn={config.CRISP_PLUGIN_URN}
        />,
      );
    },
  )
  .post(
    "/reply",
    zValidator("param", EntitySchema),
    zValidator(
      "form",
      z.object({
        content: z.string().trim().min(1),
        type: CrispOutgoingMessageTypeSchema,
      }),
    ),
    async function POST({ req, text, var: { crisp, identite_pg, userinfo } }) {
      const { id } = req.valid("param");
      const { content, type } = req.valid("form");

      const moderation = await find_moderation_for_email(identite_pg, id);
      if (!moderation) throw new NotFoundError("Moderation not found");

      const ticket = parse_ticket_id(moderation.ticket_id);
      if (ticket.kind === "no_crisp_session") {
        throw new NotFoundError("Moderation has no Crisp conversation");
      }

      const [, operator] = await to(crisp.get_user({ email: userinfo.email }));
      await crisp.send_message({
        content,
        session_id: ticket.session_id,
        type,
        user: operator ?? { nickname: "L'équipe ProConnect" },
      });

      return text("OK");
    },
  );

//

function older_messages_request(
  id: number,
  { messages, older }: CrispMessagesPage,
  plugin_urn: string,
) {
  const oldest = messages.at(0);
  if (!older || !oldest) return null;
  return urls.moderations[":id"].email.older.$hx_get({
    param: { id },
    query: {
      before: String(older.before),
      run: message_run(oldest, plugin_urn),
    },
  });
}
