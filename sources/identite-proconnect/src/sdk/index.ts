//

import { markDomainAsVerifiedFactory } from "@proconnect-gouv/proconnect.identite/managers/organization";
import * as EmailDomainRepository from "@proconnect-gouv/proconnect.identite/repositories/email-domain";
import * as OrganizationRepository from "@proconnect-gouv/proconnect.identite/repositories/organization";
import * as UserRepository from "@proconnect-gouv/proconnect.identite/repositories/user";
import type Pg from "pg";

//
export { EmailDomainRepository, OrganizationRepository };
export function MarkDomainAsVerified(client: Pg.Pool) {
  return markDomainAsVerifiedFactory({
    addDomain: EmailDomainRepository.addDomainFactory({ pg: client }),
    deleteEmailDomainsByVerificationTypes:
      EmailDomainRepository.deleteEmailDomainsByVerificationTypesFactory({
        pg: client,
      }),
    findOrganizationById: OrganizationRepository.findByIdFactory({
      pg: client,
    }),
    getUsers: OrganizationRepository.getUsersByOrganizationFactory({
      pg: client,
    }),
    updateUserOrganizationLink:
      UserRepository.updateUserOrganizationLinkFactory({
        pg: client,
      }),
  });
}

export type MarkDomainAsVerifiedHandler = ReturnType<
  typeof MarkDomainAsVerified
>;
