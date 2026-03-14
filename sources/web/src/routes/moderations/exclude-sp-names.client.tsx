/* @jsxImportSource preact */
/**
 * Exclude SP Names — dropdown checklist (Client-side Preact Component)
 */

import { signal } from "@preact/signals";
import { useRef } from "preact/hooks";

const NO_SERVICE_LABEL = "Sans service";
const label = (sp_name: string) => sp_name || NO_SERVICE_LABEL;
const excluded = signal<string[]>([]);
const open = signal(false);

export interface ExcludeSpNamesProps extends Record<string, unknown> {
  id: string;
  name: string;
  sp_names_list: string[];
  initialValue?: string;
}

export function ExcludeSpNames({
  id,
  name,
  sp_names_list,
  initialValue = "",
}: ExcludeSpNamesProps) {
  if (excluded.value.length === 0 && initialValue) {
    excluded.value = initialValue.split(",");
  }

  const inputRef = useRef<HTMLInputElement>(null);

  const syncAndDispatch = () => {
    if (!inputRef.current) return;
    inputRef.current.value = excluded.value.join(",");
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const toggle = (sp_name: string) => {
    excluded.value = excluded.value.includes(sp_name)
      ? excluded.value.filter((s) => s !== sp_name)
      : [...excluded.value, sp_name];
    syncAndDispatch();
  };

  const remove = (sp_name: string) => {
    excluded.value = excluded.value.filter((s) => s !== sp_name);
    syncAndDispatch();
  };

  return (
    <div class="relative">
      <input
        ref={inputRef}
        type="hidden"
        id={id}
        name={name}
        value={excluded.value.join(",")}
      />
      <button
        type="button"
        onClick={() => (open.value = !open.value)}
        class="fr-btn fr-btn--tertiary"
      >
        Fournisseur de service
        <span class="ml-1 text-[0.625rem]">
          {open.value ? "\u25B2" : "\u25BC"}
        </span>
      </button>

      {excluded.value.length > 0 && (
        <ul class="fr-tags-group">
          {excluded.value.map((sp_name) => (
            <li key={sp_name}>
              <button
                class="fr-tag fr-tag--dismiss"
                type="button"
                onClick={() => remove(sp_name)}
                aria-label={`Retirer ${label(sp_name)}`}
              >
                {label(sp_name)}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open.value && (
        <div class="absolute top-full left-0 z-10 mt-1 max-h-64 min-w-64 overflow-y-auto rounded border border-gray-300 bg-white shadow-lg">
          {sp_names_list.map((sp_name) => (
            <label
              key={sp_name}
              class="flex cursor-pointer items-center gap-2 border-b border-gray-100 px-3 py-1.5 text-sm"
            >
              <input
                type="checkbox"
                aria-label={`Exclure ${label(sp_name)}`}
                checked={excluded.value.includes(sp_name)}
                onChange={() => toggle(sp_name)}
              />
              {label(sp_name)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
