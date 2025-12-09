//

import type { SuggestSameUserEmailsHandler } from "#src/lib/users";
import { render_md } from "#src/ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import user_with_existing_pc_account from "./user_with_existing_pc_account";

//

test("with one email found", async () => {
  const query_suggest_same_user_emails: SuggestSameUserEmailsHandler =
    async () => ["🦄@unicorn.xyz"];

  expect(
    await render_md(
      <context.Provider
        value={
          {
            domain: "🧨",
            moderation: {
              organization: { cached_libelle: "🦄" },
              user: { email: "💌" },
            },
            query_suggest_same_user_emails,
          } as Values
        }
      >
        <Response />
      </context.Provider>,
    ),
  ).toMatchInlineSnapshot(`
    "Bonjour,

    Nous avons bien reçu votre demande de rattachement à l&#39;organisation « 🦄 » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Vous possédez déjà un compte ProConnect associé à l’adresse e-mail professionnelle : « 🦄@unicorn.xyz ».

    Merci de bien vouloir vous connecter avec le compte déjà existant ou de le supprimer (nous pouvons le faire pour vous si vous répondez à ce message).

    Votre adresse e-mail associée à un nom de domaine gratuit tel que « 🧨 » ne sera pas autorisée.

    Bien cordialement,
    L’équipe ProConnect.
    "
  `);
});

test("with three emails found", async () => {
  const query_suggest_same_user_emails: SuggestSameUserEmailsHandler =
    async () => ["🦄@unicorn.xyz", "🐷@unicorn.xyz", "🧧@unicorn.xyz"];

  expect(
    await render_md(
      <context.Provider
        value={
          {
            domain: "🧨",
            moderation: {
              organization: { cached_libelle: "🦄" },
              user: { email: "💌" },
            },
            query_suggest_same_user_emails,
          } as Values
        }
      >
        <Response />
      </context.Provider>,
    ),
  ).toMatchInlineSnapshot(`
    "Bonjour,

    Nous avons bien reçu votre demande de rattachement à l&#39;organisation « 🦄 » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Vous possédez déjà un compte ProConnect associé à l’adresse e-mail professionnelle :

    - 🦄@unicorn.xyz
    - 🐷@unicorn.xyz
    - 🧧@unicorn.xyz

    Merci de bien vouloir vous connecter avec le compte déjà existant ou de le supprimer (nous pouvons le faire pour vous si vous répondez à ce message).

    Votre adresse e-mail associée à un nom de domaine gratuit tel que « 🧨 » ne sera pas autorisée.

    Bien cordialement,
    L’équipe ProConnect.
    "
  `);
});

test("with no emails found", async () => {
  const query_suggest_same_user_emails: SuggestSameUserEmailsHandler =
    async () => [];

  expect(
    await render_md(
      <context.Provider
        value={
          {
            domain: "🧨",
            moderation: {
              organization: { cached_libelle: "🦄" },
              user: { email: "💌" },
            },
            query_suggest_same_user_emails,
          } as Values
        }
      >
        <Response />
      </context.Provider>,
    ),
  ).toMatchInlineSnapshot(`
    "Bonjour,

    Nous avons bien reçu votre demande de rattachement à l&#39;organisation « 🦄 » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Vous possédez déjà un compte ProConnect associé à l’adresse e-mail professionnelle : « ???? ».

    Merci de bien vouloir vous connecter avec le compte déjà existant ou de le supprimer (nous pouvons le faire pour vous si vous répondez à ce message).

    Votre adresse e-mail associée à un nom de domaine gratuit tel que « 🧨 » ne sera pas autorisée.

    Bien cordialement,
    L’équipe ProConnect.
    "
  `);
});

function Response() {
  return <>{user_with_existing_pc_account()}</>;
}
