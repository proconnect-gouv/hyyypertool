// @testing-library/cypress has no `exports` subpath mapping for `/add-commands`,
// so TypeScript 6 (TS2882) cannot resolve the side-effect import automatically.
// The type augmentation is already loaded via `types: ["@testing-library/cypress"]`
// in tsconfig.json — this declaration silences the import error.
declare module "@testing-library/cypress/add-commands" {}
