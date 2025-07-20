import { parseArgs } from "@std/cli/parse-args";

const PARAM_MESSAGE = "required params: port, static-dir, fb-secrets-file, server"

export default function argParse() {
    const args = parseArgs(Deno.args);
    const port = args["port"];
    // TODO validate these are real directories
    const staticDir = args["static-dir"];
    const secretServiceAccountPath = args["fb-secrets-file"];
    const serverIp = args["server"];

    if (!port || !staticDir || !secretServiceAccountPath || !serverIp) {
        console.error(PARAM_MESSAGE);
        Deno.exit(1)
    }

    if (typeof port !== 'number') {
        console.error(PARAM_MESSAGE);
        console.error("port must be a number");
        Deno.exit(1)
    }

    const parsed = { port, staticDir, secretServiceAccountPath, serverIp };

    const allArgsStr = Object.entries(parsed)
        .map(e => ` > ${e[0]} = ${e[1]}`)
        .join("\n");
    console.log("running with config:\n" + allArgsStr);

    return parsed;
}