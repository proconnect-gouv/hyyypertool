//

import { join } from "node:path";
import { cwd, env } from "node:process";
import { match } from "ts-pattern";
import { z } from "zod";

//

const pkg = await import(join(cwd(), "package.json"));
const { version } = pkg;

const GIT_SHA_SHEMA = z
  .string()
  .optional()
  .transform((sha) => (sha ? sha.slice(0, 7) : undefined));

const DEPLOY_ENV_SHEMA = z.enum(["preview", "preproduction", "production"]);

//

export const app_env = z
  .object({
    AGENTCONNECT_OIDC_CLIENT_ID: z.string().trim(),
    AGENTCONNECT_OIDC_ID_TOKEN_SIGNED_RESPONSE_ALG: z
      .string()
      .trim()
      .default("ES256"),
    AGENTCONNECT_OIDC_ISSUER: z.url().trim(),
    AGENTCONNECT_OIDC_SCOPE: z
      .string()
      .trim()
      .default(["openid", "given_name", "usual_name", "email"].join(" ")),
    AGENTCONNECT_OIDC_SECRET_ID: z.string().trim(),
    AGENTCONNECT_OIDC_USERINFO_SIGNED_RESPONSE_ALG: z
      .string()
      .trim()
      .default("ES256"),
    ALLOWED_USERS: z.string().trim().default(""),
    API_AUTH_PASSWORD: z.string().trim(),
    API_AUTH_URL: z.url().trim(),
    API_AUTH_USERNAME: z.string().trim(),
    COOKIE_ENCRYPTION_KEY: z
      .string()
      .trim()
      .default("password_at_least_32_characters_long"),
    CRISP_BASE_URL: z.string().url().default("https://api.crisp.chat"),
    CRISP_IDENTIFIER: z.string().trim(),
    CRISP_KEY: z.string().trim(),
    CRISP_PLUGIN_URN: z.string().trim(),
    CRISP_RESOLVE_DELAY: z.coerce.number().default(2000),
    CRISP_USER_NICKNAME: z.string().trim(),
    CRISP_WEBSITE_ID: z.string().trim(),
    DEPLOY_ENV: DEPLOY_ENV_SHEMA.default("preview"),
    ENTREPRISE_API_GOUV_TOKEN: z.string().trim(),
    ENTREPRISE_API_GOUV_URL: z.url().trim(),
    GIT_SHA: GIT_SHA_SHEMA,
    HOST: z.url().trim().optional(),
    HTTP_CLIENT_TIMEOUT: z.coerce.number().default(3_000),
    HYYYPERBASE_DATABASE_URL: z
      .url()
      .trim()
      .default(
        "postgresql://postgres:postgres@localhost:5555/postgres?schema=public",
      ),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().default(3000),
    PROCONNECT_IDENTITE_DATABASE_URL: z
      .url()
      .trim()
      .default(
        "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
      ),
    SENTRY_DNS: z.url().trim().optional(),
    SENTRY_PROFILES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1),
    SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1),
    TZ: z.string().trim().optional(),
    VERSION: z.string().default(
      match(DEPLOY_ENV_SHEMA.optional().parse(env["DEPLOY_ENV"]))
        .with(DEPLOY_ENV_SHEMA.enum.production, () => version)
        .otherwise(() => GIT_SHA_SHEMA.parse(env["GIT_SHA"]) ?? version),
    ),
  })
  .transform((env) => ({
    ...env,
    ASSETS_PATH: `/assets/${env.VERSION}` as const,
    PUBLIC_ASSETS_PATH: `/assets/${env.VERSION}/public/built` as const,
  }));

export type AppEnv = z.TypeOf<typeof app_env>;
