//

import { expect, test } from "bun:test";
import { elected_defaults } from "./defaults";
import { hyyyperdate } from "./hyyyperdate";
import { list_hyyyperdays } from "./list_hyyyperdays";
import { load_hyyyperday } from "./load_hyyyperday";

//

test("every entry on disk is a real date whose HyyyperDay greets Hyyypertool", async () => {
  for (const entry of await list_hyyyperdays()) {
    const loaded = await load_hyyyperday(
      hyyyperdate.parse(entry.replaceAll("/", "-")),
    );
    const html = (
      <loaded.HyyyperDay assets_path="/assets" nonce="nonce" />
    ).toString();

    expect({
      entry: loaded.entry,
      greets: html.includes("Hyyypertool"),
    }).toEqual({ entry, greets: true });
  }
});

test("every elected default is an entry on disk", async () => {
  expect(await list_hyyyperdays()).toEqual(
    expect.arrayContaining([...elected_defaults]),
  );
});
