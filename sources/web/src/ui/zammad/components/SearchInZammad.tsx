import config from "@~/app.core/config";
import type { Child } from "hono/jsx";

export function SearchInZammad({
  children,
  search,
}: {
  children: Child;
  search: string;
}) {
  return (
    <a
      href={`${config.ZAMMAD_URL}/#search/${search}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
