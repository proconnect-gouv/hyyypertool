import { config } from "./config";
import type { Action } from "./page/checks";
import type { Page } from "./page/index";
import type { Locator } from "./protocol";

//

const TRANSIENT = /navigated or closed|navigation is already pending/;
const PRESS_CAP = 50;

const build = await Bun.build({
  entrypoints: [`${import.meta.dir}/page/index.ts`],
  format: "iife",
  target: "browser",
});
const [bundle] = build.outputs;
if (!build.success || !bundle)
  throw new AggregateError(build.logs, "buncept page bundle failed");
const PAGE = await bundle.text();

type Script<T> = { readonly result?: T; readonly source: string };

export const call = <K extends keyof Page>(
  name: K,
  ...args: Parameters<Page[K]>
): Script<ReturnType<Page[K]>> => ({
  source: `window.__buncept.${name}(${args.map((arg) => JSON.stringify(arg)).join(", ")})`,
});

export type Browser = Awaited<ReturnType<typeof create_browser>>;

export async function create_browser(view: Bun.WebView) {
  // Bun.WebView rejects concurrent calls ("an evaluate() is already
  // pending"), so every call to the view queues behind the previous one.
  let chain: Promise<unknown> = Promise.resolve();
  const serial = <T>(call: () => Promise<T>) => {
    const run = chain.then(call);
    chain = run.catch(() => {});
    return run;
  };
  const evaluate = <T>(script: Script<T>) =>
    serial(() => view.evaluate<T>(script.source));
  const on_new_document = (source: string) =>
    serial(() => view.cdp("Page.addScriptToEvaluateOnNewDocument", { source }));

  // Retries `read` until `done`, treating a page torn down by an in-flight
  // navigation as "not ready yet".
  async function until<T>(
    failure: string,
    done: (value: T) => boolean,
    script: Script<T>,
  ) {
    const deadline = Date.now() + config.timeout;
    let last: T | string = "not evaluated";
    for (;;) {
      try {
        last = await evaluate(script);
        if (done(last)) return;
      } catch (error) {
        if (!TRANSIENT.test(String(error))) throw error;
      }
      if (Date.now() >= deadline)
        throw new Error(
          `${failure} after ${config.timeout}ms (got ${JSON.stringify(last)})`,
        );
      await Bun.sleep(100);
    }
  }

  await serial(() => view.navigate("about:blank"));
  await on_new_document(PAGE);

  // Waits for the element to be visible (and enabled), then runs `action`
  // on it in the same evaluate, so no swap can land between find and act.
  const act = (action: Action, scopes: Locator[], locator: Locator) =>
    until(
      `${JSON.stringify(locator)}`,
      (state) => state === "ok",
      call("act", action, scopes, locator),
    );

  // The same wait as `act`, for actions that don't go through it.
  const ready = () =>
    until("page still loading", (loaded) => loaded, call("loaded"));

  // htmx and islands use fetch/XHR: wait until none is in flight.
  // ponytail: best effort, never fails; assertions retry on their own.
  async function settle() {
    try {
      await ready();
    } catch {}
  }

  return {
    async accept_popups() {
      await on_new_document(call("accept_popups").source);
      if (view.url !== "about:blank") await evaluate(call("accept_popups"));
    },
    act,
    wait(seconds: number) {
      return Bun.sleep(seconds * 1000);
    },
    // Clicks the option's label until the box stays checked: a click that
    // lands before its island hydrates is lost, so click again.
    async check(scopes: Locator[], field: Locator) {
      const deadline = Date.now() + config.timeout;
      const check = call("check", scopes, field);
      await ready();
      let clicks = 0;
      for (let pass = 1; ; pass++) {
        await until(
          `${JSON.stringify(field)} is not checked`,
          (checked) => {
            if (checked === false) clicks++;
            return checked === true;
          },
          check,
        );
        // ponytail: same 150ms settle as fill, see there
        await Bun.sleep(150);
        if ((await evaluate(check)) === true) {
          console.error(
            `buncept_retry_probe ${JSON.stringify({ clicks, field, kind: "check", pass, retried: clicks > 1 || pass > 1, url: view.url })}`,
          );
          return;
        }
        if (Date.now() >= deadline)
          throw new Error(`${JSON.stringify(field)} kept unchecking`);
      }
    },
    // Types over the current value like a user, then checks it held: an
    // island hydrating after the keystrokes resets the field, so retype.
    async fill(scopes: Locator[], field: Locator, value: string) {
      const deadline = Date.now() + config.timeout;
      const read = call("field_value", scopes, field);
      const reasons: string[] = [];
      for (;;) {
        await act("select_field", scopes, field);
        await serial(() => view.type(value));
        // ponytail: 150ms outlasts Preact's 100ms afterPaint fallback, the
        // latest an island's mount effect can reset the field.
        if ((await evaluate(read)) === value) {
          await Bun.sleep(150);
          if ((await evaluate(read)) === value) {
            console.error(
              `buncept_retry_probe ${JSON.stringify({ field, kind: "fill", reasons, retried: reasons.length > 0, url: view.url })}`,
            );
            return;
          }
          reasons.push("reset_after_150ms");
        } else reasons.push("wrong_right_after_typing");
        if (Date.now() >= deadline)
          throw new Error(`field kept resetting, expected "${value}"`);
      }
    },
    async navigate(url: string) {
      const deadline = Date.now() + config.timeout;
      for (;;) {
        try {
          await serial(() => view.navigate(url));
          break;
        } catch (error) {
          if (!TRANSIENT.test(String(error)) || Date.now() >= deadline)
            throw error;
          await Bun.sleep(100);
        }
      }
      await settle();
    },
    async page_line() {
      const title = await evaluate(call("title")).catch(() => null);
      return title === null
        ? `Page: ${view.url}`
        : `Page: ${view.url} — "${title}"`;
    },
    async press(key: string) {
      await ready();
      await serial(() => view.press(key));
    },
    // Presses `key` until focus lands on `locator`, as a user tabs through
    // a page; a cap keeps a wrong locator from cycling the page forever.
    async press_until_focused(
      scopes: Locator[],
      key: string,
      locator: Locator,
    ) {
      const focused = call("focused", scopes, locator);
      let last: unknown = null;
      for (let presses = 0; presses <= PRESS_CAP; presses++) {
        await ready();
        last = await evaluate(focused);
        if (last === true) return;
        if (presses < PRESS_CAP) await serial(() => view.press(key));
      }
      throw new Error(
        `${JSON.stringify(locator)} not focused after ${PRESS_CAP} presses of "${key}" (got ${JSON.stringify(last)})`,
      );
    },
    settle,
    until,
  };
}
