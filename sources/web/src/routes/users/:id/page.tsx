//

import { hyper_ref } from "#src/html";
import { button } from "#src/ui/button";
import { CopyButton, GoogleSearchButton } from "#src/ui/button/components";
import { badge_description_list } from "#src/ui/list";
import { FrNumberConverter } from "#src/ui/number";
import { LocalTime } from "#src/ui/time";
import { hx_urls } from "#src/urls";
import { z_email_domain } from "@~/core/schema";
import type { get_authenticators_by_user_id } from "./get_authenticators_by_user_id.query";
import type { get_user_by_id } from "./get_user_by_id.query";

//

type User = Awaited<ReturnType<typeof get_user_by_id>>;
type Authenticators = Awaited<ReturnType<typeof get_authenticators_by_user_id>>;

export async function UserPage({
  user,
  authenticators,
}: {
  user: User;
  authenticators: Authenticators;
}) {
  const $organizations_describedby = hyper_ref("user_organizations");
  const $moderations_describedby = hyper_ref("user_moderations");

  const hx_get_user_organizations_props = hx_urls.users[
    ":id"
  ].organizations.$get({
    param: { id: user.id },
    query: { describedby: $organizations_describedby, page_ref: hyper_ref() },
  });
  const hx_get_user_moderations_props = hx_urls.users[":id"].moderations.$get({
    param: { id: user.id },
    query: { describedby: $moderations_describedby },
  });

  return (
    <main>
      <div class="bg-(--background-alt-blue-france) py-6">
        <div class="fr-container py-6!">
          <h1>👨‍💻 A propos de l'utilisateur</h1>
          <div className="grid grid-cols-2 gap-4">
            <div class="fr-card p-6!">
              <h1 class="text-(--text-action-high-blue-france)">
                « {user.given_name} {user.family_name} »
              </h1>
              <Fiche user={user} />
            </div>
            <div class="fr-card p-6!">
              <AccountInfo user={user} />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="fr-container">
        <h1 id={$organizations_describedby}>
          Liste des organisations de {user.given_name}
        </h1>
        <div class="fr-table max-w-full overflow-x-auto">
          <div
            {...hx_get_user_organizations_props}
            hx-target="this"
            hx-trigger="load"
            class="fr-table"
          ></div>
        </div>
        <hr />
        <h1 id={$moderations_describedby}>
          Liste des modérations de {user.given_name}
        </h1>

        <div class="fr-table max-w-full overflow-x-auto">
          <div
            {...hx_get_user_moderations_props}
            hx-target="this"
            hx-trigger="load"
            class="fr-table"
          ></div>
        </div>
      </div>
      <div class="bg-(--background-alt-red-marianne) py-6">
        <div class="fr-container py-6">
          <Actions user={user} />
        </div>
      </div>
      <hr />
      <div aria-describedby="mfa" class="fr-container py-6">
        <h1 id="mfa">🔓 MFA</h1>
        <MFA user={user} authenticators={authenticators} />
      </div>
    </main>
  );
}

async function MFA({
  user,
  authenticators,
}: {
  user: User;
  authenticators: Authenticators;
}) {
  const hasTOTP = user.totp_key_verified_at !== null;
  const hasPasskeys = authenticators && authenticators.length > 0;
  const hasMFA = hasTOTP || hasPasskeys;

  if (!hasMFA) {
    return <p>L'utilisateur n'a pas de MFA configurée.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div aria-describedby="totp" class="fr-card p-6!">
        <h2 class="text-(--text-action-high-blue-france)" id="totp">
          TOTP
        </h2>
        <p class="mb-1">
          <b>TOTP enrôlé le :</b> <LocalTime date={user.totp_key_verified_at} />
        </p>
        <p class="mb-1">
          <b>Force la 2FA sur tous les sites :</b>{" "}
          {user.force_2fa ? "✅" : "❌"}
        </p>
      </div>
      {authenticators.map((authenticator) => (
        <div
          aria-describedby={`passkey-${authenticator.credential_id}`}
          class="fr-card p-6!"
        >
          <h2
            class="text-(--text-action-high-blue-france)"
            id={`passkey-${authenticator.credential_id}`}
          >
            Passkey - {authenticator.display_name}
          </h2>
          <p class="mb-1">
            <b>Création :</b> <LocalTime date={authenticator.created_at} />
          </p>
          <p class="mb-1">
            <b>Dernière utilisation :</b>{" "}
            <LocalTime date={authenticator.last_used_at} />
          </p>
          <p class="mb-1">
            <b>Nombre d'utilisation :</b> {authenticator.usage_count}
          </p>
        </div>
      ))}
    </div>
  );
}

