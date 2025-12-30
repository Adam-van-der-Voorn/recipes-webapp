#!/usr/bin/env -S deno --allow-env --allow-run

const cwd = Deno.args[0]
const prefix = Deno.args[1]
const command = Deno.args[2]
const args = Deno.args.slice(3)

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const childProcess = new Deno.Command(command, { args, cwd, stderr: "piped", stdout: "piped" })
    .spawn();

relog(childProcess, "stdout", prefix)
relog(childProcess, "stderr", prefix)

// hang tight !!
setTimeout(() => {}, 999999)

async function relog(childProcess: Deno.ChildProcess, outname: "stdout" | "stderr", prefix: string) {
    const it = childProcess[outname].values()
    const out = Deno[outname];
    let done = false;
    while (!done) {
        const readResult = await it.next();
        done = readResult.done ?? false;
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