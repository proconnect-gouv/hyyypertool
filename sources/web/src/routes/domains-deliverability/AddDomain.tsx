import { hyper_ref } from "#src/html";
import { button } from "#src/ui/button";
import { input, input_group, label } from "#src/ui/form";
import { urls } from "#src/urls";

export async function AddDomain() {
  const $describedby = hyper_ref("add_problematic_email");

  const hx_add_props = urls["domains-deliverability"].$hx_put();

  return (
    <form {...hx_add_props} hx-swap="none">
      <div class={input_group()}>
        <label class={label()} for={$describedby}>
          Ajouter un email problématique
        </label>
        <div class="flex items-stretch">
          <input
            aria-describedby={$describedby}
            autocomplete="off"
            class={input({ class: "flex-1" })}
            data-1p-ignore
            data-bwignore
            data-form-type="other"
            data-lpignore="true"
            id={$describedby}
            name="problematic_email"
            placeholder="exemple@domaine.com"
            required
            spellcheck={false}
            type="email"
          />
          <button class={button()} type="submit">
            Ajouter
          </button>
        </div>
      </div>
    </form>
  );
}
