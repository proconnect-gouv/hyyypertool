//

import {
  createContext,
  type Context,
} from "@proconnect-gouv/proconnect.identite/connectors";
import { markDomainAsVerifiedFactory } from "@proconnect-gouv/proconnect.identite/managers/organization";
import * as EmailDomainRepository from "@proconnect-gouv/proconnect.identite/repositories/email-domain";
import * as OrganizationRepository from "@proconnect-gouv/proconnect.identite/repositories/organization";
import type Pg from "pg";

//
export { EmailDomainRepository, OrganizationRepository };

export function createProconnectIdentiteContext(client: Pg.Pool) {
  return createContext({
    api_entreprise_client: {} as any,
    api_insee_client: {} as any,
    api_registre_national_entreprises_client: {} as any,
    pg: client,
  });
}
export function MarkDomainAsVerified(context: Context) {
  return markDomainAsVerifiedFactory(context);
}

export type MarkDomainAsVerifiedHandler = ReturnType<
  typeof MarkDomainAsVerified
>;
