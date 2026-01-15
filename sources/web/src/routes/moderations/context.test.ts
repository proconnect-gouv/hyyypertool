//

import { expect, test } from "bun:test";
import { search_schema } from "./context";

//

test("SearchSchema > empty object", () => {
  const search = search_schema.parse({});

  expect(search).toEqual({
    day: undefined,
    hide_join_organization: false,
    hide_non_verified_domain: false,
    processed_requests: false,
    search_email: "",
    search_moderated_by: "",
    search_siret: "",
  });
});

test("SearchSchema > day 2011-01-11", () => {
  const search = search_schema.parse({ day: "2011-01-11" });

  expect(search).toEqual({
    day: new Date("2011-01-11"),
    hide_join_organization: false,
    hide_non_verified_domain: false,
    processed_requests: false,
    search_email: "",
    search_moderated_by: "",
    search_siret: "",
  });
});
