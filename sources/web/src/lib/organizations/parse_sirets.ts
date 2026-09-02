//

import { isSiretValid } from "@proconnect-gouv/proconnect.core/security";

//

export function parse_sirets(input: string): {
  valid: string[];
  invalid: string[];
} {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const siret of input.split(/[\s,;]+/)) {
    if (!siret || seen.has(siret)) continue;
    seen.add(siret);
    (isSiretValid(siret) ? valid : invalid).push(siret);
  }

  return { valid, invalid };
}
