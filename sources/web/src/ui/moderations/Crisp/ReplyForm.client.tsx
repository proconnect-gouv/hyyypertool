/* @jsxImportSource preact */

import type { CrispOutgoingMessageType } from "#src/lib/crisp";
import { MODERATION_EVENTS } from "#src/lib/moderations/event";
import { button } from "#src/ui/button";
import { Menu } from "#src/ui/menu/components";
import { tag } from "#src/ui/tag";
import type { RefObject } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

//

type ReplyView = {
  emoji: string;
  form_class: string;
  hint: string;
  input_class: string;
  label: string;
  placeholder: string;
  submit: string;
  tag_class: string;
};

const REPLY_TYPES: CrispOutgoingMessageType[] = ["text", "note"];

const REPLY_VIEWS: Record<CrispOutgoingMessageType, ReplyView> = {
  note: {
    emoji: "🔖",
    form_class: "bg-amber-50 dark:bg-amber-950/30",
    hint: "Visible uniquement par l'équipe",
    input_class: "border-amber-300",
    label: "Note privée",
    placeholder: "Écrire une note pour l'équipe…",
    submit: "Ajouter la note",
    tag_class: "has-checked:text-grey-1000 has-checked:bg-amber-300",
  },
  text: {
    emoji: "💬",
    form_class: "",
    hint: "Visible par l'usager",
    input_class: "border-border",
    label: "Message",
    placeholder: "Répondre à l'usager…",
    submit: "Envoyer",
    tag_class: "",
  },
};

const notify = (variant: "danger" | "success", title: string, message = "") =>
  window.dispatchEvent(
    new CustomEvent("notify", { detail: { variant, title, message } }),
  );

//

export interface ReplyFormProps extends Record<string, unknown> {
  action: string;
  moderation_id: number;
  state_action: string;
}

