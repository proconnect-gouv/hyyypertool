//

import { z } from "zod";

export type Htmx_Header = {
  "HX-Refresh"?: "true" | "false";
  "HX-Location"?: string;
  "HX-Trigger"?: string;
};

// \from https://htmx.org/reference/#events
export const Htmx_Events = z.nativeEnum({
  abort: "htmx:abort", //	send this event to an element to abort a request
  afterOnLoad: "htmx:afterOnLoad", //	triggered after an AJAX request has completed processing a successful response
  afterProcessNode: "htmx:afterProcessNode", //	triggered after htmx has initialized a node
  afterRequest: "htmx:afterRequest", //	triggered after an AJAX request has completed
  afterSettle: "htmx:afterSettle", //	triggered after the DOM has settled
  afterSwap: "htmx:afterSwap", //	triggered after new content has been swapped in
  beforeCleanupElement: "htmx:beforeCleanupElement", //	triggered before htmx disables an element or removes it from the DOM
  beforeHistorySave: "htmx:beforeHistorySave", //	triggered before content is saved to the history cache
  beforeOnLoad: "htmx:beforeOnLoad", //	triggered before any response processing occurs
  beforeProcessNode: "htmx:beforeProcessNode", //	triggered before htmx initializes a node
  beforeRequest: "htmx:beforeRequest", //	triggered before an AJAX request is made
  beforeSend: "htmx:beforeSend", //	triggered just before an ajax request is sent
  beforeSwap: "htmx:beforeSwap", //	triggered before a swap is done, allows you to configure the swap
  configRequest: "htmx:configRequest", //	triggered before the request, allows you to customize parameters, headers
  confirm: "htmx:confirm", //	triggered after a trigger occurs on an element, allows you to cancel (or delay) issuing the AJAX request
  historyCacheError: "htmx:historyCacheError", //	triggered on an error during cache writing
  historyCacheMiss: "htmx:historyCacheMiss", //	triggered on a cache miss in the history subsystem
  historyCacheMissError: "htmx:historyCacheMissError", //	triggered on a unsuccessful remote retrieval
  historyCacheMissLoad: "htmx:historyCacheMissLoad", //	triggered on a successful remote retrieval
  historyRestore: "htmx:historyRestore", //	triggered when htmx handles a history restoration action
  load: "htmx:load", //	triggered when new content is added to the DOM
  noSSESourceError: "htmx:noSSESourceError", //	triggered when an element refers to a SSE event in its trigger, but no parent SSE source has been defined
  onLoadError: "htmx:onLoadError", //	triggered when an exception occurs during the onLoad handling in htmx
  oobAfterSwap: "htmx:oobAfterSwap", //	triggered after an out of band element as been swapped in
  oobBeforeSwap: "htmx:oobBeforeSwap", //	triggered before an out of band element swap is done, allows you to configure the swap
  oobErrorNoTarget: "htmx:oobErrorNoTarget", //	triggered when an out of band element does not have a matching ID in the current DOM
  prompt: "htmx:prompt", //	triggered after a prompt is shown
  pushedIntoHistory: "htmx:pushedIntoHistory", //	triggered after an url is pushed into history
  responseError: "htmx:responseError", //	triggered when an HTTP response error (non-200 or 300 response code) occurs
  sendError: "htmx:sendError", //	triggered when a network error prevents an HTTP request from happening
  sseError: "htmx:sseError", //	triggered when an error occurs with a SSE source
  sseOpen: "htmx:sseOpen", //	triggered when a SSE source is opened
  swapError: "htmx:swapError", //	triggered when an error occurs during the swap phase
  targetError: "htmx:targetError", //	triggered when an invalid target is specified
  timeout: "htmx:timeout", //	triggered when a request timeout occurs
  validation_failed: "htmx:validation:failed", //	triggered when an element fails validation
  validation_halted: "htmx:validation:halted", //	triggered when a request is halted due to validation errors
  validation_validate: "htmx:validation:validate", //	triggered before an element is validated
  xhr_abort: "htmx:xhr:abort", //	triggered when an ajax request aborts
  xhr_loadend: "htmx:xhr:loadend", //	triggered when an ajax request ends
  xhr_loadstart: "htmx:xhr:loadstart", //	triggered when an ajax request starts
  xhr_progress: "htmx:xhr:progress", //	triggered periodically during an ajax request that supports progress events
} as const);

export function hx_trigger_from_body(events: string[]) {
  return events.map((event) => `${event} from:body`);
}
export function hx_include(ids: string[]) {
  return ids.map(prefix_id).join(", ");
}
export function prefix_id(name: string) {
  return `#${name}`;
}

export function is_htmx_request(req: Request) {
  return req.headers.get("hx-request") === "true";
}

export const hx_disabled_form_elements = {
  "hx-disabled-elt": ["button", "input", "textarea"].join(", "),
};
