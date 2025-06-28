#!/usr/bin/env node

import esbuild from "esbuild"

const USAGE_STRING = "usage: ./bundle.js [watch] [dev]"

const args = process.argv.slice(2);
if (args.length > 2) {
    console.error(USAGE_STRING)
    process.exit(1);
}

const isDev = args.includes("dev")
const watch = args.includes("watch");

console.log({isDev, watch})


/**
 * @type {import("esbuild").BuildOptions}
*/
const config = {
    bundle: true,
    platform: "browser",
    format: "esm",
    target: "esnext",
    treeShaking: true,
    logLevel: "info",
    define: {
        "CONST_IS_DEV_BUILD": `${isDev}`
    },
}

/**
 * @type {import("esbuild").BuildOptions}
*/
const mainConfig = {
    entryPoints: ["src/index.tsx"],
    minify: true,
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
    let ctx2 = await esbuild.context({...serviceWorkerConfig, logLevel: "info"});
    let ctx1 = await esbuild.context({...serviceWorkerConfig, logLevel: "info"});
    
    // IMPORTANT: this call MUST NOT have an `await`.
    ctx1.watch()
    ctx2.watch()
}
else {
    esbuild.build(mainConfig)
    esbuild.build(serviceWorkerConfig)
}

// if using deno, need to call esbuild.stop() here.