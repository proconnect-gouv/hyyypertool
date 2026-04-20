//

import { match } from "ts-pattern";
import type { ModerationType } from "./types";

//

export function moderation_type_to_emoji(type: string) {
  return match(type as ModerationType)
    .with("ask_for_sponsorship", () => "🧑‍🤝‍🧑 ")
    .with("big_organization_join", () => "🏢 ")
    .with("non_verified_domain", () => "🔓 ")
    .with("organization_join_block", () => "🕵️ ")
    .otherwise(() => "⁉️ " + type);
}

export function moderation_type_to_title(type: string) {
  return match(type as ModerationType)
    .with("ask_for_sponsorship", () => "Sponsorship")
    .with("big_organization_join", () => "Big Organisation")
    .with("non_verified_domain", () => "Non vérifié")
    .with("organization_join_block", () => "A traiter")
    .otherwise(() => "⁉️ " + type);
}

export function moderation_type_to_verb_in_sentence(type: string) {
  return match(type as ModerationType)
    .with("ask_for_sponsorship", () => "demande un sponsorship")
    .with(
      "big_organization_join",
      () => "a rejoint l'organisation de plus de 50 employés",
    )
    .with(
      "non_verified_domain",
      () => "a rejoint une organisation avec un domain non vérifié  ",
    )
    .with("organization_join_block", () => "veut rejoindre l'organisation")
    .otherwise((type) => `veut effectuer une action inconnue (type ${type})`);
}
