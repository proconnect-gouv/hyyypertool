//

import { expect, test } from "bun:test";
import { z_email_domain } from "./z_email_domain";

//

test("parse jeanbon@yopmail.com", () => {
  expect(z_email_domain.parse("jeanbon@yopmail.com")).toEqual("yopmail.com");
});
