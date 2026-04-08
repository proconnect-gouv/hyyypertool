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
    expect(result).toMatchInlineSnapshot(`
      {
        "end": 9,
        "start": 0,
        "text": "email:foo",
      }
    `);
  });

  test("returns second token when cursor is on it", () => {
    const result = get_token_at_cursor("email:foo is:pending", 12);
    expect(result).toMatchInlineSnapshot(`
      {
        "end": 20,
        "start": 10,
        "text": "is:pending",
      }
    `);
  });

  test("returns empty token when cursor is after trailing space", () => {
    const result = get_token_at_cursor("email:foo ", 10);
    expect(result).toMatchInlineSnapshot(`
      {
        "end": 10,
        "start": 10,
        "text": "",
      }
    `);
  });

  test("returns first token when cursor is at position 0", () => {
    const result = get_token_at_cursor("is:pending email:foo", 0);
    expect(result).toMatchInlineSnapshot(`
      {
        "end": 10,
        "start": 0,
        "text": "is:pending",
      }
    `);
  });

  test("handles quoted tokens", () => {
    const result = get_token_at_cursor('-service:"my app" email:foo', 10);
    expect(result).toMatchInlineSnapshot(`
      {
        "end": 17,
        "start": 0,
        "text": "-service:"my app"",
      }
    `);
  });

  test("returns empty token for empty string", () => {
    const result = get_token_at_cursor("", 0);
    expect(result).toMatchInlineSnapshot(`
      {
        "end": 0,
        "start": 0,
        "text": "",
      }
    `);
  });

  test("returns token at boundary (cursor at end of token)", () => {
    const result = get_token_at_cursor("email:foo is:pending", 9);
    expect(result).toMatchInlineSnapshot(`
      {
        "end": 9,
        "start": 0,
        "text": "email:foo",
      }
    `);
  });

  test("returns second token at its start boundary", () => {
    const result = get_token_at_cursor("email:foo is:pending", 10);
    expect(result).toMatchInlineSnapshot(`
      {
        "end": 20,
        "start": 10,
        "text": "is:pending",
      }
    `);
  });
});

