//

import type { App_Context } from "#src/middleware/context";
import { NotificationIsland } from "#src/ui/notifications";
import { urls } from "#src/urls";
import { z_username } from "@~/core/schema";
import type { PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { RootLayout } from "./root";

//
export function Main_Layout({ children }: PropsWithChildren) {
  const {
    var: { userinfo, nonce },
  } = useRequestContext<App_Context>();
  const username = z_username.parse(userinfo);
  return (
    <RootLayout>
      <div class="flex min-h-full grow flex-col">
        <header role="banner" class="fr-header">
          <div class="fr-header__body">
            <div class="fr-container">
              <div class="fr-header__body-row">
                <Brand />
                <Tools username={username} />
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

function Tools({ username }: { username?: string | undefined }) {
  return (
    <div class="fr-header__tools">
      <div class="fr-header__tools-links">
        <ul class="fr-btns-group">
          <li>
            <a
              class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-fi-logout-box-r-line fr-btn--icon-left"
              href={urls.auth.logout.$url().pathname}
            >
              {username}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Nav() {
  const { req } = useRequestContext();

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
            aria-current={req.routePath.startsWith("/moderations")}
            class="fr-nav__link"
            href={urls.moderations.$url().pathname}
            target="_self"
          >
            Moderations
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            aria-current={req.routePath.startsWith("/users")}
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
              req.routePath.startsWith("/organizations") &&
              !req.routePath.startsWith("/organizations/domains")
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
            aria-current={req.routePath.startsWith("/organizations/domains")}
            class="fr-nav__link"
            href={urls.organizations.domains.$url().pathname}
            target="_self"
          >
            Domaines à vérifier
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            aria-current={req.routePath.startsWith("/domains-deliverability")}
            class="fr-nav__link"
            href={urls["domains-deliverability"].$url().pathname}
            target="_self"
          >
            Délivrabilité des domaines
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            aria-current={req.routePath.startsWith("/response-templates")}
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
