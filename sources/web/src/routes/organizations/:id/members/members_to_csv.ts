//

import type { get_members_for_export } from "./get_members_for_export.query";

//

const csv_header = [
  "Prénom",
  "Nom",
  "Email",
  "Fonction",
  "Interne",
  "Type de vérification",
  "Ajouté le",
  "Modifié le",
];

export function members_to_csv(
  members: Awaited<ReturnType<typeof get_members_for_export>>,
) {
  const rows = members.map((member) => [
    member.given_name,
    member.family_name,
    member.email,
    member.job,
    member.is_external ? "non" : "oui",
    member.verification_type,
    member.created_at,
    member.updated_at,
  ]);
  return [csv_header, ...rows]
    .map((row) => row.map(csv_cell).join(","))
    .join("\r\n");
}

// A leading = + - @ makes spreadsheets run the cell as a formula (OWASP CSV injection).
function csv_cell(value: string | null) {
  const text = (value ?? "").replace(/^[=+\-@\t\r]/, "'$&");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
