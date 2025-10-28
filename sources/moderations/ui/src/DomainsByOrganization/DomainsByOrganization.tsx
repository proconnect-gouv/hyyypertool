//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader";
import { formattedPlural } from "@~/app.ui/plurial";
import { hx_urls } from "@~/app.urls";
import type { Organization } from "@~/organizations.lib/entities/Organization";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { hyper_ref } from "@~/web/html";

//

type Props = {
  organization: Pick<Organization, "id">;
  query_domain_count: Promise<number>;
};
export async function DomainsByOrganization(props: Props) {
  const $describedby = hyper_ref();
  const { organization, query_domain_count } = props;
  const count = await query_domain_count;
  const query_domains_by_organization_id = await hx_urls.organizations[
    ":id"
  ].domains.$get({
    param: {
      id: organization.id.toString(),
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
