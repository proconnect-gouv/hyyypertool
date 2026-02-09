//

import { alert } from "#src/ui/notice";
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

  const { base, title } = alert({ intent: "warning" });
  return (
    <section {...section_props}>
      <div class={base()}>
        <h3 class={title()}>
          Attention : cette organisation a cessé son activité.
        </h3>
      </div>
    </section>
  );
}
