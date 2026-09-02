//

import type { AppEnvContext } from "#src/config";
import { Main_Layout } from "#src/layouts";
import { parse_sirets } from "#src/lib/organizations";
import {
  GetOrganizationInfo,
  type GetOrganizationInfoHandler,
} from "#src/lib/organizations/usecase";
import { authorized, editor_guard } from "#src/middleware/auth";
import type { AppContext } from "#src/middleware/context";
import type { FetchVariablesContext } from "#src/middleware/fetch";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { upsertFactory } from "@proconnect-gouv/proconnect.identite/repositories/organization";
import type { OrganizationInfo } from "@proconnect-gouv/proconnect.identite/types";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import consola from "consola";
import { inArray } from "drizzle-orm";
import { Hono, type Env, type MiddlewareHandler } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import Page from "./page";

//

const SiretsFormSchema = z.object({ sirets: z.string().trim() });
const SiretsConfirmSchema = z.object({
  "sirets[]": z.array(z.string()).min(1),
});
const NewQuerySchema = z.object({
  siret: z.string().optional(),
  created: z.string().optional(),
  skipped: z.string().optional(),
});

//

type PreviewState = {
  existing_organizations: {
    id: number;
    siret: string;
    cached_libelle: string | null;
  }[];
  new_organization_infos: OrganizationInfo[];
  fetch_errors: { siret: string; reason: string }[];
  invalid_sirets: string[];
};

function error_chain(error: unknown) {
  const chain: Error[] = [];
  for (let current = error; current instanceof Error; current = current.cause)
    chain.push(current);
  return chain;
}

function describe_fetch_error(error: unknown) {
  const chain = error_chain(error);
  if (chain.some((cause) => cause.constructor.name === "NotFoundError"))
    return "non diffusible dans la base SIRENE";
  const messages = chain.map((cause) => cause.message).filter(Boolean);
  return messages.join(" ← ") || "erreur inconnue";
}

export interface GetOrganizationInfoContext extends Env {
  Variables: {
    get_organization_info: GetOrganizationInfoHandler;
  };
}

function set_get_organization_info(): MiddlewareHandler<
  AppEnvContext & FetchVariablesContext & GetOrganizationInfoContext
> {
  return async function set_get_organization_info_middleware(c, next) {
    c.set(
      "get_organization_info",
      GetOrganizationInfo({
        entreprise_api_gouv_url: c.env.ENTREPRISE_API_GOUV_URL,
        entreprise_api_gouv_token: c.env.ENTREPRISE_API_GOUV_TOKEN,
        http_timeout: c.env.HTTP_CLIENT_TIMEOUT,
        fetch: c.var.fetch,
      }),
    );
    await next();
  };
}

async function fetch_preview(
  raw_sirets: string,
  {
    identite_pg,
    get_organization_info,
  }: {
    identite_pg: IdentiteProconnectPgDatabase;
    get_organization_info: GetOrganizationInfoHandler;
  },
): Promise<PreviewState> {
  const { valid, invalid } = parse_sirets(raw_sirets);

  const existing_organizations = await identite_pg.query.organizations.findMany(
    {
      columns: { id: true, siret: true, cached_libelle: true },
      where: inArray(schema.organizations.siret, valid),
    },
  );
  const existing_sirets = new Set(
    existing_organizations.map((organization) => organization.siret),
  );
  const new_sirets = valid.filter((siret) => !existing_sirets.has(siret));

  const pending = new_sirets.map((siret) => ({
    siret,
    result: get_organization_info(siret),
  }));
  const results = await Promise.allSettled(pending.map(({ result }) => result));

  const new_organization_infos: OrganizationInfo[] = [];
  const fetch_errors: { siret: string; reason: string }[] = [];
  for (const [index, { siret }] of pending.entries()) {
    const result = results[index];
    if (!result) continue;
    if (result.status === "fulfilled") {
      new_organization_infos.push(result.value);
      continue;
    }
    const reason = describe_fetch_error(result.reason);
    consola.error(
      `get_organization_info(${siret}) failed: ${reason}`,
      result.reason,
    );
    fetch_errors.push({ siret, reason });
  }

  return {
    existing_organizations,
    new_organization_infos,
    fetch_errors,
    invalid_sirets: invalid,
  };
}

//

export default new Hono<AppContext & GetOrganizationInfoContext>()
  .use(authorized())
  .use(editor_guard())
  .use(set_get_organization_info())
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator("query", NewQuerySchema),
    async function GET({
      render,
      set,
      req,
      var: { identite_pg, get_organization_info },
    }) {
      set("page_title", "Ajouter une organisation");
      const { siret, created, skipped } = req.valid("query");

      const created_ids = created
        ?.split(",")
        .map(Number)
        .filter(Number.isInteger);
      const created_organizations =
        created_ids && created_ids.length > 0
          ? await identite_pg.query.organizations.findMany({
              columns: { id: true, siret: true, cached_libelle: true },
              where: inArray(schema.organizations.id, created_ids),
            })
          : undefined;
      const skipped_existing =
        skipped && Number.isInteger(Number(skipped))
          ? Number(skipped)
          : undefined;

      const preview = siret
        ? await fetch_preview(siret, { identite_pg, get_organization_info })
        : undefined;

      return render(
        <Page
          sirets={siret}
          created_organizations={created_organizations}
          skipped_existing={skipped_existing}
          {...(preview ?? {})}
        />,
      );
    },
  )
  .post(
    "/",
    zValidator("form", SiretsFormSchema),
    async function POST({
      render,
      set,
      req,
      var: { identite_pg, get_organization_info },
    }) {
      set("page_title", "Ajouter une organisation");
      const { sirets } = req.valid("form");
      if (!sirets)
        return render(
          <Page sirets_error="Veuillez saisir au moins un SIRET." />,
        );

      const preview = await fetch_preview(sirets, {
        identite_pg,
        get_organization_info,
      });

      return render(<Page sirets={sirets} {...preview} />);
    },
  )
  .post(
    "/confirm",
    zValidator("form", SiretsConfirmSchema),
    async function POST({
      redirect,
      req,
      var: { identite_pg, identite_pg_client, get_organization_info },
    }) {
      const { "sirets[]": sirets } = req.valid("form");

      const existing_organizations =
        await identite_pg.query.organizations.findMany({
          columns: { siret: true },
          where: inArray(schema.organizations.siret, sirets),
        });
      const existing_sirets = new Set(
        existing_organizations.map((organization) => organization.siret),
      );
      const new_sirets = sirets.filter((siret) => !existing_sirets.has(siret));

      const upsert = upsertFactory({ pg: identite_pg_client });

      const created_ids: number[] = [];
      for (const siret of new_sirets) {
        const organization_info = await get_organization_info(siret);
        const organization = await upsert({
          siret,
          organizationInfo: organization_info,
        });
        created_ids.push(organization.id);
      }

      const skipped_existing = sirets.length - created_ids.length;
      return redirect(
        `${urls.organizations.new.$url().pathname}?created=${created_ids.join(",")}${
          skipped_existing > 0 ? `&skipped=${skipped_existing}` : ""
        }`,
        303,
      );
    },
  );
