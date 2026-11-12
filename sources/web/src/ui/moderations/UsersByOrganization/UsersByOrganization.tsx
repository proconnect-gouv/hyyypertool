//

import { hx_trigger_from_body, hx_trigger_load } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import { Loader } from "#src/ui/loader";
import { hx_get_members_table_props } from "#src/ui/organizations/members";
import { formattedPlural } from "#src/ui/plurial";
import { urls } from "#src/urls";
import { match, P } from "ts-pattern";

//

type Props = {
  isOpen?: boolean;
  organization: { id: number };
  query_members_count: Promise<number>;
};
export async function UsersByOrganization(props: Props) {
  const { organization, query_members_count } = props;
  const count = await query_members_count;
  const isOpen =
    props.isOpen ??
    match(count)
      .with(0, () => false)
      .with(P.number.between(1, 3), () => true)
      .otherwise(() => false);

  return (
    <section>
      <details open={isOpen}>
        <summary>
          <h3 class="inline-block">
            👥 {count}{" "}
            {formattedPlural(count, {
              one: "membre connu",
              other: "membres connus",
            })}{" "}
            dans l’organisation
          </h3>
        </summary>

        <a
          href={
            urls.organizations[":id"].members.$url({
              param: { id: organization.id },
            }).pathname
          }
        >
          Voir tous les membres →
        </a>
        <div
          {...hx_get_members_table_props(organization.id)}
          hx-target="this"
          hx-trigger={[
            hx_trigger_load(),
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
