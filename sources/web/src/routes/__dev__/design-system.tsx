//
// Visual comparison page: DSFR (CDN) vs Tailwind theme
// Available at /__dev__/design-system
//

import type { App_Context } from "#src/middleware/context";
import { Hono } from "hono";
import { html } from "hono/html";

//

const DSFR_CSS =
  "https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.3/dist/dsfr.min.css";
const DSFR_UTILITY_CSS =
  "https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.3/dist/utility/utility.min.css";

//

export default new Hono<App_Context>()
  .get("/design-system", (c) => {
    return c.html(html`
      <!doctype html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Design System Comparison</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, sans-serif;
              background: #1a1a2e;
              color: #eee;
            }
            .header {
              padding: 1rem 2rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1px solid #333;
            }
            .header h1 {
              font-size: 1.25rem;
              font-weight: 600;
            }
            .header small {
              color: #888;
            }
            .comparison {
              display: grid;
              grid-template-columns: 1fr 1fr;
              height: calc(100vh - 60px);
            }
            .panel {
              display: flex;
              flex-direction: column;
            }
            .panel-header {
              padding: 0.5rem 1rem;
              font-weight: 600;
              font-size: 0.875rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .panel:first-child .panel-header {
              background: #2d1b69;
              color: #b794f6;
            }
            .panel:last-child .panel-header {
              background: #1b4332;
              color: #6ee7b7;
            }
            .panel iframe {
              flex: 1;
              border: none;
              width: 100%;
              background: white;
            }
            .divider {
              width: 2px;
              background: #333;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Design System Comparison</h1>
            <small
              >DSFR v1.14.3 (CDN) vs Tailwind Theme &mdash; side by side</small
            >
          </div>
          <div class="comparison">
            <div class="panel">
              <div class="panel-header">DSFR (reference)</div>
              <iframe src="/__dev__/design-system/dsfr"></iframe>
            </div>
            <div class="panel">
              <div class="panel-header">Tailwind Theme (ours)</div>
              <iframe src="/__dev__/design-system/tailwind"></iframe>
            </div>
          </div>
        </body>
      </html>
    `);
  })

  //
  // DSFR reference page — uses CDN CSS, raw fr-* classes
  //
  .get("/design-system/dsfr", (c) => {
    return c.html(html`
      <!doctype html>
      <html lang="fr" data-fr-scheme="light">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="${DSFR_CSS}" rel="stylesheet" />
          <link href="${DSFR_UTILITY_CSS}" rel="stylesheet" />
          <style>
            body {
              padding: 2rem;
            }
            section {
              margin-bottom: 2rem;
            }
            section h2 {
              font-size: 1rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #666;
              margin-bottom: 1rem;
              padding-bottom: 0.5rem;
              border-bottom: 1px solid #ddd;
            }
            .row {
              display: flex;
              gap: 0.5rem;
              flex-wrap: wrap;
              margin-bottom: 0.75rem;
            }
          </style>
        </head>
        <body>
          ${componentsDsfr()}
        </body>
      </html>
    `);
  })

  //
  // Tailwind theme page — uses our built tailwind.css
  //
  .get("/design-system/tailwind", (c) => {
    const assetsPath = c.var?.config?.PUBLIC_ASSETS_PATH ?? "/public/built";
    return c.html(html`
      <!doctype html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="${assetsPath}/tailwind.css" />
          <style>
            body {
              padding: 2rem;
            }
            section {
              margin-bottom: 2rem;
            }
            section h2 {
              font-size: 1rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #666;
              margin-bottom: 1rem;
              padding-bottom: 0.5rem;
              border-bottom: 1px solid #ddd;
            }
            .row {
              display: flex;
              gap: 0.5rem;
              flex-wrap: wrap;
              margin-bottom: 0.75rem;
            }
          </style>
        </head>
        <body>
          ${componentsTailwind()}
        </body>
      </html>
    `);
  });

//
// ─── Component showcase: DSFR classes ────────────────────────────
//

