#!/usr/bin/env node

const { spawn } = require('node:child_process');
const path = require('node:path');
const { networkInterfaces } = require('node:os');

const projectRoot = process.argv[2];
const clientRoot = path.resolve(projectRoot, 'client')

////////////////////////////
// frontend watch & build //
////////////////////////////

const clientWebpackBin = path.resolve(clientRoot, 'node_modules', '.bin', 'webpack-cli')
let feBuild = spawn(clientWebpackBin, ['--mode=development', '--watch', '--stats=minimal'], { cwd: clientRoot });
relog(feBuild, "stdout", "wpack: ")
relog(feBuild, "stderr", "wpack: ")
 

/////////////////////////////////
// backend build, watch, & run //
/////////////////////////////////

const denoArgs = [
    '--allow-read',
    '--allow-env',
    '--allow-net',
    '--watch',
]

// get local Ipv4 network
const nets = networkInterfaces();
const localAddresses = Object.values(nets)
    .flatMap(e => e)
    .filter(n => n.internal === false && n.family === "IPv4")
    .map(n => n.address)

const serverIp = localAddresses.length > 0 ? localAddresses.at(0) : '127.0.0.1'

const serverArgs = [
    'server/src/index.ts',
    '--port', '3333',
    '--static-dir', 'client/dist',
    '--fb-secrets-file', '/home/adamv/.secrets/recipiesapp-85118-firebase-adminsdk-3a43h-5a8b539d3a.json',
    '--server', serverIp, 
]

let server = spawn("deno", [...denoArgs, ...serverArgs], { cwd: projectRoot });
relog(server, "stdout", "server: ")
relog(server, "stderr", "server: ")

// hang tight !!
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