//

import { validate_form_schema } from "#src/lib/moderations";
import { checkbox_group, label } from "#src/ui/form";
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
    <div class={checkbox_group()}>
      <input
        id={$send_notification}
        name={validate_form_schema.keyof().enum.send_notification}
        type="checkbox"
        value="true"
        checked={
          moderation_type !== ModerationTypeSchema.enum.non_verified_domain
        }
      />
      <label class={label({ class: "flex-row!" })} for={$send_notification}>
        Notifier <b class="mx-1">{email}</b> du traitement de la modération.
      </label>
    </div>
  );
}
