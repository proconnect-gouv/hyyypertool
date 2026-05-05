//

import type { GetUserInfoOutput } from "#src/lib/users";
import { z_email_domain } from "#src/schema";
import { button } from "#src/ui/button";
import { CopyButton } from "#src/ui/button/components";
import { description_list } from "#src/ui/list";
import { urls } from "#src/urls";

//

type AboutProps = {
  user: GetUserInfoOutput;
  organization: { siret: string };
  nonce?: string;
};

//

export function About({ user, organization, nonce = "" }: AboutProps) {
  const domain = z_email_domain.parse(user.email);

  return (
    <section>
      <h2>
        <a
          class="bg-none"
          target="_blank"
          href={urls.users[":id"].$url({ param: { id: user.id } }).pathname}
        >
          👨‍💻 Profile
        </a>
      </h2>
      <dl class={description_list()}>
        <dt>Email </dt>
        <dd>
          {user.email}{" "}
          <CopyButton
            class="ml-2"
            nonce={nonce}
            text={user.email}
            variant={{ size: "sm", type: "tertiary" }}
          ></CopyButton>
        </dd>

        <dt>Domaine email </dt>
        <dd>
          {domain}{" "}
          <CopyButton
            class="ml-2"
            nonce={nonce}
            text={domain}
            variant={{ size: "sm", type: "tertiary" }}
          ></CopyButton>
        </dd>

        <dt>Prénom </dt>
        <dd>{user.given_name}</dd>

        <dt>Nom </dt>
        <dd>{user.family_name}</dd>

        <dt>Numéro de téléphone </dt>
        <dd>{user.phone_number}</dd>

        <dt>Profession </dt>
        <dd>
          {user.job}{" "}
          <a
            href={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${organization.siret.substring(0, 9)}`}
            class={`${button({ size: "sm", type: "tertiary" })} mr-2 ml-2`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Liste dirigeants - Annuaire entreprise API
          </a>
        </dd>
      </dl>
    </section>
  );
}
