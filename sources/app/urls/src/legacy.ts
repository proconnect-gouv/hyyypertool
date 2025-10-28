//
// @deprecated This module will be removed after Phase 2.3-2.4 migrations complete.
// Use @~/web/urls instead for new code.
//

import { path, type Params } from "static-path";

//

type KnownPath = "/" | "/legacy/moderations/:id";

//

/**
 * @deprecated Use @~/web/urls api_ref instead
 */
export function api_ref<TPathname extends KnownPath>(
  pathname: TPathname,
  params: Params<TPathname>,
) {
  return path(pathname)(params);
}
