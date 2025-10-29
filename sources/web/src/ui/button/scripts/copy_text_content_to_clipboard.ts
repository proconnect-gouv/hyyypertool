//

export function copy_text_content_to_clipboard(element: `#${string}` | string) {
  return `
    on click
      set text to ${element}.textContent
      js(text)
        navigator.clipboard.writeText(text.trim())
      end
      halt
  `;
}
