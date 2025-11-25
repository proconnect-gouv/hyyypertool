import { HtmxEvents } from "#src/htmx";
import { button } from "#src/ui/button";
import { hx_urls } from "#src/urls";
import { AUTO_GO_BACK_EVENT } from "../AutoGoBack";
import { AddAsMemberExternal } from "./AddAsMemberExternal";
import { AddAsMemberInternal } from "./AddAsMemberInternal";
import { AddDomain } from "./AddDomain";
import { SendNotification } from "./SendNotification";
import { TagInput } from "./TagInput";
import { type Values } from "./context";

export async function AcceptModal({
  userEmail,
  moderation,
}: {
  userEmail: string;
  moderation: Values["moderation"];
}) {
  const hx_path_validate_moderation = await hx_urls.moderations[
    ":id"
  ].validate.$patch({
    param: { id: moderation.id.toString() },
  });
  return (
    <div
      class="border-(--text-action-high-blue-france) bg-(--blue-france-975-75) fixed bottom-14 right-0 z-[calc(var(--ground)_+_777)] m-2 hidden justify-self-end border-solid px-4 py-2"
      id="acceptModal"
      aria-label="la modale de validation"
    >
      <div class="mb-4 flex items-center justify-between">
        <p class="mb-0 text-lg font-bold">✅ Accepter</p>
        <button
          class="fr-btn fr-icon-subtract-line  fr-btn--tertiary-no-outline"
          _={`
              on click
                add .hidden to #acceptModal
            `}
        >
          Fermer la modale
        </button>
      </div>
      <p>
        A propos de{" "}
        <span class="text-(--text-action-high-blue-france) font-bold">
          {userEmail}{" "}
        </span>
        pour l'organisation <b>{moderation.organization.cached_libelle}</b>, je
        valide :
      </p>
      <form
        {...hx_path_validate_moderation}
        hx-swap="none"
        _={`
            on submit
              wait for ${HtmxEvents.enum.afterSettle}
              add .hidden to #acceptModal
              go to the top of body smoothly
              trigger ${AUTO_GO_BACK_EVENT}(type: 'success', message: 'Modération accepté !') on #auto_go_back
          `}
      >
        <div class="mb-5">
          <AddAsMemberInternal />
        </div>
        <div class="mb-5" id="domainInternalSection">
          <AddDomain mailType="interne" />
        </div>
        <div class="mb-5">
          <AddAsMemberExternal />
        </div>
        <div class="mb-5 hidden" id="domainExternalSection">
          <AddDomain mailType="externe" />
        </div>
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
