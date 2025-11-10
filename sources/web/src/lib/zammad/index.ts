//

export * from "./const";
export * from "./fetch";
export * from "./get_zammad_attachment";
export * from "./get_zammad_mail";
export * from "./is_zammad_ticket";
export * from "./types";

// Re-export main API functions
import { fetch_zammad_api } from "./fetch";
import type {
  NewTicket,
  SearchResult,
  Ticket,
  UpdateTicket,
  User,
} from "./types";

//

export async function get_zammad_me() {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/users/me`,
    method: "GET",
    searchParams: {},
  });

  return response.json() as Promise<User>;
}

export async function get_full_ticket({ ticket_id }: { ticket_id: number }) {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/tickets/${ticket_id}`,
    method: "GET",
    searchParams: { all: "true" },
  });

  return response.json() as Promise<SearchResult>;
}

export async function send_zammad_new_email(body: NewTicket) {
  const response = await fetch_zammad_api({
    body,
    endpoint: `/api/v1/tickets`,
    method: "POST",
    searchParams: {},
  });

  const ticket = await response.json();

  return ticket as Ticket;
}

export async function send_zammad_response(
  ticket_id: number,
  body: UpdateTicket,
) {
  const response = await fetch_zammad_api({
    body,
    endpoint: `/api/v1/tickets/${ticket_id}`,
    method: "PUT",
    searchParams: {},
  });

  const ticket = await response.json();

  return ticket as Ticket;
}

//
