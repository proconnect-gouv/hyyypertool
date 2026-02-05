//

import { button } from "#src/ui";
import { TemplateEditorIsland } from "#src/ui/moderations/TemplateEditor";
import { urls } from "#src/urls";
import type { get_response_template } from "./get_response_template.query";

//

type TemplateMetadata = NonNullable<
  Awaited<ReturnType<typeof get_response_template>>
>;

export default function DetailPage({
  nonce,
  template,
  status,
}: {
  nonce: string;
  template?: TemplateMetadata;
  status?: "created";
}) {
  const is_new = !template;
  const form_action = is_new
    ? urls["response-templates"].$url().pathname
    : `${urls["response-templates"].$url().pathname}/${template.id}`;

  return (
    <main class="fr-container my-12">
      {status === "created" && (
        <div class="fr-alert fr-alert--success fr-mb-3w" role="alert">
          <p>Template créé !</p>
        </div>
      )}
      <a
        href={urls["response-templates"].$url().pathname}
        class="fr-link fr-icon-arrow-left-line fr-link--icon-left fr-mb-3w inline-block"
      >
        Retour à la liste
      </a>

      <form
        {...(is_new
          ? { method: "post", action: form_action }
          : { "hx-patch": form_action })}
      >
        <TemplateEditorIsland
          nonce={nonce}
          initialTemplate={template?.content ?? ""}
          initialLabel={template?.label ?? ""}
        />
        <div class="mt-6 flex justify-end">
          <button type="submit" class={button()}>
            Enregistrer
          </button>
        </div>
      </form>
    </main>
  );
}
