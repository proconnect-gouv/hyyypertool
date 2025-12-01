/**
 * Query parameter type definitions for Bun plugin
 * Enables TypeScript support for ?url, ?raw, and ?inline imports
 */

declare module "*?url" {
  const url: string;
  export default url;
}

declare module "*?raw" {
  const content: string;
  export default content;
}

declare module "*?inline" {
  const dataUri: string;
  export default dataUri;
}
