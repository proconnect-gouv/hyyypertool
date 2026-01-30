import type { Hono, Schema } from "hono";
import type { HonoBase } from "hono/hono-base";
import type { Endpoint } from "hono/types";
import type { HasRequiredKeys, UnionToIntersection } from "hono/utils/types";
import type { Router } from "../routes";

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

type RelaxParams<T> = T extends { param: infer P }
  ? { param: { [K in keyof P]: P[K] extends string ? string | number : P[K] } }
  : T;
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
            ? <$Args extends Omit<RelaxParams<$Input>, "form">>(
                args: $Args,
              ) => HtmxSpecifiedAttributes<Method, $Args>
            : <$Args extends Omit<RelaxParams<$Input>, "form">>(
                args?: $Args,
              ) => HtmxSpecifiedAttributes<Method, $Args>
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
        ? RelaxParams<{ param: $Param }>
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

function build_path(segments: string[]): string {
  const filtered = segments.filter((s) => s !== "index");
  return "/" + filtered.join("/");
}

function create_hx_proxy(path_segments: string[] = []): any {
  return new Proxy(() => {}, {
    get(_, prop: string) {
      if (prop === "$url") {
        return (args?: { param?: Record<string, string | number> }) => {
          let path = build_path(path_segments);
          if (args?.param) {
            for (const [key, value] of Object.entries(args.param)) {
              path = path.replace(`:${key}`, String(value));
            }
          }
          return new URL(path, "http://localhost");
        };
      }

      if (prop.startsWith("$")) {
        const method = prop.slice(1) as Methods;
        return (args?: {
          param?: Record<string, string | number>;
          query?: Record<string, string>;
          form?: Record<string, unknown>;
        }) => {
          let path = build_path(path_segments);

          if (args?.param) {
            for (const [key, value] of Object.entries(args.param)) {
              path = path.replace(`:${key}`, String(value));
            }
          }

          if (args?.query) {
            const search_params = new URLSearchParams(args.query);
            path = `${path}?${search_params}`;
          }

          const hx_vals = args?.form
            ? { "hx-vals": JSON.stringify(args.form) }
            : {};

          return { [`hx-${method}`]: path, ...hx_vals };
        };
      }

      return create_hx_proxy([...path_segments, prop]);
    },
  });
}

export function hono_hx_attibute<
  T extends Hono<any, any, any>,
>(): UnionToIntersection<HxClient<T>> {
  return create_hx_proxy() as UnionToIntersection<HxClient<T>>;
}

export const hx_urls = hono_hx_attibute<Router>();
