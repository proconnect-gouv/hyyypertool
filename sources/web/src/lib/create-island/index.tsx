/**
 * Preact Island Factory
 *
 * Creates server-side Island wrapper components that hydrate Preact components on the client.
 *
 * Supports two rendering modes:
 * - `hydrate`: Pre-renders HTML on server, then hydrates on client (no flash, SEO-friendly)
 * - `render`: Client-only rendering (lighter server load, accepts flash/layout shift)
 *
 * @example
 * ```tsx
 * // With hydration (SSR + client interactivity)
 * export const CounterIsland = createIsland({
 *   component: Counter,
 *   clientPath: `${config.PUBLIC_ASSETS_PATH}/ui/demo/counter.client.js`,
 *   mode: 'hydrate'
 * });
 *
 * // Client-only rendering
 * export const NotificationIsland = createIsland({
 *   component: NotificationContainer,
 *   clientPath: `${config.PUBLIC_ASSETS_PATH}/ui/notifications/notifications.client.js`,
 *   mode: 'render'
 * });
 * ```
 */

import type { ComponentType } from "preact";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { randomUUID } from "node:crypto";

//

export type IslandMode = "hydrate" | "render";

export interface CreateIslandOptions<P = Record<string, unknown>> {
  /** The Preact component to wrap (must be imported from .client.tsx file) */
  component: ComponentType<P>;
  /** The client-side bundle path (e.g., `${config.PUBLIC_ASSETS_PATH}/ui/demo/counter.client.js`) */
  clientPath: string;
  /** Rendering mode: 'hydrate' for SSR+hydration, 'render' for client-only */
  mode: IslandMode;
  /** Component export name in client bundle (defaults to component.name) */
  exportName?: string;
  /** Custom island tag name (defaults to 'x-island') */
  tagName?: string;
  /** Custom root element tag name (defaults to 'x-island-root') */
  rootTagName?: string;
  /** Props serializer (defaults to JSON.stringify for complex props) */
  serializeProps?: (props: Partial<P>) => string;
}

export interface IslandProps {
  /** CSP nonce for inline script */
  nonce?: string;
}

/**
 * Creates a Preact Island wrapper component
 *
 * @param options Island configuration
 * @returns Server-side Island component
 */
export function createIsland<P extends Record<string, unknown>>(
  options: CreateIslandOptions<P>,
) {
  const {
    component: Component,
    clientPath,
    mode,
    exportName = Component.name,
    tagName = "x-island",
    rootTagName = "x-island-root",
    serializeProps = (props) => JSON.stringify(props),
  } = options;

  if (!exportName) {
    throw new Error(
      "createIsland: component must have a name or exportName must be provided",
    );
  }

  /**
   * Island wrapper component
   *
   * Renders the Preact component on server (if mode='hydrate') and generates
   * client-side hydration/render script
   */
  return function Island(props: P & IslandProps) {
    const { nonce = "", ...componentProps } = props;
    const root_id = randomUUID();

    // Server-side rendering (only for hydrate mode)
    const serverRenderedHTML =
      mode === "hydrate"
        ? renderToString(h(Component, componentProps as P))
        : "";

    // Inline script for client-side hydration/rendering
    const islandScript = generateIslandScript(
      mode,
      clientPath,
      exportName,
      root_id,
      componentProps as Partial<P>,
      serializeProps,
    );

    // Custom element tags - cast to any to allow dynamic tag names
    const IslandTag = tagName as any;
    const RootTag = rootTagName as any;

    return (
      <IslandTag>
        {mode === "hydrate" ? (
          <RootTag
            id={root_id}
            dangerouslySetInnerHTML={{ __html: serverRenderedHTML }}
          />
        ) : (
          <RootTag id={root_id} />
        )}
        <script
          dangerouslySetInnerHTML={{ __html: islandScript }}
          defer
          nonce={nonce}
          type="module"
        />
      </IslandTag>
    );
  };
}

//

/**
 * Generates island script for client-side hydration or rendering
 */
function generateIslandScript<P>(
  mode: "hydrate" | "render",
  clientPath: string,
  exportName: string,
  rootId: string,
  props: Partial<P>,
  serializeProps: (props: Partial<P>) => string,
): string {
  const serializedProps = serializeProps(props);
  const preactMethod = mode === "hydrate" ? "hydrate" : "render";

  return `
import { ${preactMethod}, h } from "preact";
import { ${exportName} } from "${clientPath}";
document.addEventListener('DOMContentLoaded', () => {
  const props = ${serializedProps};
  ${preactMethod}(h(${exportName}, props), document.getElementById("${rootId}"));
});
`.trim();
}
