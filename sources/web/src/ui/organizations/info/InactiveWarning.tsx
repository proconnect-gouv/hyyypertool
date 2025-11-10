//

import { type JSX } from "hono/jsx";

//

type Props = JSX.IntrinsicElements["section"] & {
  organization: { cached_est_active: boolean | null };
};

export function InactiveWarning(props: Props) {
  const { organization, ...section_props } = props;

  if (organization.cached_est_active) {
    return null;
  }

  return (
    <section {...section_props}>
      <div class="fr-alert fr-alert--warning">
        <i class="bi bi-exclamation-triangle-fill" />
        <h3 class="fr-alert__title">
          Attention : cette organisation a cessé son activité.
        </h3>
      </div>
    </section>
  );
}
