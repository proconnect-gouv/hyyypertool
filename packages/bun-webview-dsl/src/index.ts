import { afterAll, beforeAll, describe, expect, it } from "bun:test";

export const make_web_view_options = (): ConstructorParameters<
  typeof Bun.WebView
>[0] =>
  process.platform === "linux"
    ? {
        backend: {
          type: "chrome",
          argv: [
            "--no-sandbox",
            `--user-data-dir=/tmp/bun-webview-${crypto.randomUUID()}`,
          ],
        },
      }
    : {};

//

export type Actor = {
  navigate: (path: string) => Promise<void>;
  click: (text: string) => Promise<void>;
  click_link: (name: string) => Promise<void>;
  click_visible: (text: string) => Promise<void>;
  fill: (label: string, value: string) => Promise<void>;
  fill_and_submit: (label: string, value: string) => Promise<void>;
  see: (text: string) => Promise<void>;
  see_table: (name: string, rows: string[][]) => Promise<void>;
  not_see: (text: string) => Promise<void>;
  see_in_title: (text: string) => Promise<void>;
  url: () => Promise<string>;
  within: (name: string) => Actor;
  within_row: (text: string) => Actor;
};

// CDP Network state is shared per-view — Scenario creates a fresh actor per
// it(), but requests fired in one it() must be visible to
// wait_for_network_idle in the next. A WeakMap keyed on the WebView keeps the
// inflight counter and event listeners alive for the view's lifetime.
const cdp_network_states = new WeakMap<
  Bun.WebView,
  { inflight: number; active: boolean; enabled: boolean }
>();

function cdp_network_state_for(view: Bun.WebView): {
  inflight: number;
  active: boolean;
  enabled: boolean;
} {
  let state = cdp_network_states.get(view);
  if (state) return state;
  state = { inflight: 0, active: false, enabled: false };
  cdp_network_states.set(view, state);
  return state;
}

function attach_cdp_listeners(view: Bun.WebView): void {
  const state = cdp_network_state_for(view);
  if (state.active) return;
  (
    view as {
      addEventListener: (t: string, fn: (e: unknown) => void) => void;
    }
  ).addEventListener("Network.requestWillBeSent", () => {
    state.inflight++;
  });
  (
    view as {
      addEventListener: (t: string, fn: (e: unknown) => void) => void;
    }
  ).addEventListener("Network.loadingFinished", () => {
    state.inflight = Math.max(0, state.inflight - 1);
  });
  (
    view as {
      addEventListener: (t: string, fn: (e: unknown) => void) => void;
    }
  ).addEventListener("Network.loadingFailed", () => {
    state.inflight = Math.max(0, state.inflight - 1);
  });
  state.active = true;
}

