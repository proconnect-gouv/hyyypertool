import { LocalTime } from "#src/ui";
import { Svg } from "#src/ui/icons/components";
import { table } from "#src/ui/table";
import { urls } from "#src/urls";
import { get_email_deliverability_whitelist } from "./get_email_deliverability_whitelist.query";

type EmailDelivrabilityWhiteList = Awaited<
  ReturnType<typeof get_email_deliverability_whitelist>
>[number];

export async function Table({
  whitelist,
  is_editor,
}: {
  whitelist: EmailDelivrabilityWhiteList[];
  is_editor: boolean;
}) {
  return (
    <table class={table()}>
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
          <Row
            key={item.email_domain}
            whitelist_item={item}
            is_editor={is_editor}
          />
        ))}
      </tbody>
    </table>
  );
}

async function Row({
  key,
  whitelist_item,
  is_editor,
}: {
  key?: string;
  whitelist_item: EmailDelivrabilityWhiteList;
  is_editor: boolean;
}) {
  const { verified_at, problematic_email, email_domain, verified_by } =
    whitelist_item;

  return (
    <tr aria-label={`Domaine ${email_domain}`} key={key}>
      <td>{problematic_email}</td>
      <td>{email_domain}</td>
      <td>{verified_by ?? "N/A"}</td>
      <td>
        <LocalTime date={verified_at} />
      </td>
      <td>
        <DeliverabilityRowActions
          whitelist_item={whitelist_item}
          is_editor={is_editor}
        />
      </td>
    </tr>
  );
}

function DeliverabilityRowActions({
  whitelist_item,
  is_editor,
}: {
  whitelist_item: EmailDelivrabilityWhiteList;
  is_editor: boolean;
}) {
  if (!is_editor) return <></>;
  const { problematic_email, email_domain } = whitelist_item;
  const hx_delete_props = urls["domains-deliverability"][
    ":email_domain"
  ].$hx_delete({
    param: { email_domain: email_domain },
  });
  return (
    <button
      {...hx_delete_props}
      hx-confirm={`Êtes-vous sûr de vouloir supprimer le domaine « ${email_domain} » de la liste des emails délivrables ?`}
      hx-swap="none"
      type="button"
      aria-label={`Supprimer ${problematic_email}`}
    >
      <Svg name={"delete"} />
    </button>
  );
}
