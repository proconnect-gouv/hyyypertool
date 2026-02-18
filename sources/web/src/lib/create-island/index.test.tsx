/**
 * Tests for createIsland helper
 */

import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { createIsland } from "./index";

// Mock Preact components for testing
function TestComponent({
  message = "Hello",
  count = 0,
}: {
  message?: string;
  count?: number;
}) {
  return (
    <div>
      <p>{message}</p>
      <span>{count}</span>
    </div>
  );
}

function NoPropsComponent() {
  return <div>No props</div>;
}

describe("createIsland", () => {
  describe("hydrate mode", () => {
    test("uses hydrate() in client script", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "hydrate",
      });

      const html = renderToString(<Island />);

      expect(html).toContain('import { hydrate, h } from "preact"');
      expect(html).toContain("hydrate(");
    });

    test("pre-renders component with props", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "hydrate",
      });

      const html = renderToString(<Island message="SSR Test" count={99} />);

      // Server-rendered content should be visible
      expect(html).toContain("SSR Test");
      expect(html).toContain("99");
    });
  });

  describe("render mode", () => {
    test("generates Island without SSR HTML", () => {
      const Island = createIsland({
        component: NoPropsComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island />);

      // Should have empty root element (no pre-rendered content)
      expect(html).toContain("<x-island-root id=");
      expect(html).toContain("></x-island-root>");
    });

    test("uses render() in client script", () => {
      const Island = createIsland({
        component: NoPropsComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island />);

      expect(html).toContain('import { render, h } from "preact"');
      expect(html).toContain("render(");
      expect(html).not.toContain("hydrate(");
    });
  });

  describe("configuration options", () => {
    test("uses custom exportName", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
        exportName: "CustomExportName",
      });

      const html = renderToString(<Island />);

      expect(html).toContain("import { CustomExportName } from");
      expect(html).toContain("h(CustomExportName, props)");
    });

    test("uses custom tag names", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
        tagName: "x-custom-island",
        rootTagName: "x-custom-root",
      });

      const html = renderToString(<Island />);

      expect(html).toContain("<x-custom-island>");
      expect(html).toContain("<x-custom-root");
      expect(html).toContain("</x-custom-island>");
    });

    test("uses custom props serializer", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
        serializeProps: (props) =>
          `customSerialization(${JSON.stringify(props)})`,
      });

      const html = renderToString(<Island message="Custom" />);

      expect(html).toContain(
        'const props = customSerialization({"message":"Custom"})',
      );
    });

    test("defaults exportName to component.name", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island />);

      expect(html).toContain("import { TestComponent } from");
    });
  });

  describe("prop handling", () => {
    test("serializes props as JSON", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island message="Test" count={42} />);

      expect(html).toContain('const props = {"message":"Test","count":42}');
    });

    test("strips nonce from component props", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island nonce="test-nonce" message="Test" />);

      // nonce should be on script tag
      expect(html).toContain('nonce="test-nonce"');
      // nonce should NOT be in props passed to component
      expect(html).not.toContain('"nonce"');
      expect(html).toContain('const props = {"message":"Test"}');
    });

    test("handles empty props", () => {
      const Island = createIsland({
        component: NoPropsComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island />);

      expect(html).toContain("const props = {}");
    });
  });

  describe("script generation", () => {
    test("includes correct client path", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/custom/path/to/component.js",
        mode: "render",
      });

      const html = renderToString(<Island />);

      expect(html).toContain(
        'import { TestComponent } from "/custom/path/to/component.js"',
      );
    });

    test("applies nonce to script tag", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island nonce="secure-nonce-123" />);

      expect(html).toContain('nonce="secure-nonce-123"');
    });

    test("sets script as defer module", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island />);

      expect(html).toContain("defer");
      expect(html).toContain('type="module"');
    });

    test("references correct root element ID", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island />);

      // Extract the ID from the root element
      const idMatch = html.match(/id="([^"]+)"/);
      expect(idMatch).not.toBeNull();

      const rootId = idMatch![1];

      // Script should reference the same ID
      expect(html).toContain(`document.getElementById("${rootId}")`);
    });
  });

  describe("unique IDs", () => {
    test("generates unique IDs for each instance", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html1 = renderToString(<Island />);
      const html2 = renderToString(<Island />);

      const id1Match = html1.match(/id="([^"]+)"/);
      const id2Match = html2.match(/id="([^"]+)"/);

      expect(id1Match![1]).not.toBe(id2Match![1]);
    });

    test("ID is a valid UUID or test ID format", () => {
      const Island = createIsland({
        component: TestComponent,
        clientPath: "/assets/test.client.js",
        mode: "render",
      });

      const html = renderToString(<Island />);

      const idMatch = html.match(/id="([^"]+)"/);
      const id = idMatch![1];

      // UUID format or test mock format: test-uuid-*
      const validIdRegex =
        /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|test-uuid-\d+)$/i;
      expect(id).toMatch(validIdRegex);
    });
  });
});
