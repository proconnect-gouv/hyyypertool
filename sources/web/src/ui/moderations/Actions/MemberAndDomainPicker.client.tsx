/* @jsxImportSource preact */

import { useCallback, useState } from "preact/hooks";

//

export interface MemberAndDomainPickerProps extends Record<string, unknown> {
  domain: string;
  given_name: string;
  default_internal?: boolean;
}

export function MemberAndDomainPicker({
  domain,
  given_name,
  default_internal = true,
}: MemberAndDomainPickerProps) {
  const [is_internal, set_is_internal] = useState(default_internal);
  const [add_domain, set_add_domain] = useState(false);

  const handle_member_change = useCallback((internal: boolean) => {
    set_is_internal(internal);
    set_add_domain(false);
  }, []);

  const mail_type = is_internal ? "interne" : "externe";

  const domain_checkbox = (
    <div class="mb-5">
      <div class="fr-checkbox-group">
        <input
          id="add_domain_checkbox"
          name="add_domain"
          type="checkbox"
          value="true"
          checked={add_domain}
          onChange={() => set_add_domain((v) => !v)}
        />
        <label for="add_domain_checkbox">
          J'autorise le domaine <b class="mx-1">{domain}</b> en {mail_type} à
          l'organisation
        </label>
      </div>
    </div>
  );

  return (
    <>
      <div class="mb-5">
        <div class="fr-radio-group">
          <input
            id="add_member_internal"
            name="add_member"
            required
            type="radio"
            value="AS_INTERNAL"
            checked={is_internal}
            onChange={() => handle_member_change(true)}
          />
          <label class="fr-label flex-row!" for="add_member_internal">
            Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
            QU'INTERNE
          </label>
        </div>
      </div>

      {is_internal && domain_checkbox}

      <div class="mb-5">
        <div class="fr-radio-group">
          <input
            id="add_member_external"
            name="add_member"
            required
            type="radio"
            value="AS_EXTERNAL"
            checked={!is_internal}
            onChange={() => handle_member_change(false)}
          />
          <label class="fr-label flex-row!" for="add_member_external">
            Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
            QU'EXTERNE
          </label>
        </div>
      </div>

      {!is_internal && domain_checkbox}
    </>
  );
}
