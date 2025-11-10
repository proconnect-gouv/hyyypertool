//

import type { Moderation } from "#src/lib/moderations";
import { moderation_type_to_verb_in_sentence } from "#src/lib/moderations";
import type { User } from "#src/lib/users";
//

type MessageInfoProps = {
  moderation: Pick<Moderation, "type"> & {
    organization: { cached_libelle: string | null };
    user: Pick<User, "email" | "family_name" | "given_name">;
  };
};

//

export function MessageInfo(props: MessageInfoProps) {
  const {
    moderation: {
      organization: { cached_libelle },
      type,
      user: { email, family_name, given_name },
    },
  } = props;

  return (
    <p class="mb-0">
      <b>
        {given_name} {family_name}
      </b>{" "}
      <span class="text-gray-600">
        {moderation_type_to_verb_in_sentence(type)}
      </span>{" "}
      « <b>{cached_libelle}</b> »{" "}
      <span class="text-gray-600">avec l’adresse</span> <b>{email}</b>
    </p>
  );
}
