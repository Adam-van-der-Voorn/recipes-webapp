#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-run

import esbuild from "esbuild"

const USAGE_STRING = "usage: ./bundle.ts client_dir [watch] [dev]"

const args = Deno.args;
if (args.length > 3 || args.length < 1) {
    console.error(USAGE_STRING)
    Deno.exit(1)
}

const clientDir = args[0]
const options = args.slice(1)
const isDev = options.includes("dev")
const watch = options.includes("watch");

console.log({isDev, watch})

const config: esbuild.BuildOptions = {
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
    entryPoints: [`${clientDir}/src/index.tsx`],
    minify: isDev,
    sourcemap: true,
    outfile: `${clientDir}/dist/static/js/main.bundle.js`,
    ...config
}

/**
 * @type {import("esbuild").BuildOptions}
*/
const serviceWorkerConfig = {
    entryPoints: [`${clientDir}/src/service-worker.js`],
    outdir: `${clientDir}/dist`,
    ...config
}

if (watch) {
    const ctx2 = await esbuild.context({...mainConfig, logLevel: "info"});
    const ctx1 = await esbuild.context({...serviceWorkerConfig, logLevel: "info"});
    
    // IMPORTANT: this call MUST NOT have an `await`.
    ctx1.watch()
    ctx2.watch()
}
else {
    esbuild.build(mainConfig)
    esbuild.build(serviceWorkerConfig)
}
