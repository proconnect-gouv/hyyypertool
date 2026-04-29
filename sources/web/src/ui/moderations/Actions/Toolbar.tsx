import type { Moderation } from "#src/lib/moderations";
import { button } from "#src/ui/button";
type ToolbarProps = {
  moderation: Pick<Moderation, "moderated_at">;
};
export function Toolbar(props: ToolbarProps) {
  return (
    <div
      class="bg-surface border-border fixed right-0 bottom-0 z-50 flex w-full justify-end overflow-hidden border-t p-2"
      role="dialog"
      aria-modal="true"
    >
      <ModerationButtonGroup {...props} />
      <SeeExchangesButton />
    </div>
  );
}

function SeeExchangesButton() {
  return (
    <a
      href="#exchange_moderation"
      class={button({
        type: "secondary",
        class: "bg-background dark:bg-surface",
      })}
      _={`
        on click
          set #exchange_details.open to true
          add .hidden to #refusalModal
          add .hidden to #acceptModal
          return true
      `}
    >
      💬 Voir les échanges
    </a>
  );
}
function ModerationButtonGroup({ moderation }: ToolbarProps) {
  if (moderation.moderated_at) return null;
  return (
    <>
      <button
        class={button({
          type: "secondary",
          class: "bg-background dark:bg-surface mr-4",
        })}
        _={`
          on click
            if #refusalModal.classList.contains('hidden') is false
                add .hidden to #refusalModal
            end

            if #acceptModal.classList.contains('hidden')
              remove .hidden from #acceptModal
            else
              add .hidden to #acceptModal
            end
        `}
      >
        ✅ Accepter
      </button>

      <button
        class={button({
          type: "secondary",
          class: "bg-background dark:bg-surface mr-4",
        })}
        _={`
          on click
            if #acceptModal.classList.contains('hidden') is false
              add .hidden to #acceptModal
            end

            if #refusalModal.classList.contains('hidden')
              remove .hidden from #refusalModal
            else
              add .hidden to #refusalModal
            end
        `}
      >
        ❌ Refuser
      </button>
    </>
  );
}
