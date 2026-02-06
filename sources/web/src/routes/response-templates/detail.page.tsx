//

import {
  TemplateEditorIsland,
  type LoadedTemplate,
} from "#src/ui/moderations/TemplateEditor";
import { urls } from "#src/urls";

//

export default function DetailPage({
  nonce,
  template,
}: {
  nonce: string;
  template: LoadedTemplate;
}) {
  return (
    <main class="fr-container my-12">
      <a
        href={urls["response-templates"].$url().pathname}
        class="fr-link fr-icon-arrow-left-line fr-link--icon-left fr-mb-3w inline-block"
      >
        Retour à la liste
      </a>

      <TemplateEditorIsland
        nonce={nonce}
        initialTemplate={template.content}
        initialLabel={template.label}
      />
    </main>
  );
}