export function create_actor(view: Bun.WebView, base_url: string): Actor {
  // Cypress-equivalent text normalization: collapse runs of whitespace so
  // assertions match rendered text, not the raw (often multi-spaced) DOM
  // textContent emitted by JSX island bridges and inline SVG.
  const normalize = (text: string): string => text.replace(/\s+/g, " ").trim();

  // Bun.WebView rejects concurrent evaluate() calls ("an evaluate() is already
  // pending"). Serialize so fire-and-forget calls from upstream code queue
  // instead of crashing. view.cdp() hits the same underlying session, so it
  // must go through the same chain (arbor H1, node 54).
  let eval_chain: Promise<unknown> = Promise.resolve();
  const evaluate = <T>(code: string): Promise<T> => {
    const run = eval_chain.then(() => view["evaluate"](code) as Promise<T>);
    eval_chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  };
  const cdp = <T>(method: string, params?: unknown): Promise<T> => {
    const run = eval_chain.then(() =>
      (view as { cdp: (m: string, p?: unknown) => Promise<T> }).cdp(
        method,
        params,
      ),
    );
    eval_chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  };

  // CDP Network event counter — shared per-view across all actors (Scenario
  // creates a new actor per it(), but requests fired in one it() must be
  // visible to wait_for_network_idle in the next).
  const cdp_state = cdp_network_state_for(view);
  let cdp_enable_promise: Promise<void> | null = null;
  const enable_cdp_network = (): Promise<void> => {
    if (cdp_enable_promise) return cdp_enable_promise;
    cdp_enable_promise = (async () => {
      if (cdp_state.enabled) {
        attach_cdp_listeners(view);
        return;
      }
      try {
        await cdp("Network.enable", {});
        cdp_state.enabled = true;
        attach_cdp_listeners(view);
      } catch {
        // WebKit backend or CDP unavailable — fall back to class polling
      }
    })();
    return cdp_enable_promise;
  };
  const wait_for_network_idle = async (
    timeout = 5_000,
    grace = 0,
  ): Promise<void> => {
    await enable_cdp_network();
    if (!cdp_state.active) {
      return;
    }
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (cdp_state.inflight <= 0) {
        await Bun.sleep(grace);
        if (cdp_state.inflight <= 0) return;
      }
      await Bun.sleep(50);
    }
  };

  const poll_body = async (): Promise<string> =>
    normalize(
      (await evaluate(`document.body.textContent`).catch(() => "")) as string,
    );

  const wait_for = async (
    condition: (body: string) => boolean,
    fail: (body: string) => void,
    timeout = 5_000,
  ): Promise<void> => {
    const deadline = Date.now() + timeout;
    while (true) {
      const body = await poll_body();
      if (condition(body)) return;
      if (Date.now() > deadline) {
        fail(body);
        return;
      }
      await Bun.sleep(50);
    }
  };

  // Wait for readyState, then drain in-flight network via CDP events.
  const wait_for_load_settled = async (): Promise<void> => {
    const deadline = Date.now() + 5_000;
    while (Date.now() < deadline) {
      const ready = (await evaluate(`document.readyState`)) as string;
      if (ready === "complete") break;
      await Bun.sleep(20);
    }
    await wait_for_network_idle();
  };

  const wait_for_navigation = async (
    url_before: string,
    timeout = 5_000,
  ): Promise<void> => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const url = (await evaluate(`location.href`)) as string;
      const ready = (await evaluate(`document.readyState`)) as string;
      if (url !== url_before || ready !== "complete") break;
      await Bun.sleep(20);
    }
    while (Date.now() < deadline) {
      const ready = (await evaluate(`document.readyState`)) as string;
      if (ready === "complete") break;
      await Bun.sleep(50);
    }
  };

  const wait_for_title = async (
    condition: (title: string) => boolean,
    fail: (title: string) => void,
    timeout = 5_000,
  ): Promise<void> => {
    const deadline = Date.now() + timeout;
    while (true) {
      const title = (await evaluate(`document.title`)) as string;
      if (condition(title)) return;
      if (Date.now() > deadline) {
        fail(title);
        return;
      }
      await Bun.sleep(50);
    }
  };

  function row_finder_expr(text: string): string {
    return `[...document.querySelectorAll('tr')].find(function(tr){return tr.textContent.includes(${JSON.stringify(text)});})`;
  }

  function create_scoped_actor(selector: string): Actor {
    return create_expr_scoped_actor(
      `document.querySelector(${JSON.stringify(selector)})`,
      (name) =>
        create_scoped_actor(
          `:is(${selector}) [aria-label*=${JSON.stringify(name)}], :is(${selector}) [aria-labelledby*=${JSON.stringify(name)}]`,
        ),
    );
  }

  function create_expr_scoped_actor(
    root_expr: string,
    make_within: (name: string) => Actor = (name) =>
      create_scoped_actor(
        `[aria-label*=${JSON.stringify(name)}], [aria-labelledby*=${JSON.stringify(name)}]`,
      ),
  ): Actor {
    const scoped_root = root_expr;
    const selector = root_expr; // used only in error messages below

    // evaluate() truncates a thrown Error's message at the first newline, so
    // the within resolver signals a miss by returning a sentinel object whose
    // .message survives the bridge intact. within_row / css resolvers return
    // null/undefined on miss and fall through to the bare "scope not found".
    const scope_guard_js = `if (!root || (root && root.__not_found)) throw new Error((root && root.__not_found) ? root.message : ${JSON.stringify(`scope not found: ${selector}`)});`;

    const scoped_poll_body = async (): Promise<string> => {
      const got = (await evaluate(`(function(){
        var r = ${scoped_root};
        if (r && r.__not_found) return r;
        return r ? r.textContent : null;
      })()`)) as
        | string
        | null
        | undefined
        | { __not_found: true; message: string };
      if (got && typeof got === "object" && (got as any).__not_found) {
        throw new Error((got as { message: string }).message);
      }
      if (got === null || got === undefined) {
        throw new Error(`scope not found: ${selector}`);
      }
      return normalize(got as string);
    };

    const scoped_wait_for = async (
      condition: (body: string) => boolean,
      fail: (body: string) => void,
      timeout = 5_000,
    ): Promise<void> => {
      const deadline = Date.now() + timeout;
      while (true) {
        const body = await scoped_poll_body();
        if (condition(body)) return;
        if (Date.now() > deadline) {
          fail(body);
          return;
        }
        await Bun.sleep(50);
      }
    };

    return {
      click: async (text) => {
        const deadline = Date.now() + 3_000;
        while (Date.now() < deadline) {
          const clicked = (await evaluate(`
            (function(){
              const root = ${scoped_root};
              ${scope_guard_js}
              const el = [...root.querySelectorAll('button,a,input[type=submit],label,summary')]
                .find(el => el.textContent.includes(${JSON.stringify(text)}));
              if (el) { el.click(); return true; }
              return false;
            })()
          `)) as boolean;
          if (clicked) {
            await wait_for_network_idle();
            return;
          }
          await Bun.sleep(50);
        }
        throw new Error(`Timed out waiting to click ${JSON.stringify(text)}`);
      },

      click_link: async (name) => {
        const url_before = (await evaluate(`location.href`)) as string;
        await evaluate(`
          (function(){
            const root = ${scoped_root};
            ${scope_guard_js}
            root.querySelector('[aria-label*=${JSON.stringify(name)}]')?.click()
          })()
        `);
        await wait_for_navigation(url_before);
        await wait_for_load_settled();
      },

      click_visible: async (text) => {
        const deadline = Date.now() + 3_000;
        while (Date.now() < deadline) {
          const clicked = (await evaluate(`
            (function(){
              const root = ${scoped_root};
              ${scope_guard_js}
              const el = [...root.querySelectorAll('button,a,input[type=submit],label,summary')]
                .find(el => el.textContent.includes(${JSON.stringify(text)}) && el.getClientRects().length > 0);
              if (el) { el.click(); return true; }
              return false;
            })()
          `)) as boolean;
          if (clicked) {
            await wait_for_network_idle();
            return;
          }
          await Bun.sleep(50);
        }
        throw new Error(
          `Timed out waiting to click visible ${JSON.stringify(text)}`,
        );
      },

      fill: async (label, value) => {
        await evaluate(`
          (function(){
            const root = ${scoped_root};
            ${scope_guard_js}
            const el =
              root.querySelector('[placeholder=${JSON.stringify(label)}]') ||
              root.querySelector('[aria-label=${JSON.stringify(label)}]') ||
              [...root.querySelectorAll('label')]
                .find(l => l.textContent.trim() === ${JSON.stringify(label)})
                ?.control;
            if (el) {
              el.value = ${JSON.stringify(value)};
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          })()
        `);
        await wait_for_network_idle();
      },

      fill_and_submit: async (label, value) => {
        await evaluate(`
          (function(){
            const root = ${scoped_root};
            ${scope_guard_js}
            const el =
              root.querySelector('[placeholder=${JSON.stringify(label)}]') ||
              root.querySelector('[aria-label=${JSON.stringify(label)}]') ||
              [...root.querySelectorAll('label')]
                .find(l => l.textContent.trim() === ${JSON.stringify(label)})
                ?.control;
            if (el) {
              el.value = ${JSON.stringify(value)};
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
              el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
              el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
            }
          })()
        `);
        await wait_for_network_idle();
      },

      navigate: async (path) => {
        await view.navigate(`${base_url}${path}`);
        await wait_for_load_settled();
      },

      not_see: (text) =>
        scoped_wait_for(
          (body) => !body.includes(text),
          (body) => expect(body).not.toContain(text),
        ),

      see: (text) =>
        scoped_wait_for(
          (body) => body.includes(text),
          (body) => expect(body).toContain(text),
        ),

      see_in_title: (text) =>
        wait_for_title(
          (title) => title.includes(text),
          (title) => expect(title).toContain(text),
        ),

      url: () => evaluate(`location.pathname`) as Promise<string>,

      see_table: async (name, rows) => {
        const deadline = Date.now() + 3_000;
        while (true) {
          const error = (await evaluate(
            `(function(){
              var name = ${JSON.stringify(name)};
              var rows = ${JSON.stringify(rows)};
              var header = [...document.querySelectorAll('[id]')]
                .find(function(el){ return el.textContent.trim().includes(name); });
              if (!header) return 'Table header not found: ' + name;
              var table = document.querySelector('[aria-describedby="' + header.id + '"]');
              if (!table) return 'Table not found for: ' + name;
              var trs = [...table.querySelectorAll('tr')];
              for (var i = 0; i < rows.length; i++) {
                var expected = rows[i].filter(function(c){ return c !== ''; });
                var matched = trs.some(function(tr){
                  var cells = [...tr.querySelectorAll('td')].map(function(td){ return td.textContent; });
                  return expected.every(function(c){ return cells.some(function(cell){ return cell.includes(c); }); });
                });
                if (!matched) return 'Row not found in table: ' + JSON.stringify(rows[i]);
              }
              return null;
            })()`,
          )) as string | null;
          if (error === null) return;
          if (Date.now() > deadline) {
            const actual = (await evaluate(
              `(function(){
                var name = ${JSON.stringify(name)};
                var header = [...document.querySelectorAll('[id]')]
                  .find(function(el){ return el.textContent.trim().includes(name); });
                if (!header) return null;
                var table = document.querySelector('[aria-describedby="' + header.id + '"]');
                if (!table) return null;
                return [...table.querySelectorAll('tr')].map(function(tr){
                  return [...tr.querySelectorAll('td')].map(function(td){ return td.textContent.trim(); });
                }).filter(function(r){ return r.length > 0; });
              })()`,
            )) as string[][] | null;
            expect(actual, `see_table(${JSON.stringify(name)})`).not.toBeNull();
            for (const row of rows) {
              const expected = row.filter((c) => c !== "");
              expect(
                actual!.some((tr) =>
                  expected.every((c) => tr.some((cell) => cell.includes(c))),
                ),
                `Row not found in table "${name}": ${JSON.stringify(row)}\nActual rows: ${JSON.stringify(actual)}`,
              ).toBe(true);
            }
            return;
          }
          await Bun.sleep(50);
        }
      },

      within: make_within,

      within_row: (text) =>
        create_expr_scoped_actor(
          row_finder_expr(text),
          (name) =>
            create_expr_scoped_actor(
              row_finder_expr(text),
              (innerName) =>
                create_scoped_actor(
                  `[aria-label*=${JSON.stringify(innerName)}], [aria-labelledby*=${JSON.stringify(innerName)}]`,
                ),
            ).within(name),
        ),
    };
  }

  return {
    navigate: async (path) => {
      await view.navigate(`${base_url}${path}`);
      await wait_for_load_settled();
    },

    click: async (text) => {
      const deadline = Date.now() + 3_000;
      while (Date.now() < deadline) {
        const clicked = (await evaluate(
          `(() => {
            const el = [...document.querySelectorAll('button,a,input[type=submit],label,summary')]
              .find(el => el.textContent.includes(${JSON.stringify(text)}));
            if (el) { el.click(); return true; }
            return false;
          })()`,
        )) as boolean;
        if (clicked) {
          await wait_for_network_idle();
          return;
        }
        await Bun.sleep(50);
      }
      throw new Error(`Timed out waiting to click ${JSON.stringify(text)}`);
    },

    click_link: async (name) => {
      const url_before = (await evaluate(`location.href`)) as string;
      await evaluate(
        `document.querySelector('[aria-label*=${JSON.stringify(name)}]')?.click()`,
      );
      await wait_for_navigation(url_before);
      await wait_for_load_settled();
    },

    click_visible: async (text) => {
      const deadline = Date.now() + 3_000;
      while (Date.now() < deadline) {
        const clicked = (await evaluate(
          `(() => {
            const el = [...document.querySelectorAll('button,a,input[type=submit],label,summary')]
              .find(el => el.textContent.includes(${JSON.stringify(text)}) && el.getClientRects().length > 0);
            if (el) { el.click(); return true; }
            return false;
          })()`,
        )) as boolean;
        if (clicked) {
          await wait_for_network_idle();
          return;
        }
        await Bun.sleep(50);
      }
      throw new Error(
        `Timed out waiting to click visible ${JSON.stringify(text)}`,
      );
    },

    fill: async (label, value) => {
      await evaluate(`
        (() => {
          const el =
            document.querySelector('[placeholder=${JSON.stringify(label)}]') ||
            document.querySelector('[aria-label=${JSON.stringify(label)}]') ||
            [...document.querySelectorAll('label')]
              .find(l => l.textContent.trim() === ${JSON.stringify(label)})
              ?.control;
          if (el) {
            el.value = ${JSON.stringify(value)};
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()
      `);
      await wait_for_network_idle();
    },

    fill_and_submit: async (label, value) => {
      await evaluate(`
        (() => {
          const el =
            document.querySelector('[placeholder=${JSON.stringify(label)}]') ||
            document.querySelector('[aria-label=${JSON.stringify(label)}]') ||
            [...document.querySelectorAll('label')]
              .find(l => l.textContent.trim() === ${JSON.stringify(label)})
              ?.control;
          if (el) {
            el.value = ${JSON.stringify(value)};
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
          }
        })()
      `);
      await wait_for_network_idle();
    },

    see: (text) =>
      wait_for(
        (body) => body.includes(text),
        (body) => expect(body).toContain(text),
      ),

    see_table: async (name, rows) => {
      const deadline = Date.now() + 3_000;
      while (true) {
        const error = (await evaluate(
          `(function(){
            var name = ${JSON.stringify(name)};
            var rows = ${JSON.stringify(rows)};
            var header = [...document.querySelectorAll('[id]')]
              .find(function(el){ return el.textContent.trim().includes(name); });
            if (!header) return 'Table header not found: ' + name;
            var table = document.querySelector('[aria-describedby="' + header.id + '"]');
            if (!table) return 'Table not found for: ' + name;
            var trs = [...table.querySelectorAll('tr')];
            for (var i = 0; i < rows.length; i++) {
              var expected = rows[i].filter(function(c){ return c !== ''; });
              var matched = trs.some(function(tr){
                var cells = [...tr.querySelectorAll('td')].map(function(td){ return td.textContent; });
                return expected.every(function(c){ return cells.some(function(cell){ return cell.includes(c); }); });
              });
              if (!matched) return 'Row not found in table: ' + JSON.stringify(rows[i]);
            }
            return null;
          })()`,
        )) as string | null;
        if (error === null) return;
        if (Date.now() > deadline) {
          const actual = (await evaluate(
            `(function(){
              var name = ${JSON.stringify(name)};
              var header = [...document.querySelectorAll('[id]')]
                .find(function(el){ return el.textContent.trim().includes(name); });
              if (!header) return null;
              var table = document.querySelector('[aria-describedby="' + header.id + '"]');
              if (!table) return null;
              return [...table.querySelectorAll('tr')].map(function(tr){
                return [...tr.querySelectorAll('td')].map(function(td){ return td.textContent.trim(); });
              }).filter(function(r){ return r.length > 0; });
            })()`,
          )) as string[][] | null;
          expect(actual, `see_table(${JSON.stringify(name)})`).not.toBeNull();
          for (const row of rows) {
            const expected = row.filter((c) => c !== "");
            expect(
              actual!.some((tr) =>
                expected.every((c) => tr.some((cell) => cell.includes(c))),
              ),
              `Row not found in table "${name}": ${JSON.stringify(row)}\nActual rows: ${JSON.stringify(actual)}`,
            ).toBe(true);
          }
          return;
        }
        await Bun.sleep(50);
      }
    },

    see_in_title: (text) =>
      wait_for_title(
        (title) => title.includes(text),
        (title) => expect(title).toContain(text),
      ),

    not_see: (text) =>
      wait_for(
        (body) => !body.includes(text),
        (body) => expect(body).not.toContain(text),
      ),

    url: () => evaluate(`location.pathname`) as Promise<string>,

    within: (name) =>
      create_expr_scoped_actor(
        // Resolve by accessible name: aria-label, aria-labelledby (id→text),
        // or <summary> textContent walking to its enclosing <details>.
        // CSS cannot do :has-text(), so use an evaluate()-expression (precedent: within_row).
        // On miss, returns a {__not_found, message} sentinel so the full
        // multi-line diagnostic survives the evaluate() bridge (which truncates
        // thrown Error messages at the first newline); see scoped_poll_body /
        // scope_guard_js consumers.
        `(function(){
          var name = ${JSON.stringify(name)};
          var byAria = document.querySelector('[aria-label*=' + JSON.stringify(name) + '], [aria-labelledby*=' + JSON.stringify(name) + ']');
          if (byAria) return byAria;
          var summaries = [...document.querySelectorAll('summary')];
          var summary = summaries.find(function(s){ return s.textContent.includes(name); });
          if (summary) return summary.closest('details') || summary;
          var labelledEls = [...document.querySelectorAll('[aria-labelledby]')];
          var labelled = labelledEls.find(function(el){
            var ids = (el.getAttribute('aria-labelledby') || '').split(/\\s+/);
            return ids.some(function(id){
              var owner = document.getElementById(id);
              return owner && owner.textContent.includes(name);
            });
          });
          if (labelled) return labelled;
          var lines = ['scope not found: ' + JSON.stringify(name)];
          if (summaries.length === 0) {
            lines.push('  no <summary> elements in the document');
          } else {
            lines.push('  considered ' + summaries.length + ' <summary> element(s):');
            summaries.forEach(function(s){
              lines.push('    - ' + JSON.stringify(s.textContent.replace(/\\s+/g, ' ').trim().slice(0, 80)));
            });
          }
          var ariaLabelEls = [...document.querySelectorAll('[aria-label]')];
          if (ariaLabelEls.length > 0) {
            lines.push('  considered ' + ariaLabelEls.length + ' [aria-label] element(s):');
            ariaLabelEls.forEach(function(e){
              lines.push('    - ' + JSON.stringify(e.getAttribute('aria-label')));
            });
          }
          return { __not_found: true, message: lines.join('\\n') };
        })()`,
      ),

    within_row: (text) =>
      create_expr_scoped_actor(
        row_finder_expr(text),
      ),
  };
}

