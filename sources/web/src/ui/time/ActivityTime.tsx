//

import { Time } from "./LocalTime";

//

interface ActivityTime_Props {
  date: Date | string | null | undefined;
}

export function ActivityTime({ date: date_like }: ActivityTime_Props) {
  if (!date_like) return <></>;

  const date = new Date(date_like);
  const day = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const time = date
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h");

  return (
    <Time date={date}>
      {day} à {time}
    </Time>
  );
}
