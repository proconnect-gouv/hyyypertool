//

import type { HyyyperUser } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import { z_username } from "#src/schema";
import { badge } from "#src/ui/badge";
import { button } from "#src/ui/button";
import { header, MARIANNE_LOGO_URL, MOTTO_LOGO_URL, nav } from "#src/ui/header";
import { Svg } from "#src/ui/icons/components";
import { NotificationIsland } from "#src/ui/notifications";
import { urls } from "#src/urls";
import { roles } from "@~/hyyyperbase";
import type { PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { routePath } from "hono/route";
import { RootLayout } from "./root";

//
export function Main_Layout({ children }: PropsWithChildren) {
  const {
    var: { userinfo, nonce, hyyyper_user },
  } = useRequestContext<AppContext>();
  const username = z_username.parse(userinfo);
  return (
    <RootLayout>
      <Header
        username={username}
        email={userinfo?.email}
        hyyyper_user={hyyyper_user}
      />
      {children}
      <NotificationIsland nonce={nonce} />
    </RootLayout>
  );
}

//

function Header({
  username,
  email,
  hyyyper_user,
}: {
  username?: string;
  email?: string | undefined;
  hyyyper_user: HyyyperUser;
}) {
  const { base, body, body_row, container, menu } = header();
  return (
    <header role="banner" class={base()}>
      <div class={body()}>
        <div class={container()}>
          <div class={body_row()}>
            <Brand />
            <UserMenu
              username={username}
              email={email}
              hyyyper_user={hyyyper_user}
            />
          </div>
        </div>
      </div>

      <div class={menu()}>
        <div class={container()}>
          <Nav />
        </div>
      </div>
    </header>
  );
}

function Brand() {
  const { brand, brand_top, logo, service, service_tagline, service_title } =
    header();
  return (
    <div class={brand()}>
      <div class={brand_top()}>
        <div>
          <p
            class={logo()}
            style={`--logo-bg: ${MARIANNE_LOGO_URL}; --motto-bg: ${MOTTO_LOGO_URL}`}
          >
            République
            <br />
            Française
          </p>
        </div>
      </div>
      <div class={service()}>
        <a href="/" title="Accueil ">
          <p class={service_title()}>Hyyypertool</p>
        </a>
        <p class={service_tagline()}>hyyyyyyyypertool</p>
      </div>
    </div>
  );
}

function UserMenu({
  username,
  email,
  hyyyper_user,
}: {
  username?: string | undefined;
  email?: string | undefined;
  hyyyper_user: HyyyperUser;
}) {
  const is_admin = hyyyper_user.role === roles.enum.admin;
  const $menu = "account-menu";
  const { tools, tools_links } = header();

  return (
    <div class={tools()}>
      <div class={tools_links()}>
        <div class="relative inline-block">
          <button
            _={`on click toggle @hidden on #${$menu} then on click from elsewhere if #${$menu} and not @hidden add @hidden to #${$menu} end end`}
            aria-controls={$menu}
            aria-expanded="false"
            aria-haspopup="menu"
            class={button({ type: "tertiary" })}
            title="Mon espace"
            type="button"
          >
            Mon espace
          </button>
          <div
            class="absolute right-0 z-50 mt-1 min-w-48 rounded border border-gray-200 bg-white shadow-lg"
            hidden
            id={$menu}
            role="menu"
          >
            <div class="border-b border-gray-200 px-4 py-3">
              <p class="font-semibold">
                {username}{" "}
                <span class={badge({ intent: role_intent(hyyyper_user.role) })}>
                  {hyyyper_user.role}
                </span>
              </p>
              {email ? <p class="text-sm text-gray-600">{email}</p> : undefined}
            </div>
            <ul class="m-0 list-none p-0">
              {is_admin ? (
                <li>
                  <a
                    class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    href={urls.admin.team.$url().pathname}
                  >
                    Gestion de l'équipe
                  </a>
                </li>
              ) : undefined}
              <li>
                <a
                  class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                  href={urls.auth.logout.$url().pathname}
                >
                  <Svg name="logout" />
                  Se deconnecter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function role_intent(role: string) {
  return role === roles.enum.admin
    ? ("info" as const)
    : role === roles.enum.moderator
      ? ("warning" as const)
      : undefined;
}

function Nav() {
  const route_path = routePath(useRequestContext());
  const { base, list, item, link } = nav();

  return (
    <nav
      class={base()}
      id="navigation-494"
      role="navigation"
      aria-label="Menu principal"
    >
      <ul class={list()}>
        <li class={item()}>
          <a
            aria-current={route_path.startsWith("/moderations")}
            class={link()}
            href={urls.moderations.$url().pathname}
            target="_self"
          >
            Moderations
          </a>
        </li>
        <li class={item()}>
          <a
            aria-current={route_path.startsWith("/users")}
            class={link()}
            href={urls.users.$url().pathname}
            target="_self"
          >
            Utilisateurs
          </a>
        </li>
        <li class={item()}>
          <a
            aria-current={
              route_path.startsWith("/organizations") &&
              !route_path.startsWith("/organizations/domains")
            }
            class={link()}
            href={urls.organizations.$url().pathname}
            target="_self"
          >
            Organisations
          </a>
        </li>
        <li class={item()}>
          <a
            aria-current={route_path.startsWith("/organizations/domains")}
            class={link()}
            href={urls.organizations.domains.$url().pathname}
            target="_self"
          >
            Domaines à vérifier
          </a>
        </li>
        <li class={item()}>
          <a
            aria-current={route_path.startsWith("/domains-deliverability")}
            class={link()}
            href={urls["domains-deliverability"].$url().pathname}
            target="_self"
          >
            Délivrabilité des domaines
          </a>
        </li>
      </ul>
    </nav>
  );
}