async function Actions({ user }: { user: User }) {
  const { id } = user;

  return (
    <div>
      <div class="flex justify-between gap-1">
        <button
          class={button({ intent: "danger" })}
          {...hx_urls.users[":id"].reset.email_verified.$patch({
            param: { id: id },
          })}
          hx-swap="none"
        >
          🚫 réinitialiser la vérification de l’email (bloquer)
        </button>
        <button
          class={button({ intent: "danger" })}
          hx-confirm={"Confirmez-vous la réinitialisation du mot de passe ?"}
          {...hx_urls.users[":id"].reset.password.$patch({
            param: { id: id },
          })}
          hx-swap="none"
        >
          🔐 réinitialiser le mot de passe
        </button>
        <button
          class={button({ intent: "danger" })}
          hx-confirm={"Confirmez-vous la réinitialisation du mot de passe ?"}
          {...hx_urls.users[":id"].reset.france_connect.$patch({
            param: { id: id },
          })}
          hx-swap="none"
        >
          🪪 révoquer les données FranceConnect
        </button>
        <button
          class={button({ intent: "danger" })}
          hx-confirm={"Confirmez-vous la réinitialisation de la MFA ?"}
          {...hx_urls.users[":id"].reset.mfa.$patch({
            param: { id: id },
          })}
          hx-swap="none"
        >
          📵 réinitialiser la MFA
        </button>
      </div>
      <button
        class={button({ class: "mt-5 w-full justify-center", intent: "dark" })}
        hx-confirm={"Confirmez-vous la suppression de ce compte ?"}
        hx-swap="none"
        {...hx_urls.users[":id"].$delete({
          param: { id: id },
        })}
      >
        🗑️ supprimer définitivement ce compte
      </button>
    </div>
  );
}

function Fiche({ user }: { user: User }) {
  const { base, dd, dt } = badge_description_list();

  const domain = z_email_domain.parse(user.email);

  return (
    <dl class={base({ className: "grid-cols-[100px_1fr]" })}>
      <dt class={dt()}>id</dt>
      <dd class={dd()}>
        <b>{user.id}</b>
      </dd>

      <dt class={dt()}>email</dt>
      <dd class={dd()}>
        <b> {user.email}</b>
        <CopyButton
          class="fr-p-O leading-none"
          text={user.email}
          title="Copier l'email"
          variant={{ size: "sm", type: "tertiary" }}
        />
      </dd>

      <dt class={dt()}>domain</dt>
      <dd class={dd()}>
        <b> {domain}</b>
        <CopyButton
          class="fr-p-O leading-none"
          text={domain}
          title="Copier le nom de domaine"
          variant={{ size: "sm", type: "tertiary" }}
        />

        <GoogleSearchButton
          class={button({ class: "align-bottom", size: "sm" })}
          query={domain}
        >
          Vérifier le nom de domaine
        </GoogleSearchButton>
      </dd>

      <dt class={dt()}>prénom</dt>
      <dd class={dd()}>
        <b>{user.given_name}</b>
      </dd>

      <dt class={dt()}>nom</dt>
      <dd class={dd()}>
        <b>{user.family_name}</b>
      </dd>

      <dt class={dt()}>téléphone</dt>
      <dd class={dd()}>
        <b>{user.phone_number}</b>
      </dd>

      <dt class={dt()}>fonction</dt>
      <dd class={dd()}>
        <b>{user.job}</b>
      </dd>
    </dl>
  );
}

function AccountInfo({ user }: { user: User }) {
  const { base, dd, dt } = badge_description_list();

  return (
    <dl class={base()}>
      <dt class={dt()}>Nombre de connection</dt>
      <dd class={dd()}>
        <b>{FrNumberConverter.format(user.sign_in_count)}</b>
      </dd>

      <dt class={dt()}>Création</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.created_at} />
        </b>
      </dd>

      <dt class={dt()}>Dernière connection</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.last_sign_in_at} />
        </b>
      </dd>

      <dt class={dt()}>Dernière modification</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.updated_at} />
        </b>
      </dd>

      <dt class={dt()}>Email vérifié</dt>
      <dd class={dd()}>
        <b>{user.email_verified ? "✅" : "❌"}</b>
      </dd>

      <dt class={dt()}>Email vérifié envoyé le</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.verify_email_sent_at} />
        </b>
      </dd>

      <dt class={dt()}>Demande de changement de mot de passe envoyé</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.reset_password_sent_at} />
        </b>
      </dd>
    </dl>
  );
}
