//

import { hyper_ref } from "#src/html";
import { z_email_domain } from "#src/schema";
import { AcceptModal } from "./AcceptModal";
import { context, type Values } from "./context";
import { RefusalModal } from "./RefusalModal";
import { Toolbar } from "./Toolbar";

//

type ActionProps = {
  value: Omit<Values, "$accept" | "$decision_form" | "$reject" | "domain">;
  response_templates: { label: string }[];
};

export async function Actions({ value, response_templates }: ActionProps) {
  const { moderation } = value;

  const { user } = moderation;

  const domain = z_email_domain.parse(moderation.user.email);

  return (
    <context.Provider
      value={{
        $accept: hyper_ref(),
        $decision_form: hyper_ref(),
        $reject: hyper_ref(),
        domain,
        ...value,
      }}
    >
      <Toolbar moderation={moderation} />
      <AcceptModal
        userEmail={user.email}
        moderation={moderation}
        domain={domain}
      />
      <RefusalModal userEmail={user.email} response_templates={response_templates} />
    </context.Provider>
  );
}
