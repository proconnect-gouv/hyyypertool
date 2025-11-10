import { fetch_zammad_api } from "./fetch";
import type { Article } from "./types";

export async function get_zammad_mail({ ticket_id }: { ticket_id: number }) {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/ticket_articles/by_ticket/${ticket_id}`,
    method: "GET",
    searchParams: {
      page: String(1),
      per_page: String(1),
      sort_by: "created_at",
      order_by: "desc",
    },
  });

  return response.json() as Promise<Article[]>;
}

export type get_zammad_mail_dto = Awaited<ReturnType<typeof get_zammad_mail>>;
