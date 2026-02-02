//

import { validate_form_schema } from "#src/lib/moderations";
import { ModerationTypeSchema } from "@~/identite-proconnect/types";
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
  const { data: moderation_type } = ModerationTypeSchema.safeParse(type);

  return (
    <div class="fr-checkbox-group">
      <input
        id={$send_notification}
        name={validate_form_schema.keyof().enum.send_notification}
        type="checkbox"
        value="true"
        checked={
          moderation_type !== ModerationTypeSchema.enum.non_verified_domain
        }
      />
      <label class="fr-label flex-row!" for={$send_notification}>
        Notifier <b class="mx-1">{email}</b> du traitement de la modération.
      </label>
    </div>
  );
}
