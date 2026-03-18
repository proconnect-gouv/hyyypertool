//

import { beforeAll, describe, expect, setSystemTime, test } from "bun:test";
import {
  get_suggestions,
  get_token_at_cursor,
  replace_token_at_cursor,
} from "./search-bar";

//

describe("get_token_at_cursor", () => {
  test("returns token at cursor in the middle", () => {
    const result = get_token_at_cursor("email:foo is:pending", 5);
    expect(result.text).toBe("email:foo");
    expect(result.start).toBe(0);
    expect(result.end).toBe(9);
  });

  test("returns second token when cursor is on it", () => {
    const result = get_token_at_cursor("email:foo is:pending", 12);
    expect(result.text).toBe("is:pending");
    expect(result.start).toBe(10);
    expect(result.end).toBe(20);
  });

  test("returns empty token when cursor is after trailing space", () => {
    const result = get_token_at_cursor("email:foo ", 10);
    expect(result.text).toBe("");
  });

  test("returns first token when cursor is at position 0", () => {
    const result = get_token_at_cursor("is:pending email:foo", 0);
    expect(result.text).toBe("is:pending");
  });

  test("handles quoted tokens", () => {
    const result = get_token_at_cursor('-service:"my app" email:foo', 10);
    expect(result.text).toBe('-service:"my app"');
    expect(result.start).toBe(0);
    expect(result.end).toBe(17);
  });

  test("returns empty token for empty string", () => {
    const result = get_token_at_cursor("", 0);
    expect(result.text).toBe("");
  });

  test("returns token at boundary (cursor at end of token)", () => {
    const result = get_token_at_cursor("email:foo is:pending", 9);
    expect(result.text).toBe("email:foo");
  });

  test("returns second token at its start boundary", () => {
    const result = get_token_at_cursor("email:foo is:pending", 10);
    expect(result.text).toBe("is:pending");
  });
});

describe("replace_token_at_cursor", () => {
  test("replaces first token", () => {
    const result = replace_token_at_cursor(
      "em is:pending",
      1,
      "email:test@foo.com",
    );
    expect(result.text).toBe("email:test@foo.com is:pending");
    expect(result.cursor).toBe(18);
  });

  test("replaces last token", () => {
    const result = replace_token_at_cursor(
      "email:foo is:pen",
      15,
      "is:pending",
    );
    expect(result.text).toBe("email:foo is:pending");
    expect(result.cursor).toBe(20);
  });

  test("replaces middle token", () => {
    const result = replace_token_at_cursor(
      "email:foo by: siret:123",
      12,
      "by:admin@gov.fr",
    );
    expect(result.text).toBe("email:foo by:admin@gov.fr siret:123");
  });

  test("inserts at trailing space (empty token)", () => {
    const result = replace_token_at_cursor("email:foo ", 10, "is:pending");
    expect(result.text).toBe("email:foo is:pending");
  });
});

