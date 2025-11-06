import { LocalTime } from "#src/ui";
import { hx_urls } from "#src/urls";
import { usePageRequestContext } from "./context";

type EmailDelivrabilityWhiteList = {
  verified_at: string;
  problematic_email: string;
  email_domain: string;
  verified_by: string | null;
};
export async function Table() {
  const {
    var: { identite_pg },
  } = usePageRequestContext();

  const results =
    await identite_pg.query.email_deliverability_whitelist.findMany();

  return (
    <div class="fr-table *:table!" id="domains-deliverability-table">
      <table>
        <thead>
          <tr>
            <th>Email problématique</th>
            <th>Domaine de l'email</th>
            <th>Vérifié par</th>
            <th>Vérifié le</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => (
            <Row key={item.email_domain} whitelist_item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function Row({
  key,
  whitelist_item,
}: {
  key?: string;
  whitelist_item: EmailDelivrabilityWhiteList;
}) {
  const { verified_at, problematic_email, email_domain, verified_by } =
    whitelist_item;

  const hx_delete_props = await (hx_urls as any)["domains-deliverability"][
    ":email_domain"
  ].$delete({
    param: { email_domain: email_domain },
  });

  return (
    <tr aria-label={`Domaine ${email_domain}`} key={key}>
      <td>{problematic_email}</td>
      <td>{email_domain}</td>
      <td>{verified_by ?? "N/A"}</td>
      <td>
        <LocalTime date={verified_at} />
      </td>
      <td>
        <button
          {...hx_delete_props}
          hx-confirm={`Êtes-vous sûr de vouloir supprimer le domaine « ${email_domain} » de la liste des emails délivrables ?`}
          hx-swap="none"
          type="button"
          aria-label={`Supprimer ${problematic_email}`}
        >
          <span class="fr-icon-delete-line" aria-hidden="true"></span>
        </button>
      </td>
    </tr>
  );
}
