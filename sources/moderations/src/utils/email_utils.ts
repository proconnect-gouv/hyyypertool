/**
 * Pure utility functions for email processing.
 */

import { z } from "zod";

/**
 * Zod schema for extracting domain from email address.
 *
 * Re-exported from @~/core for domain package independence.
 */
export const z_email_domain = z
  .email()
  .transform((email) => email.split("@")[1]);

/**
 * Extracts the domain from an email address.
 *
 * @pure - No side effects, deterministic output
 * @throws {ZodError} If email is invalid
 * @param email - Email address to extract domain from
 * @returns Domain portion of email (e.g., "example.com")
 */
export function extract_domain(email: string): string {
  return z_email_domain.parse(email);
}
