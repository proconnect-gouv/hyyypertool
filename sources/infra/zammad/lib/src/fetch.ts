//

import env from "@~/core/config";
import { HTTPError } from "@~/core/error";
import consola from "consola";
import type { NewTicket, UpdateTicket } from "./types";

//

interface Zammad_Pagination {
  per_page: string;
  page: string;
}

interface Zammad_Order {
  sort_by: string;
  order_by: "asc" | "desc";
}

type Options =
  | {
      endpoint: `/api/v1/users/me`;
      method: "GET";
      searchParams: {};
    }
  | {
      endpoint: `/api/v1/tickets/${number}`;
      method: "GET";
      searchParams: { all: "true" | "false" };
    }
  | {
      endpoint: `/api/v1/tickets`;
      method: "POST";
      body: NewTicket;
      searchParams: {};
    }
  | {
      endpoint: `/api/v1/tickets/${number}`;
      method: "PUT";
      body: UpdateTicket;
      searchParams: {};
    }
  | {
      endpoint: `/api/v1/ticket_articles/by_ticket/${number}`;
      method: "GET";
      searchParams: Partial<Zammad_Pagination & Zammad_Order>;
    }
  | {
      endpoint: `/api/v1/ticket_attachment/${number}/${number}/${number}`;
      method: "GET";
      searchParams: {};
    };

export async function fetch_zammad_api(options: Options) {
  const searchParams = new URLSearchParams(options.searchParams);
  const url = `${env.ZAMMAD_URL}${options.endpoint}?${searchParams.toString()}`;
  const headers = new Headers({
    "content-type": "application/json",
    Authorization: `Bearer ${env.ZAMMAD_TOKEN}`,
  });

  consola.info(`  <<-- ${options.method} ${url}`);

  const response = await fetch(url, {
    method: options.method,
    headers,
    body: options.method === "GET" ? null : JSON.stringify(options.body),
  });

  consola.info(
    `  -->> ${options.method} ${url} ${response.status} ${response.statusText}`,
  );

  if (!response.ok) {
    throw new HTTPError(`${url} ${response.status} ${response.statusText}`);
  }

  return response;
}
