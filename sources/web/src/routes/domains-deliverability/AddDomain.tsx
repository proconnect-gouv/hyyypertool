import { hyper_ref } from "#src/html";
import { urls } from "#src/urls";

export async function AddDomain() {
  const $describedby = hyper_ref("add_problematic_email");

  const hx_add_props = urls["domains-deliverability"].$hx_put();

  return (
    <form {...hx_add_props} hx-swap="none">
      <div class="fr-input-group">
        <label class="fr-label" for={$describedby}>
          Ajouter un email problématique
        </label>
        <div class="fr-input-wrap fr-input-wrap--addon">
          <input
            aria-describedby={$describedby}
            id={$describedby}
            class="fr-input"
            type="email"
            placeholder="exemple@domaine.com"
            required
            name="problematic_email"
          />
          <button class="fr-btn" type="submit">
            Ajouter
          </button>
        </div>
      </div>
    </form>
  );
}
