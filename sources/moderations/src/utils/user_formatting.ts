/**
 * Pure utility functions for user information formatting.
 */

import { z } from "zod";

/**
 * Zod schema for building user nickname from name parts.
 *
 * Re-exported from @~/core for domain package independence.
 */
export const z_username = z
  .object({
    given_name: z.string().default(""),
    usual_name: z.string().default(""),
  })
  .transform(({ given_name, usual_name }) => {
    return `${given_name} ${usual_name}`;
  });

/**
 * Builds a user nickname from userinfo.
 *
 * @pure - No side effects, deterministic output
 * @param userinfo - Object containing given_name and usual_name
 * @returns Formatted nickname (e.g., "John Doe")
 */
export function build_user_nickname(userinfo: {
  given_name: string;
  usual_name?: string;
}): string {
  return z_username.parse(userinfo);
}

/**
 * Formats a "moderated_by" string in "Name <email>" format.
 *
 * @pure - No side effects, deterministic output
 * @param userinfo - Object containing name parts and email
 * @returns Formatted string (e.g., "John Doe <john@example.com>")
 */
export function format_moderated_by(userinfo: {
  given_name: string;
  usual_name?: string;
  email: string;
}): string {
  const nickname = build_user_nickname(userinfo);
  return `${nickname} <${userinfo.email}>`;
}
