//
// @deprecated This module will be removed after Phase 2.3-2.4 migrations complete.
// Use @~/web/errors instead for new code.
//

import ModernError from "modern-errors";

//

/**
 * @deprecated Use @~/web/errors AuthError instead
 */
export class AuthError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AuthError";
  }
}

/**
 * @deprecated Use @~/web/errors BadRequestError instead
 */
export const BadRequestError = ModernError.subclass("BadRequestError");
