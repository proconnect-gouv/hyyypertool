//

import { type CrispApi } from "#src/lib/crisp";
import { schema } from "@~/identite-proconnect/database";
import {
  create_pink_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";
import { beforeAll, beforeEach, expect, mock, test } from "bun:test";
import { eq } from "drizzle-orm";
import { RemoveMemberFromOrganization } from "./RemoveMemberFromOrganization";

//

beforeAll(migrate);
beforeEach(empty_database);

const crisp: CrispApi = {
  create_conversation: mock().mockResolvedValue({
    session_id: "🗨️",
  }),
  get_user: mock().mockResolvedValue({
    nickname: "👩‍🚀",
  }),
  mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
  send_message: mock().mockResolvedValue(undefined),
};

const remove_member_from_organization = RemoveMemberFromOrganization({
  crisp,
  pg,
  resolve_delay: 0,
});

const anais_tailhade = { email: "anais.tailhade@omage.gouv.fr" };

//

test("remove user from organization", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  const unicorn_organization_id = await create_unicorn_organization(pg);
  await pg.insert(schema.users_organizations).values({
    organization_id: unicorn_organization_id,
    user_id: pink_diamond_user_id,
    is_external: false,
    verification_type: VerificationTypeSchema.enum.domain,
  });

  await remove_member_from_organization({
    moderator: anais_tailhade,
    organization_id: unicorn_organization_id,
    user_id: pink_diamond_user_id,
  });

  const memberships = await pg.query.users_organizations.findMany({
    where: eq(schema.users_organizations.user_id, pink_diamond_user_id),
  });
  expect(memberships).toHaveLength(0);

  const organization = await pg.query.organizations.findFirst({
    columns: { cached_libelle: true, siret: true },
    where: eq(schema.organizations.id, unicorn_organization_id),
  });
  const organization_name = organization?.cached_libelle ?? organization?.siret;

  expect(crisp.create_conversation).toHaveBeenCalledWith({
    email: "pink.diamond@unicorn.xyz",
    subject: "[ProConnect] - Retrait d'une organisation",
    nickname: "Pink Diamond",
  });
  expect(crisp.get_user).toHaveBeenCalledWith({
    email: "anais.tailhade@omage.gouv.fr",
  });
  expect(crisp.send_message).toHaveBeenCalledWith({
    content: expect.stringContaining(`${organization_name}`),
    session_id: "🗨️",
    user: {
      nickname: "👩‍🚀",
    },
  });
  expect(crisp.mark_conversation_as_resolved).toHaveBeenCalledWith({
    session_id: "🗨️",
  });
});
