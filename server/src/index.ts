import { handleRequests } from './routes/routes.ts';
import { setupFirebase } from './firebaseSetup.ts';
import express from 'express';
import path from 'node:path';
import argParse from "./argparse.ts";

const { staticDir, secretServiceAccountPath, port, serverIp } = argParse()

const staticDirResolved = path.resolve(staticDir)

const app = setupFirebase(secretServiceAccountPath);

const exp = express()
handleRequests(exp, app, staticDirResolved);
exp.listen(port, serverIp, () => {
    console.log('Express started on', `http://${serverIp}:${port}`)
    console.log("serving on-disk resources from", staticDirResolved)
});