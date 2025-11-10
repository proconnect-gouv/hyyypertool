//

import { fetch_zammad_api } from "./fetch";

//

export async function get_zammad_attachment({
  article_id,
  attachment_id,
  ticket_id,
}: {
  article_id: number;
  attachment_id: number;
  ticket_id: number;
}) {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/ticket_attachment/${ticket_id}/${article_id}/${attachment_id}`,
    method: "GET",
    searchParams: {},
  });

  return response;
}
