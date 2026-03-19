//
// DSFR reference panel — raw fr-* classes via CDN
//

import { html } from "hono/html";

export function componentsDsfr() {
  return html`
    <!-- Buttons -->
    <section>
      <h2>Buttons</h2>
      <div class="row">
        <button class="fr-btn">Primary</button>
        <button class="fr-btn fr-btn--secondary">Secondary</button>
        <button class="fr-btn fr-btn--tertiary">Tertiary</button>
      </div>
      <div class="row">
        <button class="fr-btn fr-btn--sm">Small</button>
        <button class="fr-btn">Default</button>
        <button class="fr-btn fr-btn--lg">Large</button>
      </div>
      <div class="row">
        <button
          class="fr-btn"
          style="background-color: var(--error-425-625); --hover: var(--error-425-625-hover)"
        >
          Danger
        </button>
        <button
          class="fr-btn"
          style="background-color: var(--background-action-high-green-bourgeon); --hover: var(--background-action-high-green-bourgeon-hover)"
        >
          Success
        </button>
        <button
          class="fr-btn"
          style="background-color: var(--background-action-high-warning); --hover: var(--background-action-high-warning-hover)"
        >
          Warning
        </button>
        <button
          class="fr-btn"
          style="background-color: var(--grey-0-1000); color: white"
        >
          Dark
        </button>
      </div>
    </section>

    <!-- Badges -->
    <section>
      <h2>Badges</h2>
      <div class="row">
        <p class="fr-badge fr-badge--info">Info</p>
        <p class="fr-badge fr-badge--success">Success</p>
        <p class="fr-badge fr-badge--error">Error</p>
        <p class="fr-badge fr-badge--warning">Warning</p>
        <p class="fr-badge fr-badge--new">New</p>
      </div>
    </section>

    <!-- Notice -->
    <section>
      <h2>Notice</h2>
      <div class="fr-notice fr-notice--info" style="margin-bottom: 0.5rem">
        <div class="fr-container">
          <div class="fr-notice__body">
            <p>
              <span class="fr-notice__title">Info notice title</span>
              <span class="fr-notice__desc"
                >This is an informational message.</span
              >
            </p>
          </div>
        </div>
      </div>
      <div class="fr-notice fr-notice--alert">
        <div class="fr-container">
          <div class="fr-notice__body">
            <p>
              <span class="fr-notice__title">Alert notice</span>
              <span class="fr-notice__desc">Something went wrong.</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Callout -->
    <section>
      <h2>Callout</h2>
      <div
        class="fr-callout fr-callout--green-emeraude fr-icon-information-line"
      >
        <h3 class="fr-callout__title">Success callout</h3>
        <p class="fr-callout__text">
          This callout uses the green emeraude accent.
        </p>
      </div>
      <div class="fr-callout fr-callout--brown-caramel">
        <h3 class="fr-callout__title">Warning callout</h3>
        <p class="fr-callout__text">
          This callout uses the brown caramel accent.
        </p>
      </div>
    </section>

    <!-- Fieldset -->
    <section>
      <h2>Fieldset</h2>
      <fieldset class="fr-fieldset">
        <legend class="fr-fieldset__legend font-normal">
          Choose an option:
        </legend>
        <div class="fr-fieldset__element">
          <label><input type="radio" name="dsfr-opt" /> Option A</label>
        </div>
        <div class="fr-fieldset__element">
          <label><input type="radio" name="dsfr-opt" /> Option B</label>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset" style="margin-top: 1rem">
        <legend class="fr-fieldset__legend font-normal">Inline variant:</legend>
        <div class="fr-fieldset__element fr-fieldset__element--inline">
          <label><input type="radio" name="dsfr-inline" /> Yes</label>
        </div>
        <div class="fr-fieldset__element fr-fieldset__element--inline">
          <label><input type="radio" name="dsfr-inline" /> No</label>
        </div>
      </fieldset>
    </section>

    <!-- Table -->
    <section>
      <h2>Table</h2>
      <div class="fr-table">
        <table>
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
              <td><p class="fr-badge fr-badge--success">Active</p></td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>User</td>
              <td><p class="fr-badge fr-badge--warning">Pending</p></td>
            </tr>
            <tr>
              <td>Charlie</td>
              <td>Moderator</td>
              <td><p class="fr-badge fr-badge--error">Suspended</p></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Header (mini) -->
    <section>
      <h2>Header</h2>
      <header class="fr-header">
        <div class="fr-header__body">
          <div class="fr-container">
            <div class="fr-header__body-row">
              <div class="fr-header__brand fr-enlarge-link">
                <div class="fr-header__brand-top">
                  <div class="fr-header__logo">
                    <p class="fr-logo">République<br />Française</p>
                  </div>
                </div>
                <div class="fr-header__service">
                  <p class="fr-header__service-title">Hyyypertool</p>
                  <p class="fr-header__service-tagline">
                    Design system preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fr-header__menu fr-modal">
          <div class="fr-container">
            <nav class="fr-nav" role="navigation" aria-label="Menu principal">
              <ul class="fr-nav__list">
                <li class="fr-nav__item">
                  <a class="fr-nav__link" aria-current="page" href="#">
                    Moderations
                  </a>
                </li>
                <li class="fr-nav__item">
                  <a class="fr-nav__link" href="#">Utilisateurs</a>
                </li>
                <li class="fr-nav__item">
                  <a class="fr-nav__link" href="#">Organisations</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </section>

    <!-- Typography -->
    <section>
      <h2>Typography</h2>
      <h1 class="fr-h1">Heading 1</h1>
      <p class="fr-text--xl">Extra large text</p>
      <p class="fr-text--lead">Lead text</p>
      <p class="fr-text--sm">Small text</p>
    </section>

    <!-- Cards -->
    <section>
      <h2>Cards</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3
                class="fr-card__title"
                style="color: var(--text-action-high-blue-france)"
              >
                Card Title
              </h3>
              <p class="fr-card__desc">Card description text goes here.</p>
            </div>
          </div>
        </div>
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3
                class="fr-card__title"
                style="color: var(--text-action-high-blue-france)"
              >
                Another Card
              </h3>
              <p class="fr-card__desc">More card description text.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Alert -->
    <section>
      <h2>Alert</h2>
      <div class="fr-alert fr-alert--warning" style="margin-bottom: 0.5rem">
        <h3 class="fr-alert__title">Warning alert</h3>
        <p>Something requires your attention.</p>
      </div>
    </section>

    <!-- Form inputs -->
    <section>
      <h2>Form Inputs</h2>
      <div class="fr-input-group" style="margin-bottom: 1rem">
        <label class="fr-label" for="dsfr-email">Email address</label>
        <input class="fr-input" id="dsfr-email" type="email" placeholder="name@example.com" />
      </div>
      <div class="fr-input-group" style="margin-bottom: 1rem">
        <label class="fr-label" for="dsfr-date">Date</label>
        <input class="fr-input" id="dsfr-date" type="date" />
      </div>
      <div class="fr-select-group" style="margin-bottom: 1rem">
        <label class="fr-label" for="dsfr-select">Role</label>
        <select class="fr-select" id="dsfr-select">
          <option value="">Choisir un rôle</option>
          <option>Admin</option>
          <option>User</option>
        </select>
      </div>
      <div class="fr-input-group fr-input-group--error" style="margin-bottom: 1rem">
        <label class="fr-label fr-label--error" for="dsfr-error">Champ en erreur</label>
        <input class="fr-input fr-input--error" id="dsfr-error" type="text" placeholder="Invalide" />
        <p class="fr-error-text">Ce champ est requis.</p>
      </div>
      <div class="fr-input-group fr-input-group--valid">
        <label class="fr-label fr-label--success" for="dsfr-valid">Champ valide</label>
        <input class="fr-input fr-input--valid" id="dsfr-valid" type="text" value="Alice" />
        <p class="fr-valid-text">Valeur correcte.</p>
      </div>
    </section>

    <!-- Tags -->
    <section>
      <h2>Tags</h2>
      <div class="row">
        <button class="fr-tag">Tag one</button>
        <button class="fr-tag">Tag two</button>
        <button class="fr-tag" aria-pressed="true">Active tag</button>
      </div>
    </section>

    <!-- Colors -->
    <section>
      <h2>Color Palette</h2>
      <div class="row">
        <div
          style="width:60px;height:60px;background:var(--blue-france-sun-113-625);border-radius:4px"
          title="#000091 blue-france"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--error-425-625);border-radius:4px"
          title="#c9191e error"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--background-action-high-green-bourgeon);border-radius:4px"
          title="#68a532 green-bourgeon"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--background-action-high-warning);border-radius:4px"
          title="#d64d00 warning"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--red-marianne-425-625);border-radius:4px"
          title="#e1000f red-marianne"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--green-emeraude-sun-425-625);border-radius:4px"
          title="#00a95f green-emeraude"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--brown-caramel-sun-425-625);border-radius:4px"
          title="#c08c65 brown-caramel"
        ></div>
      </div>
      <div class="row" style="margin-top: 0.5rem">
        <div
          style="width:60px;height:60px;background:var(--grey-0-1000);border-radius:4px"
          title="#000 grey-1000"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--grey-200-850);border-radius:4px"
          title="#3a3a3a grey-850"
        ></div>
        <div
          style="width:60px;height:60px;background:#e5e5e5;border-radius:4px;border:1px solid #ccc"
          title="#e5e5e5 grey-200"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--background-alt-grey);border-radius:4px;border:1px solid #ccc"
          title="#f6f6f6 grey-50"
        ></div>
        <div
          style="width:60px;height:60px;background:var(--background-contrast-grey);border-radius:4px;border:1px solid #ccc"
          title="#eee grey-contrast"
        ></div>
      </div>
    </section>
  `;
}
