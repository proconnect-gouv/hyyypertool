// Parts of this package (actionability check, click dispatched in-page, fill by
// focus + select + type-over, retry on "navigated or closed") are adapted
// from bunwright 0.3.2 and the local patch this repo carried on it (removed):
//
//   Bunwright: The lightweight browser automation library for Bun
//   Copyright (C) Jonas Perusquia Morales
//   Licensed under the GNU Lesser General Public License v2.1
//   https://github.com/jonaspm/bunwright
//
// Modified for hyyypertool: rewritten as a CodeceptJS-style `I` actor over
// Bun.WebView, relicensed under the GPL-3.0 as LGPL-2.1 §3 allows.

export { create_browser } from "./browser";
export { config } from "./config";
export type { Locator } from "./protocol";
export { Scenario, type Actor } from "./scenario";