function componentsDsfr() {
  return html`
    <!-- Buttons -->
    <section>
      <h2>Buttons</h2>
      <div class="row">
        <button class="fr-btn">Primary</button>
        <button class="fr-btn fr-btn--secondary">Secondary</button>
        <button class="fr-btn fr-btn--tertiary">Tertiary</button>
      </div>
      <div class="row">
        <button class="fr-btn fr-btn--sm">Small</button>
        <button class="fr-btn">Default</button>
        <button class="fr-btn fr-btn--lg">Large</button>
      </div>
      <div class="row">
        <button
          class="fr-btn"
          style="background-color: var(--error-425-625); --hover: var(--error-425-625-hover)"
        >
          Danger
        </button>
        <button
          class="fr-btn"
          style="background-color: var(--background-action-high-green-bourgeon); --hover: var(--background-action-high-green-bourgeon-hover)"
        >
          Success
        </button>
        <button
          class="fr-btn"
          style="background-color: var(--background-action-high-warning); --hover: var(--background-action-high-warning-hover)"
        >
          Warning
        </button>
        <button
          class="fr-btn"
          style="background-color: var(--grey-0-1000); color: white"
        >
          Dark
        </button>
      </div>
    </section>

    <!-- Badges -->
    <section>
      <h2>Badges</h2>
      <div class="row">
        <p class="fr-badge fr-badge--info">Info</p>
        <p class="fr-badge fr-badge--success">Success</p>
        <p class="fr-badge fr-badge--error">Error</p>
        <p class="fr-badge fr-badge--warning">Warning</p>
        <p class="fr-badge fr-badge--new">New</p>
      </div>
    </section>

    <!-- Notice -->
    <section>
      <h2>Notice</h2>
      <div class="fr-notice fr-notice--info" style="margin-bottom: 0.5rem">
        <div class="fr-container">
          <div class="fr-notice__body">
            <p>
              <span class="fr-notice__title">Info notice title</span>
              <span class="fr-notice__desc"
                >This is an informational message.</span
              >
            </p>
          </div>
        </div>
      </div>
      <div class="fr-notice fr-notice--alert">
        <div class="fr-container">
          <div class="fr-notice__body">
            <p>
              <span class="fr-notice__title">Alert notice</span>
              <span class="fr-notice__desc">Something went wrong.</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Callout -->
    <section>
      <h2>Callout</h2>
      <div
        class="fr-callout fr-callout--green-emeraude fr-icon-information-line"
      >
        <h3 class="fr-callout__title">Success callout</h3>
        <p class="fr-callout__text">
          This callout uses the green emeraude accent.
        </p>
      </div>
      <div class="fr-callout fr-callout--brown-caramel">
        <h3 class="fr-callout__title">Warning callout</h3>
        <p class="fr-callout__text">
          This callout uses the brown caramel accent.
        </p>
      </div>
    </section>

    <!-- Fieldset -->
    <section>
      <h2>Fieldset</h2>
      <fieldset class="fr-fieldset">
        <legend class="fr-fieldset__legend font-normal">
          Choose an option:
        </legend>
        <div class="fr-fieldset__element">
          <label><input type="radio" name="dsfr-opt" /> Option A</label>
        </div>
        <div class="fr-fieldset__element">
          <label><input type="radio" name="dsfr-opt" /> Option B</label>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset" style="margin-top: 1rem">
        <legend class="fr-fieldset__legend font-normal">Inline variant:</legend>
        <div class="fr-fieldset__element fr-fieldset__element--inline">
          <label><input type="radio" name="dsfr-inline" /> Yes</label>
        </div>
        <div class="fr-fieldset__element fr-fieldset__element--inline">
          <label><input type="radio" name="dsfr-inline" /> No</label>
        </div>
      </fieldset>
    </section>

    <!-- Table -->
    <section>
      <h2>Table</h2>
      <div class="fr-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>Admin</td>
              <td><p class="fr-badge fr-badge--success">Active</p></td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>User</td>
              <td><p class="fr-badge fr-badge--warning">Pending</p></td>
            </tr>
            <tr>
              <td>Charlie</td>
              <td>Moderator</td>
              <td><p class="fr-badge fr-badge--error">Suspended</p></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Header (mini) -->
    <section>
      <h2>Header</h2>
      <header class="fr-header">
        <div class="fr-header__body">
          <div class="fr-container">
            <div class="fr-header__body-row">
              <div class="fr-header__brand fr-enlarge-link">
                <div class="fr-header__brand-top">
                  <div class="fr-header__logo">
                    <p class="fr-logo">
                      République<br />Française
                    </p>
                  </div>
                </div>
                <div class="fr-header__service">
                  <p class="fr-header__service-title">Hyyypertool</p>
                  <p class="fr-header__service-tagline">
                    Design system preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fr-header__menu fr-modal">
          <div class="fr-container">
            <nav class="fr-nav" role="navigation" aria-label="Menu principal">
              <ul class="fr-nav__list">
                <li class="fr-nav__item">
                  <a class="fr-nav__link" aria-current="page" href="#">
                    Moderations
                  </a>
                </li>
                <li class="fr-nav__item">
                  <a class="fr-nav__link" href="#">Utilisateurs</a>
                </li>
                <li class="fr-nav__item">
                  <a class="fr-nav__link" href="#">Organisations</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </section>

    <!-- Typography -->
    <section>
      <h2>Typography</h2>
      <h1 class="fr-h1">Heading 1</h1>
      <p class="fr-text--xl">Extra large text</p>
      <p class="fr-text--lead">Lead text</p>
      <p class="fr-text--sm">Small text</p>
    </section>

    <!-- Cards -->
    <section>
      <h2>Cards</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3
                class="fr-card__title"
                style="color: var(--text-action-high-blue-france)"
              >
                Card Title
              </h3>
              <p class="fr-card__desc">Card description text goes here.</p>
            </div>
          </div>
        </div>
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3
                class="fr-card__title"
                style="color: var(--text-action-high-blue-france)"
              >
                Another Card
              </h3>
              <p class="fr-card__desc">More card description text.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Alert -->
    <section>
      <h2>Alert</h2>
      <div class="fr-alert fr-alert--warning" style="margin-bottom: 0.5rem">
        <h3 class="fr-alert__title">Warning alert</h3>
        <p>Something requires your attention.</p>
      </div>
    </section>

    <!-- Form inputs -->
    <section>
      <h2>Form Inputs</h2>
      <div class="fr-input-group" style="margin-bottom: 1rem">
        <label class="fr-label">Email address</label>
        <input class="fr-input" type="email" placeholder="name@example.com" />
      </div>
      <div class="fr-search-bar" role="search">
        <label class="fr-label">Search</label>
        <input class="fr-input" type="search" placeholder="Search..." />
        <button class="fr-btn" title="Search">Search</button>
      </div>
    </section>

    <!-- Tags -->
    <section>
      <h2>Tags</h2>
      <div class="row">
        <button class="fr-tag">Tag one</button>
        <button class="fr-tag">Tag two</button>
        <button class="fr-tag" aria-pressed="true">Active tag</button>
      </div>
    </section>

    <!-- Colors -->
    <section>
      <h2>Color Palette</h2>
      <div class="row">
        <div
          style="width:60px;height:60px;background:var(--blue-france-sun-113-625);border-radius:4px"
          title="#000091 blue-france"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--error-425-625);border-radius:4px"
          title="#c9191e error"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--background-action-high-green-bourgeon);border-radius:4px"
          title="#68a532 green-bourgeon"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--background-action-high-warning);border-radius:4px"
          title="#d64d00 warning"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--red-marianne-425-625);border-radius:4px"
          title="#e1000f red-marianne"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--green-emeraude-sun-425-625);border-radius:4px"
          title="#00a95f green-emeraude"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--brown-caramel-sun-425-625);border-radius:4px"
          title="#c08c65 brown-caramel"
        ></div>
      </div>
      <div class="row" style="margin-top: 0.5rem">
        <div
          style="width:60px;height:60px;background:var(--grey-0-1000);border-radius:4px"
          title="#000 grey-1000"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--grey-200-850);border-radius:4px"
          title="#3a3a3a grey-850"
        ></div>
        <div
          style="width:60px;height:60px;background:#e5e5e5;border-radius:4px;border:1px solid #ccc"
          title="#e5e5e5 grey-200"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--background-alt-grey);border-radius:4px;border:1px solid #ccc"
          title="#f6f6f6 grey-50"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--background-contrast-grey);border-radius:4px;border:1px solid #ccc"
          title="#eee grey-contrast"
        ></div>
      </div>
    </section>
  `;
}

