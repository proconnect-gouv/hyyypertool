//

import { hyper_ref } from "#src/html";
import type { Moderation } from "#src/lib/moderations";
import type { IsUserExternalMemberHandler } from "#src/lib/moderations";
import type { User } from "#src/lib/users";
import type { SuggestSameUserEmailsHandler } from "#src/lib/users";
import { createContext } from "hono/jsx";
import type { SimplifyDeep } from "type-fest";

export interface Values {
  domain: string;
  moderation: SimplifyDeep<
    Pick<Moderation, "id" | "moderated_at" | "type"> & {
      organization: {
        cached_libelle: string | null;
        id: number;
        siret: string;
        cached_libelle_categorie_juridique: string | null;
      };
      user: Pick<User, "email" | "id" | "family_name" | "given_name">;
    }
  >;
  $accept: string;
  $decision_form: string;
  $reject: string;
  query_suggest_same_user_emails: SuggestSameUserEmailsHandler;
  query_is_user_external_member: IsUserExternalMemberHandler;
  query_suggest_organization_domains: (
    organization_id: number,
  ) => Promise<string[]>;
}
export const context = createContext<Values>(null as any);

//
export const reject_context = createContext({
  $modal_message: hyper_ref(),
});
export const valid_context = createContext({
  $send_notification: hyper_ref(),
  is_already_internal_member: false,
  is_already_external_member: false,
});
