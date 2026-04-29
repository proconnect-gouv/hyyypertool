import { HtmxEvents, hx_disabled_form_elements } from "#src/htmx";
import { button } from "#src/ui/button";
import { Svg } from "#src/ui/icons/components";
import { urls } from "#src/urls";
import { AUTO_GO_BACK_EVENT } from "../AutoGoBack";
import { MemberAndDomainPickerIsland } from "./MemberAndDomainPickerIsland";
import { SendNotification } from "./SendNotification";
import { TagInput } from "./TagInput";
import { type Values } from "./context";

export async function AcceptModal({
  userEmail,
  moderation,
  domain,
}: {
  userEmail: string;
  moderation: Values["moderation"];
  domain: string;
}) {
  const hx_path_validate_moderation = urls.moderations[
    ":id"
  ].validate.$hx_patch({
    param: { id: moderation.id },
  });
  return (
    <div
      class="border-blue-france bg-surface fixed right-0 bottom-14 z-[calc(var(--ground)+777)] m-2 hidden justify-self-end border-solid px-8 py-4 shadow-lg"
      id="acceptModal"
      aria-label="la modale de validation"
    >
      <div class="mb-4 flex items-center justify-between">
        <p class="mb-0 text-lg font-bold">✅ Accepter</p>
        <button
          class={button({ icon: "only", intent: "ghost" })}
          _={`
              on click
                add .hidden to #acceptModal
            `}
        >
          <Svg name="subtract" />
          <span class="sr-only">Fermer la modale</span>
        </button>
      </div>
      <p>
        A propos de{" "}
        <span class="text-blue-france dark:text-blue-france-925 font-bold">
          {userEmail}{" "}
        </span>
        pour l'organisation <b>{moderation.organization.cached_libelle}</b>, je
        valide :
      </p>
      <form
        {...hx_path_validate_moderation}
        {...hx_disabled_form_elements}
        hx-swap="none"
        _={`
            on submit
              wait for ${HtmxEvents.enum.afterSettle}
              add .hidden to #acceptModal
              go to the top of body smoothly
              trigger ${AUTO_GO_BACK_EVENT}(type: 'success', message: 'Modération accepté !') on #auto_go_back
          `}
      >
        <MemberAndDomainPickerIsland
          domain={domain}
          given_name={moderation.user.given_name ?? ""}
        />
        <div class="mb-5">
          <TagInput />
        </div>
        <div class="mb-5">
          <SendNotification />
        </div>
        <div>
          <button class={button()} type="submit">
            Terminer
          </button>
        </div>
      </form>
    </div>
  );
}
