//

import { get_zammad_mail } from "#src/lib/zammad";
import { to } from "await-to-js";

//

export async function get_moderation_tickets(
  moderations: {
    id: number;
    moderated_at: string | null;
    status: string;
    ticket_id: string | null;
  }[],
) {
  return Promise.all(
    moderations.map(async (moderation) => {
      if (!moderation.ticket_id) return { moderation };
      const ticket_id = Number(moderation.ticket_id);
      const [, zammad_ticket] = await to(get_zammad_mail({ ticket_id }));
      return { moderation, zammad_ticket };
    }),
  );
}
