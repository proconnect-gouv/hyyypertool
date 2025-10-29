//

import NProgress from "nprogress";

//

declare global {
  interface Window {
    NProgress: typeof NProgress;
  }
}

//

window.NProgress = NProgress;
