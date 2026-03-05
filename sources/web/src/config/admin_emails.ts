//

import { consola } from "consola";
import env from "./env";

//

function resolve_admin_emails(): string {
  if (env.ADMIN_EMAILS) {
    return env.ADMIN_EMAILS;
  }

  if (env.ALLOWED_USERS) {
    consola.warn("⚠️  ALLOWED_USERS is deprecated, use ADMIN_EMAILS instead.");
    return env.ALLOWED_USERS;
  }

  return "";
}

export const ADMIN_EMAILS = resolve_admin_emails();

export const admin_email_list = ADMIN_EMAILS.split(",").filter(Boolean);
