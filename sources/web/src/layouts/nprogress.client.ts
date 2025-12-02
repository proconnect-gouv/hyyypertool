//

import nProgress from "nprogress";

//

document.addEventListener("htmx:beforeSend", () => {
  nProgress.start();
});

document.addEventListener("htmx:afterOnLoad", () => {
  nProgress.done();
});

document.addEventListener("htmx:afterSettle", () => {
  nProgress.done();
});
