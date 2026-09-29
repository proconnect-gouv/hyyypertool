import { Scenario, config } from "./index";

// Run by index.feature.test.ts: this Scenario must fail. With no
// `config.url`, the first step throws; the step after it must not run.
config.timeout = 100;

Scenario("a failed step skips the steps after it", ({ I }) => {
  I.amOnPage("/");
  I.see("never checked");
});
