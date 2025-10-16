//

import dotenv from "dotenv";
import { join } from "node:path";
import { cwd, env } from "node:process";
import { match } from "ts-pattern";
import { z } from "zod";

//

/**
 * @deprecated This dotenv.config() call is deprecated.
 * Environment variables should be loaded at the bin level instead.
 * Use set_config middleware for runtime configuration.
 */
dotenv.config({
  path: [
    `.env.${process.env.NODE_ENV ?? "development"}.local`,
    ".env.local",
    ".env",
  ],
});

const pkg = await import(join(cwd(), "package.json"));
const { version } = pkg;

const GIT_SHA_SHEMA = z
  .string()
  .optional()
  .transform((sha) => (sha ? sha.slice(0, 7) : undefined));

const DEPLOY_ENV_SHEMA = z.enum(["preview", "preproduction", "production"]);

//

export const app_env = z.object({
  AGENTCONNECT_OIDC_CLIENT_ID: z.string().trim(),
  AGENTCONNECT_OIDC_ID_TOKEN_SIGNED_RESPONSE_ALG: z
    .string()
    .trim()
    .default("ES256"),
  AGENTCONNECT_OIDC_ISSUER: z.string().trim().url(),
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
  API_AUTH_URL: z.string().trim().url(),
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
  DATABASE_URL: z
    .string()
    .trim()
    .url()
    .default(
      "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
    ),
  DEPLOY_ENV: DEPLOY_ENV_SHEMA.default("preview"),
  ENTREPRISE_API_GOUV_TOKEN: z.string().trim(),
  ENTREPRISE_API_GOUV_URL: z.string().trim().url(),
  GIT_SHA: GIT_SHA_SHEMA,
  HOST: z.string().trim().url().optional(),
  HTTP_CLIENT_TIMEOUT: z.coerce.number().default(3_000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  SENTRY_DNS: z.string().trim().url().optional(),
  TZ: z.string().trim().optional(),
  VERSION: z.string().default(
    match(
      DEPLOY_ENV_SHEMA.optional().parse(env["DEPLOY_ENV"], {
        path: ["env.DEPLOY_ENV"],
      }),
    )
      .with(DEPLOY_ENV_SHEMA.Enum.production, () => version)
      .otherwise(
        () =>
          GIT_SHA_SHEMA.parse(env["GIT_SHA"], {
            path: ["env.GIT_SHA"],
          }) ?? version,
      ),
  ),
  ZAMMAD_MODERATION_TAG: z.string().trim().default("moderation"),
  ZAMMAD_TOKEN: z.string().trim(),
  ZAMMAD_URL: z.string().trim().url(),
});

export default app_env.parse(env, {
  path: ["env"],
});

export type App_Env = z.TypeOf<typeof app_env>;
