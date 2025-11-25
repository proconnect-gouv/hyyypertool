import { tag } from "#src/ui/tag";
import {
  VerificationTypeSchema,
  type VerificationType,
} from "@~/identite-proconnect/types";

const verificationType: Array<[VerificationType, string]> = [
  [VerificationTypeSchema.enum.official_contact_email, "Mail officiel"],
  [
    VerificationTypeSchema.enum.in_liste_dirigeants_rna,
    "Liste des dirigeants RNA",
  ],
  [
    VerificationTypeSchema.enum.in_liste_dirigeants_rne,
    "Liste des dirigeants RNE",
  ],
  [VerificationTypeSchema.enum.proof_received, "Justificatif transmis"],
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