describe("replace_token_at_cursor", () => {
  test("replaces first token", () => {
    const result = replace_token_at_cursor(
      "em is:pending",
      1,
      "email:test@foo.com",
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "cursor": 18,
        "text": "email:test@foo.com is:pending",
      }
    `);
  });

  test("replaces last token", () => {
    const result = replace_token_at_cursor(
      "email:foo is:pen",
      15,
      "is:pending",
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "cursor": 20,
        "text": "email:foo is:pending",
      }
    `);
  });

  test("replaces middle token", () => {
    const result = replace_token_at_cursor(
      "email:foo by: siret:123",
      12,
      "by:admin@gov.fr",
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "cursor": 25,
        "text": "email:foo by:admin@gov.fr siret:123",
      }
    `);
  });

  test("inserts at trailing space (empty token)", () => {
    const result = replace_token_at_cursor("email:foo ", 10, "is:pending");
    expect(result).toMatchInlineSnapshot(`
      {
        "cursor": 20,
        "text": "email:foo is:pending",
      }
    `);
  });
});

describe("get_suggestions", () => {
  const moderators = ["admin@gov.fr", "mod@gov.fr"];
  const sp_names = ["App1", "App2", "My App", ""];

  describe("pivot item", () => {
    test("positive qualifier shows Exclure pivot first", () => {
      const result = get_suggestions("is:", moderators, sp_names);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "hint": "-is:",
          "insert": "-is:",
          "is_category": true,
          "label": "Exclure",
        }
      `);
    });

    test("negative qualifier shows positive pivot first", () => {
      const result = get_suggestions("-type:", moderators, sp_names);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "hint": "type:",
          "insert": "type:",
          "is_category": true,
          "label": "Type",
        }
      `);
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
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "hint": "pending",
            "insert": "is:pending",
            "label": "En attente (non modéré)",
          },
          {
            "hint": "processed",
            "insert": "is:processed",
            "label": "Traitées (déjà modéré)",
          },
        ]
      `);
    });

    test("filters by partial value", () => {
      const result = get_suggestions("is:pen", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "hint": "pending",
            "insert": "is:pending",
            "label": "En attente (non modéré)",
          },
        ]
      `);
    });

    test("-is: returns negated status suggestions", () => {
      const values = get_suggestions("-is:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "hint": "pending",
            "insert": "-is:pending",
            "label": "En attente (non modéré)",
          },
          {
            "hint": "processed",
            "insert": "-is:processed",
            "label": "Traitées (déjà modéré)",
          },
        ]
      `);
    });
  });

  describe("type: qualifier with negation", () => {
    test("-type: returns suggestions with negation prefix", () => {
      const values = get_suggestions("-type:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "hint": "non_verified_domain",
            "insert": "-type:non_verified_domain",
            "label": "Non vérifié",
          },
          {
            "hint": "organization_join_block",
            "insert": "-type:organization_join_block",
            "label": "A traiter",
          },
        ]
      `);
    });

    test("type: without negation returns suggestions without prefix", () => {
      const values = get_suggestions("type:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "hint": "non_verified_domain",
            "insert": "type:non_verified_domain",
            "label": "Non vérifié",
          },
          {
            "hint": "organization_join_block",
            "insert": "type:organization_join_block",
            "label": "A traiter",
          },
        ]
      `);
    });
  });

  describe("by: qualifier with negation", () => {
    test("by: returns moderator suggestions", () => {
      const values = get_suggestions("by:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "insert": "by:admin@gov.fr",
            "label": "admin@gov.fr",
          },
          {
            "insert": "by:mod@gov.fr",
            "label": "mod@gov.fr",
          },
        ]
      `);
    });

    test("-by: returns negated moderator suggestions", () => {
      const values = get_suggestions("-by:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "insert": "-by:admin@gov.fr",
            "label": "admin@gov.fr",
          },
          {
            "insert": "-by:mod@gov.fr",
            "label": "mod@gov.fr",
          },
        ]
      `);
    });

    test("by:adm filters moderators", () => {
      const result = get_suggestions("by:adm", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "insert": "by:admin@gov.fr",
            "label": "admin@gov.fr",
          },
        ]
      `);
    });

    test("-by:adm filters negated moderators", () => {
      const result = get_suggestions("-by:adm", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "insert": "-by:admin@gov.fr",
            "label": "admin@gov.fr",
          },
        ]
      `);
    });
  });

  describe("service: qualifier", () => {
    test("-service: returns sp_names suggestions", () => {
      const values = get_suggestions("-service:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "insert": "-service:App1",
            "label": "App1",
          },
          {
            "insert": "-service:App2",
            "label": "App2",
          },
          {
            "insert": "-service:"My App"",
            "label": "My App",
          },
          {
            "insert": "-service:""",
            "label": "(sans service)",
          },
        ]
      `);
    });

    test("service: returns sp_names suggestions with positive prefix", () => {
      const values = get_suggestions("service:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "insert": "service:App1",
            "label": "App1",
          },
          {
            "insert": "service:App2",
            "label": "App2",
          },
          {
            "insert": "service:"My App"",
            "label": "My App",
          },
          {
            "insert": "service:""",
            "label": "(sans service)",
          },
        ]
      `);
    });

    test("-service:App1 filters by partial", () => {
      const result = get_suggestions("-service:App1", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "insert": "-service:App1",
            "label": "App1",
          },
        ]
      `);
    });

    test("service:App filters multiple matching names", () => {
      const result = get_suggestions("service:App", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "insert": "service:App1",
            "label": "App1",
          },
          {
            "insert": "service:App2",
            "label": "App2",
          },
          {
            "insert": "service:"My App"",
            "label": "My App",
          },
        ]
      `);
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
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "hint": "2026-03-18",
            "insert": "date:2026-03-18",
            "label": "Aujourd'hui",
          },
          {
            "hint": "2026-03-17",
            "insert": "date:2026-03-17",
            "label": "Hier",
          },
          {
            "hint": "2026-03-16",
            "insert": "date:2026-03-16",
            "label": "Lundi",
          },
          {
            "hint": "2026-03-15",
            "insert": "date:2026-03-15",
            "label": "Dimanche",
          },
          {
            "hint": "2026-03-14",
            "insert": "date:2026-03-14",
            "label": "Samedi",
          },
          {
            "hint": "2026-03-13",
            "insert": "date:2026-03-13",
            "label": "Vendredi",
          },
          {
            "hint": "2026-03-12",
            "insert": "date:2026-03-12",
            "label": "Jeudi",
          },
        ]
      `);
    });

    test("-date: returns date suggestions with negation prefix", () => {
      const values = get_suggestions("-date:", moderators, sp_names).filter(
        (s) => !s.is_category,
      );
      expect(values).toMatchInlineSnapshot(`
        [
          {
            "hint": "2026-03-18",
            "insert": "-date:2026-03-18",
            "label": "Aujourd'hui",
          },
          {
            "hint": "2026-03-17",
            "insert": "-date:2026-03-17",
            "label": "Hier",
          },
          {
            "hint": "2026-03-16",
            "insert": "-date:2026-03-16",
            "label": "Lundi",
          },
          {
            "hint": "2026-03-15",
            "insert": "-date:2026-03-15",
            "label": "Dimanche",
          },
          {
            "hint": "2026-03-14",
            "insert": "-date:2026-03-14",
            "label": "Samedi",
          },
          {
            "hint": "2026-03-13",
            "insert": "-date:2026-03-13",
            "label": "Vendredi",
          },
          {
            "hint": "2026-03-12",
            "insert": "-date:2026-03-12",
            "label": "Jeudi",
          },
        ]
      `);
    });

    test("date: filters by partial date", () => {
      const result = get_suggestions("date:2026-03-18", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "hint": "2026-03-18",
            "insert": "date:2026-03-18",
            "label": "Aujourd'hui",
          },
        ]
      `);
    });

    test("date: filters by label", () => {
      const result = get_suggestions("date:hier", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "hint": "2026-03-17",
            "insert": "date:2026-03-17",
            "label": "Hier",
          },
        ]
      `);
    });
  });

  describe("email: and siret: qualifiers", () => {
    test("email: returns only pivot", () => {
      const result = get_suggestions("email:", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "hint": "-email:",
            "insert": "-email:",
            "is_category": true,
            "label": "Exclure",
          },
        ]
      `);
    });

    test("-email: returns only pivot", () => {
      const result = get_suggestions("-email:", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "hint": "email:",
            "insert": "email:",
            "is_category": true,
            "label": "Email",
          },
        ]
      `);
    });

    test("siret: returns only pivot", () => {
      const result = get_suggestions("siret:", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "hint": "-siret:",
            "insert": "-siret:",
            "is_category": true,
            "label": "Exclure",
          },
        ]
      `);
    });

    test("-siret: returns only pivot", () => {
      const result = get_suggestions("-siret:", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "hint": "siret:",
            "insert": "siret:",
            "is_category": true,
            "label": "Siret",
          },
        ]
      `);
    });
  });

  describe("unknown qualifier", () => {
    test("returns empty for unknown qualifier", () => {
      expect(
        get_suggestions("foo:", moderators, sp_names),
      ).toMatchInlineSnapshot(`[]`);
    });

    test("returns empty for negated unknown qualifier", () => {
      expect(
        get_suggestions("-foo:", moderators, sp_names),
      ).toMatchInlineSnapshot(`[]`);
    });
  });

  describe("empty and bare tokens", () => {
    test("empty token returns qualifier categories", () => {
      const result = get_suggestions("", moderators, sp_names);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "hint": "is:",
            "insert": "is:",
            "is_category": true,
            "label": "Statut",
          },
          {
            "hint": "date:",
            "insert": "date:",
            "is_category": true,
            "label": "Date",
          },
          {
            "hint": "email:",
            "insert": "email:",
            "is_category": true,
            "label": "Email",
          },
          {
            "hint": "siret:",
            "insert": "siret:",
            "is_category": true,
            "label": "Siret",
          },
          {
            "hint": "type:",
            "insert": "type:",
            "is_category": true,
            "label": "Type",
          },
          {
            "hint": "by:",
            "insert": "by:",
            "is_category": true,
            "label": "Modérateur",
          },
          {
            "hint": "service:",
            "insert": "service:",
            "is_category": true,
            "label": "Service",
          },
        ]
      `);
    });

    test("bare text with no qualifier match returns empty", () => {
      expect(
        get_suggestions("hello", moderators, sp_names),
      ).toMatchInlineSnapshot(`[]`);
    });
  });
});
