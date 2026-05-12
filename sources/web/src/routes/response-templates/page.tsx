//

import { hx_include } from "#src/htmx";
import { decodeHtmlEntities } from "#src/lib/response-templates";
import { button, callout, formattedPlural } from "#src/ui";
import { accordion } from "#src/ui/accordion";
import { input, label } from "#src/ui/form";
import { urls } from "#src/urls";

//

type PageTemplate = {
  id: number;
  label: string;
  content: string;
};

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
  templates: PageTemplate[];
  searchQuery?: string;
}) {
  return (
    <main class="container mx-auto my-12 px-4">
      <div class="mb-6 flex items-baseline justify-between">
        <h1 class="mb-0">Templates de réponse</h1>
        <a
          href={urls["response-templates"].new.$url().pathname}
          class={button()}
        >
          Nouveau template
        </a>
      </div>
      <p class="mb-6 text-lg leading-7">
        Sélectionnez un template pour le visualiser et l'éditer.
      </p>

      <form
        class="bg-surface sticky top-0 z-10 mb-6 p-2"
        {...hx_templates_query_props}
        hx-trigger={`keyup changed delay:300ms from:#${TEMPLATES_SEARCH_ID}`}
      >
        <label class={label()} for={TEMPLATES_SEARCH_ID}>
          Rechercher un template
        </label>
        <input
          type="search"
          id={TEMPLATES_SEARCH_ID}
          name="q"
          class={`${input()} dark:bg-[#303030]`}
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
  templates: PageTemplate[];
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
      <p class="text-grey-625 dark:text-grey-200 mb-6 text-sm">
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

function TemplateAccordion({ template }: { template: PageTemplate }) {
  const accordionId = `accordion-${template.id}`;

  const { base, btn } = accordion();
  return (
    <details class={base()} open={undefined}>
      <summary class={btn()}>
        <span class="flex-1">{template.label}</span>
        <a
          href={`/response-templates/${template.id}`}
          class={button({
            intent: "ghost",
            size: "sm",
            class: "mr-2",
          })}
        >
          Éditer
        </a>
      </summary>
      <div id={accordionId}>
        <TemplatePreview template={template} />
      </div>
    </details>
  );
}

function TemplatePreview({ template }: { template: PageTemplate }) {
  const decodedContent = decodeHtmlEntities(template.content);
  const { base, text } = callout();
  return (
    <div class={base({ class: "mb-6" })}>
      <p class={text({ class: "whitespace-pre-wrap" })}>{decodedContent}</p>
    </div>
  );
}
