import { handleRequests } from './routes/routes.ts';
import { setupFirebase } from './firebaseSetup.ts';
import { argv } from 'node:process';
import express from 'express';
import path from 'node:path';

// TODO verify params
const port = argv[2];
const staticDir = argv[3];
const secretServiceAccountPath = argv[4];

const staticDirResolved = path.resolve(staticDir)

const app = setupFirebase(secretServiceAccountPath);

const exp = express()
handleRequests(exp, app, staticDirResolved);
exp.listen(port, () => {
    console.log('Express started on port', port)
    console.log("serving on-disk resources from", staticDirResolved)
});