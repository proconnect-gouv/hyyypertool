//

export function copy_value_to_clipboard(element: `#${string}` | string) {
  return `
    on click
      set text to ${element}.value
      js(me, text)
        navigator.clipboard.writeText(text)
      end
      halt
  `;
}