//
// ─── Component showcase: Tailwind theme classes ──────────────────
//

function componentsTailwind() {
  return html`
    <!-- Buttons -->
    <section>
      <h2>Buttons</h2>
      <div class="row">
        <button
          class="inline-flex items-center w-fit font-medium text-base leading-6 min-h-10 px-4 py-2 bg-blue-france text-white hover:bg-blue-france-hover"
        >
          Primary
        </button>
        <button
          class="inline-flex items-center w-fit font-medium text-base leading-6 min-h-10 px-4 py-2 bg-transparent text-blue-france shadow-[inset_0_0_0_1px_var(--color-blue-france)] hover:bg-blue-france-975"
        >
          Secondary
        </button>
        <button
          class="inline-flex items-center w-fit font-medium text-base leading-6 min-h-10 px-4 py-2 bg-transparent text-blue-france shadow-[inset_0_0_0_1px_var(--color-grey-200)] hover:bg-grey-50"
        >
          Tertiary
        </button>
      </div>
      <div class="row">
        <button
          class="inline-flex items-center w-fit font-medium text-sm leading-6 min-h-8 px-3 py-1 bg-blue-france text-white hover:bg-blue-france-hover"
        >
          Small
        </button>
        <button
          class="inline-flex items-center w-fit font-medium text-base leading-6 min-h-10 px-4 py-2 bg-blue-france text-white hover:bg-blue-france-hover"
        >
          Default
        </button>
        <button
          class="inline-flex items-center w-fit font-medium text-lg leading-7 min-h-12 px-6 py-2 bg-blue-france text-white hover:bg-blue-france-hover"
        >
          Large
        </button>
      </div>
      <div class="row">
        <button
          class="inline-flex items-center w-fit font-medium text-base leading-6 min-h-10 px-4 py-2 bg-error text-white hover:bg-error-hover"
        >
          Danger
        </button>
        <button
          class="inline-flex items-center w-fit font-medium text-base leading-6 min-h-10 px-4 py-2 bg-green-bourgeon text-white hover:bg-green-bourgeon-hover"
        >
          Success
        </button>
        <button
          class="inline-flex items-center w-fit font-medium text-base leading-6 min-h-10 px-4 py-2 bg-warning text-white hover:bg-warning-hover"
        >
          Warning
        </button>
        <button
          class="inline-flex items-center w-fit font-medium text-base leading-6 min-h-10 px-4 py-2 bg-grey-1000 text-white hover:bg-grey-850"
        >
          Dark
        </button>
      </div>
    </section>

    <!-- Badges -->
    <section>
      <h2>Badges</h2>
      <div class="row">
        <p
          class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#0063cb] bg-[#e8edff]"
        >
          Info
        </p>
        <p
          class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#18753c] bg-[#b8fec9]"
        >
          Success
        </p>
        <p
          class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#ce0500] bg-[#ffe9e9]"
        >
          Error
        </p>
        <p
          class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#b34000] bg-[#ffe9e6]"
        >
          Warning
        </p>
        <p
          class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#695240] bg-[#feebd0]"
        >
          New
        </p>
      </div>
    </section>

    <!-- Notice -->
    <section>
      <h2>Notice</h2>
      <div
        class="relative py-4 bg-[#e8edff] text-[#0063cb]"
        style="margin-bottom: 0.5rem"
      >
        <div class="max-w-7xl mx-auto px-4">
          <div class="relative flex flex-row items-start justify-between">
            <p>
              <span class="relative mr-1 font-bold">Info notice title</span>
              <span>This is an informational message.</span>
            </p>
          </div>
        </div>
      </div>
      <div class="relative py-4 bg-[#ffe9e9] text-[#ce0500]">
        <div class="max-w-7xl mx-auto px-4">
          <div class="relative flex flex-row items-start justify-between">
            <p>
              <span class="relative mr-1 font-bold">Alert notice</span>
              <span>Something went wrong.</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Callout -->
    <section>
      <h2>Callout</h2>
      <div
        class="relative p-6 mb-6 border-l-4 border-l-green-emeraude bg-[#c3fad5]"
      >
        <h3 class="font-bold text-xl leading-7 mb-2">Success callout</h3>
        <p class="text-lg leading-7">
          This callout uses the green emeraude accent.
        </p>
      </div>
      <div
        class="relative p-6 mb-6 border-l-4 border-l-brown-caramel bg-[#f7ebe5]"
      >
        <h3 class="font-bold text-xl leading-7 mb-2">Warning callout</h3>
        <p class="text-lg leading-7">
          This callout uses the brown caramel accent.
        </p>
      </div>
    </section>

    <!-- Fieldset -->
    <section>
      <h2>Fieldset</h2>
      <fieldset class="border-none p-0 m-0">
        <legend class="font-normal text-base mb-2">Choose an option:</legend>
        <div class="mt-2">
          <label><input type="radio" name="tw-opt" /> Option A</label>
        </div>
        <div class="mt-2">
          <label><input type="radio" name="tw-opt" /> Option B</label>
        </div>
      </fieldset>
      <fieldset class="border-none p-0 m-0" style="margin-top: 1rem">
        <legend class="font-normal text-base mb-2">Inline variant:</legend>
        <div class="flex gap-4">
          <div>
            <label><input type="radio" name="tw-inline" /> Yes</label>
          </div>
          <div>
            <label><input type="radio" name="tw-inline" /> No</label>
          </div>
        </div>
      </fieldset>
    </section>

    <!-- Table -->
    <section>
      <h2>Table</h2>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th
              class="bg-grey-50 text-left p-3 font-semibold border-b border-grey-200"
            >
              Name
            </th>
            <th
              class="bg-grey-50 text-left p-3 font-semibold border-b border-grey-200"
            >
              Role
            </th>
            <th
              class="bg-grey-50 text-left p-3 font-semibold border-b border-grey-200"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-3 border-b border-grey-200">Alice</td>
            <td class="p-3 border-b border-grey-200">Admin</td>
            <td class="p-3 border-b border-grey-200">
              <p
                class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#18753c] bg-[#b8fec9]"
              >
                Active
              </p>
            </td>
          </tr>
          <tr>
            <td class="p-3 border-b border-grey-200">Bob</td>
            <td class="p-3 border-b border-grey-200">User</td>
            <td class="p-3 border-b border-grey-200">
              <p
                class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#b34000] bg-[#ffe9e6]"
              >
                Pending
              </p>
            </td>
          </tr>
          <tr>
            <td class="p-3 border-b border-grey-200">Charlie</td>
            <td class="p-3 border-b border-grey-200">Moderator</td>
            <td class="p-3 border-b border-grey-200">
              <p
                class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#ce0500] bg-[#ffe9e9]"
              >
                Suspended
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Header (mini) -->
    <section>
      <h2>Header</h2>
      <header class="bg-white border-b border-grey-200">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div>
                <p class="text-sm leading-tight font-bold"
                  >République<br />Française</p
                >
              </div>
              <div class="border-l border-grey-200 pl-4">
                <p class="font-bold">Hyyypertool</p>
                <p class="text-sm text-grey-850">Design system preview</p>
              </div>
            </div>
          </div>
        </div>
        <nav class="border-t border-grey-200" aria-label="Menu principal">
          <div class="max-w-7xl mx-auto px-4">
            <ul class="flex gap-0">
              <li>
                <a
                  class="inline-block px-4 py-3 text-sm font-medium text-blue-france border-b-2 border-blue-france"
                  href="#"
                  >Moderations</a
                >
              </li>
              <li>
                <a
                  class="inline-block px-4 py-3 text-sm font-medium text-grey-850 hover:text-blue-france"
                  href="#"
                  >Utilisateurs</a
                >
              </li>
              <li>
                <a
                  class="inline-block px-4 py-3 text-sm font-medium text-grey-850 hover:text-blue-france"
                  href="#"
                  >Organisations</a
                >
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </section>

    <!-- Typography -->
    <section>
      <h2>Typography</h2>
      <h1 class="text-4xl font-bold mb-2">Heading 1</h1>
      <p class="text-xl mb-1">Extra large text</p>
      <p class="text-lg mb-1">Lead text</p>
      <p class="text-sm">Small text</p>
    </section>

    <!-- Cards -->
    <section>
      <h2>Cards</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
        <div class="bg-white border border-grey-200 p-6">
          <h3 class="font-bold text-blue-france mb-2">Card Title</h3>
          <p class="text-sm text-grey-850">
            Card description text goes here.
          </p>
        </div>
        <div class="bg-white border border-grey-200 p-6">
          <h3 class="font-bold text-blue-france mb-2">Another Card</h3>
          <p class="text-sm text-grey-850">More card description text.</p>
        </div>
      </div>
    </section>

    <!-- Alert -->
    <section>
      <h2>Alert</h2>
      <div
        class="p-4 border-l-4 border-l-warning bg-[#ffe9e6]"
        style="margin-bottom: 0.5rem"
      >
        <h3 class="font-bold mb-1">Warning alert</h3>
        <p>Something requires your attention.</p>
      </div>
    </section>

    <!-- Form inputs -->
    <section>
      <h2>Form Inputs</h2>
      <div style="margin-bottom: 1rem">
        <label class="block text-base mb-1">Email address</label>
        <input
          class="block w-full px-4 py-2 border border-grey-200 text-base"
          type="email"
          placeholder="name@example.com"
        />
      </div>
      <div class="flex items-stretch">
        <label class="sr-only">Search</label>
        <input
          class="block flex-1 px-4 py-2 border border-grey-200 text-base focus:border-blue-france focus:outline-none"
          type="search"
          placeholder="Search..."
        />
        <button
          class="inline-flex items-center justify-center w-10 min-w-10 bg-blue-france text-white hover:bg-blue-france-hover"
          title="Search"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 2a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 16a7 7 0 1 1 7-7 7 7 0 0 1-7 7zm11 1.414L17.414 15l-1.414 1.414L20.586 21z" />
          </svg>
        </button>
      </div>
    </section>

    <!-- Tags -->
    <section>
      <h2>Tags</h2>
      <div class="row">
        <button
          class="inline-flex items-center px-3 py-1 text-sm rounded-full bg-blue-france-925 text-blue-france m-1"
        >
          Tag one
        </button>
        <button
          class="inline-flex items-center px-3 py-1 text-sm rounded-full bg-blue-france-925 text-blue-france m-1"
        >
          Tag two
        </button>
        <button
          class="inline-flex items-center px-3 py-1 text-sm rounded-full bg-blue-france text-white m-1"
        >
          Active tag
        </button>
      </div>
    </section>

    <!-- Colors -->
    <section>
      <h2>Color Palette</h2>
      <div class="row">
        <div
          class="w-[60px] h-[60px] bg-blue-france rounded"
          title="#000091 blue-france"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-error rounded"
          title="#c9191e error"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-green-bourgeon rounded"
          title="#68a532 green-bourgeon"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-warning rounded"
          title="#d64d00 warning"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-red-marianne rounded"
          title="#e1000f red-marianne"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-green-emeraude rounded"
          title="#00a95f green-emeraude"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-brown-caramel rounded"
          title="#c08c65 brown-caramel"
        ></div>
      </div>
      <div class="row" style="margin-top: 0.5rem">
        <div
          class="w-[60px] h-[60px] bg-grey-1000 rounded"
          title="#000 grey-1000"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-grey-850 rounded"
          title="#3a3a3a grey-850"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-grey-200 rounded border border-[#ccc]"
          title="#e5e5e5 grey-200"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-grey-50 rounded border border-[#ccc]"
          title="#f6f6f6 grey-50"
        ></div>
        <div
          class="w-[60px] h-[60px] bg-grey-contrast rounded border border-[#ccc]"
          title="#eee grey-contrast"
        ></div>
      </div>
    </section>
  `;
}
