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
  template,
  status,
  is_editor = false,
}: {
  template?: TemplateMetadata;
  status?: "created";
  is_editor?: boolean;
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
          <p class="mb-0">Template créé !</p>
        </div>
      )}
      <div class="mb-6 flex items-center justify-between">
        <a
          href={urls["response-templates"].$url().pathname}
          class={button({
            intent: "ghost",
            size: "sm",
            type: "tertiary",
          })}
        >
          <Svg name="arrow-go-back" />
          Retour à la liste
        </a>
        {!is_new && is_editor && (
          <button
            class={button({ intent: "danger", size: "sm" })}
            hx-delete={form_action}
            hx-confirm="Supprimer ce template ?"
          >
            Supprimer
          </button>
        )}
      </div>

      {is_editor && (
        <form
          {...(is_new
            ? { method: "post", action: form_action }
            : { "hx-patch": form_action })}
        >
          <TemplateEditorIsland
            initialTemplate={template?.content ?? ""}
            initialLabel={template?.label ?? ""}
            initialEndUserReason={template?.end_user_reason ?? ""}
            initialAllowEditing={template?.allow_editing ?? false}
          />
          <div class="mt-6 flex justify-end">
            <button type="submit" class={button()}>
              Enregistrer
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
