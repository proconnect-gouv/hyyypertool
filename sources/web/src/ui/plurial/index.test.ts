//

import { expect, test } from "bun:test";
import { formattedPlural, FrCardinalRules } from "./index";

//

test("returns 'one' for 0", () => {
  expect(FrCardinalRules.select(0)).toEqual("one");
});

test("returns 'one' for 1", () => {
  expect(FrCardinalRules.select(1)).toEqual("one");
});

test("returns 'other' for 2", () => {
  expect(FrCardinalRules.select(2)).toEqual("other");
});

test("returns 'other' for 42", () => {
  expect(FrCardinalRules.select(42)).toEqual("other");
});

//

test("returns 'pomme' for 0", () => {
  expect(formattedPlural(0, { one: "pomme", other: "pomme" })).toEqual("pomme");
});

test("returns 'pomme' for 1", () => {
  expect(formattedPlural(1, { one: "pomme", other: "pommes" })).toEqual(
    "pomme",
  );
});

test("returns 'pommes' for 2", () => {
  expect(formattedPlural(2, { one: "pomme", other: "pommes" })).toEqual(
    "pommes",
  );
});

test("returns 'pommes' for 42", () => {
  expect(formattedPlural(42, { one: "pomme", other: "pommes" })).toEqual(
    "pommes",
  );
});
