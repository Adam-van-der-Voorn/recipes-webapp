#!/usr/bin/env node

const { spawn } = require('node:child_process');
const path = require('node:path');

const projectRoot = process.argv[2];
const clientRoot = path.resolve(projectRoot, 'client')
const serverRoot = path.resolve(projectRoot, 'server')

// frontend watch & build 
const clientWebpackBin = path.resolve(clientRoot, 'node_modules', '.bin', 'webpack-cli')
let feBuild = spawn(clientWebpackBin, ['--mode=development', '--watch', '--stats=minimal'], { cwd: clientRoot });
relog(feBuild, "stdout", "wpack: ")
relog(feBuild, "stderr", "wpack: ")

// backend watch & build
const serverTscBin = path.resolve(serverRoot, 'node_modules', '.bin', 'tsc')
let beBuild = spawn(serverTscBin, ['--project', 'tsconfig.json', '--watch'], { cwd: serverRoot });
relog(beBuild, "stdout", "tsc: ")
relog(beBuild, "stderr", "tsc: ")
 
const denoArgs = [
    '--allow-read',
    '--allow-env',
    '--allow-net',
    '--unstable-sloppy-imports',
    '--watch',
]

const serverArgs = [
    'server/src/index.ts',
    '3333',
    'client/dist',
    '/home/adamv/.secrets/recipiesapp-85118-firebase-adminsdk-3a43h-5a8b539d3a.json',
]

// server
let server = spawn("deno", [...denoArgs, ...serverArgs], { cwd: projectRoot });
relog(server, "stdout", "server: ")
relog(server, "stderr", "server: ")

setTimeout(() => {}, 999999)

function relog(childProcess, outname, prefix) {
    childProcess[outname].setEncoding('utf-8')
    childProcess[outname].on('data', (buf) => {
        let ii = 0;
        let output = ""
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] == '\n') {
                output += prefix + buf.slice(ii, i + 1);
                ii = i + 1; 
            }
        }
        process[outname].write(output);
        // console.error("REMAINDER: (" + buf.slice(ii, buf.length) + ")")
    })
}