/* @jsxImportSource preact */

import { button } from "#src/ui/button";
import type { ResponseTemplateDto } from "../../../routes/response-templates/get_response_templates.query";
import { AcceptForm } from "./AcceptForm.client";
import { RefusalForm } from "./RefusalForm.client";
import { toolbar_open } from "./toolbar-modal.signal";

//

export interface ActionsClientProps extends Record<string, unknown> {
  moderation_id: number;
  moderated_at: string | null;
  domain: string;
  given_name: string;
  user_email: string;
  organization_name: string | null;
  moderation_type: string;
  response_templates: ResponseTemplateDto[];
  is_editor?: boolean;
}

export function ActionsClient({
  moderation_id,
  moderated_at,
  domain,
  given_name,
  user_email,
  organization_name,
  moderation_type,
  response_templates,
  is_editor = true,
}: ActionsClientProps) {
  return (
    <>
      {is_editor && (
        <div
          class="bg-surface border-border fixed right-0 bottom-0 z-50 flex w-full justify-end overflow-hidden border-t p-2"
          role="toolbar"
        >
          {!moderated_at && (
            <>
              <button
                class={button({
                  type: "secondary",
                  class: "bg-background dark:bg-surface mr-4",
                })}
                type="button"
                onClick={() => {
                  toolbar_open.value =
                    toolbar_open.value === "accept" ? null : "accept";
                }}
              >
                ✅ Accepter
              </button>
              <button
                class={button({
                  type: "secondary",
                  class: "bg-background dark:bg-surface mr-4",
                })}
                type="button"
                onClick={() => {
                  toolbar_open.value =
                    toolbar_open.value === "refusal" ? null : "refusal";
                }}
              >
                ❌ Refuser
              </button>
            </>
          )}
          <a
            href="#exchange_moderation"
            class={button({
              type: "secondary",
              class: "bg-background dark:bg-surface",
            })}
            onClick={() => {
              toolbar_open.value = null;
              const details = document.getElementById(
                "exchange_details",
              ) as HTMLDetailsElement | null;
              if (details) details.open = true;
            }}
          >
            💬 Voir les échanges
          </a>
        </div>
      )}
      {is_editor && (
        <>
          <AcceptForm
            moderation_id={moderation_id}
            domain={domain}
            given_name={given_name}
            user_email={user_email}
            organization_name={organization_name}
            moderation_type={moderation_type}
          />
          <RefusalForm
            moderation_id={moderation_id}
            user_email={user_email}
            organization_name={organization_name}
            response_templates={response_templates}
          />
        </>
      )}
    </>
  );
}
