import { GetUserById } from "#src/queries/users";

export const get_user_by_id = GetUserById({
  columns: {
    id: true,
    email: true,
    given_name: true,
    family_name: true,
  },
});
