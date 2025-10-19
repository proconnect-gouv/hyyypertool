//

const minify = true;
const outdir = "./public/built";

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
