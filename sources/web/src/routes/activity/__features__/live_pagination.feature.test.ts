import { empty_databases, start_app, stop_app } from "#src/testing";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { schema } from "@~/identite-proconnect/database";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import { pg } from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll } from "bun:test";
import { Scenario } from "buncept";

//

beforeAll(start_app);
beforeAll(async () => {
  await empty_databases();
  await insert_database(pg);
  await insert_moderateur(hyyyper_pglite);
  await pg.insert(schema.activity_logs).values(
    Array.from({ length: 51 }, () => ({
      action: "user.mfa_reset",
      actor_ref: "oidc-sub-moderateur",
      actor_type: "moderator",
      app: "hyyypertool",
      context: {
        inputs: { user_id: 1 },
        outcome: {
          previous: {
            authenticators: 1,
            email_verified: true,
            force_2fa: false,
            password_configured: true,
            totp_configured: false,
          },
        },
      },
      created_at: "2024-01-01T00:00:00.000Z",
    })),
  );
});
afterAll(stop_app);

//

Scenario(
  "Le direct conserve la page choisie dans le journal d'activité",
  ({ I }) => {
    I.amOnPage("/activity?live=1");
    I.see("Affiche de 1-50 sur 51");

    I.click("Suivant");
    I.see("Affiche de 51-51 sur 51");

    // htmx polls on the browser clock; wait long enough for a live refresh.
    I.wait(2);
    I.see("Affiche de 51-51 sur 51");
    I.seeInCurrentUrl("page=2");
  },
);
