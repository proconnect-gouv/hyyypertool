import { LocalTime } from "#src/ui";
import { hx_urls } from "#src/urls";
import { get_email_deliverability_whitelist } from "./get_email_deliverability_whitelist.query";

type EmailDelivrabilityWhiteList = Awaited<
  ReturnType<typeof get_email_deliverability_whitelist>
>[number];

export async function Table({
  whitelist,
}: {
  whitelist: EmailDelivrabilityWhiteList[];
}) {
  return (
    <div class="fr-table *:table!">
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
          {whitelist.map((item) => (
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

  const hx_delete_props = hx_urls["domains-deliverability"][
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
