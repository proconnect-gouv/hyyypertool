import { tag } from "@~/app.ui/tag";
import {
  Verification_Type_Schema,
  type Verification_Type,
} from "@~/identite-proconnect.lib/verification_type";

const verificationType: Array<[Verification_Type, string]> = [
  [Verification_Type_Schema.enum.official_contact_email, "Mail officiel"],
  [
    Verification_Type_Schema.enum.in_liste_dirigeants_rna,
    "Liste des dirigeants RNA",
  ],
  [
    Verification_Type_Schema.enum.in_liste_dirigeants_rne,
    "Liste des dirigeants RNE",
  ],
  [Verification_Type_Schema.enum.proof_received, "Justificatif transmis"],
];

export function TagInput() {
  return (
    <ul class="fr-tags-group">
      {verificationType.map(([value, key]) => (
        <li key={key}>
          <label class={tag()}>
            <input
              hidden
              class="m-1"
              type="radio"
              value={value ?? "null"}
              name="verification_type"
            />
            {key}
          </label>
        </li>
      ))}
    </ul>
  );
}
