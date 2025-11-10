//

import type { App_Context } from "#src/middleware/context";
import { DescribedBy_Schema, Entity_Schema } from "@~/core/schema";
import { get_crisp_mail } from "@~/crisp.lib";
import type { Crisp_Context } from "#src/middleware/crisp";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { GetCripsFromSessionId } from "#src/lib/moderations";
import { GetZammadFromTicketId } from "#src/lib/moderations";
import { GetModerationForEmail } from "@~/moderations.repository";
import { get_zammad_mail } from "@~/zammad.lib/get_zammad_mail";
import { to } from "await-to-js";
import { type Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { z } from "zod";

//

export async function load_email_page_variables(
  pg: IdentiteProconnect_PgDatabase,
  { id, crisp_config }: { id: number; crisp_config: any },
) {
  const MAX_ARTICLE_COUNT = 3;

  // Load moderation data
  const get_moderation_for_email = GetModerationForEmail(pg);
  const moderation = await get_moderation_for_email(id);

  // Load zammad data if ticket_id exists
  if (moderation.ticket_id) {
    const get_zammad_from_ticket_id = GetZammadFromTicketId({
      fetch_zammad_mail: get_zammad_mail,
    });
    const [, zammad_result] = await to(
      get_zammad_from_ticket_id({
        ticket_id: moderation.ticket_id,
        limit: MAX_ARTICLE_COUNT,
      }),
    );
    return {
      MAX_ARTICLE_COUNT,
      moderation,
      zammad: zammad_result,
    };
  }

  // Load crisp data if session_id exists (using ticket_id as session_id)
  if (moderation.ticket_id) {
    const get_crisp_from_session_id = GetCripsFromSessionId({
      crisp_config,
      fetch_crisp_mail: get_crisp_mail,
    });
    const [, crisp_result] = await to(
      get_crisp_from_session_id({
        session_id: moderation.ticket_id,
        limit: MAX_ARTICLE_COUNT,
      }),
    );
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
