//

import type { App_Context } from "#src/middleware/context";
import { button } from "#src/ui/button";
import { header, MARIANNE_LOGO_URL, MOTTO_LOGO_URL, nav } from "#src/ui/header";
import { Icon } from "#src/ui/icons/components";
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
        <Header username={username} />
        <div class="relative flex flex-1 flex-col">{children}</div>
      </div>
      <NotificationIsland nonce={nonce} />
    </RootLayout>
  );
}

//

function Header({ username }: { username?: string }) {
  const { base, body, body_row, container, menu } = header();
  return (
    <header role="banner" class={base()}>
      <div class={body()}>
        <div class={container()}>
          <div class={body_row()}>
            <Brand />
            <Tools username={username} />
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

function Tools({ username }: { username?: string | undefined }) {
  const { tools, tools_links } = header();
  return (
    <div class={tools()}>
      <div class={tools_links()}>
        <ul class="m-0 flex list-none gap-2 p-0">
          <li>
            <a
              class={button({ size: "sm", type: "tertiary-no-outline" })}
              href={urls.auth.logout.$url().pathname}
            >
              <Icon name="logout" class="inline h-4 w-4" />
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
            aria-current={req.routePath.startsWith("/moderations")}
            class={link()}
            href={urls.moderations.$url().pathname}
            target="_self"
          >
            Moderations
          </a>
        </li>
        <li class={item()}>
          <a
            aria-current={req.routePath.startsWith("/users")}
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
              req.routePath.startsWith("/organizations") &&
              !req.routePath.startsWith("/organizations/domains")
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
            aria-current={req.routePath.startsWith("/organizations/domains")}
            class={link()}
            href={urls.organizations.domains.$url().pathname}
            target="_self"
          >
            Domaines à vérifier
          </a>
        </li>
        <li class={item()}>
          <a
            aria-current={req.routePath.startsWith("/domains-deliverability")}
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
