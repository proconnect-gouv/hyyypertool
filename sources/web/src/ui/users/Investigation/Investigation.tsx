//

import { button } from "#src/ui/button";
import { GoogleSearchButton } from "#src/ui/button/components";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { Organization } from "@~/organizations.lib/entities/Organization";
import type { User } from "@~/users.lib/entities/User";

//

type InvestigationProps = {
  user: Pick<User, "email">;
  organization: Pick<Organization, "cached_libelle">;
};

//

export function Investigation(props: InvestigationProps) {
  const { user, organization } = props;

  const domain = z_email_domain.parse(user.email, { path: ["user.email"] });

  return (
    <ul class="mt-5 w-full bg-[#F6F6F6] p-3 [&_li]:inline-block">
      <li>
        <GoogleSearchButton
          class={`${button({ size: "sm", type: "tertiary" })} mr-2 bg-white`}
          query={user.email}
        >
          Chercher l'email
        </GoogleSearchButton>
      </li>
      <li>
        <GoogleSearchButton
          class={`${button({ size: "sm", type: "tertiary" })} mr-2 bg-white`}
          query={domain}
        >
          Chercher le domaine email
        </GoogleSearchButton>
      </li>
      <li>
        <GoogleSearchButton
          class={`${button({ size: "sm", type: "tertiary" })} bg-white`}
          query={`${organization.cached_libelle} ${domain}`}
        >
          Chercher le matching
        </GoogleSearchButton>
      </li>
    </ul>
  );
}
