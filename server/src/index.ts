import { handleRequests } from './routes/routes.ts';
import { setupFirebase } from './firebaseSetup.ts';
import express from 'express';
import argParse from "./argparse.ts";
import * as path from "@std/path"

const { staticDir, secretServiceAccountPath, port, serverIp } = argParse()

const staticDirResolved = await path.resolve(staticDir)

const app = setupFirebase(secretServiceAccountPath);

const exp = express()
handleRequests(exp, app, staticDirResolved);
exp.listen(port, serverIp, () => {
    console.log('Express started on', `http://${serverIp}:${port}`)
    console.log("serving on-disk resources from", staticDirResolved)
});