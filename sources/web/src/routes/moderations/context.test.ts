//

import { expect, test } from "bun:test";
import { search_schema } from "./context";

//

test("SearchSchema > empty object (default q=is:pending -type:non_verified_domain)", () => {
  const { q: search } = search_schema.parse({});

  expect(search).toEqual({
    day: undefined,
    exclude_day: undefined,
    processed_requests: false,
    search_email: "",
    search_moderated_by: "",
    search_siret: "",
    exclude_email: "",
    exclude_moderated_by: "",
    exclude_siret: "",
    exclude_sp_names: [],
    exclude_types: ["non_verified_domain"],
    search_text: "",
    search_type: "",
    sp_names: [],
  });
});

test("SearchSchema > q with date", () => {
  const { q: search } = search_schema.parse({
    q: "is:pending date:2011-01-11",
  });

  expect(search).toEqual({
    day: new Date("2011-01-11"),
    exclude_day: undefined,
    processed_requests: false,
    search_email: "",
    search_moderated_by: "",
    search_siret: "",
    exclude_email: "",
    exclude_moderated_by: "",
    exclude_siret: "",
    exclude_sp_names: [],
    exclude_types: [],
    search_text: "",
    search_type: "",
    sp_names: [],
  });
});
