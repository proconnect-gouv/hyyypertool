/**
 * SearchEmail Island Component (Server-side)
 *
 * Renders an email search input that auto-enables processed requests when typing
 */

import config from "#src/config";
import { createIsland } from "../../lib/create-island";
import { SearchEmail, type SearchEmailProps } from "./search-email.client";

//

export const SearchEmailIsland = createIsland<SearchEmailProps>({
  component: SearchEmail,
  clientPath: `${config.PUBLIC_ASSETS_PATH}/routes/moderations/search-email.client.js`,
  mode: "hydrate", // SSR required for HTMX to find the input on page load
  exportName: "SearchEmail",
  tagName: "x-search-email-island",
  rootTagName: "x-search-email-root",
});
