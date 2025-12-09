import { beforeEach, describe, expect, test } from "bun:test";
import ChangesetPlugin from "./index";

describe("ChangesetPlugin", () => {
  describe("isEnabled", () => {
    test("should return true", () => {
      expect(ChangesetPlugin.isEnabled()).toBe(true);
    });
  });

  describe("parseChangeset", () => {
    let plugin: ChangesetPlugin;

    beforeEach(() => {
      plugin = new ChangesetPlugin({});
    });

    test("should parse simple markdown content", () => {
      const content = `Nouveau système de gestion des utilisateurs`;

      const result = plugin.parseChangeset("my-feature", content);

      expect(result).toEqual({
        id: "my-feature",
        content: "Nouveau système de gestion des utilisateurs",
      });
    });

    test("should parse multiline content", () => {
      const content = `Ajout de la fonctionnalité de recherche

Cette fonctionnalité permet aux utilisateurs de rechercher rapidement.`;

      const result = plugin.parseChangeset("search", content);

      expect(result).toEqual({
        id: "search",
        content: `Ajout de la fonctionnalité de recherche

Cette fonctionnalité permet aux utilisateurs de rechercher rapidement.`,
      });
    });

    test("should trim whitespace", () => {
      const content = `

  Description avec espaces

`;

      const result = plugin.parseChangeset("trimmed", content);

      expect(result).toEqual({
        id: "trimmed",
        content: "Description avec espaces",
      });
    });

    test("should return null for empty content", () => {
      const content = ``;

      const result = plugin.parseChangeset("empty", content);

      expect(result).toBeNull();
    });

    test("should return null for whitespace-only content", () => {
      const content = `

  `;

      const result = plugin.parseChangeset("whitespace", content);

      expect(result).toBeNull();
    });

    test("should handle content with special characters", () => {
      const content = `Amélioration de l'interface utilisateur (UI)`;

      const result = plugin.parseChangeset("special", content);

      expect(result).toEqual({
        id: "special",
        content: "Amélioration de l'interface utilisateur (UI)",
      });
    });
  });
});
