/* @jsxImportSource preact */

import { decodeHtmlEntities, render } from "#src/lib/response-templates";
import { callout } from "#src/ui/callout";
import { input } from "#src/ui/form";
import { alert } from "#src/ui/notice";
import { table } from "#src/ui/table";
import { tabs } from "#src/ui/tabs";
import { tag } from "#src/ui/tag";
import {
  batch,
  type ReadonlySignal,
  type Signal,
  useComputed,
  useSignal,
} from "@preact/signals";
import { useRef } from "preact/hooks";
import { AVAILABLE_VARIABLES, SAMPLE_DATA } from "./render";

//

export interface TemplateMetadata {
  id: string;
  label: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateEditorProps extends Record<string, unknown> {
  initialTemplate?: string;
  initialLabel?: string;
}

//

export function TemplateEditor({
  initialTemplate = "",
  initialLabel = "",
}: TemplateEditorProps) {
  const template = useSignal(decodeHtmlEntities(initialTemplate));
  const labelSignal = useSignal(initialLabel);
  const sampleData = useSignal({ ...SAMPLE_DATA });
  const showSampleEditor = useSignal(false);
  const activeTab = useSignal<"editor" | "preview">("editor");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const renderResult = useComputed(() =>
    render(template.value, sampleData.value),
  );

  const { base, list, tab, panel } = tabs();

  return (
    <>
      <input type="hidden" name="label" value={labelSignal.value} />
      <input type="hidden" name="content" value={template.value} />
      <div class="mb-6">
        <TitleInput label={labelSignal} />
      </div>

      <div class={base()}>
        <ul class={list()} role="tablist" aria-label="Modele">
          <li role="presentation">
            <button
              type="button"
              class={tab({ selected: activeTab.value === "editor" })}
              role="tab"
              aria-selected={activeTab.value === "editor" ? "true" : "false"}
              aria-controls="tab-editor-panel"
              id="tab-editor"
              tabIndex={activeTab.value === "editor" ? 0 : -1}
              onClick={() => (activeTab.value = "editor")}
            >
              Modifier
            </button>
          </li>
          <li role="presentation">
            <button
              type="button"
              class={tab({ selected: activeTab.value === "preview" })}
              role="tab"
              aria-selected={activeTab.value === "preview" ? "true" : "false"}
              aria-controls="tab-preview-panel"
              id="tab-preview"
              tabIndex={activeTab.value === "preview" ? 0 : -1}
              onClick={() => (activeTab.value = "preview")}
            >
              Apercu
            </button>
          </li>
        </ul>
        <div
          class={panel({ selected: activeTab.value === "editor" })}
          role="tabpanel"
          aria-labelledby="tab-editor"
          id="tab-editor-panel"
          tabIndex={0}
        >
          <TemplateEditorPanel template={template} textareaRef={textareaRef} />
        </div>
        <div
          class={panel({ selected: activeTab.value === "preview" })}
          role="tabpanel"
          aria-labelledby="tab-preview"
          id="tab-preview-panel"
          tabIndex={0}
        >
          <TemplatePreviewPanel renderResult={renderResult} />
        </div>
      </div>

      <details
        open={showSampleEditor.value}
        onToggle={(e) =>
          (showSampleEditor.value = (e.target as HTMLDetailsElement).open)
        }
      >
        <summary class="cursor-pointer p-2 text-sm">
          <span class="ml-2">Modifier les donnees d&apos;exemple</span>
        </summary>
        <SampleDataEditor sampleData={sampleData} />
      </details>
    </>
  );
}

//

function TitleInput(props: { label: Signal<string> }) {
  const { label: labelSignal } = props;
  return (
    <>
      <label class="sr-only" htmlFor="template-label">
        Titre du template
      </label>
      <input
        class={input({
          class: `
            text-4xl
            not-focus:bg-transparent
            not-focus:shadow-none
          `,
        })}
        placeholder={"Titre du template"}
        id="template-label"
        onInput={(e) => (labelSignal.value = e.currentTarget.value)}
        required
        type="text"
        value={labelSignal.value}
      />
    </>
  );
}
//

interface TemplateEditorPanelProps {
  template: Signal<string>;
  textareaRef: preact.RefObject<HTMLTextAreaElement>;
}

function TemplateEditorPanel({
  template,
  textareaRef,
}: TemplateEditorPanelProps) {
  const onInsertVariable = (key: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = template.value || "";
    const insert = `\${ ${key} }`;

    template.value = text.slice(0, start) + insert + text.slice(end);

    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + insert.length;
      textarea.setSelectionRange(newPos, newPos);
    });
  };

  return (
    <div class="mb-4">
      <p class="text-grey-625 mb-2 text-sm">
        Cliquez sur une variable pour l&apos;inserer a la position du curseur
      </p>
      <div class="mb-2 flex flex-wrap gap-2">
        {AVAILABLE_VARIABLES.map((v) => (
          <button
            key={v.key}
            type="button"
            class={tag({ size: "sm" })}
            onClick={() => onInsertVariable(v.key)}
            title={`Inserer \${ ${v.key} }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <label class="sr-only" htmlFor="template-input">
        Contenu du template
      </label>
      <textarea
        class={input()}
        id="template-input"
        onChange={(e) => (template.value = e.currentTarget.value)}
        placeholder="Bonjour ${ given_name } ${ family_name },&#10;&#10;Votre demande pour ${ organization_name } a ete traitee."
        ref={textareaRef}
        rows={22}
        value={template.value}
      >
        {template.value}
      </textarea>
    </div>
  );
}

//

interface TemplatePreviewPanelProps {
  renderResult: ReadonlySignal<{ result: string; missing: string[] }>;
}

function TemplatePreviewPanel({ renderResult }: TemplatePreviewPanelProps) {
  const { base: callout_base, text: callout_text } = callout();
  const { base: alert_base } = alert({ intent: "warning" });
  return (
    <>
      <div class={callout_base({ class: "mb-6" })}>
        <p class={callout_text({ class: "whitespace-pre-wrap" })}>
          {renderResult.value.result}
        </p>
      </div>
      {renderResult.value.missing.length > 0 && (
        <div class={alert_base()} role="alert">
          <p>Variables inconnues : {renderResult.value.missing.join(", ")}</p>
        </div>
      )}
    </>
  );
}

//

interface SampleDataEditorProps {
  sampleData: Signal<Record<string, string>>;
}

function SampleDataEditor({ sampleData }: SampleDataEditorProps) {
  const handleInput = (key: string, value: string) => {
    batch(() => {
      const current = sampleData.peek();
      sampleData.value = { ...current, [key]: value };
    });
  };

  return (
    <div class="mt-2">
      <table class={table()}>
        <caption>Donnees d&apos;exemple</caption>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Valeur</th>
          </tr>
        </thead>
        <tbody>
          {AVAILABLE_VARIABLES.map((v) => (
            <tr key={v.key}>
              <td>
                <code>{`\${ ${v.key} }`}</code>
              </td>
              <td class="box-border">
                <input
                  type="text"
                  class={input()}
                  value={sampleData.value[v.key]}
                  onInput={(e) => handleInput(v.key, e.currentTarget.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
