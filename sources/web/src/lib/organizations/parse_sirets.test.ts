//

import { expect, test } from "bun:test";
import { parse_sirets } from "./parse_sirets";

//

test("déduplique les SIRET en double", () => {
  const { valid, invalid } = parse_sirets(
    "82271212100018\n82271212100018\n41816609600069",
  );
  expect(valid).toEqual(["82271212100018", "41816609600069"]);
  expect(invalid).toEqual([]);
});

test("ignore les lignes vides et les séparateurs blancs/virgules/points-virgules", () => {
  const { valid, invalid } = parse_sirets(
    "  82271212100018,\n\n 41816609600069 ; 39234600300198  ",
  );
  expect(valid).toEqual(["82271212100018", "41816609600069", "39234600300198"]);
  expect(invalid).toEqual([]);
});

test("sépare les SIRET valides des invalides", () => {
  const { valid, invalid } = parse_sirets(
    "82271212100018\n123456\n00557246600026\n0000000000000",
  );
  expect(valid).toEqual(["82271212100018", "00557246600026"]);
  expect(invalid).toEqual(["123456", "0000000000000"]);
});

test("retourne des listes vides pour une entrée vide", () => {
  const { valid, invalid } = parse_sirets("");
  expect(valid).toEqual([]);
  expect(invalid).toEqual([]);
});
