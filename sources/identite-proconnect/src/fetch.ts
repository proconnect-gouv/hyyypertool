//

import consola from "consola";
import { join } from "node:path";

//

export type ApiAuthConfig = {
  baseUrl: string;
  username: string;
  password: string;
};

type Options =
  | {
      endpoint: "/api/admin/join-organization";
      method: "POST";
      searchParams: {
        is_external: "true" | "false";
        organization_id: string;
        user_id: string;
      };
    }
  | {
      endpoint: "/api/admin/send-moderation-processed-email";
      method: "POST";
      searchParams: { organization_id: string; user_id: string };
    };

export async function fetch_mcp_admin_api(
  config: ApiAuthConfig,
  options: Options & { timeout?: number },
) {
  const searchParams = new URLSearchParams(options.searchParams);
  const url = `${join(config.baseUrl, options.endpoint)}?${searchParams}`;
  const headers = new Headers({
    Authorization: `Basic ${Buffer.from(`${config.username}:${config.password}`).toString("base64")}`,
  });

  consola.info(`  <<-- ${options.method} ${url}`);

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    signal: AbortSignal.timeout(options.timeout ?? 10_000),
  });

  consola.info(
    `  -->> ${options.method} ${url} ${response.status} ${response.statusText}`,
  );

  if (!response.ok) {
    throw new Error(
      `${options.method} ${url} ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as any;
}
