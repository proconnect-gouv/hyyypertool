//

import { hx_include } from "#src/htmx";
import { button, callout, formattedPlural } from "#src/ui";
import { accordion } from "#src/ui/accordion";
import {
  decodeHtmlEntities,
  type TemplateMetadata,
} from "#src/ui/moderations/TemplateEditor";
import { urls } from "#src/urls";

//

const TEMPLATES_LIST_ID = "templates-list";
const TEMPLATES_SEARCH_ID = "templates-search";
const hx_templates_query_props = {
  "hx-get": urls["response-templates"].$url().pathname,
  "hx-include": hx_include([TEMPLATES_SEARCH_ID]),
  "hx-replace-url": true,
  "hx-select": `#${TEMPLATES_LIST_ID}`,
  "hx-swap": "outerHTML",
  "hx-target": `#${TEMPLATES_LIST_ID}`,
};

export default function Page({
  templates,
  searchQuery = "",
}: {
  templates: TemplateMetadata[];
  searchQuery?: string;
}) {
  return (
    <main class="fr-container my-12">
      <h1>Templates de réponse</h1>
      <p class="fr-text--lead fr-mb-3w">
        Sélectionnez un template pour le visualiser et l'éditer.
      </p>

      <form
        class="fr-mb-3w sticky top-0 z-10 bg-white py-2"
        {...hx_templates_query_props}
        hx-trigger={`keyup changed delay:300ms from:#${TEMPLATES_SEARCH_ID}`}
      >
        <label class="fr-label" for={TEMPLATES_SEARCH_ID}>
          Rechercher un template
        </label>
        <input
          type="search"
          id={TEMPLATES_SEARCH_ID}
          name="q"
          class="fr-input"
          placeholder="Rechercher par titre ou contenu..."
          value={searchQuery}
        />
      </form>

      <TemplateList templates={templates} searchQuery={searchQuery} />
    </main>
  );
}

function TemplateList({
  templates,
  searchQuery = "",
}: {
  templates: TemplateMetadata[];
  searchQuery?: string;
}) {
  const query = searchQuery.toLowerCase().trim();
  const filteredTemplates = query
    ? templates.filter(
        (t) =>
          t.label.toLowerCase().includes(query) ||
          t.content.toLowerCase().includes(query),
      )
    : templates;

  const total_count = templates.length;
  const filtered_count = filteredTemplates.length;

  return (
    <div id={TEMPLATES_LIST_ID}>
      <p class="fr-text--sm fr-text--mention-grey fr-mb-2w">
        {filtered_count}{" "}
        {formattedPlural(filtered_count, {
          one: "template",
          other: "templates",
        })}
        {total_count > filtered_count && ` sur ${total_count}`}
      </p>

      <ul>
        {filteredTemplates.map((template) => (
          <TemplateAccordion key={template.id} template={template} />
        ))}
      </ul>
    </div>
  );
}

function TemplateAccordion({ template }: { template: TemplateMetadata }) {
  const accordionId = `accordion-${template.id}`;

  const { base, btn } = accordion();
  return (
    <div class="relative">
      <details class={base()} open={undefined}>
        <summary class={btn({ class: "justify-between" })}>
          <div>{template.label}</div>
        </summary>
        <div id={accordionId}>
          <p
            class="fr-text--sm fr-mb-2w"
            style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
          >
            <TemplatePreview template={template} />
          </p>
        </div>
      </details>
      <a
        href={`/response-templates/${template.id}`}
        class={button({
          intent: "ghost",
          size: "sm",
          class: "absolute top-2 right-10 z-10",
        })}
      >
        Éditer
      </a>
    </div>
  );
}

function TemplatePreview({ template }: { template: TemplateMetadata }) {
  const decodedContent = decodeHtmlEntities(template.content);
  const { base, text } = callout();
  return (
    <div class={base({ class: "fr-mb-3w" })}>
      <p class={text({ class: "whitespace-pre-wrap" })}>{decodedContent}</p>
    </div>
  );
}
