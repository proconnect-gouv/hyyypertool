/* @jsxImportSource preact */
/**
 * Processed Requests Checkbox (Client-side Preact Component)
 *
 * Auto-checks when user types in search email or siret inputs
 */

import { useEffect, useRef } from "preact/hooks";

export interface ProcessedCheckboxProps extends Record<string, unknown> {
  id: string;
  name: string;
  value: string;
  initialChecked?: boolean;
  searchEmailId: string;
  searchSiretId: string;
}

export function ProcessedCheckbox({
  id,
  name,
  value,
  initialChecked = false,
  searchEmailId,
  searchSiretId,
}: ProcessedCheckboxProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const emailInput = document.getElementById(searchEmailId) as HTMLInputElement;
    const siretInput = document.getElementById(searchSiretId) as HTMLInputElement;

    const handleInput = () => {
      const hasEmailValue = emailInput?.value.trim() !== "";
      const hasSiretValue = siretInput?.value.trim() !== "";

      if ((hasEmailValue || hasSiretValue) && checkboxRef.current) {
        checkboxRef.current.checked = true;
      }
    };

    emailInput?.addEventListener("input", handleInput);
    siretInput?.addEventListener("input", handleInput);

    return () => {
      emailInput?.removeEventListener("input", handleInput);
      siretInput?.removeEventListener("input", handleInput);
    };
  }, [searchEmailId, searchSiretId]);

  return (
    <div class="fr-checkbox-group">
      <input
        ref={checkboxRef}
        defaultChecked={initialChecked}
        id={id}
        name={name}
        type="checkbox"
        value={value}
      />
      <label class="fr-label" for={id}>
        Voir les demandes traitées
      </label>
    </div>
  );
}
