//

import { Moderation_Type_Schema } from "@~/moderations.lib/Moderation_Type";
import { validate_form_schema } from "@~/moderations.lib/schema/validate.form";
import { useContext } from "hono/jsx";
import { context, valid_context } from "./context";

//

export function SendNotification() {
  const {
    moderation: {
      type,
      user: { email },
    },
  } = useContext(context);
  const { $send_notification } = useContext(valid_context);

  return (
    <div class="fr-checkbox-group">
      <input
        id={$send_notification}
        name={validate_form_schema.keyof().enum.send_notification}
        type="checkbox"
        value="true"
        checked={
          Moderation_Type_Schema.parse(type, {
            path: ["moderation", "type"],
          }) !== Moderation_Type_Schema.enum.non_verified_domain
        }
      />
      <label class="fr-label flex-row!" for={$send_notification}>
        Notifier <b class="mx-1">{email}</b> du traitement de la modération.
      </label>
    </div>
  );
}
