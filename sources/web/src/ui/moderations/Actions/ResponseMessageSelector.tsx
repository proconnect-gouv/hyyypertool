//

import { reject_form_schema } from "#src/lib/moderations";
import { select } from "#src/ui/form";
import { reponse_templates } from "./responses";

//

export function ResponseMessageSelector({ $message }: { $message: string }) {
  return (
    <div>
      <input
        _={`
        on keydown or change
          set :key to my value
          set :option to <option[value="${"${:key}"}"]/> in #responses-type
          set #${$message}.value to :option@message
        on keydown[key is 'Enter']
          halt
        `}
        class={select()}
        list="responses-type"
        placeholder="Recherche d'une réponse type"
        autocomplete="off"
        name={reject_form_schema.keyof().enum.reason}
      />
      <datalist id="responses-type">
        {reponse_templates.map(async ({ label, default: template }, index) => (
          <option
            key={index}
            value={label}
            message={await Promise.resolve(template())}
          ></option>
        ))}
      </datalist>
    </div>
  );
}