export function ReplyForm({
  action,
  moderation_id,
  state_action,
}: ReplyFormProps) {
  const draft_key = `crisp-reply-draft:${moderation_id}`;
  const [content, set_content] = useState(
    () => sessionStorage.getItem(draft_key) ?? "",
  );
  const [submitting, set_submitting] = useState(false);
  const [type, set_type] = useState<CrispOutgoingMessageType>("text");
  const textarea_ref = useRef<HTMLTextAreaElement>(null);
  const view = REPLY_VIEWS[type];

  useEffect(() => {
    const textarea = textarea_ref.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [content]);

  const update_content = (value: string) => {
    set_content(value);
    if (value) sessionStorage.setItem(draft_key, value);
    else sessionStorage.removeItem(draft_key);
  };

  const change_type = (value: CrispOutgoingMessageType) => {
    set_type(value);
    textarea_ref.current?.focus();
  };

  const resolve = async () => {
    const response = await fetch(state_action, {
      body: new URLSearchParams({ state: "resolved" }),
      method: "PATCH",
    });
    if (!response.ok)
      notify("danger", "Erreur", `Échec de la résolution (${response.status})`);
  };

  const run = async (task: () => Promise<void>) => {
    if (submitting) return;
    set_submitting(true);
    try {
      await task();
      document.body.dispatchEvent(
        new CustomEvent(MODERATION_EVENTS.enum.MODERATION_EMAIL_UPDATED),
      );
    } catch {
      notify("danger", "Erreur", "Une erreur inattendue est survenue.");
    } finally {
      set_submitting(false);
    }
  };

  const submit = ({ and_resolve }: { and_resolve: boolean }) => {
    if (!content.trim()) return;
    return run(async () => {
      const response = await fetch(action, {
        body: new URLSearchParams({ content, type }),
        method: "POST",
      });
      if (!response.ok) {
        notify("danger", "Erreur", `Échec de l'envoi (${response.status})`);
        return;
      }
      update_content("");
      if (and_resolve) await resolve();
    });
  };

  return (
    <form
      class={`border-border flex flex-col gap-2 border-t p-3 transition-colors ${view.form_class}`}
      onSubmit={(event) => {
        event.preventDefault();
        void submit({ and_resolve: false });
      }}
    >
      <ReplyTypeSelector hint={view.hint} on_change={change_type} type={type} />
      <ReplyEditor
        content={content}
        disabled={submitting}
        id={`crisp-reply-${moderation_id}`}
        input_class={view.input_class}
        on_input={update_content}
        on_shortcut={(and_resolve) => void submit({ and_resolve })}
        placeholder={view.placeholder}
        textarea_ref={textarea_ref}
      />
      <ReplyActions
        disabled={submitting || !content.trim()}
        on_submit_and_resolve={() => void submit({ and_resolve: true })}
        submit_label={submitting ? "Envoi…" : view.submit}
      />
    </form>
  );
}

function ReplyTypeSelector({
  hint,
  on_change,
  type,
}: {
  hint: string;
  on_change: (type: CrispOutgoingMessageType) => void;
  type: CrispOutgoingMessageType;
}) {
  return (
    <fieldset class="m-0 flex flex-wrap items-center gap-2 border-0 p-0">
      <legend class="sr-only">Type de réponse</legend>
      {REPLY_TYPES.map((value) => (
        <label
          class={tag({
            class: `has-focus-visible:outline-blue-france gap-1 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 ${REPLY_VIEWS[value].tag_class}`,
            size: "sm",
          })}
          key={value}
        >
          <input
            checked={type === value}
            class="sr-only"
            name="type"
            onChange={() => on_change(value)}
            type="radio"
            value={value}
          />
          <span aria-hidden="true">{REPLY_VIEWS[value].emoji}</span>{" "}
          {REPLY_VIEWS[value].label}
        </label>
      ))}
      <span class="text-text-muted ml-auto text-xs">{hint}</span>
    </fieldset>
  );
}

function ReplyEditor({
  content,
  disabled,
  id,
  input_class,
  on_input,
  on_shortcut,
  placeholder,
  textarea_ref,
}: {
  content: string;
  disabled: boolean;
  id: string;
  input_class: string;
  on_input: (content: string) => void;
  on_shortcut: (and_resolve: boolean) => void;
  placeholder: string;
  textarea_ref: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <>
      <label class="sr-only" for={id}>
        Répondre dans la conversation Crisp
      </label>
      <textarea
        class={`bg-surface focus:outline-blue-france max-h-40 min-h-11 w-full resize-none rounded-lg border px-3 py-2 focus:outline-2 ${input_class}`}
        disabled={disabled}
        id={id}
        name="content"
        onInput={(event) => on_input(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || !(event.ctrlKey || event.metaKey))
            return;
          event.preventDefault();
          on_shortcut(event.altKey);
        }}
        placeholder={placeholder}
        ref={textarea_ref}
        rows={1}
        value={content}
      />
    </>
  );
}

function ReplyActions({
  disabled,
  on_submit_and_resolve,
  submit_label,
}: {
  disabled: boolean;
  on_submit_and_resolve: () => void;
  submit_label: string;
}) {
  return (
    <div class="flex items-center justify-between gap-2">
      <span class="text-text-muted text-xs">
        <kbd>Ctrl</kbd> + <kbd>Entrée</kbd> pour envoyer
      </span>
      <div class="flex">
        <button
          class={button({ class: "rounded-l-lg rounded-r-none" })}
          disabled={disabled}
          type="submit"
        >
          {submit_label}
        </button>
        <Menu>
          <Menu.Trigger
            aria-label="Plus d'options d'envoi"
            class={button({
              class:
                "rounded-l-none rounded-r-lg border-l border-white/40 px-2",
            })}
            disabled={disabled}
          >
            <Menu.Chevron />
          </Menu.Trigger>
          <Menu.Popover>
            <Menu.Item
              aria-keyshortcuts="Control+Alt+Enter"
              aria-label="Envoyer et résoudre"
              class="flex items-center gap-4 font-bold"
              onClick={on_submit_and_resolve}
            >
              Envoyer et résoudre
              <span class="ml-auto flex gap-1 text-xs">
                <kbd>Ctrl</kbd>
                <kbd>Alt</kbd>
                <kbd>Enter</kbd>
              </span>
            </Menu.Item>
          </Menu.Popover>
        </Menu>
      </div>
    </div>
  );
}
