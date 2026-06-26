import { afterAll, beforeAll, describe, it } from "bun:test";

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
  see: (text: string) => Promise<void>;
  not_see: (text: string) => Promise<void>;
  see_in_title: (text: string) => Promise<void>;
  url: () => Promise<string>;
  within: (name: string) => Actor;
};

export function create_actor(view: Bun.WebView, base_url: string): Actor {
  const poll_body = async (): Promise<string> =>
    (await view
      .evaluate(`document.body.textContent`)
      .catch(() => "")) as string;

  const wait_for = async (
    condition: (body: string) => boolean,
    error_message: (body: string) => string,
    timeout = 10_000,
  ): Promise<void> => {
    const deadline = Date.now() + timeout;
    while (true) {
      const body = await poll_body();
      if (condition(body)) return;
      if (Date.now() > deadline) throw new Error(error_message(body));
      await Bun.sleep(50);
    }
  };

  const wait_for_htmx = async (timeout = 5_000): Promise<void> => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const busy = (await view
        .evaluate(`document.querySelector('.htmx-request') !== null`)
        .catch(() => false)) as boolean;
      if (!busy) return;
      await Bun.sleep(50);
    }
  };

  const wait_for_navigation = async (
    url_before: string,
    timeout = 10_000,
  ): Promise<void> => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const url = (await view.evaluate(`location.href`)) as string;
      const ready = (await view.evaluate(`document.readyState`)) as string;
      if (url !== url_before || ready !== "complete") break;
      await Bun.sleep(20);
    }
    while (Date.now() < deadline) {
      const ready = (await view.evaluate(`document.readyState`)) as string;
      if (ready === "complete") break;
      await Bun.sleep(50);
    }
  };

  const wait_for_title = async (
    condition: (title: string) => boolean,
    error_message: (title: string) => string,
    timeout = 10_000,
  ): Promise<void> => {
    const deadline = Date.now() + timeout;
    while (true) {
      const title = (await view.evaluate(`document.title`)) as string;
      if (condition(title)) return;
      if (Date.now() > deadline) throw new Error(error_message(title));
      await Bun.sleep(50);
    }
  };

  function create_scoped_actor(selector: string): Actor {
    const scoped_root = `document.querySelector(${JSON.stringify(selector)})`;

    const scoped_poll_body = async (): Promise<string> =>
      (await view
        .evaluate(`${scoped_root}?.textContent ?? ''`)
        .catch(() => "")) as string;

    const scoped_wait_for = async (
      condition: (body: string) => boolean,
      error_message: (body: string) => string,
      timeout = 10_000,
    ): Promise<void> => {
      const deadline = Date.now() + timeout;
      while (true) {
        const body = await scoped_poll_body();
        if (condition(body)) return;
        if (Date.now() > deadline) throw new Error(error_message(body));
        await Bun.sleep(50);
      }
    };

    return {
      click: async (text) => {
        const deadline = Date.now() + 10_000;
        while (Date.now() < deadline) {
          const clicked = (await view.evaluate(`
            (function(){
              const root = ${scoped_root};
              if (!root) throw new Error(${JSON.stringify(`scope not found: ${selector}`)});
              const el = [...root.querySelectorAll('button,a,input[type=submit],label')]
                .find(el => el.textContent.includes(${JSON.stringify(text)}));
              if (el) { el.click(); return true; }
              return false;
            })()
          `)) as boolean;
          if (clicked) { await wait_for_htmx(); return; }
          await Bun.sleep(50);
        }
        throw new Error(`Timed out waiting to click ${JSON.stringify(text)}`);
      },

      click_link: async (name) => {
        const url_before = (await view.evaluate(`location.href`)) as string;
        await view.evaluate(`
          (function(){
            const root = ${scoped_root};
            if (!root) throw new Error(${JSON.stringify(`scope not found: ${selector}`)});
            root.querySelector('[aria-label*=${JSON.stringify(name)}]')?.click()
          })()
        `);
        await wait_for_navigation(url_before);
      },

      click_visible: async (text) => {
        const deadline = Date.now() + 10_000;
        while (Date.now() < deadline) {
          const clicked = (await view.evaluate(`
            (function(){
              const root = ${scoped_root};
              if (!root) throw new Error(${JSON.stringify(`scope not found: ${selector}`)});
              const el = [...root.querySelectorAll('button,a,input[type=submit],label')]
                .find(el => el.textContent.includes(${JSON.stringify(text)}) && el.getClientRects().length > 0);
              if (el) { el.click(); return true; }
              return false;
            })()
          `)) as boolean;
          if (clicked) { await wait_for_htmx(); return; }
          await Bun.sleep(50);
        }
        throw new Error(
          `Timed out waiting to click visible ${JSON.stringify(text)}`,
        );
      },

      fill: async (label, value) => {
        await view.evaluate(`
          (function(){
            const root = ${scoped_root};
            if (!root) throw new Error(${JSON.stringify(`scope not found: ${selector}`)});
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
        await wait_for_htmx();
      },

      navigate: (path) => view.navigate(`${base_url}${path}`),

      not_see: (text) =>
        scoped_wait_for(
          (body) => !body.includes(text),
          (body) =>
            `Timed out waiting for ${JSON.stringify(text)} to disappear in ${JSON.stringify(selector)}\nScope text: ${body.slice(0, 500)}`,
        ),

      see: (text) =>
        scoped_wait_for(
          (body) => body.includes(text),
          (body) =>
            `Timed out waiting to see ${JSON.stringify(text)} in ${JSON.stringify(selector)}\nScope text: ${body.slice(0, 500)}`,
        ),

      see_in_title: (text) =>
        wait_for_title(
          (title) => title.includes(text),
          (title) =>
            `Timed out waiting for title to include ${JSON.stringify(text)}\nTitle: ${title}`,
        ),

      url: () => view.evaluate(`location.pathname`) as Promise<string>,

      within: (name) =>
        create_scoped_actor(
          `:is(${selector}) [aria-label*=${JSON.stringify(name)}], :is(${selector}) [aria-labelledby*=${JSON.stringify(name)}]`,
        ),
    };
  }

  return {
    navigate: (path) => view.navigate(`${base_url}${path}`),

    click: async (text) => {
      const deadline = Date.now() + 10_000;
      while (Date.now() < deadline) {
        const clicked = (await view.evaluate(
          `(() => {
            const el = [...document.querySelectorAll('button,a,input[type=submit],label')]
              .find(el => el.textContent.includes(${JSON.stringify(text)}));
            if (el) { el.click(); return true; }
            return false;
          })()`,
        )) as boolean;
        if (clicked) { await wait_for_htmx(); return; }
        await Bun.sleep(50);
      }
      throw new Error(`Timed out waiting to click ${JSON.stringify(text)}`);
    },

    click_link: async (name) => {
      const url_before = (await view.evaluate(`location.href`)) as string;
      await view.evaluate(
        `document.querySelector('[aria-label*=${JSON.stringify(name)}]')?.click()`,
      );
      await wait_for_navigation(url_before);
    },

    click_visible: async (text) => {
      const deadline = Date.now() + 10_000;
      while (Date.now() < deadline) {
        const clicked = (await view.evaluate(
          `(() => {
            const el = [...document.querySelectorAll('button,a,input[type=submit],label')]
              .find(el => el.textContent.includes(${JSON.stringify(text)}) && el.getClientRects().length > 0);
            if (el) { el.click(); return true; }
            return false;
          })()`,
        )) as boolean;
        if (clicked) { await wait_for_htmx(); return; }
        await Bun.sleep(50);
      }
      throw new Error(
        `Timed out waiting to click visible ${JSON.stringify(text)}`,
      );
    },

    fill: async (label, value) => {
      await view.evaluate(`
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
      await wait_for_htmx();
    },

    see: (text) =>
      wait_for(
        (body) => body.includes(text),
        (body) =>
          `Timed out waiting to see ${JSON.stringify(text)}\nPage text: ${body.slice(0, 500)}`,
      ),

    see_in_title: (text) =>
      wait_for_title(
        (title) => title.includes(text),
        (title) =>
          `Timed out waiting for title to include ${JSON.stringify(text)}\nTitle: ${title}`,
      ),

    not_see: (text) =>
      wait_for(
        (body) => !body.includes(text),
        (body) =>
          `Timed out waiting for ${JSON.stringify(text)} to disappear\nPage text: ${body.slice(0, 500)}`,
      ),

    url: () => view.evaluate(`location.pathname`) as Promise<string>,

    within: (name) =>
      create_scoped_actor(
        `[aria-label*=${JSON.stringify(name)}], [aria-labelledby*=${JSON.stringify(name)}]`,
      ),
  };
}

//

export type ScenarioActor = {
  navigate: (path: string) => void;
  see: (text: string) => void;
  not_see: (text: string) => void;
  see_in_title: (text: string) => void;
  click: (text: string) => void;
  click_link: (name: string) => void;
  click_visible: (text: string) => void;
  fill: (label: string, value: string) => void;
  url: () => void;
  within: (name: string) => ScenarioActor;
};

export function Scenario(
  name: string,
  get_base_url: () => string,
  fn: (ctx: { I: ScenarioActor }) => void,
): void {
  describe(name, () => {
    let view: Bun.WebView;
    beforeAll(() => {
      view = new Bun.WebView(make_web_view_options());
    });
    afterAll(() => {
      view?.[Symbol.asyncDispose]();
    });
    fn({ I: _create_scenario_actor(() => view, get_base_url) });
  });
}

function _create_scenario_actor(
  get_view: () => Bun.WebView,
  get_base_url: () => string,
  selector?: string,
): ScenarioActor {
  const act = (label: string, action: () => Promise<void>) =>
    it(label, action);

  const scoped = (name: string) =>
    _create_scenario_actor(
      get_view,
      get_base_url,
      selector
        ? `:is(${selector}) [aria-label*=${JSON.stringify(name)}], :is(${selector}) [aria-labelledby*=${JSON.stringify(name)}]`
        : `[aria-label*=${JSON.stringify(name)}], [aria-labelledby*=${JSON.stringify(name)}]`,
    );

  return {
    navigate: (path) =>
      act(`navigate "${path}"`, () =>
        get_view().navigate(`${get_base_url()}${path}`),
      ),
    see: (text) =>
      act(`see "${text}"`, () => {
        const actor = create_actor(get_view(), get_base_url());
        return selector
          ? actor.within(selector).see(text)
          : actor.see(text);
      }),
    not_see: (text) =>
      act(`not see "${text}"`, () => {
        const actor = create_actor(get_view(), get_base_url());
        return selector
          ? actor.within(selector).not_see(text)
          : actor.not_see(text);
      }),
    see_in_title: (text) =>
      act(`see in title "${text}"`, () =>
        create_actor(get_view(), get_base_url()).see_in_title(text),
      ),
    click: (text) =>
      act(`click "${text}"`, () => {
        const actor = create_actor(get_view(), get_base_url());
        return selector
          ? actor.within(selector).click(text)
          : actor.click(text);
      }),
    click_link: (name) =>
      act(`click link "${name}"`, () => {
        const actor = create_actor(get_view(), get_base_url());
        return selector
          ? actor.within(selector).click_link(name)
          : actor.click_link(name);
      }),
    click_visible: (text) =>
      act(`click visible "${text}"`, () => {
        const actor = create_actor(get_view(), get_base_url());
        return selector
          ? actor.within(selector).click_visible(text)
          : actor.click_visible(text);
      }),
    fill: (label, value) =>
      act(`fill "${label}" with "${value}"`, () => {
        const actor = create_actor(get_view(), get_base_url());
        return selector
          ? actor.within(selector).fill(label, value)
          : actor.fill(label, value);
      }),
    url: () =>
      act(`check url`, () =>
        create_actor(get_view(), get_base_url())
          .url()
          .then(() => {}),
      ),
    within: scoped,
  };
}
