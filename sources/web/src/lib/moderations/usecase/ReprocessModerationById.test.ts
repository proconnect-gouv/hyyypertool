//

import { beforeAll, expect, mock, setSystemTime, test } from "bun:test";
import { ReprocessModerationById } from "./ReprocessModerationById";

//

const userinfo = { email: "foo@bar.com" };

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

test("reprocess a moderation", async () => {
  const get_moderation_by_id = mock().mockResolvedValueOnce({
    comment: "",
    organization_id: 1,
    user_id: 1,
  });
  const update_moderation_by_id = mock();
  const remove_user_from_organization = mock();

  const reprocess_moderation_by_id = ReprocessModerationById({
    get_moderation_by_id,
    update_moderation_by_id,
    remove_user_from_organization,
    userinfo,
  });
  await reprocess_moderation_by_id(1);

  expect(get_moderation_by_id).toHaveBeenLastCalledWith(1, {
    columns: {
      comment: true,
      organization_id: true,
      user_id: true,
    },
  });
  expect(update_moderation_by_id).toHaveBeenLastCalledWith(1, {
    comment: "7952342400000 foo@bar.com | Réouverte par foo@bar.com",
    moderated_by: null,
    moderated_at: null,
  });
  expect(remove_user_from_organization).toHaveBeenLastCalledWith({
    organization_id: 1,
    user_id: 1,
  });
});
