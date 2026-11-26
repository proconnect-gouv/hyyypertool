//

import { HorizontalMenu, Menu } from "#src/ui/menu/components";
import { VERIFICATION_TYPE_LABELS } from "#src/ui/organizations/members";
import { urls } from "#src/urls";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";

//

const NOT_VERIFIED = VerificationTypeSchema.enum.domain_not_verified_yet;

export async function MemberRowActions({
  user_id,
  organization_id,
  is_external,
  verification_type,
  open_href,
}: {
  user_id: number;
  organization_id: number;
  is_external: boolean;
  verification_type: string | null;
  open_href: string;
}) {
  const member = urls.organizations[":id"].members[":user_id"];
  const param = { id: organization_id, user_id };
  const patch = (form: Record<string, string>) =>
    member.$hx_patch({ form, param });

  return (
    <HorizontalMenu>
      <Menu.Link href={open_href}>Ouvrir</Menu.Link>
      <Menu.Item {...member.$hx_delete({ param })} hx-swap="none">
        🚪🚶retirer de l'orga
      </Menu.Item>
      {VERIFICATION_TYPE_LABELS.filter(([value]) => value !== NOT_VERIFIED).map(
        ([value, label]) => (
          <Menu.Item {...patch({ verification_type: value })} hx-swap="none">
            🔄 vérif: {label}
          </Menu.Item>
        ),
      )}
      {verification_type !== null ? (
        <Menu.Item
          {...patch({ verification_type: NOT_VERIFIED })}
          hx-swap="none"
        >
          🚫 non vérifié
        </Menu.Item>
      ) : null}
      <Menu.Item
        {...patch({ is_external: String(!is_external) })}
        hx-swap="none"
      >
        🔄 interne/externe
      </Menu.Item>
    </HorizontalMenu>
  );
}
