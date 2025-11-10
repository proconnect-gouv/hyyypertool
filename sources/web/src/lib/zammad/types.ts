//

import type { Article_Type, Priority_Type } from "./const";

//

export interface User {
  active: boolean;
  created_at: string;
  email: string;
  firstname: string;
  id: number;
  image: string;
  last_login: string;
  lastname: string;
  login: string;
  note: string;
  organization_id: number;
  updated_at: string;
  updated_by_id: string;
  verified: boolean;
}

export interface Ticket {
  article_ids: number[];
  customer_id: number | `guess:${string}`;
  group: string;
  id: number;
  owner_id: number | undefined;
  priority_id: Priority_Type;
  state: "closed" | "open";
  title: string;
}
export interface NewArticle
  extends Omit<Article, "id" | "created_at" | "created_by"> {} //

export interface SearchResult {
  tickets: number[];
  tickets_count: number;
  assets: {
    Ticket?: Record<`${number}`, Ticket>;
    Group?: Record<`${number}`, unknown>;
    User?: Record<`${number}`, User>;
    Role?: Record<`${number}`, unknown>;
  };
}

export interface NewTicket extends Omit<Ticket, "article_ids" | "id"> {
  article: NewArticle;
}

export interface UpdateTicket
  extends Omit<Partial<Ticket>, "article_ids" | "customer_id" | "id"> {
  article: NewArticle;
}

export interface Article {
  body: string;
  content_type: "text/html";
  created_at: string;
  created_by: string;
  from?: "IdentiteProconnect" | string;
  id: number;
  internal?: boolean;
  sender_id: number;
  subject: string;
  subtype?: "reply";
  to: string;
  type_id: Article_Type;
}
