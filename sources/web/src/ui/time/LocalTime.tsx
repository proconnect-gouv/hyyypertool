//

import type { PropsWithChildren } from "hono/jsx";

//

/**
 * @deprecated use @~/web/time after app.ui migration
 */
function date_to_string(date: Date | undefined | null) {
  return date
    ? `${date.toLocaleDateString("fr-FR")} ${date.toLocaleTimeString("fr-FR")} `
    : "";
}

//

interface Time_Props {
  date: Date | string | null | undefined;
}

//

export function Time({
  children,
  date: date_like,
}: PropsWithChildren<Time_Props>) {
  if (!date_like) return <></>;

  const date = new Date(date_like);

  return (
    <time datetime={date.toISOString()} title={date.toString()}>
      {children}
    </time>
  );
}

export function LocalTime({ date: date_like }: Time_Props) {
  if (!date_like) return <></>;

  const date = new Date(date_like);

  return <Time date={date}>{date_to_string(date)}</Time>;
}
