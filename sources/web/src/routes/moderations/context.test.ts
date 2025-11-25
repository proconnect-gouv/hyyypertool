//

import { expect, test } from "bun:test";
import { search_schema } from "./context";

//

test("SearchSchema > empty object", () => {
  const search = search_schema.parse({});

  expect(search).toEqual({
    day: undefined,
    search_siret: "",
    search_email: "",
    processed_requests: false,
    hide_non_verified_domain: false,
    hide_join_organization: false,
  });
});

test("SearchSchema > day 2011-01-11", () => {
  const search = search_schema.parse({ day: "2011-01-11" });

  expect(search).toEqual({
    day: new Date("2011-01-11"),
    search_siret: "",
    search_email: "",
    processed_requests: false,
    hide_non_verified_domain: false,
    hide_join_organization: false,
  });
});
