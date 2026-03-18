//

export type Token =
  | "by"
  | "date"
  | "email"
  | "is"
  | "service"
  | "siret"
  | "type";

export interface Search {
  day: Date | undefined;
  exclude_day: Date | undefined;
  exclude_email: string;
  exclude_moderated_by: string;
  exclude_siret: string;
  exclude_sp_names: string[];
  exclude_types: string[];
  processed_requests: boolean | undefined;
  search_email: string;
  search_moderated_by: string;
  search_siret: string;
  search_text: string;
  search_type: string;
  sp_names: string[];
}

const positive_handlers: Record<Token, (s: Search, value: string) => void> = {
  email: (search, v) => {
    search.search_email = v;
  },
  siret: (search, v) => {
    search.search_siret = v;
  },
  by: (search, v) => {
    search.search_moderated_by = v;
  },
  is: (search, v) => {
    if (v === "processed") search.processed_requests = true;
    if (v === "pending") search.processed_requests = false;
  },
  type: (search, v) => {
    search.search_type = v;
  },
  service: (search, v) => {
    search.sp_names.push(v);
  },
  date: (search, v) => {
    const d = new Date(v);
    if (!isNaN(d.getTime())) search.day = d;
  },
};

const negative_handlers: Record<Token, (s: Search, value: string) => void> = {
  email: (search, v) => {
    search.exclude_email = v;
  },
  siret: (search, v) => {
    search.exclude_siret = v;
  },
  by: (search, v) => {
    search.exclude_moderated_by = v;
  },
  is: (search, v) => {
    if (v === "pending") search.processed_requests = true;
    if (v === "processed") search.processed_requests = false;
  },
  type: (search, v) => {
    search.exclude_types.push(v);
  },
  service: (search, v) => {
    search.exclude_sp_names.push(v);
  },
  date: (search, v) => {
    const d = new Date(v);
    if (!isNaN(d.getTime())) search.exclude_day = d;
  },
};

//

export function parse_q(q: string): Search {
  const tokens = tokenize(q);
  const search: Search = {
    day: undefined,
    exclude_day: undefined,
    exclude_email: "",
    exclude_moderated_by: "",
    exclude_siret: "",
    exclude_sp_names: [],
    exclude_types: [],
    processed_requests: undefined,
    search_email: "",
    search_moderated_by: "",
    search_siret: "",
    search_text: "",
    search_type: "",
    sp_names: [],
  };

  const bare_parts: string[] = [];

  for (const token of tokens) {
    const match = /^(-?)(\w+):(.+)$/.exec(token);
    if (match) {
      const handlers = match[1] ? negative_handlers : positive_handlers;
      const handler = handlers[match[2] as Token];
      if (handler) {
        handler(search, unquote(match[3]!));
        continue;
      }
    }

    bare_parts.push(token);
  }

  search.search_text = bare_parts.join(" ");
  return search;
}

const serializers: Record<string, (s: Search) => string[]> = {
  is: (search) =>
    search.processed_requests === true
      ? ["is:processed"]
      : search.processed_requests === false
        ? ["is:pending"]
        : [],
  email: (search) => [
    ...(search.search_email ? [`email:${quote(search.search_email)}`] : []),
    ...(search.exclude_email ? [`-email:${quote(search.exclude_email)}`] : []),
  ],
  siret: (search) => [
    ...(search.search_siret ? [`siret:${quote(search.search_siret)}`] : []),
    ...(search.exclude_siret ? [`-siret:${quote(search.exclude_siret)}`] : []),
  ],
  by: (search) => [
    ...(search.search_moderated_by
      ? [`by:${quote(search.search_moderated_by)}`]
      : []),
    ...(search.exclude_moderated_by
      ? [`-by:${quote(search.exclude_moderated_by)}`]
      : []),
  ],
  date: (search) => [
    ...(search.day ? [`date:${format_date(search.day)}`] : []),
    ...(search.exclude_day ? [`-date:${format_date(search.exclude_day)}`] : []),
  ],
  type: (search) => [
    ...(search.search_type ? [`type:${quote(search.search_type)}`] : []),
    ...search.exclude_types.map((t) => `-type:${quote(t)}`),
  ],
  service: (search) =>
    search.exclude_sp_names.map((sp) => `-service:${quote(sp)}`),
  text: (search) => (search.search_text ? [search.search_text] : []),
};

export function serialize_q(search: Search): string {
  return Object.values(serializers)
    .flatMap((fn) => fn(search))
    .join(" ");
}

//

function tokenize(q: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let in_quotes = false;
  let quote_char = "";

  for (let i = 0; i < q.length; i++) {
    const ch = q[i];

    if (in_quotes) {
      if (ch === quote_char) {
        in_quotes = false;
        current += ch;
      } else {
        current += ch;
      }
    } else if (ch === '"' || ch === "'") {
      in_quotes = true;
      quote_char = ch;
      current += ch;
    } else if (ch === " ") {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }

  if (current) tokens.push(current);
  return tokens;
}

function unquote(search: string): string {
  if (
    (search.startsWith('"') && search.endsWith('"')) ||
    (search.startsWith("'") && search.endsWith("'"))
  ) {
    return search.slice(1, -1);
  }
  return search;
}

function quote(search: string): string {
  if (search.includes(" ")) return `"${search}"`;
  return search;
}

function format_date(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
