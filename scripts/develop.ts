#!/usr/bin/env -S deno run --allow-all
import { networkInterfaces } from "node:os"
import * as path from "@std/path"


const projectRoot = Deno.args[0];
const clientRoot = path.resolve(projectRoot, 'client')
const encoder = new TextEncoder()
const decoder = new TextDecoder()


////////////////////////////
// frontend watch & build //
////////////////////////////
{   
    const feBuild = new Deno.Command('./bundle.ts', { args: ['dev', 'watch'], cwd: clientRoot, stderr: "piped", stdout: "piped" })
        .spawn();
    relog(feBuild, "stdout", "bundle: ")
    relog(feBuild, "stderr", "bundle: ")
}

 

/////////////////////////////////
// backend build, watch, & run //
/////////////////////////////////
{
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
    const server = new Deno.Command(Deno.execPath(), { args: [...denoArgs, ...serverArgs], cwd: projectRoot, stderr: "piped", stdout: "piped" })
        .spawn();
    relog(server, "stdout", "server: ")
    relog(server, "stderr", "server: ")
}


// hang tight !!
setTimeout(() => {}, 999999)


async function relog(childProcess: Deno.ChildProcess, outname: "stdout" | "stderr", prefix: string) {
    const it = childProcess[outname].values()
    const out = Deno[outname];
    let done = false;
    while (!done) {
        const readResult = await it.next();
        done = readResult.done;
        if (readResult.value) {
            const buf = decoder.decode(readResult.value);
            let ii = 0;
            let output = ""
            for (let i = 0; i < buf.length; i++) {
                if (buf[i] == '\n') {
                    output += prefix + buf.slice(ii, i + 1);
                    ii = i + 1; 
                }
            }
            await out.write(encoder.encode(output))
        }
    }
    console.log(`${prefix}process exited`)        
}