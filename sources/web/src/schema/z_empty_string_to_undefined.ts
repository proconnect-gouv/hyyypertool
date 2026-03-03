import { z } from "zod";

// from https://gist.github.com/bennettdams/463c804fcfde0eaa888eaa4851c668a1#file-zod-empty-string-undefined-optional-ts-L3

export const z_empty_string_to_undefined = z
  .literal("")
  .transform(() => undefined);
