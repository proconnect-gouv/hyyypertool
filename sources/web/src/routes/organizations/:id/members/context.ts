//

import { createContext } from "hono/jsx";
import type { get_users_by_organization } from "./get_users_by_organization.query";

//

type User = Awaited<
  ReturnType<typeof get_users_by_organization>
>["users"][number];

export const MemberContext = createContext({
  user: {} as User,
  organization_id: 0,
});
