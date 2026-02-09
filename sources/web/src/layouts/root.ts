//

import type { App_Context } from "#src/middleware/context";
import { html, raw } from "hono/html";
import type { PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

//

export function RootLayout({ children }: PropsWithChildren) {
  const {
    var: { config, nonce, sentry_trace_meta_tags, page_title },
  } = useRequestContext<App_Context>();

  return html`
    <html
      lang="fr"
      hx-ext="${[
        config.NODE_ENV === "production" ? "" : "debug",
        "chunked-transfer",
        "include-vals",
      ]
        .filter(Boolean)
        .join(", ")}"
    >
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#000091" />

        <!--  -->
        ${raw(sentry_trace_meta_tags ?? "")}
        <!--  -->

        <link
          rel="apple-touch-icon"
          href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/favicon.svg"
          type="image/svg+xml"
        />
        <link
          rel="shortcut icon"
          href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="manifest"
          href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/manifest.webmanifest"
          crossorigin="use-credentials"
        />

        <!--  -->

        <link
          rel="stylesheet"
          href="${config.ASSETS_PATH}/node_modules/animate.css/source/_vars.css"
        />
        <link
          rel="stylesheet"
          href="${config.ASSETS_PATH}/node_modules/animate.css/source/_base.css"
        />
        <link
          rel="stylesheet"
          href="${config.ASSETS_PATH}/node_modules/animate.css/source/bouncing_entrances/bounceIn.css"
        />

        <!--  -->

        <link
          rel="stylesheet"
          href="${config.PUBLIC_ASSETS_PATH}/tailwind.css"
        />

        <!--  -->

        <script nonce="${nonce}" type="importmap">
          {
            "imports": {
              "@preact/signals-core": "${config.ASSETS_PATH}/node_modules/@preact/signals-core/dist/signals-core.module.js",
              "@preact/signals": "${config.ASSETS_PATH}/node_modules/@preact/signals/dist/signals.module.js",
              "/src/": "${config.PUBLIC_ASSETS_PATH}/",
              "#src/config": "${config.ASSETS_PATH}/bundle/config.js",
              "preact": "${config.ASSETS_PATH}/node_modules/preact/dist/preact.module.js",
              "preact/hooks": "${config.ASSETS_PATH}/node_modules/preact/hooks/dist/hooks.module.js",
              "preact/jsx-runtime": "${config.ASSETS_PATH}/node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js",
              "preact/jsx-dev-runtime": "${config.ASSETS_PATH}/node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js"
            }
          }
        </script>

        <title>
          ${page_title ??
          `H${
            Array.from({ length: Math.max(3, nonce.length) })
              .fill("y")
              .join("") + "pertool"
          }`}
        </title>
      </head>
      <body class="flex min-h-screen flex-col">
        <div class="flex flex-1 flex-col">${children}</div>
        <footer class="container mx-auto flex flex-row justify-between p-2">
          <div>© ${new Date().getFullYear()} 🇫🇷</div>
          <a
            href="https://github.com/proconnect-gouv/hyyypertool/tree/${config.VERSION}"
            rel="noopener noreferrer"
            target="_blank"
            safe
          >
            <small>version ${config.VERSION}</small>
          </a>
        </footer>
      </body>

      <!--  -->

      <script
        nonce="${nonce}"
        src="${config.PUBLIC_ASSETS_PATH}/layouts/nprogress.client.js"
        type="module"
      ></script>

      <link
        rel="stylesheet"
        href="${config.ASSETS_PATH}/node_modules/nprogress/nprogress.css"
      />

      <!--  -->

      ${config.NODE_ENV === "development"
        ? html`<script
            nonce="${nonce}"
            src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/htmx.js"
          ></script>`
        : html`<script
            nonce="${nonce}"
            src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/htmx.min.js"
          ></script>`}

      <meta
        name="htmx-env"
        content="${JSON.stringify({
          defaultSettleDelay: 0,
          globalViewTransitions: true,
          historyEnabled: true,
          inlineScriptNonce: nonce,
        })}"
      />

      ${config.DEPLOY_ENV === "preview"
        ? html`<script
            defer
            nonce="${nonce}"
            src="${config.ASSETS_PATH}/node_modules/htmx-ext-debug/debug.js"
          ></script>`
        : ""}

      <script
        defer
        nonce="${nonce}"
        src="${config.ASSETS_PATH}/node_modules/htmx-ext-include-vals/include-vals.js"
        type="module"
      ></script>
      <script
        defer
        nonce="${nonce}"
        src="${config.ASSETS_PATH}/node_modules/htmx-ext-sse/dist/sse.js"
        type="module"
      ></script>
      <script
        defer
        nonce="${nonce}"
        src="${config.ASSETS_PATH}/node_modules/htmx.ext...chunked-transfer/dist/index.js"
        type="module"
      ></script>

      <!--  -->

      ${config.NODE_ENV === "development"
        ? html`<script
              nonce="${nonce}"
              src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/_hyperscript.js"
            ></script>

            <script
              nonce="${nonce}"
              src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/hdb.js"
            ></script>`
        : html`<script
            nonce="${nonce}"
            src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/_hyperscript.min.js"
          ></script>`}
      <script
        nonce="${nonce}"
        src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/template.js"
      ></script>

      <!--  -->

      <script
        defer
        nonce="${nonce}"
        src="${config.PUBLIC_ASSETS_PATH}/lib/htmx.client.js"
        type="module"
      ></script>

      <!--  -->

      ${config.NODE_ENV === "development"
        ? html`<script
            defer
            nonce="${nonce}"
            src="${config.PUBLIC_ASSETS_PATH}/routes/__dev__/live-reload.client.js"
            type="module"
          ></script>`
        : ""}
    </html>
  `;
}
