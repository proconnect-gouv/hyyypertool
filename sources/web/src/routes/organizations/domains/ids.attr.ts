//

const ids = {
  describedby: "hyyyper_domains_heading",
  table: "hyyyper_domains_table",
  search: "hyyyper_domains_search",
} as const;

const targets = {
  describedby: `#${ids.describedby}`,
  table: `#${ids.table}`,
  search: `#${ids.search}`,
} as const;

export const domains_attrs = {
  ids,
  targets,
} as const;
