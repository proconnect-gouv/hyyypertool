//

import { describe, expect, test } from "bun:test";
import { parse_q, serialize_q } from "./parse_q";

//

describe("parse_q", () => {
  test("parses is:pending", () => {
    const result = parse_q("is:pending");
    expect(result.processed_requests).toBe(false);
  });

  test("parses is:processed", () => {
    const result = parse_q("is:processed");
    expect(result.processed_requests).toBe(true);
  });

  test("parses email qualifier", () => {
    const result = parse_q("email:foo@bar.com");
    expect(result.search_email).toBe("foo@bar.com");
  });

  test("parses siret qualifier", () => {
    const result = parse_q("siret:123456");
    expect(result.search_siret).toBe("123456");
  });

  test("parses by qualifier", () => {
    const result = parse_q("by:admin@gov.fr");
    expect(result.search_moderated_by).toBe("admin@gov.fr");
  });

  test("parses date qualifier", () => {
    const result = parse_q("date:2026-03-14");
    expect(result.day).toEqual(new Date("2026-03-14"));
  });

  test("parses -type:non_verified_domain", () => {
    const result = parse_q("-type:non_verified_domain");
    expect(result.exclude_types).toContain("non_verified_domain");
  });

  test("parses -type:organization_join_block", () => {
    const result = parse_q("-type:organization_join_block");
    expect(result.exclude_types).toContain("organization_join_block");
  });

  test("parses multiple -service tokens", () => {
    const result = parse_q("-service:App1 -service:App2");
    expect(result.exclude_sp_names).toEqual(["App1", "App2"]);
  });

  test("parses bare text as search_text", () => {
    const result = parse_q("foo");
    expect(result.search_text).toBe("foo");
  });

  test("parses multi-word bare text", () => {
    const result = parse_q("foo bar");
    expect(result.search_text).toBe("foo bar");
  });

  test("parses -email: as exclusion", () => {
    const result = parse_q("-email:yop");
    expect(result.exclude_email).toBe("yop");
    expect(result.search_email).toBe("");
  });

  test("parses -siret: as exclusion", () => {
    const result = parse_q("-siret:123");
    expect(result.exclude_siret).toBe("123");
    expect(result.search_siret).toBe("");
  });

  test("parses -by: as exclusion", () => {
    const result = parse_q("-by:admin@gov.fr");
    expect(result.exclude_moderated_by).toBe("admin@gov.fr");
    expect(result.search_moderated_by).toBe("");
  });

  test("parses quoted values", () => {
    const result = parse_q('email:"foo bar@baz.com"');
    expect(result.search_email).toBe("foo bar@baz.com");
  });

  test("parses complex query with all qualifiers", () => {
    const result = parse_q(
      "is:pending email:foo@bar.com -type:non_verified_domain -service:App1 -service:App2 date:2026-03-14 by:admin@gov.fr",
    );
    expect(result.processed_requests).toBe(false);
    expect(result.search_email).toBe("foo@bar.com");
    expect(result.exclude_types).toContain("non_verified_domain");
    expect(result.exclude_sp_names).toEqual(["App1", "App2"]);
    expect(result.day).toEqual(new Date("2026-03-14"));
    expect(result.search_moderated_by).toBe("admin@gov.fr");
  });

  test("empty string has no status filter", () => {
    const result = parse_q("");
    expect(result.processed_requests).toBeUndefined();
    expect(result.search_text).toBe("");
  });

  test("handles empty string for exclude_sp_names (sans service)", () => {
    const result = parse_q('-service:""');
    expect(result.exclude_sp_names).toEqual([""]);
  });

  test("parses -is:pending as processed_requests true", () => {
    const result = parse_q("-is:pending");
    expect(result.processed_requests).toBe(true);
  });

  test("parses -is:processed as processed_requests false", () => {
    const result = parse_q("-is:processed");
    expect(result.processed_requests).toBe(false);
  });

  test("parses -date qualifier as exclude_day", () => {
    const result = parse_q("-date:2026-03-14");
    expect(result.exclude_day).toEqual(new Date("2026-03-14"));
    expect(result.day).toBeUndefined();
  });
});

describe("serialize_q", () => {
  test("serializes pending state", () => {
    const result = serialize_q(parse_q("is:pending"));
    expect(result).toBe("is:pending");
  });

  test("serializes processed state", () => {
    const result = serialize_q(parse_q("is:processed"));
    expect(result).toBe("is:processed");
  });

  test("serializes empty query (no is: token)", () => {
    const result = serialize_q(parse_q(""));
    expect(result).toBe("");
  });

  test("serializes all qualifiers", () => {
    const search = parse_q(
      "is:processed email:foo@bar.com siret:123 by:admin@gov.fr date:2026-03-14 -type:non_verified_domain -type:organization_join_block -service:App1 -service:App2",
    );
    const result = serialize_q(search);
    expect(result).toContain("is:processed");
    expect(result).toContain("email:foo@bar.com");
    expect(result).toContain("siret:123");
    expect(result).toContain("by:admin@gov.fr");
    expect(result).toContain("date:2026-03-14");
    expect(result).toContain("-type:non_verified_domain");
    expect(result).toContain("-type:organization_join_block");
    expect(result).toContain("-service:App1");
    expect(result).toContain("-service:App2");
  });

  test("quotes values with spaces", () => {
    const search = parse_q("is:pending");
    search.search_email = "foo bar@baz.com";
    const result = serialize_q(search);
    expect(result).toContain('email:"foo bar@baz.com"');
  });
});

describe("roundtrip", () => {
  test("parse then serialize preserves meaning", () => {
    const q =
      "is:processed email:test@example.com siret:12345 -type:non_verified_domain -service:MyApp";
    const search = parse_q(q);
    const serialized = serialize_q(search);
    const reparsed = parse_q(serialized);

    expect(reparsed.processed_requests).toBe(search.processed_requests);
    expect(reparsed.search_email).toBe(search.search_email);
    expect(reparsed.search_siret).toBe(search.search_siret);
    expect(reparsed.exclude_types).toEqual(search.exclude_types);
    expect(reparsed.exclude_sp_names).toEqual(search.exclude_sp_names);
  });

  test("bare text roundtrips", () => {
    const q = "is:pending hello";
    const search = parse_q(q);
    const serialized = serialize_q(search);
    const reparsed = parse_q(serialized);
    expect(reparsed.search_text).toBe("hello");
  });
});
