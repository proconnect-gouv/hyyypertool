//

import { createHash } from "node:crypto";

//

export function hyper_ref(given_name?: string) {
  const short_sha = createHash("sha1")
    .update(crypto.randomUUID())
    .digest("hex")
    .slice(0, 8);
  return given_name
    ? `hyyyper_${given_name}_${short_sha}`
    : `hyyyper_${short_sha}`;
}
