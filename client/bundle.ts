import * as esbuild from "https://deno.land/x/esbuild@v0.20.1/mod.js";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.9";

const config = {
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "esnext",
  minify: true,
  treeShaking: true,
}

esbuild.build({
    //   plugins: [...denoPlugins()],
    entryPoints: ["src/index.tsx"],
    sourcemap: true,
    outfile: "dist/static/js/main.bundle.js",
    ...config
});

esbuild.build({
    entryPoints: ["src/service-worker.js"],
    outdir: "dist",
    ...config
});
await esbuild.stop();