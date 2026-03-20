//

import { hyper_ref } from "#src/html";
import { hx_include, hx_trigger_from_body } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import { Loader } from "#src/ui/loader";
import { formattedPlural } from "#src/ui/plurial";
import { table } from "#src/ui/table";
import { urls } from "#src/urls";
import { match, P } from "ts-pattern";

//

type Props = {
  isOpen?: boolean;
  organization: { id: number };
  query_members_count: Promise<number>;
};
export async function UsersByOrganization(props: Props) {
  const $describedby = hyper_ref("users_by_organization");
  const $page_ref = hyper_ref("users_by_organization_page");
  const { organization, query_members_count } = props;
  const count = await query_members_count;
  const isOpen =
    props.isOpen ??
    match(count)
      .with(0, () => false)
      .with(P.number.between(1, 3), () => true)
      .otherwise(() => false);
  const hx_get_users_by_organization_props = {
    ...urls.organizations[":id"].members.$hx_get({
      param: { id: organization.id },
      query: { describedby: $describedby, page_ref: $page_ref },
    }),
  };

  return (
    <section>
      <details open={isOpen}>
        <summary>
          <h3 class="inline-block" id={$describedby}>
            👥 {count}{" "}
            {formattedPlural(count, {
              one: "membre connu",
              other: "membres connus",
            })}{" "}
            dans l’organisation
          </h3>
        </summary>

        <div
          {...hx_get_users_by_organization_props}
          class={table()}
          hx-include={hx_include([$page_ref])}
          hx-target="this"
          hx-trigger={[
            "load delay:1s",
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
