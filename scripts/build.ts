//

const minify = true;

{
  const { logs, outputs, success } = await Bun.build({
    entrypoints: [
      "./sources/app/layout/src/_client/nprogress.ts",
      "./sources/welcome/api/src/_client/hyyypertitle.ts",
    ],
    external: ["lit", "@~/app.core/config"],
    minify,
    outdir: "./public/built",
  });
  console.log({ logs, outputs, success });
}

export {};
