//

export class AuthError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AuthError";
  }
}

export class BadRequestError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "BadRequestError";
  }
}

export class HTTPError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "HTTPError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "NotFoundError";
  }
}
