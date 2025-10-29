//

import type { Hono, HonoRequest, Schema } from "hono";
import { hc } from "hono/client";
import type { HonoBase } from "hono/hono-base";
import type { Endpoint } from "hono/types";
import type { HasRequiredKeys, UnionToIntersection } from "hono/utils/types";
import type { Router } from "../routes";

//
type HxClientRequestOptions<T = unknown> = keyof T extends never
  ? {
      headers?: Record<string, string>;
      fetch?: typeof fetch | HonoRequest;
    }
  : {
      headers: T;
      fetch?: typeof fetch | HonoRequest;
    };

type Methods =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace";

type InputEndpoint = { form?: {}; query?: {}; param?: {} };
type HtmxSpecifiedAttributes<
  Method extends Methods,
  Input extends InputEndpoint,
  TForm = Input["form"],
> =
  HasRequiredKeys<NonNullable<TForm>> extends true
    ? Record<`hx-${Method}`, string> & Record<`hx-vals`, string>
    : Record<`hx-${Method}`, string>;

type HxClientRequest<TSchema extends Schema> = {
  [$$Method in keyof TSchema]: TSchema[$$Method] extends Endpoint & {
    input: infer $Input;
  }
    ? { input: $Input; method: $$Method } extends {
        input: InputEndpoint;
        method: `$${infer Method}`;
      }
      ? Method extends Methods
        ? $Input extends InputEndpoint
          ? HasRequiredKeys<Omit<$Input, "form">> extends true
            ? <$Args extends Omit<$Input, "form">>(
                args: $Args,
                options?: HxClientRequestOptions,
              ) => Promise<HtmxSpecifiedAttributes<Method, $Args>>
            : <$Args extends Omit<$Input, "form">>(
                args?: $Args,
                options?: HxClientRequestOptions,
              ) => Promise<HtmxSpecifiedAttributes<Method, $Args>>
          : never
        : never
      : never
    : never;
} & {
  $url: (
    arg?: TSchema[keyof TSchema] extends {
      input: infer $Input;
    }
      ? $Input extends {
          param: infer $Param;
        }
        ? {
            param: $Param;
          }
        : {}
      : {},
  ) => URL;
};
type PathToChain<
  TPath extends string,
  TSchema extends Schema,
  Original extends string = "",
> = TPath extends `/${infer $Path}`
  ? PathToChain<$Path, TSchema, TPath>
  : TPath extends `${infer $ParentPath}/${infer $SubPath}`
    ? {
        [K in $ParentPath]: PathToChain<$SubPath, TSchema, Original>;
      }
    : {
        [K in TPath extends "" ? "index" : TPath]: HxClientRequest<
          TSchema extends Record<string, unknown> ? TSchema[Original] : never
        >;
      };

type HxClient<T> =
  T extends HonoBase<any, infer $Schema, any>
    ? $Schema extends Record<infer $Path, Schema>
      ? $Path extends string
        ? PathToChain<$Path, $Schema>
        : never
      : never
    : never;

export function hono_hx_attibute<
  T extends Hono<any, any, any>,
>(): UnionToIntersection<HxClient<T>> {
  return hc<T>("http://localhost:3000", {
    fetch(input: string | URL | Request, options: any) {
      const init: RequestInit = options;
      const url =
        input instanceof URL
          ? input
          : input instanceof Request
            ? new URL(input.url)
            : new URL(input);

      const attribute = `hx-${init.method?.toLowerCase()}`;
      const hx_val =
        options.body instanceof FormData
          ? { "hx-vals": JSON.stringify(Object.fromEntries(options.body)) }
          : {};
      return { [attribute]: `${url.pathname}${url.search}`, ...hx_val } as any;
    },
  }) as any;
}

export const hx_urls = hono_hx_attibute<Router>();
