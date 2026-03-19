//
// Tailwind theme panel — uses actual ui/ component functions
//

import { badge } from "#src/ui/badge";
import { button } from "#src/ui/button";
import { callout } from "#src/ui/callout";
import {
  checkbox_group,
  fieldset,
  input,
  input_group,
  label,
  radio_group,
  select,
} from "#src/ui/form";
import { Svg } from "#src/ui/icons/components";
import { alert, notice } from "#src/ui/notice";
import { table } from "#src/ui/table";
import { tag } from "#src/ui/tag";

//

export function componentsTailwind() {
  return (
    <>
      {/* Buttons */}
      <section>
        <h2>Buttons</h2>
        <div class="row">
          <button class={button()}>Primary</button>
          <button class={button({ type: "secondary" })}>Secondary</button>
          <button class={button({ type: "tertiary" })}>Tertiary</button>
        </div>
        <div class="row">
          <button class={button({ size: "sm" })}>Small</button>
          <button class={button()}>Default</button>
          <button class={button({ size: "lg" })}>Large</button>
        </div>
        <div class="row">
          <button class={button({ intent: "danger" })}>Danger</button>
          <button class={button({ intent: "success" })}>Success</button>
          <button class={button({ intent: "warning" })}>Warning</button>
          <button class={button({ intent: "dark" })}>Dark</button>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2>Badges</h2>
        <div class="row">
          <p class={badge({ icon: "left", intent: "info" })}>
            <Svg name="info" /> Info
          </p>
          <p class={badge({ icon: "left", intent: "success" })}>
            <Svg name="check" /> Success
          </p>
          <p class={badge({ icon: "left", intent: "error" })}>
            <Svg name="error" /> Error
          </p>
          <p class={badge({ icon: "left", intent: "warning" })}>
            <Svg name="warning" /> Warning
          </p>
          <p class={badge({ icon: "left", intent: "new" })}>
            <Svg name="new" />
            New
          </p>
        </div>
      </section>

      {/* Notice */}
      <section>
        <h2>Notice</h2>
        <div class={notice({ type: "info" }).base()}>
          <div class={notice().container()}>
            <div class={notice().body()}>
              <p class="flex items-baseline gap-1">
                <Svg name="info" />
                <span class={notice().title()}>Info notice title</span>
                <span>This is an informational message.</span>
              </p>
            </div>
          </div>
        </div>
        <div class={notice({ type: "alert" }).base()}>
          <div class={notice().container()}>
            <div class={notice().body()}>
              <p class="flex items-baseline gap-1">
                <Svg name="error" />
                <span class={notice().title()}>Alert notice</span>
                <span>Something went wrong.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Callout */}
      <section>
        <h2>Callout</h2>
        <div class={callout({ intent: "success" }).base()}>
          <h3 class={callout({ intent: "success" }).title()}>
            Success callout
          </h3>
          <p class={callout({ intent: "success" }).text()}>
            This callout uses the green emeraude accent.
          </p>
        </div>
        <div class={callout({ intent: "warning" }).base()}>
          <h3 class={callout({ intent: "warning" }).title()}>
            Warning callout
          </h3>
          <p class={callout({ intent: "warning" }).text()}>
            This callout uses the brown caramel accent.
          </p>
        </div>
      </section>

      {/* Fieldset */}
      <section>
        <h2>Fieldset</h2>
        <fieldset class={fieldset().base()}>
          <legend class={fieldset().legend()}>Choose an option:</legend>
          <div class={fieldset().element()}>
            <label>
              <input type="radio" name="tw-opt" /> Option A
            </label>
          </div>
          <div class={fieldset().element()}>
            <label>
              <input type="radio" name="tw-opt" /> Option B
            </label>
          </div>
        </fieldset>
        <fieldset class={fieldset().base()} style="margin-top: 1rem">
          <legend class={fieldset().legend()}>Inline variant:</legend>
          <div class={fieldset({ inline: true }).element()}>
            <label>
              <input type="radio" name="tw-inline" /> Yes
            </label>
          </div>
          <div class={fieldset({ inline: true }).element()}>
            <label>
              <input type="radio" name="tw-inline" /> No
            </label>
          </div>
        </fieldset>
      </section>

      {/* Table */}
      <section>
        <h2>Table</h2>
        <div>
          <table class={table()}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alice</td>
                <td>Admin</td>
                <td>
                  <p class={badge({ icon: "left", intent: "success" })}>
                    <Svg name="check" /> Active
                  </p>
                </td>
              </tr>
              <tr>
                <td>Bob</td>
                <td>User</td>
                <td>
                  <p class={badge({ icon: "left", intent: "warning" })}>
                    <Svg name="warning" /> Pending
                  </p>
                </td>
              </tr>
              <tr>
                <td>Charlie</td>
                <td>Moderator</td>
                <td>
                  <p class={badge({ icon: "left", intent: "error" })}>
                    <Svg name="error" /> Suspended
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Header (mini) */}
      <section>
        <h2>Header</h2>
        <header class="bg-white drop-shadow-[0_1px_3px_rgba(0,0,18,0.16)]">
          <div class="mx-auto max-w-7xl px-4">
            <div class="flex items-center justify-between py-6">
              <div class="flex items-center gap-4">
                <div class="border-grey-200 border-l pl-4">
                  <p class="m-0 text-[1.25rem] leading-7 font-bold">
                    Hyyypertool
                  </p>
                  <p class="text-grey-850 m-0 text-sm leading-6">
                    Design system preview
                  </p>
                </div>
              </div>
            </div>
          </div>
          <nav
            class="shadow-[inset_0_1px_0_0_var(--color-grey-200)]"
            aria-label="Menu principal"
          >
            <div class="mx-auto max-w-7xl px-4">
              <ul class="m-0 flex list-none gap-0 p-0">
                <li>
                  <a
                    class="text-blue-france inline-flex items-center px-4 py-3 text-sm shadow-[inset_0_-2px_0_0_var(--color-blue-france)]"
                    href="#"
                  >
                    Moderations
                  </a>
                </li>
                <li>
                  <a
                    class="text-grey-850 hover:bg-grey-50 inline-flex items-center px-4 py-3 text-sm"
                    href="#"
                  >
                    Utilisateurs
                  </a>
                </li>
                <li>
                  <a
                    class="text-grey-850 hover:bg-grey-50 inline-flex items-center px-4 py-3 text-sm"
                    href="#"
                  >
                    Organisations
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </header>
      </section>

      {/* Typography */}
      <section>
        <h2>Typography</h2>
        <h1 class="mb-2 text-4xl font-bold">Heading 1</h1>
        <p class="mb-1 text-xl">Extra large text</p>
        <p class="mb-1 text-lg">Lead text</p>
        <p class="text-sm">Small text</p>
      </section>

      {/* Cards */}
      <section>
        <h2>Cards</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
          <div class="border-grey-200 border bg-white p-6">
            <h3 class="text-blue-france mb-2 font-bold">Card Title</h3>
            <p class="text-grey-850 text-sm">
              Card description text goes here.
            </p>
          </div>
          <div class="border-grey-200 border bg-white p-6">
            <h3 class="text-blue-france mb-2 font-bold">Another Card</h3>
            <p class="text-grey-850 text-sm">More card description text.</p>
          </div>
        </div>
      </section>

      {/* Alert */}
      <section>
        <h2>Alert</h2>
        <div
          class={alert({ intent: "warning" }).base()}
          style="margin-bottom: 0.5rem"
        >
          <h3 class={alert({ intent: "warning" }).title()}>Warning alert</h3>
          <p>Something requires your attention.</p>
        </div>
      </section>

      {/* Radio & Checkbox */}
      <section>
        <h2>Radio &amp; Checkbox</h2>
        <fieldset
          class={fieldset().base()}
          id="tw-radio-form"
          aria-labelledby="tw-radio-form-legend tw-radio-form-messages"
        >
          <legend class={fieldset({ regular: true }).legend()} id="tw-radio-form-legend">
            Légende pour l'ensemble des éléments
          </legend>
          <div class={fieldset().element()}>
            <div class={radio_group().base()}>
              <input class={input()} type="radio" id="tw-radio-1" name="tw-radios" />
              <label class={radio_group().label()} for="tw-radio-1">Radio 1</label>
            </div>
          </div>
          <div class={fieldset().element()}>
            <div class={radio_group().base()}>
              <input class={input()} type="radio" id="tw-radio-2" name="tw-radios" />
              <label class={radio_group().label()} for="tw-radio-2">Radio 2</label>
            </div>
          </div>
          <div class={fieldset().element()}>
            <div class={radio_group().base()}>
              <input class={input()} type="radio" id="tw-radio-3" name="tw-radios" />
              <label class={radio_group().label()} for="tw-radio-3">Radio 3</label>
            </div>
          </div>
          <div id="tw-radio-form-messages" aria-live="polite" />
        </fieldset>
        <fieldset
          class={fieldset().base()}
          id="tw-checkbox-form"
          aria-labelledby="tw-checkbox-form-legend tw-checkbox-form-messages"
          style="margin-top: 1rem"
        >
          <legend class={fieldset({ regular: true }).legend()} id="tw-checkbox-form-legend">
            Légende pour l'ensemble des éléments
          </legend>
          <div class={fieldset().element()}>
            <div class={checkbox_group().base()}>
              <input class={input()} name="checkbox1" id="tw-checkbox-1" type="checkbox" aria-describedby="tw-checkbox-1-messages" />
              <label class={checkbox_group().label()} for="tw-checkbox-1">Checkbox 1</label>
              <div id="tw-checkbox-1-messages" aria-live="polite" />
            </div>
          </div>
          <div class={fieldset().element()}>
            <div class={checkbox_group().base()}>
              <input class={input()} name="checkbox2" id="tw-checkbox-2" type="checkbox" aria-describedby="tw-checkbox-2-messages" />
              <label class={checkbox_group().label()} for="tw-checkbox-2">Checkbox 2</label>
              <div id="tw-checkbox-2-messages" aria-live="polite" />
            </div>
          </div>
          <div class={fieldset().element()}>
            <div class={checkbox_group().base()}>
              <input class={input()} name="checkbox3" id="tw-checkbox-3" type="checkbox" aria-describedby="tw-checkbox-3-messages" />
              <label class={checkbox_group().label()} for="tw-checkbox-3">Checkbox 3</label>
              <div id="tw-checkbox-3-messages" aria-live="polite" />
            </div>
          </div>
          <div id="tw-checkbox-form-messages" aria-live="polite" />
        </fieldset>
      </section>

      {/* Form inputs */}
      <section>
        <h2>Form Inputs</h2>
        <div class={input_group()}>
          <label class={label()} for="tw-email">
            Email address
          </label>
          <input
            class={input()}
            id="tw-email"
            type="email"
            placeholder="name@example.com"
          />
        </div>
        <div class={input_group()}>
          <label class={label()} for="tw-date">
            Date
          </label>
          <input class={input()} id="tw-date" type="date" />
        </div>
        <div class={input_group()}>
          <label class={label()} for="tw-select">
            Role
          </label>
          <select class={select()} id="tw-select">
            <option value="">Choisir un rôle</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        </div>
        <div class={input_group({ intent: "error" })}>
          <label class={label({ intent: "error" })} for="tw-error">
            Champ en erreur
          </label>
          <input
            class={input({ intent: "error" })}
            id="tw-error"
            type="text"
            placeholder="Invalide"
          />
          <p class="text-label-error mt-1 flex items-center gap-1 text-sm">
            <Svg name="error" /> Ce champ est requis.
          </p>
        </div>
        <div class={input_group({ intent: "valid" })}>
          <label class={label({ intent: "valid" })} for="tw-valid">
            Champ valide
          </label>
          <input
            class={input({ intent: "valid" })}
            id="tw-valid"
            type="text"
            value="Alice"
          />
          <p class="text-label-success mt-1 flex items-center gap-1 text-sm">
            <Svg name="check" /> Valeur correcte.
          </p>
        </div>
      </section>

      {/* Tags */}
      <section>
        <h2>Tags</h2>
        <div class="row">
          <label class={tag()}>
            <input type="checkbox" class="sr-only" name="tw-tag" />
            Tag one
          </label>
          <label class={tag()}>
            <input type="checkbox" class="sr-only" name="tw-tag" />
            Tag two
          </label>
          <label class={tag()}>
            <input type="checkbox" class="sr-only" name="tw-tag" checked />
            Active tag
          </label>
        </div>
      </section>

      {/* Colors */}
      <section>
        <h2>Color Palette</h2>
        <div class="row">
          <div
            class="bg-blue-france h-[60px] w-[60px] rounded"
            title="#000091 blue-france"
          />
          <div
            class="bg-error h-[60px] w-[60px] rounded"
            title="#c9191e error"
          />
          <div
            class="bg-green-bourgeon h-[60px] w-[60px] rounded"
            title="#68a532 green-bourgeon"
          />
          <div
            class="bg-warning h-[60px] w-[60px] rounded"
            title="#d64d00 warning"
          />
          <div
            class="bg-red-marianne h-[60px] w-[60px] rounded"
            title="#e1000f red-marianne"
          />
          <div
            class="bg-green-emeraude h-[60px] w-[60px] rounded"
            title="#00a95f green-emeraude"
          />
          <div
            class="bg-brown-caramel h-[60px] w-[60px] rounded"
            title="#c08c65 brown-caramel"
          />
        </div>
        <div class="row" style="margin-top: 0.5rem">
          <div
            class="bg-grey-1000 h-[60px] w-[60px] rounded"
            title="#000 grey-1000"
          />
          <div
            class="bg-grey-850 h-[60px] w-[60px] rounded"
            title="#3a3a3a grey-850"
          />
          <div
            class="bg-grey-200 h-[60px] w-[60px] rounded border border-[#ccc]"
            title="#e5e5e5 grey-200"
          />
          <div
            class="bg-grey-50 h-[60px] w-[60px] rounded border border-[#ccc]"
            title="#f6f6f6 grey-50"
          />
          <div
            class="bg-grey-contrast h-[60px] w-[60px] rounded border border-[#ccc]"
            title="#eee grey-contrast"
          />
        </div>
      </section>
    </>
  );
}
