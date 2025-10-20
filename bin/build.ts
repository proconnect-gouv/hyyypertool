//

import { execSync } from "child_process";

const minify = true;
const outdir = "./bin/public/built";

// Build Tailwind CSS
console.log("Building Tailwind CSS...");
execSync(
  "bun x tailwindcss -i ./sources/app/ui/tailwind.css -o ./bin/public/built/tailwind.css --config ./tailwind.config.ts",
  { stdio: "inherit" },
);
console.log("✓ Tailwind CSS built successfully");
console.log("");

{
  const { logs, outputs, success } = await Bun.build({
    entrypoints: [
      "./sources/app/layout/src/_client/nprogress.ts",
      "./sources/welcome/api/src/_client/hyyypertitle.ts",
    ],
    external: ["@~/app.core/config"],
    minify,
    outdir,
  });
  console.log({ logs, outputs, success });
}

export {};
