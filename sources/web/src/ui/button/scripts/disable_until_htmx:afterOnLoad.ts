//

export const disable_until_htmx_afterOnLoad = `
on click
  toggle [@disabled=true] until htmx:afterOnLoad
end
`;