//

export type ScenarioActor = {
  navigate: (path: string) => void;
  see: (text: string) => void;
  see_table: (name: string, rows: string[][]) => void;
  not_see: (text: string) => void;
  see_in_title: (text: string) => void;
  click: (text: string) => void;
  click_link: (name: string) => void;
  click_visible: (text: string) => void;
  fill: (label: string, value: string) => void;
  fill_and_submit: (label: string, value: string) => void;
  url: () => void;
  within_row: (text: string) => ScenarioActor;
};

export type ScenarioWithin = (
  name: string,
  fn: (section: { I: ScenarioActor }) => void,
) => void;

export function Scenario(
  get_base_url: () => string,
  fn: (ctx: { I: ScenarioActor; within: ScenarioWithin }) => void,
) {
  let view: Bun.WebView;
  beforeAll(() => {
    view = new Bun.WebView(make_web_view_options());
  });
  afterAll(() => {
    view?.[Symbol.asyncDispose]();
  });
  const I = _create_scenario_actor(() => view, get_base_url);
  const within: ScenarioWithin = (name, fn) =>
    describe.serial(`within "${name}"`, () => {
      // Scope-existence invariant: verify the resolver finds the scope before
      // any assertion verb. `see("")` passes iff scope resolves (any textContent
      // includes ""), and throws the resolver's rich diagnostic on miss.
      // Localises "scope missing" failures to a distinct it, not the first assertion.
      it(
        `scope found`,
        () => create_actor(view, get_base_url()).within(name).see(""),
        30_000,
      );
      fn({
        I: _create_scenario_actor(
          () => view,
          get_base_url,
          (actor) => actor.within(name),
        ),
      });
    });
  return fn.bind(null, { I, within });
}

