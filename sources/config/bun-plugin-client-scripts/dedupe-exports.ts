//

import { basename } from "node:path";
import { parse } from "oxc-parser";

//

type ImportFixMap = Map<string, Map<string, string>>; // filename -> (buggyName -> correctName)

/**
 * WORKAROUND: Bun generates duplicate exports with DIFFERENT names for the same variable.
 * Example:
 *   export{gX as searchSiret, _X as searchEmail};  // First (correct, public API)
 *   export{D as a, gX as b};                       // Second (buggy, internal chunk)
 *
 * Consumer files import using the BUGGY names (a, b) instead of correct ones (searchEmail, searchSiret).
 *
 * This function builds a mapping: buggyExportName -> correctExportName
 * by finding variables that appear in multiple exports.
 *
 * Returns: Map<filename, Map<buggyName, correctName>>
 */
export async function buildImportFixMap(
  files: Array<{ path: string; content: string }>,
): Promise<ImportFixMap> {
  const fixMap: ImportFixMap = new Map();

  for (const file of files) {
    const filename = basename(file.path);
    const { program: ast } = await parse(file.path, file.content);

    // Collect all exports grouped by statement order
    const exportStatements: Array<Map<string, string>> = []; // localVar -> exportedName

    function traverse(node: any) {
      if (!node || typeof node !== "object") return;

      if (
        node.type === "ExportNamedDeclaration" &&
        node.specifiers?.length > 0 &&
        !node.source
      ) {
        const stmtExports = new Map<string, string>();
        for (const spec of node.specifiers) {
          if (spec.type === "ExportSpecifier") {
            const localName = spec.local?.name;
            const exportedName = spec.exported?.name;
            if (localName && exportedName) {
              stmtExports.set(localName, exportedName);
            }
          }
        }
        if (stmtExports.size > 0) {
          exportStatements.push(stmtExports);
        }
      }

      for (const key in node) {
        const child = node[key];
        if (Array.isArray(child)) {
          child.forEach((c) => traverse(c));
        } else if (child && typeof child === "object") {
          traverse(child);
        }
      }
    }

    traverse(ast);

    // If only 0-1 export statements, no fix needed
    if (exportStatements.length <= 1) {
      continue;
    }

    // First export is the correct one (public API)
    // Subsequent exports are buggy (internal chunk re-exports)
    const correctExports = exportStatements[0]; // localVar -> correctExportName
    const fileFixes = new Map<string, string>(); // buggyName -> correctName

    // For each subsequent (buggy) export statement
    for (let i = 1; i < exportStatements.length; i++) {
      const buggyExports = exportStatements[i]; // localVar -> buggyExportName

      // Find variables exported in both - map buggy name to correct name
      for (const [localVar, buggyName] of buggyExports) {
        const correctName = correctExports.get(localVar);
        if (correctName && correctName !== buggyName) {
          fileFixes.set(buggyName, correctName);
        }
      }
    }

    if (fileFixes.size > 0) {
      fixMap.set(filename, fileFixes);
    }
  }

  return fixMap;
}

/**
 * WORKAROUND: Bun code splitting + minification uses buggy export names
 * in cross-chunk imports instead of correct public API names.
 *
 * Fixes: import{b}from"./file.js" -> import{searchSiret}from"./file.js"
 * when file.js has buggy export{gX as b} but correct export{gX as searchSiret}
 *
 * @param content - File content to fix
 * @param importFixMap - Map from buildImportFixMap: buggyName -> correctName
 */
export function fixChunkImports(
  content: string,
  importFixMap: ImportFixMap,
): string {
  // Match: import{...}from"./something.client.js"
  const importRegex =
    /import\s*\{([^}]+)\}\s*from\s*"(\.\/[^"]+\.client\.js)"/g;

  return content.replace(importRegex, (match, imports, source) => {
    const filename = basename(source);
    const fileFixes = importFixMap.get(filename);

    if (!fileFixes) return match;

    // Fix each import specifier
    const fixedImports = imports
      .split(",")
      .map((spec: string) => {
        spec = spec.trim();
        // Handle "a as b" or just "a"
        const asMatch = spec.match(/^(\w+)\s+as\s+(\w+)$/);
        if (asMatch) {
          const [, importedName, localAlias] = asMatch;
          const correctName = fileFixes.get(importedName);
          if (correctName) {
            return `${correctName} as ${localAlias}`;
          }
        } else {
          const correctName = fileFixes.get(spec);
          if (correctName) {
            return correctName;
          }
        }
        return spec;
      })
      .join(",");

    return `import{${fixedImports}}from"${source}"`;
  });
}

/**
 * WORKAROUND: Bun code splitting generates duplicate export statements
 * See: https://github.com/oven-sh/bun/issues/5344
 *
 * Uses AST-based approach to remove redundant internal chunk exports.
 * Bun generates: 1st = public API, 2nd+ = internal chunks
 */
export async function dedupeExports(
  content: string,
  filename: string,
): Promise<string> {
  const { program: ast } = await parse(filename, content);

  // Find all ExportNamedDeclaration nodes (export { ... })
  const exportStatements: Array<{ start: number; end: number }> = [];

  function traverse(node: any) {
    if (!node || typeof node !== "object") return;

    if (node.type === "ExportNamedDeclaration" && node.specifiers) {
      // Only track exports with specifiers: export { a, b }
      // Ignore: export const x, export function foo, etc.
      if (node.specifiers.length > 0 && !node.source) {
        exportStatements.push({
          end: node.end,
          start: node.start,
        });
      }
    }

    // Traverse children
    for (const key in node) {
      const child = node[key];
      if (Array.isArray(child)) {
        child.forEach((c) => traverse(c));
      } else if (child && typeof child === "object") {
        traverse(child);
      }
    }
  }

  traverse(ast);

  // If we found 2+ export statements, remove all but the first
  if (exportStatements.length <= 1) {
    return content;
  }

  // Sort by position (descending) to remove from end to start
  exportStatements.sort((a, b) => b.start - a.start);

  // Remove all exports except the first (keep index 0, remove rest)
  const toRemove = exportStatements.slice(0, -1);

  let dedupedContent = content;
  for (const stmt of toRemove) {
    // Remove the export statement and any trailing newlines
    const before = dedupedContent.slice(0, stmt.start);
    const after = dedupedContent.slice(stmt.end);

    // Clean up extra newlines that would be left behind
    const cleanAfter = after.replace(/^\n+/, "\n");

    dedupedContent = before + cleanAfter;
  }

  return dedupedContent;
}
