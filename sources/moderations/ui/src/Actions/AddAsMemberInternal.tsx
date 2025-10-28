import { hyper_ref } from "@~/web/html";
import { validate_form_schema } from "@~/moderations.lib/schema/validate.form";
import { useContext } from "hono/jsx";
import { context, valid_context } from "./context";

export function AddAsMemberInternal() {
  const { is_already_internal_member } = useContext(valid_context);
  const {
    moderation: {
      user: { given_name },
    },
  } = useContext(context);
  const id = hyper_ref();
  return (
    <div class="fr-radio-group">
      <input
        id={id}
        name={validate_form_schema.keyof().enum.add_member}
        required
        type="radio"
        value={validate_form_schema.shape.add_member.enum.AS_INTERNAL}
        checked={!is_already_internal_member}
        _={`
          on change
            remove .hidden from #domainInternalSection
            add .hidden to #domainExternalSection
        `}
      />
      <label class="fr-label flex-row!" for={id}>
        Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
        QU'INTERNE
      </label>
    </div>
  );
}
