//

import { expect, test } from "bun:test";
import { extract_domain } from "./email_utils";

//

test("extract_domain from valid email", () => {
  expect(extract_domain("user@example.com")).toEqual("example.com");
});

test("extract_domain from another email", () => {
  expect(extract_domain("jean.bon@yopmail.fr")).toEqual("yopmail.fr");
});
