//

import type { HyyyperUser } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import { z_username } from "#src/schema";
import { button } from "#src/ui";
import { badge } from "#src/ui/badge";
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
      <div class="flex min-h-full grow flex-col">
        <header role="banner" class="fr-header">
          <div class="fr-header__body">
            <div class="fr-container">
              <div class="fr-header__body-row">
                <Brand />
                <UserMenu
                  username={username}
                  email={userinfo?.email}
                  hyyyper_user={hyyyper_user}
                />
              </div>
            </div>
          </div>

          <div class="fr-header__menu fr-modal">
            <div class="fr-container">
              <Nav />
            </div>
          </div>
        </header>
        <div class="relative flex flex-1 flex-col">{children}</div>
      </div>
      <NotificationIsland nonce={nonce} />
    </RootLayout>
  );
}

//
function Brand() {
  return (
    <div class="fr-header__brand fr-enlarge-link">
      <div class="fr-header__brand-top">
        <div class="fr-header__logo">
          <p class="fr-logo">
            République
            <br />
            Française
          </p>
        </div>
      </div>
      <div class="fr-header__service">
        <a href="/" title="Accueil ">
          <p class="fr-header__service-title">Hyyypertool</p>
        </a>
        <p class="fr-header__service-tagline">hyyyyyyyypertool</p>
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

  return (
    <div class="fr-header__tools">
      <div class="relative inline-block">
        <button
          _={`on click toggle @hidden on #${$menu} then on click from elsewhere if #${$menu} and not @hidden add @hidden to #${$menu} end end`}
          aria-controls={$menu}
          aria-expanded="false"
          aria-haspopup="menu"
          class={button({
            class: "fr-icon-account-circle-fill fr-btn--icon-left",
            type: "tertiary",
          })}
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
              <span
                class={badge({
                  intent: role_intent(hyyyper_user.role),
                  class: "fr-badge--sm",
                })}
              >
                {hyyyper_user.role}
              </span>
            </p>
            {email ? <p class="text-sm text-gray-600">{email}</p> : undefined}
          </div>
          <ul class="fr-menu__list">
            {is_admin ? (
              <li>
                <a class="fr-nav__link" href={urls.admin.team.$url().pathname}>
                  <span>
                    <span class="fr-icon-settings-5-line fr-icon--sm" />
                    Gestion de l'équipe
                  </span>
                </a>
              </li>
            ) : undefined}
            <li>
              <a class="fr-nav__link" href={urls.auth.logout.$url().pathname}>
                <span>
                  <span class="fr-icon-logout-box-r-line fr-icon--sm" />
                  Se deconnecter
                </span>
              </a>
            </li>
          </ul>
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

  return (
    <nav
      class="fr-nav"
      id="navigation-494"
      role="navigation"
      aria-label="Menu principal"
    >
      <ul class="fr-nav__list">
        <li class="fr-nav__item">
          <a
            aria-current={route_path.startsWith("/moderations")}
            class="fr-nav__link"
            href={urls.moderations.$url().pathname}
            target="_self"
          >
            Moderations
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            aria-current={route_path.startsWith("/users")}
            class="fr-nav__link"
            href={urls.users.$url().pathname}
            target="_self"
          >
            Utilisateurs
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            aria-current={
              route_path.startsWith("/organizations") &&
              !route_path.startsWith("/organizations/domains")
            }
            class="fr-nav__link"
            href={urls.organizations.$url().pathname}
            target="_self"
          >
            Organisations
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            aria-current={route_path.startsWith("/organizations/domains")}
            class="fr-nav__link"
            href={urls.organizations.domains.$url().pathname}
            target="_self"
          >
            Domaines à vérifier
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            aria-current={route_path.startsWith("/domains-deliverability")}
            class="fr-nav__link"
            href={urls["domains-deliverability"].$url().pathname}
            target="_self"
          >
            Délivrabilité des domaines
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            aria-current={route_path.startsWith("/response-templates")}
            class="fr-nav__link"
            href={urls["response-templates"].$url().pathname}
            target="_self"
          >
            Templates de réponse
          </a>
        </li>
      </ul>
    </nav>
  );
}
