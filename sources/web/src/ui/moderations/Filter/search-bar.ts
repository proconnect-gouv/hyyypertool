//

export interface Suggestion {
  label: string;
  hint?: string;
  insert: string;
  /** If true, selecting this just inserts the qualifier prefix and keeps the dropdown open */
  is_category?: boolean;
}

const NO_SERVICE_LABEL = "(sans service)";

function quote(s: string): string {
  if (s.includes(" ")) return `"${s}"`;
  return s;
}

//

/** Find the token at the cursor position and return it along with its start/end offsets. */
export function get_token_at_cursor(value: string, cursor: number) {
  const parts: { text: string; start: number; end: number }[] = [];
  let current = "";
  let start = 0;
  let in_quotes = false;
  let quote_char = "";

  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (in_quotes) {
      current += ch;
      if (ch === quote_char) in_quotes = false;
    } else if (ch === '"' || ch === "'") {
      in_quotes = true;
      quote_char = ch;
      current += ch;
    } else if (ch === " ") {
      if (current) {
        parts.push({ text: current, start, end: i });
        current = "";
      }
      start = i + 1;
    } else {
      current += ch;
    }
  }
  if (current) parts.push({ text: current, start, end: value.length });

  for (const part of parts) {
    if (cursor >= part.start && cursor <= part.end) return part;
  }
  return { text: "", start: cursor, end: cursor };
}

export function replace_token_at_cursor(
  value: string,
  cursor: number,
  replacement: string,
): { text: string; cursor: number } {
  const token = get_token_at_cursor(value, cursor);
  const new_text =
    value.slice(0, token.start) + replacement + value.slice(token.end);
  return { text: new_text, cursor: token.start + replacement.length };
}

//

function get_date_suggestions(prefix = ""): Suggestion[] {
  const today = new Date();
  const day_names = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const suggestions: Suggestion[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = format_date(d);
    let label: string;
    if (i === 0) label = "Aujourd'hui";
    else if (i === 1) label = "Hier";
    else label = day_names[d.getDay()]!;

    suggestions.push({ label, hint: iso, insert: `${prefix}date:${iso}` });
  }
  return suggestions;
}

function format_date(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const qualifier_labels: Record<string, string> = {
  is: "Statut",
  date: "Date",
  email: "Email",
  siret: "Siret",
  type: "Type",
  by: "Modérateur",
  service: "Service",
};

const CATEGORIES: Suggestion[] = Object.entries(qualifier_labels).map(
  ([name, label]) => ({
    label,
    hint: `${name}:`,
    insert: `${name}:`,
    is_category: true,
  }),
);

export function get_suggestions(
  token: string,
  moderators_list: string[],
  sp_names_list: string[],
): Suggestion[] {
  if (!token) return CATEGORIES;

  const qual_match = /^(-?\w+):(.*)$/.exec(token);
  if (qual_match) {
    const qualifier = qual_match[1]! + ":";
    const partial = qual_match[2]!.toLowerCase();
    return get_value_suggestions(
      qualifier,
      partial,
      moderators_list,
      sp_names_list,
    );
  }

  const lower = token.toLowerCase();
  return CATEGORIES.filter(
    (c) =>
      c.label.toLowerCase().includes(lower) ||
      c.hint?.toLowerCase().includes(lower) ||
      c.insert.toLowerCase().includes(lower),
  );
}

const qualifier_suggestions: Record<
  string,
  (
    partial: string,
    prefix: string,
    moderators: string[],
    sp_names: string[],
  ) => Suggestion[]
> = {
  is: (partial, prefix) =>
    [
      {
        label: "En attente (non modéré)",
        hint: "pending",
        insert: `${prefix}is:pending`,
      },
      {
        label: "Traitées (déjà modéré)",
        hint: "processed",
        insert: `${prefix}is:processed`,
      },
    ].filter(
      (s) =>
        s.hint!.includes(partial) || s.label.toLowerCase().includes(partial),
    ),

  date: (partial, prefix) =>
    get_date_suggestions(prefix).filter(
      (s) =>
        s.hint!.includes(partial) || s.label.toLowerCase().includes(partial),
    ),

  type: (partial, prefix) =>
    [
      {
        label: "Non vérifié",
        hint: "non_verified_domain",
        insert: `${prefix}type:non_verified_domain`,
      },
      {
        label: "A traiter",
        hint: "organization_join_block",
        insert: `${prefix}type:organization_join_block`,
      },
    ].filter(
      (s) =>
        s.hint!.includes(partial) || s.label.toLowerCase().includes(partial),
    ),

  service: (partial, prefix, _moderators, sp_names) =>
    sp_names
      .filter((s) => (s || NO_SERVICE_LABEL).toLowerCase().includes(partial))
      .map((s) => ({
        label: s || NO_SERVICE_LABEL,
        insert: `${prefix}service:${s ? quote(s) : '""'}`,
      })),

  by: (partial, prefix, moderators) =>
    moderators
      .filter((m) => m.toLowerCase().includes(partial))
      .map((m) => ({ label: m, insert: `${prefix}by:${m}` })),
};

function get_value_suggestions(
  qualifier: string,
  partial: string,
  moderators_list: string[],
  sp_names_list: string[],
): Suggestion[] {
  const negated = qualifier.startsWith("-");
  const name = qualifier.replace(/^-/, "").replace(/:$/, "");
  const prefix = negated ? "-" : "";
  const handler = qualifier_suggestions[name];
  const values = handler
    ? handler(partial, prefix, moderators_list, sp_names_list)
    : [];

  // When partial is empty, offer a pivot to the opposite polarity
  if (!partial && qualifier_labels[name]) {
    const pivot: Suggestion = negated
      ? {
          label: qualifier_labels[name]!,
          hint: `${name}:`,
          insert: `${name}:`,
          is_category: true,
        }
      : {
          label: "Exclure",
          hint: `-${name}:`,
          insert: `-${name}:`,
          is_category: true,
        };
    return [pivot, ...values];
  }

  return values;
}
