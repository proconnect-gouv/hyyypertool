//

export interface Search {
  day: Date | undefined;
  search_email: string;
  search_moderated_by: string;
  search_siret: string;
  exclude_email: string;
  exclude_moderated_by: string;
  exclude_siret: string;
  exclude_sp_names: string[];
  processed_requests: boolean | undefined;
  hide_non_verified_domain: boolean;
  hide_join_organization: boolean;
  search_text: string;
}

//

export function parse_q(q: string): Search {
  const tokens = tokenize(q);
  const search: Search = {
    day: undefined,
    search_email: "",
    search_moderated_by: "",
    search_siret: "",
    exclude_email: "",
    exclude_moderated_by: "",
    exclude_siret: "",
    exclude_sp_names: [],
    processed_requests: undefined,
    hide_non_verified_domain: false,
    hide_join_organization: false,
    search_text: "",
  };

  const bare_parts: string[] = [];

  for (const token of tokens) {
    const negated_match = /^-(\w+):(.+)$/.exec(token);
    if (negated_match) {
      const qualifier = negated_match[1]!;
      const value = unquote(negated_match[2]!);

      if (qualifier === "type") {
        if (value === "non_verified_domain")
          search.hide_non_verified_domain = true;
        else if (value === "organization_join_block")
          search.hide_join_organization = true;
      } else if (qualifier === "service") {
        search.exclude_sp_names.push(value);
      } else if (qualifier === "email") {
        search.exclude_email = value;
      } else if (qualifier === "siret") {
        search.exclude_siret = value;
      } else if (qualifier === "by") {
        search.exclude_moderated_by = value;
      } else {
        bare_parts.push(token);
      }
      continue;
    }

    const is_match = /^is:(.+)$/.exec(token);
    if (is_match) {
      if (is_match[1] === "processed") search.processed_requests = true;
      else if (is_match[1] === "pending") search.processed_requests = false;
      continue;
    }

    const date_match = /^date:(.+)$/.exec(token);
    if (date_match) {
      const d = new Date(date_match[1]!);
      if (!isNaN(d.getTime())) search.day = d;
      continue;
    }

    const qualifier_match = /^(\w+):(.+)$/.exec(token);
    if (qualifier_match) {
      const qualifier = qualifier_match[1]!;
      const value = unquote(qualifier_match[2]!);
      if (qualifier === "email") search.search_email = value;
      else if (qualifier === "siret") search.search_siret = value;
      else if (qualifier === "by") search.search_moderated_by = value;
      else {
        bare_parts.push(token);
      }
      continue;
    }

    bare_parts.push(token);
  }

  search.search_text = bare_parts.join(" ");
  return search;
}

export function serialize_q(search: Search): string {
  const parts: string[] = [];

  if (search.processed_requests === true) {
    parts.push("is:processed");
  } else if (search.processed_requests === false) {
    parts.push("is:pending");
  }

  if (search.search_email) {
    parts.push(`email:${quote(search.search_email)}`);
  }

  if (search.exclude_email) {
    parts.push(`-email:${quote(search.exclude_email)}`);
  }

  if (search.search_siret) {
    parts.push(`siret:${quote(search.search_siret)}`);
  }

  if (search.exclude_siret) {
    parts.push(`-siret:${quote(search.exclude_siret)}`);
  }

  if (search.search_moderated_by) {
    parts.push(`by:${quote(search.search_moderated_by)}`);
  }

  if (search.exclude_moderated_by) {
    parts.push(`-by:${quote(search.exclude_moderated_by)}`);
  }

  if (search.day) {
    parts.push(`date:${format_date(search.day)}`);
  }

  if (search.hide_non_verified_domain) {
    parts.push("-type:non_verified_domain");
  }

  if (search.hide_join_organization) {
    parts.push("-type:organization_join_block");
  }

  for (const sp of search.exclude_sp_names) {
    parts.push(`-service:${quote(sp)}`);
  }

  if (search.search_text) {
    parts.push(search.search_text);
  }

  return parts.join(" ");
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

function unquote(s: string): string {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

function quote(s: string): string {
  if (s.includes(" ")) return `"${s}"`;
  return s;
}

function format_date(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
