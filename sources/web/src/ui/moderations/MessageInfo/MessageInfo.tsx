//

import type { Moderation } from "#src/lib/moderations";
import { moderation_type_to_verb_in_sentence } from "#src/lib/moderations";
import type { User } from "#src/lib/users";
//

type MessageInfoProps = {
  moderation: Pick<Moderation, "sp_name" | "type"> & {
    organization: { cached_libelle: string | null };
    user: Pick<User, "email" | "family_name" | "given_name">;
  };
};

//

export function MessageInfo(props: MessageInfoProps) {
  const {
    moderation: {
      organization: { cached_libelle },
      sp_name,
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
      <ServiceProviderInfo sp_name={sp_name} />
    </p>
  );
}

function ServiceProviderInfo({ sp_name }: { sp_name: string | null }) {
  if (!sp_name) return null;
  return (
    <>
      <span class="text-gray-600"> pour se connecter au service </span> «{" "}
      <b>{sp_name}</b> »{" "}
    </>
  );
}
