import {
  act,
  check,
  checked,
  field_value,
  focused,
  see,
  see_element,
} from "./checks";
import { install_inflight, loaded } from "./loaded";

//

const page = {
  accept_popups() {
    window.confirm = () => true;
    window.alert = () => {};
  },
  act,
  check,
  checked,
  field_value,
  focused,
  loaded,
  see,
  see_element,
  title: () => document.title,
  url: () => location.href,
};

export type Page = typeof page;

declare global {
  interface Window {
    __buncept: Page;
  }
}

install_inflight();
window.__buncept = page;
