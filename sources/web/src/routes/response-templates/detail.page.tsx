//

import { button } from "#src/ui";
import { Svg } from "#src/ui/icons/components";
import { TemplateEditorIsland } from "#src/ui/moderations/TemplateEditor";
import { alert } from "#src/ui/notice";
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
    : urls["response-templates"][":id"].$url({ param: { id: template.id } })
        .pathname;

  const { base: alert_base } = alert({ intent: "success" });

  return (
    <main class="container mx-auto my-12 px-4">
      {status === "created" && (
        <div class={alert_base()} role="alert">
          <p>Template créé !</p>
        </div>
      )}
      <div class="mb-6 flex items-center justify-between">
        <a
          href={urls["response-templates"].$url().pathname}
          class={button({ intent: "ghost", size: "sm" })}
        >
          <Svg name="arrow-go-back" />
          Retour à la liste
        </a>
        {!is_new && (
          <button
            class={button({ intent: "danger", size: "sm" })}
            hx-delete={form_action}
            hx-confirm="Supprimer ce template ?"
          >
            Supprimer
          </button>
        )}
      </div>

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
