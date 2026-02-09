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
      <html class="font-marianne" lang="fr">
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
                    <p class="fr-logo">République<br />Française</p>
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
          class="bg-blue-france hover:bg-blue-france-hover inline-flex min-h-10 w-fit items-center px-4 py-2 text-base leading-6 font-medium text-white"
        >
          Primary
        </button>
        <button
          class="text-blue-france hover:bg-blue-france-975 inline-flex min-h-10 w-fit items-center bg-transparent px-4 py-2 text-base leading-6 font-medium shadow-[inset_0_0_0_1px_var(--color-blue-france)]"
        >
          Secondary
        </button>
        <button
          class="text-blue-france hover:bg-grey-50 inline-flex min-h-10 w-fit items-center bg-transparent px-4 py-2 text-base leading-6 font-medium shadow-[inset_0_0_0_1px_var(--color-grey-200)]"
        >
          Tertiary
        </button>
      </div>
      <div class="row">
        <button
          class="bg-blue-france hover:bg-blue-france-hover inline-flex min-h-8 w-fit items-center px-3 py-1 text-sm leading-6 font-medium text-white"
        >
          Small
        </button>
        <button
          class="bg-blue-france hover:bg-blue-france-hover inline-flex min-h-10 w-fit items-center px-4 py-2 text-base leading-6 font-medium text-white"
        >
          Default
        </button>
        <button
          class="bg-blue-france hover:bg-blue-france-hover inline-flex min-h-12 w-fit items-center px-6 py-2 text-lg leading-7 font-medium text-white"
        >
          Large
        </button>
      </div>
      <div class="row">
        <button
          class="bg-error hover:bg-error-hover inline-flex min-h-10 w-fit items-center px-4 py-2 text-base leading-6 font-medium text-white"
        >
          Danger
        </button>
        <button
          class="bg-green-bourgeon hover:bg-green-bourgeon-hover inline-flex min-h-10 w-fit items-center px-4 py-2 text-base leading-6 font-medium text-white"
        >
          Success
        </button>
        <button
          class="bg-warning hover:bg-warning-hover inline-flex min-h-10 w-fit items-center px-4 py-2 text-base leading-6 font-medium text-white"
        >
          Warning
        </button>
        <button
          class="bg-grey-1000 hover:bg-grey-850 inline-flex min-h-10 w-fit items-center px-4 py-2 text-base leading-6 font-medium text-white"
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
          class="inline-flex min-h-6 w-fit items-center rounded bg-[#e8edff] px-2 text-sm leading-6 font-bold text-[#0063cb] uppercase"
        >
          Info
        </p>
        <p
          class="inline-flex min-h-6 w-fit items-center rounded bg-[#b8fec9] px-2 text-sm leading-6 font-bold text-[#18753c] uppercase"
        >
          Success
        </p>
        <p
          class="inline-flex min-h-6 w-fit items-center rounded bg-[#ffe9e9] px-2 text-sm leading-6 font-bold text-[#ce0500] uppercase"
        >
          Error
        </p>
        <p
          class="inline-flex min-h-6 w-fit items-center rounded bg-[#ffe9e6] px-2 text-sm leading-6 font-bold text-[#b34000] uppercase"
        >
          Warning
        </p>
        <p
          class="inline-flex min-h-6 w-fit items-center rounded bg-[#feebd0] px-2 text-sm leading-6 font-bold text-[#695240] uppercase"
        >
          New
        </p>
      </div>
    </section>

    <!-- Notice -->
    <section>
      <h2>Notice</h2>
      <div
        class="relative bg-[#e8edff] py-4 text-[#0063cb]"
        style="margin-bottom: 0.5rem"
      >
        <div class="mx-auto max-w-7xl px-4">
          <div class="relative flex flex-row items-start justify-between">
            <p>
              <span class="relative mr-1 font-bold">Info notice title</span>
              <span>This is an informational message.</span>
            </p>
          </div>
        </div>
      </div>
      <div class="relative bg-[#ffe9e9] py-4 text-[#ce0500]">
        <div class="mx-auto max-w-7xl px-4">
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
        class="border-l-green-emeraude relative mb-6 border-l-4 bg-[#c3fad5] p-6"
      >
        <h3 class="mb-2 text-xl leading-7 font-bold">Success callout</h3>
        <p class="text-lg leading-7">
          This callout uses the green emeraude accent.
        </p>
      </div>
      <div
        class="border-l-brown-caramel relative mb-6 border-l-4 bg-[#f7ebe5] p-6"
      >
        <h3 class="mb-2 text-xl leading-7 font-bold">Warning callout</h3>
        <p class="text-lg leading-7">
          This callout uses the brown caramel accent.
        </p>
      </div>
    </section>

    <!-- Fieldset -->
    <section>
      <h2>Fieldset</h2>
      <fieldset class="m-0 border-none p-0">
        <legend class="mb-2 text-base font-normal">Choose an option:</legend>
        <div class="mt-2">
          <label><input type="radio" name="tw-opt" /> Option A</label>
        </div>
        <div class="mt-2">
          <label><input type="radio" name="tw-opt" /> Option B</label>
        </div>
      </fieldset>
      <fieldset class="m-0 border-none p-0" style="margin-top: 1rem">
        <legend class="mb-2 text-base font-normal">Inline variant:</legend>
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
              class="bg-grey-50 border-grey-200 border-b p-3 text-left font-semibold"
            >
              Name
            </th>
            <th
              class="bg-grey-50 border-grey-200 border-b p-3 text-left font-semibold"
            >
              Role
            </th>
            <th
              class="bg-grey-50 border-grey-200 border-b p-3 text-left font-semibold"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border-grey-200 border-b p-3">Alice</td>
            <td class="border-grey-200 border-b p-3">Admin</td>
            <td class="border-grey-200 border-b p-3">
              <p
                class="inline-flex min-h-6 w-fit items-center rounded bg-[#b8fec9] px-2 text-sm leading-6 font-bold text-[#18753c] uppercase"
              >
                Active
              </p>
            </td>
          </tr>
          <tr>
            <td class="border-grey-200 border-b p-3">Bob</td>
            <td class="border-grey-200 border-b p-3">User</td>
            <td class="border-grey-200 border-b p-3">
              <p
                class="inline-flex min-h-6 w-fit items-center rounded bg-[#ffe9e6] px-2 text-sm leading-6 font-bold text-[#b34000] uppercase"
              >
                Pending
              </p>
            </td>
          </tr>
          <tr>
            <td class="border-grey-200 border-b p-3">Charlie</td>
            <td class="border-grey-200 border-b p-3">Moderator</td>
            <td class="border-grey-200 border-b p-3">
              <p
                class="inline-flex min-h-6 w-fit items-center rounded bg-[#ffe9e9] px-2 text-sm leading-6 font-bold text-[#ce0500] uppercase"
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
      <header class="bg-white drop-shadow-[0_1px_3px_rgba(0,0,18,0.16)]">
        <div>
          <div class="mx-auto max-w-7xl px-4">
            <div class="flex items-center justify-between py-6">
              <div class="flex items-center gap-4">
                <div>
                  <p
                    class="m-0 inline-block indent-[-0.1em] align-middle text-[1.05rem] leading-[1.0317460317em] font-bold tracking-[-0.01em] uppercase before:mb-[0.3333333333rem] before:block before:h-[1rem] before:w-[2.75rem] before:[background-image:var(--logo-bg),_linear-gradient(90deg,_#000091,_#000091_50%,_#e1000f_0,_#e1000f),_linear-gradient(90deg,_#000,_#000)] before:[background-size:2.75rem_1.125rem,_2.75rem_1rem,_0] before:[background-position:0_-0.0625rem,_0_0,_0_0] before:bg-no-repeat before:content-[''] after:block after:min-w-[2.625rem] after:pt-[2.2083333333rem] after:[background-image:var(--motto-bg)] after:[background-size:5.25rem_3.75rem] after:[background-position:0_calc(100%_+_1.875rem)] after:bg-no-repeat after:content-['']"
                    style="--logo-bg: url(&quot;data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 18'%3E%3Cpath fill='%23fff' d='M11.3 10.2c-.9.6-1.7 1.3-2.3 2.1v-.1c.4-.5.7-1 1-1.5.4-.2.7-.5 1-.8.5-.5 1-1 1.7-1.3.3-.1.5-.1.8 0-.1.1-.2.1-.4.2H13v-.1c-.3.3-.7.5-1 .9-.1.2-.2.6-.7.6 0 .1.1 0 0 0zm1.6 4.6c0-.1-.1 0-.2 0l-.1.1-.1.1-.2.2s.1.1.2 0l.1-.1c.1 0 .2-.1.2-.2.1 0 .1 0 .1-.1 0 .1 0 0 0 0zm-1.6-4.3c.1 0 .2 0 .2-.1s.1-.1.1-.1v-.1c-.2.1-.3.2-.3.3zm2.4 1.9s0-.1 0 0c.1-.1.2-.1.3-.1.7-.1 1.4-.3 2.1-.6-.8-.5-1.7-.9-2.6-1h.1c-.1-.1-.3-.1-.5-.2h.1c-.2-.1-.5-.1-.7-.2.1 0 .2-.2.2-.3h-.1c-.4.2-.6.5-.8.9.2.1.5 0 .7.1h-.3c-.1 0-.2.1-.2.2h.1c-.1 0-.1.1-.2.1.1.1.2 0 .4 0 0 .1.1.1.1.1-.1 0-.2.1-.3.3-.1.2-.2.2-.3.3v.1c-.3.2-.6.5-.9.8v.1c-.1.1-.2.1-.2.2v.1c.4-.1.6-.4 1-.5l.6-.3c.2 0 .3-.1.5-.1v.1h.2c0 .1-.2 0-.1.1s.3.1.4 0c.2-.2.3-.2.4-.2zM12.4 14c-.4.2-.9.2-1.2.4 0 0 0 .1-.1.1 0 0-.1 0-.1.1-.1 0-.1.1-.2.2l-.1.1s0 .1.1 0l.1-.1s-.1.1-.1.2V15.3l-.1.1s0 .1-.1.1l-.1.1.2-.2.1-.1h.2s0-.1.1-.1c.1-.1.2-.2.3-.2h.1c.1-.1.3-.1.4-.2.1-.1.2-.2.3-.2.2-.2.5-.3.8-.5-.1 0-.2-.1-.3-.1 0 .1-.2 0-.3 0zM30 9.7c-.1.2-.4.2-.6.3-.2.2 0 .4.1.5.1.3-.2.5-.4.5.1.1.2.1.2.1 0 .2.2.2.1.4s-.5.3-.3.5c.1.2.1.5 0 .7-.1.2-.3.4-.5.5-.2.1-.4.1-.6 0-.1 0-.1-.1-.2-.1-.5-.1-1-.2-1.5-.2-.1 0-.3.1-.4.1-.1.1-.3.2-.4.3l-.1.1c-.1.1-.2.2-.2.3-.1.2-.2.4-.2.6-.2.5-.2 1 0 1.4 0 0 1 .3 1.7.6.2.1.5.2.7.4l1.7 1H13.2l1.6-1c.6-.4 1.3-.7 2-1 .5-.2 1.1-.5 1.5-.9.2-.2.3-.4.5-.5.3-.4.6-.7 1-1l.3-.3s0-.1.1-.1c-.2.1-.2.2-.4.2 0 0-.1 0 0-.1s.2-.2.3-.2v-.1c-.4 0-.7.2-1 .5h-.2c-.5.2-.8.5-1.2.7v-.1c-.2.1-.4.2-.5.2-.2 0-.5.1-.8 0-.4 0-.7.1-1.1.2-.2.1-.4.1-.6.2v.1l-.2.2c-.2.1-.3.2-.5.4l-.5.5h-.1l.1-.1.1-.1c0-.1.1-.1.1-.2.2-.1.3-.3.5-.4 0 0-.1 0 0 0 0 0 0-.1.1-.1l-.1.1c-.1.1-.1.2-.2.2v-.1-.1l.2-.2c.1-.1.2-.1.3-.2h.1c-.2.1-.3.1-.5.2H14h-.1c0-.1.1-.1.2-.2h.1c1-.8 2.3-.6 3.4-1 .1-.1.2-.1.3-.2.1-.1.3-.2.5-.3.2-.2.4-.4.5-.7v-.1c-.4.4-.8.7-1.3 1-.6.2-1.3.4-2 .4 0-.1.1-.1.1-.1 0-.1.1-.1.1-.2h.1s0-.1.1-.1h.1c-.1-.1-.3.1-.4 0 .1-.1 0-.2.1-.2h.1s0-.1.1-.1c.5-.3.9-.5 1.3-.7-.1 0-.1.1-.2 0 .1 0 0-.1.1-.1.3-.1.6-.3.9-.4-.1 0-.2.1-.3 0 .1 0 .1-.1.2-.1v-.1h0c0-.1.1 0 .2-.1h-.1c.1-.1.2-.2.4-.2 0-.1-.1 0-.1-.1h.1-.5c-.1 0 0-.1 0-.1.1-.2.2-.5.3-.7h-.1c-.3.3-.8.5-1.2.6h-.2c-.2.1-.4.1-.5 0-.1-.1-.2-.2-.3-.2-.2-.1-.5-.3-.8-.4-.7-.2-1.5-.4-2.3-.3.3-.1.7-.2 1.1-.3.5-.2 1-.3 1.5-.3h-.3c-.4 0-.9.1-1.3.2-.3.1-.6.2-.9.2-.2.1-.3.2-.5.2v-.1c.3-.4.7-.7 1.1-.8.5-.1 1.1 0 1.6.1.4 0 .8.1 1.1.2.1 0 .2.2.3.3.2.1.4 0 .5.1v-.2c.1-.1.3 0 .4 0 .2-.2-.2-.4-.3-.6v-.1c.2.2.5.4.7.6.1.1.5.2.5 0-.2-.3-.4-.6-.7-.9v-.2c-.1 0-.1 0-.1-.1-.1-.1-.1-.2-.1-.3-.1-.2 0-.4-.1-.5-.1-.2-.1-.3-.1-.5-.1-.5-.2-1-.3-1.4-.1-.6.3-1 .6-1.5.2-.4.5-.7.8-1 .1-.4.3-.7.6-1 .3-.3.6-.5.9-.6.3-.1.5-.2.8-.3l2.5-.4H25l1.8.3c.1 0 .2 0 .2.1.1.1.3.2.4.2.2.1.4.3.6.5.1.1.2.3.1.4-.1.1-.1.4-.2.4-.2.1-.4.1-.6.1-.1 0-.2 0-.4-.1.5.2.9.4 1.2.8 0 .1.2.1.3.1v.1c-.1.1-.1.1-.1.2h.1c.1-.1.1-.4.3-.3.2.1.2.3.1.4-.1.1-.2.2-.4.3v.2c.1.1.1.2.2.4s.1.5.2.7c.1.5.2.9.2 1.4 0 .2-.1.5 0 .7l.3.6c.1.2.2.3.3.5.2.3.6.6.4 1zm-15.6 5.2c-.1 0-.1.1-.1.1s.1 0 .1-.1zm5.8-1.8c-.1.1 0 0 0 0zm-6.7-.2c0 .1.1 0 .1 0 .2-.1.5 0 .6-.2-.1-.1-.2 0-.2-.1-.1 0-.2 0-.2.1-.1.1-.3.1-.3.2z'/%3E%3Cpath fill='gray' d='M27.9 6.8c.1 0 .3 0 .3.1-.1.2-.4.3-.6.5h-.1c-.1.1-.1.2-.1.2h-.3c.1.1.3.2.5.2l.1.1h.2V8c-.1.1-.2.1-.4.1.2.1.5.1.7 0 .2-.1 0-.4.1-.5-.1 0 0-.1-.1-.1.1-.1.1-.2.2-.2s.1 0 .2-.1c0-.1-.1-.1-.1-.2.2-.1.3-.3.3-.5 0-.1-.3-.1-.4-.2h-.5c-.2 0-.3.1-.5.1l-.6.3c.2-.1.4-.1.7-.2 0 .3.2.3.4.3'/%3E%3C/svg%3E&quot;); --motto-bg: url(&quot;data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 252 180'%3E%3Cdefs%3E%3Csymbol id='a' viewBox='0 0 11 15.5'%3E%3Cpath d='M10.4 5.3C11.9 1.5 10.1 0 7.9 0 4.2 0 0 6.5 0 11.7c0 2.5 1.2 3.8 3 3.8 2.1 0 4.3-2 6.2-5.5h-1c-1.2 1.5-2.6 2.6-3.9 2.6-1.3 0-2-.8-2-2.6a10.7 10.7 0 01.3-2.2zm-4-3.1c1.1 0 2 .8 1.5 2.6L3.1 6.1c.8-2.2 2.2-4 3.4-4z'/%3E%3C/symbol%3E%3Csymbol id='b' viewBox='0 0 12.4 21.8'%3E%3Cuse width='11' height='15.5' y='6.4' href='%23a'/%3E%3Cpath d='M7.9 4.7L12.4.6V0h-3L6.7 4.7H8z'/%3E%3C/symbol%3E%3Csymbol id='c' viewBox='0 0 11.5 19'%3E%3Cpath d='M1.7 5.7h2.6L.1 17.1a1.3 1.3 0 001.2 2c3 0 6.4-2.6 7.8-6.2h-.7a9.4 9.4 0 01-5.1 3.5L7 5.7H11l.5-1.6H7.7L9 0H7.6L4.9 4.1l-3.2.4v1.2z'/%3E%3C/symbol%3E%3Csymbol id='d' viewBox='0 0 9.8 21.9'%3E%3Cpath d='M7.6 8c.3-1-.4-1.6-1-1.6-2.2 0-5 2.1-6 5h.7A5.6 5.6 0 014.4 9L.1 20.3a1.1 1.1 0 001 1.6c2.2 0 4.7-2 5.8-5H6A5.6 5.6 0 013 19.5zM8 3.7a1.8 1.8 0 001.8-1.8A1.8 1.8 0 008 0a1.8 1.8 0 00-1.8 1.8A1.8 1.8 0 008 3.6'/%3E%3C/symbol%3E%3Csymbol id='e' viewBox='0 0 14.8 15.5'%3E%3Cpath d='M3.3 3.1c.7 0 1 1 0 3.4l-3 6.8c-.7 1.3 0 2.2 1.2 2.2a1.3 1.3 0 001.5-1l3-8C7.4 4.8 10 3 11 3s.8.6.3 1.6l-4.6 9a1.3 1.3 0 001.1 1.9c2.3 0 5-2 6-5h-.6A5.6 5.6 0 0110 13l4-8a6.1 6.1 0 00.8-2.8A2 2 0 0012.6 0c-2 0-3.6 2.2-6 5V2.8C6.6 1.4 6.1 0 4.8 0 3.2 0 1.8 2.5.7 4.9h.7c.7-1.1 1.3-1.8 2-1.8'/%3E%3C/symbol%3E%3Csymbol id='f' viewBox='0 0 12 15.5'%3E%3Cpath d='M11.8 3.5c.5-1.9.2-3.5-1.2-3.5-1.8 0-2.3 1.2-4 5V2.8C6.5 1.3 6 0 4.6 0 3.1 0 1.7 2.5.5 5h.8C2 3.7 2.8 3 3.3 3c.7 0 1 1 0 3.4l-3 6.8c-.7 1.3 0 2.1 1.2 2.1a1.3 1.3 0 001.5-1l3-8a50.3 50.3 0 012.6-3h3.2z'/%3E%3C/symbol%3E%3Csymbol id='g' viewBox='0 0 14.7 16.2'%3E%3Cpath d='M10.5 13.1c-.6 0-1-1 0-3.4L14.6.1 13.4 0l-1.3 1.3h-.3C6.1 1.3 0 8.6 0 14.2a2 2 0 002.1 2.1c1.7 0 3.3-2.4 5.2-5l-.1 1c-.3 2.6.6 4 2 4 1.5 0 3-2.4 4-4.9h-.7c-.7 1.1-1.5 1.8-2 1.8zM7.9 9.8c-1.3 1.6-3.4 3.5-4.3 3.5-.5 0-.9-.5-.9-1.6 0-3.5 4-8.2 6-8.2a4.2 4.2 0 011.4.2z'/%3E%3C/symbol%3E%3Csymbol id='h' viewBox='0 0 21.9 19.8'%3E%3Cpath d='M11.2 19.8l.3-.9c-3.8-.7-4.3-.7-2.7-4.8l1.4-3.9h3c1.9 0 1.9.9 1.6 3h1l2.6-6.9h-1c-1 1.6-1.8 2.9-3.8 2.9h-3l2-5.6c.8-2 1.1-2.4 3.7-2.4h.7c2.6 0 3 .7 3 3.5h1l.9-4.7H7.3L7 .9c3 .6 3.3.9 2 4.8L5.7 14c-1.5 3.9-2 4.2-5.5 4.8l-.3.9z'/%3E%3C/symbol%3E%3Csymbol id='i' viewBox='0 0 10.1 21.9'%3E%3Cpath d='M2.9 19.4L10.1.3 9.8 0l-5 .6v.6l1 .7c.9.7.6 1.3-.2 3.4L.2 19.9a1.3 1.3 0 001.1 2c2.3 0 4.7-2.1 5.8-5h-.7a6.5 6.5 0 01-3.5 2.5'/%3E%3C/symbol%3E%3Csymbol id='j' viewBox='0 0 18 22'%3E%3Cpath d='M18 .6h-4.3a3.8 3.8 0 00-2.1-.6A6.6 6.6 0 005 6.5a3.3 3.3 0 003 3.6c-1.9.8-3 1.8-3 2.9a1.7 1.7 0 00.9 1.5c-4.3 1.3-6 2.8-6 4.7 0 2 2.6 2.8 5.6 2.8 5.3 0 9.6-2.7 9.6-5.1 0-1.8-1.6-2.5-4.3-3.3-2.2-.7-3.2-.8-3.2-1.6A2.4 2.4 0 019 10.2a6.6 6.6 0 006.1-6.5 4.5 4.5 0 00-.2-1.5h2.5zM9.8 16.2c2.1.7 3 1 3 1.6 0 1.4-2 2.5-5.6 2.5-2.7 0-4-.6-4-2 0-1.5 1.4-2.5 3.5-3.3a21.5 21.5 0 003 1.2zM9 9c-1 0-1.3-.8-1.3-1.7 0-2.8 1.4-6.2 3.5-6.2 1 0 1.3.8 1.3 1.6 0 2.9-1.4 6.3-3.5 6.3z'/%3E%3C/symbol%3E%3Csymbol id='k' viewBox='0 0 23 25.1'%3E%3Cpath d='M14.3 15.6c1.9 0 2 .8 1.6 2.8H17l2.5-6.8h-1c-1 1.6-1.7 2.9-3.8 2.9h-4.1l2-5.6c.7-2 1-2.4 3.7-2.4H18c2.6 0 3 .7 3 3.5h1l.9-4.7H7.3l-.3.9c3 .6 3.3.9 2 4.8l-3.2 8.4c-1.5 3.9-2 4.2-5.6 4.8l-.2 1h17.4l3.2-5h-1.2c-2 2-4 3.8-8 3.8-4.7 0-4.3-.3-2.7-4.6l1.4-3.8h4.2zm2.3-11.8L21 .6V0h-3l-2.6 3.9h1.2v-.1z'/%3E%3C/symbol%3E%3Csymbol id='l' viewBox='0 0 13.6 21.8'%3E%3Cpath d='M11.4 6.4c-2 0-4 2.2-5.8 4.8L9.6.3 9.4 0l-5 .6V1l1 .8c.9.7.6 1.3-.2 3.4L.8 16.8A13.9 13.9 0 000 19c0 1.4 1.8 2.7 3.5 2.7 3.8 0 10-6.9 10-12.2 0-2.3-.5-3.2-2.1-3.2zM4.8 19.5c-.8 0-1.9-.7-1.9-1.3a15.5 15.5 0 01.8-2.2L5 12.7C6.3 11 8.4 9.3 9.6 9.3c.7 0 1.2.4 1.2 1.5 0 3.1-2.9 8.7-6 8.7z'/%3E%3C/symbol%3E%3Csymbol id='m' viewBox='0 0 19.2 19.9'%3E%3Cpath d='M17.6 0H7.3L7 .9c3 .6 3.3.9 2 4.8l-3.2 8.5c-1.5 3.9-2 4.2-5.5 4.8L0 20h15.7l3.5-6H18c-2 2-4.2 4.8-7.7 4.8-2.7 0-3-.5-1.6-4.5l3.1-8.5c1.4-3.9 2-4.2 5.5-4.8z'/%3E%3C/symbol%3E%3Csymbol id='n' viewBox='0 0 126 90'%3E%3Cuse width='12.4' height='21.8' x='112.7' y='66.1' href='%23b'/%3E%3Cuse width='11.5' height='19' x='102.2' y='69' href='%23c'/%3E%3Cuse width='9.8' height='21.9' x='93.6' y='66.1' href='%23d'/%3E%3Cuse width='14.8' height='15.5' x='77.2' y='72.5' href='%23e'/%3E%3Cuse width='12' height='15.5' x='65.7' y='72.5' href='%23f'/%3E%3Cuse width='11' height='15.5' x='54.3' y='72.5' href='%23a'/%3E%3Cuse width='11.5' height='19' x='43.7' y='69' href='%23c'/%3E%3Cuse width='14.7' height='16.2' x='28.9' y='71.8' href='%23g'/%3E%3Cuse width='12' height='15.5' x='19.6' y='72.5' href='%23f'/%3E%3Cuse width='21.9' height='19.8' y='67.6' href='%23h'/%3E%3Cuse width='12.4' height='21.8' x='77.3' y='33.1' href='%23b'/%3E%3Cuse width='11.5' height='19' x='66.8' y='36' href='%23c'/%3E%3Cuse width='9.8' height='21.9' x='58.2' y='33' href='%23d'/%3E%3Cuse width='10.1' height='21.9' x='49.4' y='33.1' href='%23i'/%3E%3Cuse width='14.7' height='16.2' x='34.9' y='38.8' href='%23g'/%3E%3Cuse width='18' height='22' x='18.6' y='39.4' href='%23j'/%3E%3Cuse width='23' height='25.1' y='29.3' href='%23k'/%3E%3Cuse width='12.4' height='21.8' x='76.8' y='.1' href='%23b'/%3E%3Cuse width='11.5' height='19' x='66.2' y='2.9' href='%23c'/%3E%3Cuse width='12' height='15.5' x='54.8' y='6.5' href='%23f'/%3E%3Cuse width='11' height='15.5' x='43.4' y='6.4' href='%23a'/%3E%3Cuse width='13.6' height='21.8' x='29.4' y='.1' href='%23l'/%3E%3Cuse width='9.8' height='21.9' x='20.6' href='%23d'/%3E%3Cuse width='19.2' height='19.9' y='1.4' href='%23m'/%3E%3C/symbol%3E%3C/defs%3E%3Cuse fill='%23000' width='126' height='90' x='0' y='0' href='%23n'/%3E%3Cuse fill='%23fff' width='126' height='90' x='126' y='90' href='%23n'/%3E%3C/svg%3E&quot;)"
                  >
                    République<br />Française
                  </p>
                </div>
                <div class="border-grey-200 border-l pl-4">
                  <p class="m-0 text-[1.25rem] leading-7 font-bold">
                    Hyyypertool
                  </p>
                  <p class="text-grey-850 m-0 text-sm leading-6">
                    Design system preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav
          class="shadow-[inset_0_1px_0_0_var(--color-grey-200)]"
          aria-label="Menu principal"
        >
          <div class="mx-auto max-w-7xl px-4">
            <ul class="m-0 flex list-none gap-0 p-0">
              <li>
                <a
                  class="text-blue-france inline-flex items-center px-4 py-3 text-sm shadow-[inset_0_-2px_0_0_var(--color-blue-france)]"
                  href="#"
                  >Moderations</a
                >
              </li>
              <li>
                <a
                  class="text-grey-850 hover:bg-grey-50 inline-flex items-center px-4 py-3 text-sm"
                  href="#"
                  >Utilisateurs</a
                >
              </li>
              <li>
                <a
                  class="text-grey-850 hover:bg-grey-50 inline-flex items-center px-4 py-3 text-sm"
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
      <h1 class="mb-2 text-4xl font-bold">Heading 1</h1>
      <p class="mb-1 text-xl">Extra large text</p>
      <p class="mb-1 text-lg">Lead text</p>
      <p class="text-sm">Small text</p>
    </section>

    <!-- Cards -->
    <section>
      <h2>Cards</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
        <div class="border-grey-200 border bg-white p-6">
          <h3 class="text-blue-france mb-2 font-bold">Card Title</h3>
          <p class="text-grey-850 text-sm">Card description text goes here.</p>
        </div>
        <div class="border-grey-200 border bg-white p-6">
          <h3 class="text-blue-france mb-2 font-bold">Another Card</h3>
          <p class="text-grey-850 text-sm">More card description text.</p>
        </div>
      </div>
    </section>

    <!-- Alert -->
    <section>
      <h2>Alert</h2>
      <div
        class="border-l-warning border-l-4 bg-[#ffe9e6] p-4"
        style="margin-bottom: 0.5rem"
      >
        <h3 class="mb-1 font-bold">Warning alert</h3>
        <p>Something requires your attention.</p>
      </div>
    </section>

    <!-- Form inputs -->
    <section>
      <h2>Form Inputs</h2>
      <div style="margin-bottom: 1rem">
        <label class="mb-1 block text-base">Email address</label>
        <input
          class="border-grey-200 block w-full border px-4 py-2 text-base"
          type="email"
          placeholder="name@example.com"
        />
      </div>
      <div class="flex items-stretch">
        <label class="sr-only">Search</label>
        <input
          class="border-grey-200 focus:border-blue-france block flex-1 border px-4 py-2 text-base focus:outline-none"
          type="search"
          placeholder="Search..."
        />
        <button
          class="bg-blue-france hover:bg-blue-france-hover inline-flex w-10 min-w-10 items-center justify-center text-white"
          title="Search"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M11 2a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 16a7 7 0 1 1 7-7 7 7 0 0 1-7 7zm11 1.414L17.414 15l-1.414 1.414L20.586 21z"
            />
          </svg>
        </button>
      </div>
    </section>

    <!-- Tags -->
    <section>
      <h2>Tags</h2>
      <div class="row">
        <button
          class="bg-blue-france-925 text-blue-france m-1 inline-flex items-center rounded-full px-3 py-1 text-sm"
        >
          Tag one
        </button>
        <button
          class="bg-blue-france-925 text-blue-france m-1 inline-flex items-center rounded-full px-3 py-1 text-sm"
        >
          Tag two
        </button>
        <button
          class="bg-blue-france m-1 inline-flex items-center rounded-full px-3 py-1 text-sm text-white"
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
          class="bg-blue-france h-[60px] w-[60px] rounded"
          title="#000091 blue-france"
        ></div>
        <div
          class="bg-error h-[60px] w-[60px] rounded"
          title="#c9191e error"
        ></div>
        <div
          class="bg-green-bourgeon h-[60px] w-[60px] rounded"
          title="#68a532 green-bourgeon"
        ></div>
        <div
          class="bg-warning h-[60px] w-[60px] rounded"
          title="#d64d00 warning"
        ></div>
        <div
          class="bg-red-marianne h-[60px] w-[60px] rounded"
          title="#e1000f red-marianne"
        ></div>
        <div
          class="bg-green-emeraude h-[60px] w-[60px] rounded"
          title="#00a95f green-emeraude"
        ></div>
        <div
          class="bg-brown-caramel h-[60px] w-[60px] rounded"
          title="#c08c65 brown-caramel"
        ></div>
      </div>
      <div class="row" style="margin-top: 0.5rem">
        <div
          class="bg-grey-1000 h-[60px] w-[60px] rounded"
          title="#000 grey-1000"
        ></div>
        <div
          class="bg-grey-850 h-[60px] w-[60px] rounded"
          title="#3a3a3a grey-850"
        ></div>
        <div
          class="bg-grey-200 h-[60px] w-[60px] rounded border border-[#ccc]"
          title="#e5e5e5 grey-200"
        ></div>
        <div
          class="bg-grey-50 h-[60px] w-[60px] rounded border border-[#ccc]"
          title="#f6f6f6 grey-50"
        ></div>
        <div
          class="bg-grey-contrast h-[60px] w-[60px] rounded border border-[#ccc]"
          title="#eee grey-contrast"
        ></div>
      </div>
    </section>
  `;
}
