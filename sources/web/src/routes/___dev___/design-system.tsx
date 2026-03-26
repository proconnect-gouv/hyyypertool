//
// Visual comparison page: DSFR (CDN) vs Tailwind theme
// Available at /___dev___/design-system
//

import type { AppContext } from "#src/middleware/context";
import { Hono } from "hono";
import { html } from "hono/html";
import { componentsDsfr } from "./dsfr.page";
import { componentsTailwind } from "./tailwind.page";

//

const DSFR_CSS =
  "https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.3/dist/dsfr.min.css";
const DSFR_UTILITY_CSS =
  "https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.3/dist/utility/utility.min.css";

const PANEL_STYLES = `
  body { padding: 2rem; }
  section { margin-bottom: 2rem; }
  section h2 {
    font-size: 1rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: #666;
    margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #ddd;
  }
  .row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
`;

//

export default new Hono<AppContext>()
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
              <iframe src="/___dev___/design-system/dsfr"></iframe>
            </div>
            <div class="panel">
              <div class="panel-header">Tailwind Theme (ours)</div>
              <iframe src="/___dev___/design-system/tailwind"></iframe>
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
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="${DSFR_CSS}" rel="stylesheet" />
          <link href="${DSFR_UTILITY_CSS}" rel="stylesheet" />
          <style>
            ${PANEL_STYLES}
          </style>
        </head>
        <body>
          ${componentsDsfr()}
        </body>
      </html>
    `);
  })

  //
  // Tailwind theme page — uses our built tailwind.css + ui/ component functions
  //
  .get("/design-system/tailwind", (c) => {
    const assetsPath = c.env.PUBLIC_ASSETS_PATH ?? "/public/built";
    return c.html(html`
      <!doctype html>
      <html class="font-marianne" lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="${assetsPath}/tailwind.css" />
          <style>
            ${PANEL_STYLES}
          </style>
        </head>
        <body>
          ${componentsTailwind()}
        </body>
      </html>
    `);
  });
