//

import { type Env } from "hono";
import { createMiddleware } from "hono/factory";
import { secureHeaders } from "hono/secure-headers";

//

export interface Csp_Context extends Env {
  Variables: {
    nonce: string;
  };
}

// Refused to execute inline script because it violates the following
// Content Security Policy directive: "script-src-elem 'self'".
// Either the 'unsafe-inline' keyword, a hash ('sha256-ZtVO4euNrRnx0KrqoCatLuOIaHv1Z7zi++KgINh8SqM='), or a nonce ('nonce-...') is required to enable inline execution.
export const csp_headers = createMiddleware<Csp_Context>(
  function csp_headers_middleware(context, next) {
    const nonce = crypto.getRandomValues(new Uint8Array(16)).join("");

    context.set("nonce", nonce);

    const handler = secureHeaders({
      contentSecurityPolicy: {
        baseUri: ["'self'"],
        childSrc: ["'self'"],
        connectSrc: ["'self'"],
        // defaultSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        // formAction: ["'self'"],
        frameAncestors: ["'self'"],
        frameSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        manifestSrc: ["'self'"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        // reportTo: "endpoint-1",
        // sandbox: ["allow-same-origin", "allow-scripts"],
        // scriptSrc: ["'self'", "'unsafe-inline'"],
        // scriptSrc: [`'nonce-${nonce}'`, "'strict-dynamic'", "'unsafe-inline'"],
        // scriptSrcAttr: ["'none'"],
        // scriptSrcElem: [`'nonce-${nonce}'`],
        // scriptSrcElem: ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"],
        // styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        // styleSrcAttr: ["none"],
        // styleSrcElem: ["'self'", "https:", "'unsafe-inline'"],
        upgradeInsecureRequests: [],
        workerSrc: ["'self'"],
      },
    });

    return handler(context, next);
  },
);