function _create_scenario_actor(
  get_view: () => Bun.WebView,
  get_base_url: () => string,
  scope?: (actor: Actor) => Actor,
  row_text?: string,
): ScenarioActor {
  const act = (label: string, action: () => Promise<void>) =>
    it(label, action, 30_000);

  const get_scoped = (actor: Actor): Actor =>
    row_text ? actor.within_row(row_text) : scope ? scope(actor) : actor;

  return {
    navigate: (path) =>
      act(`navigate "${path}"`, () =>
        create_actor(get_view(), get_base_url()).navigate(path),
      ),
    see: (text) =>
      act(`see "${text}"`, () =>
        get_scoped(create_actor(get_view(), get_base_url())).see(text),
      ),
    see_table: (name, rows) =>
      act(`see table "${name}"`, () =>
        create_actor(get_view(), get_base_url()).see_table(name, rows),
      ),
    not_see: (text) =>
      act(`not see "${text}"`, () =>
        get_scoped(create_actor(get_view(), get_base_url())).not_see(text),
      ),
    see_in_title: (text) =>
      act(`see in title "${text}"`, () =>
        create_actor(get_view(), get_base_url()).see_in_title(text),
      ),
    click: (text) =>
      act(`click "${text}"`, () =>
        get_scoped(create_actor(get_view(), get_base_url())).click(text),
      ),
    click_link: (name) =>
      act(`click link "${name}"`, () =>
        get_scoped(create_actor(get_view(), get_base_url())).click_link(name),
      ),
    click_visible: (text) =>
      act(`click visible "${text}"`, () =>
        get_scoped(create_actor(get_view(), get_base_url())).click_visible(
          text,
        ),
      ),
    fill: (label, value) =>
      act(`fill "${label}" with "${value}"`, () =>
        get_scoped(create_actor(get_view(), get_base_url())).fill(label, value),
      ),
    fill_and_submit: (label, value) =>
      act(`fill and submit "${label}" with "${value}"`, () =>
        get_scoped(create_actor(get_view(), get_base_url())).fill_and_submit(
          label,
          value,
        ),
      ),
    url: () =>
      act(`check url`, () =>
        create_actor(get_view(), get_base_url())
          .url()
          .then(() => {}),
      ),

    within_row: (text) =>
      _create_scenario_actor(get_view, get_base_url, undefined, text),
  };
}