describe("get_suggestions", () => {
  const moderators = ["admin@gov.fr", "mod@gov.fr"];
  const sp_names = ["App1", "App2", "My App", ""];

  describe("pivot item", () => {
    test("positive qualifier shows Exclure pivot first", () => {
      const result = get_suggestions("is:", moderators, sp_names);
      expect(result[0]!.insert).toBe("-is:");
      expect(result[0]!.is_category).toBe(true);
      expect(result[0]!.label).toBe("Exclure");
    });

    test("negative qualifier shows positive pivot first", () => {
      const result = get_suggestions("-type:", moderators, sp_names);
      expect(result[0]!.insert).toBe("type:");
      expect(result[0]!.is_category).toBe(true);
      expect(result[0]!.label).toBe("Type");
    });

    test("pivot disappears when partial is typed", () => {
      const result = get_suggestions("is:pen", moderators, sp_names);
      expect(result.every((s) => !s.is_category)).toBe(true);
    });
  });

  describe("is: qualifier", () => {
    test("returns status suggestions after pivot", () => {
      const result = get_suggestions("is:", moderators, sp_names);
      const values = result.filter((s) => !s.is_category);
      expect(values).toHaveLength(2);
      expect(values[0]!.insert).toBe("is:pending");
      expect(values[1]!.insert).toBe("is:processed");
    });

    test("filters by partial value", () => {
      const result = get_suggestions("is:pen", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.insert).toBe("is:pending");
    });

    test("-is: returns negated status suggestions", () => {
      const values = get_suggestions("-is:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toHaveLength(2);
      expect(values[0]!.insert).toBe("-is:pending");
      expect(values[1]!.insert).toBe("-is:processed");
    });
  });

  describe("type: qualifier with negation", () => {
    test("-type: returns suggestions with negation prefix", () => {
      const values = get_suggestions("-type:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toHaveLength(2);
      expect(values[0]!.insert).toBe("-type:non_verified_domain");
      expect(values[1]!.insert).toBe("-type:organization_join_block");
    });

    test("type: without negation returns suggestions without prefix", () => {
      const values = get_suggestions("type:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toHaveLength(2);
      expect(values[0]!.insert).toBe("type:non_verified_domain");
      expect(values[1]!.insert).toBe("type:organization_join_block");
    });
  });

  describe("by: qualifier with negation", () => {
    test("by: returns moderator suggestions", () => {
      const values = get_suggestions("by:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toHaveLength(2);
      expect(values[0]!.insert).toBe("by:admin@gov.fr");
    });

    test("-by: returns negated moderator suggestions", () => {
      const values = get_suggestions("-by:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toHaveLength(2);
      expect(values[0]!.insert).toBe("-by:admin@gov.fr");
      expect(values[1]!.insert).toBe("-by:mod@gov.fr");
    });

    test("by:adm filters moderators", () => {
      const result = get_suggestions("by:adm", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.insert).toBe("by:admin@gov.fr");
    });

    test("-by:adm filters negated moderators", () => {
      const result = get_suggestions("-by:adm", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.insert).toBe("-by:admin@gov.fr");
    });
  });

  describe("service: qualifier", () => {
    test("-service: returns sp_names suggestions", () => {
      const values = get_suggestions("-service:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toHaveLength(4);
      expect(values[0]!.insert).toBe("-service:App1");
      expect(values[1]!.insert).toBe("-service:App2");
      expect(values[2]!.insert).toBe('-service:"My App"');
      expect(values[2]!.label).toBe("My App");
      expect(values[3]!.insert).toBe('-service:""');
      expect(values[3]!.label).toBe("(sans service)");
    });

    test("service: returns sp_names suggestions with positive prefix", () => {
      const values = get_suggestions("service:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toHaveLength(4);
      expect(values[0]!.insert).toBe("service:App1");
    });

    test("-service:App1 filters by partial", () => {
      const result = get_suggestions("-service:App1", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.insert).toBe("-service:App1");
    });
  });

  describe("date: qualifier", () => {
    beforeAll(() => {
      setSystemTime(new Date("2026-03-18T12:00:00.000Z")); // Wednesday
    });

    test("date: returns 7 date suggestions after pivot", () => {
      const values = get_suggestions("date:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toHaveLength(7);
      expect(values[0]!.label).toBe("Aujourd'hui");
      expect(values[0]!.hint).toBe("2026-03-18");
      expect(values[0]!.insert).toBe("date:2026-03-18");
      expect(values[1]!.label).toBe("Hier");
      expect(values[1]!.hint).toBe("2026-03-17");
    });

    test("-date: returns date suggestions with negation prefix", () => {
      const values = get_suggestions("-date:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toHaveLength(7);
      expect(values[0]!.insert).toBe("-date:2026-03-18");
      expect(values[1]!.insert).toBe("-date:2026-03-17");
    });

    test("date: filters by partial date", () => {
      const result = get_suggestions("date:2026-03-18", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.label).toBe("Aujourd'hui");
    });

    test("date: filters by label", () => {
      const result = get_suggestions("date:hier", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.label).toBe("Hier");
    });
  });

  describe("email: and siret: qualifiers", () => {
    test("email: returns only pivot", () => {
      const result = get_suggestions("email:", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.is_category).toBe(true);
    });

    test("-email: returns only pivot", () => {
      const result = get_suggestions("-email:", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.is_category).toBe(true);
    });

    test("siret: returns only pivot", () => {
      const result = get_suggestions("siret:", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.is_category).toBe(true);
    });

    test("-siret: returns only pivot", () => {
      const result = get_suggestions("-siret:", moderators, sp_names);
      expect(result).toHaveLength(1);
      expect(result[0]!.is_category).toBe(true);
    });
  });

  describe("unknown qualifier", () => {
    test("returns empty for unknown qualifier", () => {
      expect(get_suggestions("foo:", moderators, sp_names)).toEqual([]);
    });

    test("returns empty for negated unknown qualifier", () => {
      expect(get_suggestions("-foo:", moderators, sp_names)).toEqual([]);
    });
  });

  describe("empty and bare tokens", () => {
    test("empty token returns qualifier categories", () => {
      const result = get_suggestions("", moderators, sp_names);
      expect(result.length).toBe(7);
      expect(result.every((s) => s.is_category)).toBe(true);
    });

    test("bare text with no qualifier match returns empty", () => {
      expect(get_suggestions("hello", moderators, sp_names)).toEqual([]);
    });
  });
});
