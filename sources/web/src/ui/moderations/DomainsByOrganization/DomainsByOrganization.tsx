//

import { hyper_ref } from "#src/html";
import { hx_trigger_from_body } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import { Loader } from "#src/ui/loader";
import { formattedPlural } from "#src/ui/plurial";
import { urls } from "#src/urls";

//

type Props = {
  organization: { id: number };
  query_domain_count: Promise<number>;
};
export async function DomainsByOrganization(props: Props) {
  const $describedby = hyper_ref();
  const { organization, query_domain_count } = props;
  const count = await query_domain_count;
  const query_domains_by_organization_id = urls.organizations[
    ":id"
  ].domains.$hx_get({
    param: {
      id: organization.id,
    },
    query: { describedby: $describedby },
  });

  return (
    <section>
      <details>
        <summary>
          <h3 class="inline-block" id={$describedby}>
            🌐 {count}{" "}
            {formattedPlural(count, {
              one: "domaine connu",
              other: "domaines connus",
            })}{" "}
            dans l’organisation
          </h3>
        </summary>
        <div
          {...query_domains_by_organization_id}
          hx-trigger={[
            "load delay:1s",
            ...hx_trigger_from_body([ORGANISATION_EVENTS.enum.DOMAIN_UPDATED]),
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
