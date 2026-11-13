//

import { NotFoundError } from "#src/errors";
import { is_htmx_request } from "#src/htmx";
import { MainLayout } from "#src/layouts";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import { remove_member_from_organization } from "#src/lib/users";
import { editor_guard } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import { EntitySchema } from "#src/schema";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { roles } from "@~/hyyyperbase";
import consola from "consola";
import { Hono, type Context } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import type { VerificationType } from "@~/identite-proconnect/types";
import { match } from "ts-pattern";
import organization_member_router from "./:user_id";
import { batch_form_schema, query_schema } from "./context";
import { get_organization_by_id } from "../get_organization_by_id.query";
import { get_users_by_organization } from "./get_users_by_organization.query";
import Page from "./page";

//

export default new Hono<AppContext>()
  //
  .route("/:user_id", organization_member_router)
  //

  .get(
    "/",
    jsxRenderer(MainLayout),
    zValidator("param", EntitySchema),
    zValidator("query", query_schema, function hook(result, { redirect, req }) {
      if (result.success) return undefined;
      consola.error(result.error);
      return redirect(
        urls.organizations[":id"].members.$url({
          param: { id: req.param("id") ?? "" },
        }).pathname,
      );
    }),
    async function GET({
      render,
      req,
      set,
      var: { identite_pg, hyyyper_user },
    }) {
      const { id: organization_id } = req.valid("param");
      const { order, page, page_size, q, sort } = req.valid("query");
      const is_embedded =
        is_htmx_request(req.raw) &&
        new URL(req.header("HX-Current-URL") ?? req.url).pathname !==
          new URL(req.url).pathname;
      const pagination = {
        page,
        page_size: page_size ?? (is_embedded ? 10 : 50),
      };

      const [organization, query_members_collection] = await Promise.all([
        get_organization_by_id(identite_pg, organization_id),
        get_users_by_organization(identite_pg, {
          organization_id,
          pagination: { ...pagination, page: page - 1 },
          search: q,
          sort: sort ? { order, sort } : undefined,
        }),
      ]);

      set(
        "page_title",
        `Membres de l’organisation ${organization.cached_libelle} (${organization.siret})`,
      );
      return render(
        <Page
          is_editor={hyyyper_user.role !== roles.enum.visitor}
          is_selectable={!is_embedded}
          order={order}
          organization={organization}
          pagination={pagination}
          q={q}
          query_members_collection={query_members_collection}
          sort={sort}
        />,
      );
    },
  )
  .post(
    "/",
    editor_guard(),
    zValidator("param", EntitySchema),
    zValidator("form", batch_form_schema, function hook(result, { text }) {
      if (result.success) return undefined;
      return text("Sélectionnez au moins un membre et une action.", 400);
    }),
    async function POST(c) {
      const { id: organization_id } = c.req.valid("param");
      const { action, user_id: user_ids } = c.req.valid("form");
      const { crisp, identite_pg, identite_runtime, userinfo } = c.var;

      const update = (input: {
        is_external?: boolean;
        verification_type?: VerificationType;
      }) =>
        settle(c, user_ids, async (user_id) => {
          const outcome = await identite_runtime.updateMembership({
            ...input,
            organization_id,
            user_id,
          });
          match(outcome)
            .with(
              { kind: "member_updated" },
              { kind: "membership_unchanged" },
              () => {},
            )
            .with({ kind: "membership_not_found" }, () => {
              throw new NotFoundError(
                `User ${user_id} is not a member of organization ${organization_id}.`,
              );
            })
            .exhaustive();
        });

      switch (action) {
        case "external":
          return update({ is_external: true });
        case "internal":
          return update({ is_external: false });
        case "remove":
          return settle(c, user_ids, (user_id) =>
            remove_member_from_organization(
              {
                crisp,
                pg: identite_pg,
                resolve_delay: c.env.CRISP_RESOLVE_DELAY,
                runtime: identite_runtime,
              },
              { moderator: userinfo, organization_id, user_id },
            ),
          );
        default:
          return update({ verification_type: action });
      }
    },
  );

//

// Runs every member concurrently (removal waits CRISP_RESOLVE_DELAY each), then
// refreshes the table even when some failed, so it shows what was applied.
async function settle(
  { header, text }: Pick<Context, "header" | "text">,
  user_ids: number[],
  run: (user_id: number) => Promise<void>,
) {
  const results = await Promise.allSettled(user_ids.map(run));
  const failures = results.flatMap((result): unknown[] =>
    result.status === "rejected" ? [result.reason] : [],
  );

  header("HX-Trigger", ORGANISATION_EVENTS.enum.MEMBERS_UPDATED);
  if (failures.length === 0) return text("OK", 200);

  const reasons = failures.map((failure) =>
    failure instanceof Error ? failure.message : String(failure),
  );
  const message = `${failures.length} membre(s) sur ${user_ids.length} non traité(s) : ${reasons.join(" ; ")}`;
  throw failures.every((failure) => failure instanceof NotFoundError)
    ? new NotFoundError(message)
    : new AggregateError(failures, message);
}
