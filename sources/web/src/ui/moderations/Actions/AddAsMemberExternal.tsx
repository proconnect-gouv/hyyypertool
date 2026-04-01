//

import { hyper_ref } from "#src/html";
import { validate_form_schema } from "#src/lib/moderations";
import { radio_group } from "#src/ui/form";
import { useContext } from "hono/jsx";
import { context, valid_context } from "./context";

//

export function AddAsMemberExternal() {
  const { is_already_external_member } = useContext(valid_context);
  const {
    moderation: {
      user: { given_name },
    },
  } = useContext(context);
  const id = hyper_ref();
  const { base, label } = radio_group();
  return (
    <div class={base()}>
      <input
        id={id}
        name={validate_form_schema.keyof().enum.add_member}
        required
        type="radio"
        value={validate_form_schema.shape.add_member.enum.AS_EXTERNAL}
        checked={is_already_external_member}
        _={`
          on change
            remove .hidden from #domainExternalSection
            add .hidden to #domainInternalSection
        `}
      />
      <label class={label({ class: "flex-row!" })} for={id}>
        Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
        QU'EXTERNE
      </label>
    </div>
  );
}
