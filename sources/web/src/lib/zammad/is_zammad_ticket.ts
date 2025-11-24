//

import { z } from "zod/v4";

//

export function is_zammad_ticket(ticket_id: string | number) {
  return z.coerce.number().safeParse(ticket_id).success;
}
