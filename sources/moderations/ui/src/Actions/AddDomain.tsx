import { hyper_ref } from "@~/web/html";
import { validate_form_schema } from "@~/moderations.lib/schema/validate.form";
import { useContext } from "hono/jsx";
import { context } from "./context";

export function AddDomain(props: { mailType: string }) {
  const { domain } = useContext(context);
  const id = hyper_ref();
  return (
    <div class="fr-checkbox-group">
      <input
        id={id}
        name={validate_form_schema.keyof().enum.add_domain}
        type="checkbox"
        value="true"
      />
      <label for={id}>
        J’autorise le domaine <b class="mx-1">{domain}</b> en {props.mailType} à
        l'organisation
      </label>
    </div>
  );
}
