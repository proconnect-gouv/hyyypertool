//

import { hx_trigger_from_body } from "#src/htmx";
import { IsUserExternalMember, MODERATION_EVENTS } from "#src/lib/moderations";
import { CountUserMemberships, SuggestSameUserEmails } from "#src/lib/users";
import type { GetModerationWithDetailsDto } from "#src/queries/moderations";
import { type GetOrganizationMemberDto } from "#src/queries/organizations";
import { button } from "#src/ui/button";
import { Actions } from "#src/ui/moderations/Actions";
import { AutoGoBack } from "#src/ui/moderations/AutoGoBack";
import { DomainsByOrganization } from "#src/ui/moderations/DomainsByOrganization";
import { Header } from "#src/ui/moderations/Header";
import { OrganizationsByUser } from "#src/ui/moderations/OrganizationsByUser";
import { UsersByOrganization } from "#src/ui/moderations/UsersByOrganization";
import {
  About as About_Organization,
  Investigation as Investigation_Organization,
} from "#src/ui/organizations/info";
import { About as About_User } from "#src/ui/users/About";
import { Investigation as Investigation_User } from "#src/ui/users/Investigation";
import { hx_urls } from "#src/urls";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import { createContext, useContext } from "hono/jsx";
import { ModerationExchanges } from "./ModerationExchanges";
import { SuggestOrganizationDomains } from "./SuggestOrganizationDomains";
import type { get_organization_by_id } from "./get_organization_by_id.query";

//

type OrganizationFiche = Awaited<ReturnType<typeof get_organization_by_id>>;
type OrganizationMember = GetOrganizationMemberDto;

type PageData = {
  banaticUrl: string;
  domain: string;
  moderation: GetModerationWithDetailsDto;
  organization_fiche: OrganizationFiche;
  organization_member: OrganizationMember;
  query_domain_count: Promise<number>;
  query_organization_members_count: Promise<number>;
  identite_pg: IdentiteProconnectPgDatabase;
};

const PageContext = createContext<PageData>({} as PageData);

export default async function Moderation_Page(props: PageData) {
  return (
    <PageContext.Provider value={props}>
      <ModerationPageContent />
    </PageContext.Provider>
  );
}

async function ModerationPageContent() {
  const {
    banaticUrl,
    moderation,
    identite_pg,
    organization_fiche,
    query_domain_count,
    query_organization_members_count,
  } = useContext(PageContext)!;

  const moderation_id = `moderation-${moderation.id.toString()}`;

  return (
    <main class="fr-container my-12">
      <button
        onclick="history.back()"
        class={button({
          class: "fr-btn--icon-left fr-icon-arrow-go-back-fill",
          type: "tertiary",
          size: "sm",
        })}
      >
        retour
      </button>
      <AutoGoBack id="auto_go_back" />

      <hr class="bg-none pb-5" />
      <section
        hx-disinherit="*"
        {...await hx_urls.moderations[":id"].$get(
          {
            param: { id: moderation.id.toString() },
          },
          {},
        )}
        hx-select={`#${moderation_id}`}
        hx-trigger={hx_trigger_from_body([
          MODERATION_EVENTS.enum.MODERATION_UPDATED,
        ])}
        id={moderation_id}
      >
        <Header.Provier value={{ moderation }}>
          <Header />
        </Header.Provier>

        <hr class="bg-none pb-5" />

        <About_User user={moderation.user} organization={organization_fiche} />
        <Investigation_User
          user={moderation.user}
          organization={moderation.organization}
        />
        <About_Organization organization={organization_fiche} />
        <Investigation_Organization
          banaticUrl={banaticUrl}
          organization={moderation.organization}
        />

        <hr class="bg-none" />

        <DomainsByOrganization
          organization={moderation.organization}
          query_domain_count={query_domain_count}
        />
        <OrganizationsByUser
          user={moderation.user}
          query_organization_count={CountUserMemberships({ pg: identite_pg })}
        />

        <UsersByOrganization
          organization={moderation.organization}
          query_members_count={query_organization_members_count}
        />

        <hr class="bg-none" />

        <Actions
          value={{
            moderation,
            query_suggest_same_user_emails: SuggestSameUserEmails({
              pg: identite_pg,
            }),
            query_is_user_external_member: IsUserExternalMember({
              pg: identite_pg,
            }),
            query_suggest_organization_domains: SuggestOrganizationDomains({
              pg: identite_pg,
            }),
          }}
        />

        <hr class="bg-none" />

        <hr />

        <hr class="bg-none" />

        <ModerationExchanges moderation={moderation} />
      </section>
    </main>
  );
}
