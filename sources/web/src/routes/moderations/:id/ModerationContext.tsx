//

import { createContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

//

export interface ModerationPageContextType {
  moderation: any; // GetModerationWithDetailsDto
  organization: any; // Organization
  user: any; // User
  organization_fiche: any; // OrganizationFiche
  query_domain_count: Promise<number>;
  query_organization_members_count: Promise<number>;
  banaticUrl: string;
}

export const ModerationContext =
  createContext<ModerationPageContextType | null>(null);

export function useModerationPageContext() {
  const context = useRequestContext().var;
  if (!context) {
    throw new Error(
      "useModerationPageContext must be used within a page context",
    );
  }
  return {
    moderation: context["moderation"],
    organization: context["moderation"]["organization"],
    user: context["moderation"]["user"],
    organization_fiche: context["organization_fiche"],
    query_domain_count: context["query_domain_count"],
    query_organization_members_count:
      context["query_organization_members_count"],
    banaticUrl: context["banaticUrl"],
  };
}
