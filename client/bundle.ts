#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-run

import esbuild from "esbuild"

const USAGE_STRING = "usage: ./bundle.ts [watch] [dev]"

const args = Deno.args;
if (args.length > 2) {
    console.error(USAGE_STRING)
    Deno.exit(1)
}

const isDev = args.includes("dev")
const watch = args.includes("watch");

console.log({isDev, watch})

const config: esbuild.BuildOptions = {
    // @ts-ignore
    bundle: true,
    platform: "browser",
    format: "esm",
    target: "esnext",
    treeShaking: true,
    logLevel: "info",
    define: {
        "CONST_IS_DEV_BUILD": `${isDev}`,
        'global': 'window'
    },
}

const mainConfig: esbuild.BuildOptions = {
    entryPoints: ["src/index.tsx"],
    minify: isDev,
    sourcemap: true,
    outfile: "dist/static/js/main.bundle.js",
    ...config
}

/**
 * @type {import("esbuild").BuildOptions}
*/
const serviceWorkerConfig = {
    entryPoints: ["src/service-worker.js"],
    outdir: "dist",
    ...config
}

if (watch) {
    let ctx2 = await esbuild.context({...mainConfig, logLevel: "info"});
    let ctx1 = await esbuild.context({...serviceWorkerConfig, logLevel: "info"});
    
    // IMPORTANT: this call MUST NOT have an `await`.
    ctx1.watch()
    ctx2.watch()
}
else {
    esbuild.build(mainConfig)
    esbuild.build(serviceWorkerConfig)
}
