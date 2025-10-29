//

export function hide_on_click_elsewere(element: `#${string}` | string) {
  return /* hs */ `
    on click from elsewhere
      if ${element} and not @hidden
        add @hidden to ${element}
      end
    end
  `;
}
