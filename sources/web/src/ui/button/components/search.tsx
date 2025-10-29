//

import type { JSX, PropsWithChildren } from "hono/jsx";

//

export function GoogleSearchButton(
  props: JSX.IntrinsicElements["a"] &
    PropsWithChildren<{
      query: string;
    }>,
) {
  const { children, query, ...other_props } = props;
  return (
    <a
      href={google_search(query)}
      rel="noopener noreferrer"
      target="_blank"
      {...other_props}
    >
      {children}
    </a>
  );
}

//

function google_search(q: string) {
  const query = new URLSearchParams({ q });
  return `https://www.google.com/search?${query}`;
}
