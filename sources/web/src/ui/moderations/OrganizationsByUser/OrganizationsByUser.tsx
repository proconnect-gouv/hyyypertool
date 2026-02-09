//

import { hyper_ref } from "#src/html";
import { hx_include, hx_trigger_from_body } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import type { CountUserMembershipsHandler, User } from "#src/lib/users";
import { Loader } from "#src/ui/loader";
import { formattedPlural } from "#src/ui/plurial";
import { table } from "#src/ui/table";
import { urls } from "#src/urls";

//

type Props = {
  isOpen?: boolean;
  query_organization_count: CountUserMembershipsHandler;
  user: Pick<User, "id" | "given_name" | "family_name">;
};
export async function OrganizationsByUser(props: Props) {
  const { user, query_organization_count } = props;
  const $describedby = hyper_ref("organizations_by_user");
  const $page_ref = hyper_ref("organizations_by_user_page");
  const count = await query_organization_count(user.id);
  const isOpen = props.isOpen ?? false;
  const hx_get_organizations_by_user = urls.users[":id"].organizations.$hx_get({
    param: { id: user.id },
    query: { describedby: $describedby, page_ref: $page_ref },
  });

  return (
    <section>
      <details open={isOpen}>
        <summary>
          <h3 class="inline-block" id={$describedby}>
            🏢 {count}{" "}
            {formattedPlural(count, {
              one: "organisation connu",
              other: "organisations connues",
            })}{" "}
            pour {user.given_name} {user.family_name}
          </h3>
        </summary>

        <div
          {...hx_get_organizations_by_user}
          class={table()}
          hx-include={hx_include([$page_ref])}
          hx-target="this"
          hx-trigger={[
            "load",
            hx_trigger_from_body([ORGANISATION_EVENTS.enum.MEMBERS_UPDATED]),
          ].join(", ")}
        >
          <center>
            <Loader />
          </center>
        </div>
      </details>
    </section>
  );
}
