import { handleRequests } from './routes.js';
import { setupFirebase } from './firebaseSetup.js';
import express from 'express';
import path from 'node:path';

// TODO verify params
const port = process.argv[2];
const staticDir = process.argv[3];
const secretServiceAccountPath = process.argv[4];

const staticDirResolved = path.resolve(staticDir)

const app = setupFirebase(secretServiceAccountPath);

const exp = express()
handleRequests(exp, app, staticDirResolved);
exp.listen(port, () => {
    console.log('Express started on port', port)
    console.log("serving static resources from", staticDirResolved)
});