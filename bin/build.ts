//

import { execSync } from "child_process";

const minify = true;
const outdir = "./public/built";

// Build Tailwind CSS
console.log("Building Tailwind CSS...");
execSync(
  "bun x tailwindcss -i ../sources/app/ui/tailwind.css -o ./public/built/tailwind.css",
  { stdio: "inherit" },
);
console.log("✓ Tailwind CSS built successfully");
console.log("");

{
  const { logs, outputs, success } = await Bun.build({
    entrypoints: ["lit"],
    outdir,
    minify,
  });
  console.log({ logs, outputs, success });
}
{
  const lit_files = [
    "async-directive.js",
    "decorators.js",
    "directive.js",
    "directives/repeat.js",
    "html.js",
  ];
  const { logs, outputs, success } = await Bun.build({
    entrypoints: lit_files.map((entrypoint) =>
      Bun.resolveSync(`lit/${entrypoint}`, process.cwd()),
    ),
    outdir: `${outdir}/node_modules/lit`,
    minify,
  });
  console.log({ logs, outputs, success });
}

{
  const { logs, outputs, success } = await Bun.build({
    entrypoints: [
      "../sources/app/layout/src/_client/nprogress.ts",
      "../sources/welcome/api/src/_client/hyyypertitle.ts",
    ],
    external: ["lit", "@~/app.core/config"],
    minify,
    outdir,
  });
  console.log({ logs, outputs, success });
}

export {};
