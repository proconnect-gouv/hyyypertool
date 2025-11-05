//

import type { App_Context } from "#src/middleware/context";
import type { Crisp_Context } from "#src/middleware/crisp";
import { DescribedBy_Schema, Entity_Schema } from "@~/core/schema";
import { get_crisp_mail, is_crisp_ticket } from "@~/crisp.lib";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { get_zammad_mail } from "@~/zammad.lib/get_zammad_mail";
import { is_zammad_ticket } from "@~/zammad.lib/is_zammad_ticket";
import { to } from "await-to-js";
import { type Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { z } from "zod";
import { get_moderation_for_email } from "./get_moderation_for_email";

//

export async function load_email_page_variables(
  pg: IdentiteProconnect_PgDatabase,
  { id, crisp_config }: { id: number; crisp_config: any },
) {
  const MAX_ARTICLE_COUNT = 3;

  // Load moderation data
  const moderation = await get_moderation_for_email(pg, id);

  // Load zammad data if ticket_id exists
  if (moderation.ticket_id && is_zammad_ticket(moderation.ticket_id)) {
    const [articles_err, articles] = await to(
      get_zammad_mail({ ticket_id: Number(moderation.ticket_id) }),
    );
    const zammad_result = articles_err
      ? null
      : {
          articles,
          show_more: articles.length > MAX_ARTICLE_COUNT,
          subject: articles.at(0)?.subject ?? "",
          ticket_id: moderation.ticket_id,
        };
    return {
      MAX_ARTICLE_COUNT,
      moderation,
      zammad: zammad_result,
    };
  }

  // Load crisp data if session_id exists (using ticket_id as session_id)
  if (moderation.ticket_id && is_crisp_ticket(moderation.ticket_id)) {
    const [err_crisp, crisp] = await to(
      get_crisp_mail(crisp_config, { session_id: moderation.ticket_id }),
    );
    const crisp_result = err_crisp
      ? null
      : {
          conversation: crisp.conversation,
          messages: crisp.messages.slice(-MAX_ARTICLE_COUNT),
          session_id: moderation.ticket_id,
          show_more: crisp.messages.length > MAX_ARTICLE_COUNT,
          subject: crisp.conversation.meta.subject ?? "",
        };
    return {
      MAX_ARTICLE_COUNT,
      moderation,
      crisp: crisp_result,
    };
  }

  return {
    MAX_ARTICLE_COUNT,
    moderation,
  };
}

//

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof load_email_page_variables>>;
}
export type ContextType = App_Context & Crisp_Context & ContextVariablesType;

//

type PageInputType = {
  out: {
    param: z.input<typeof Entity_Schema>;
    query: z.input<typeof DescribedBy_Schema>;
  };
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
