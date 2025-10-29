//

import { button } from "#src/ui/button";
import { CopyButton } from "#src/ui/button/components";
import { description_list } from "#src/ui/list";
import { urls } from "#src/urls";
import { z_email_domain } from "@~/core/schema";
import type { Organization } from "@~/organizations.lib/entities/Organization";
import type { GetUserInfoOutput } from "@~/users.lib/usecase/GetUserInfo";

//

type AboutProps = {
  user: GetUserInfoOutput;
  organization: Pick<Organization, "siret">;
};

//

export function About({ user, organization }: AboutProps) {
  const domain = z_email_domain.parse(user.email, { path: ["user.email"] });

  return (
    <section>
      <h3>
        <a
          class="bg-none"
          target="_blank"
          href={
            urls.users[":id"].$url({ param: { id: user.id.toString() } })
              .pathname
          }
        >
          👨‍💻 Profile
        </a>
      </h3>
      <dl class={description_list()}>
        <dt>Email </dt>
        <dd>
          {user.email}{" "}
          <CopyButton
            class="ml-2"
            text={user.email}
            variant={{ size: "sm", type: "tertiary" }}
          ></CopyButton>
        </dd>

        <dt>Domaine email </dt>
        <dd>
          {domain}{" "}
          <CopyButton
            class="ml-2"
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
            class={`${button({ size: "sm", type: "tertiary" })} ml-2 mr-2 bg-white`}
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
