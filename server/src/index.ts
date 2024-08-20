import { handleRequests } from './routes.js';
import { setupFirebase } from './firebaseSetup.js';
import express from 'express';

const PORT = process.argv[2];
const secretServiceAccountPath = process.argv[3];

const BASE_URL = `http://localhost:${PORT}`

const app = setupFirebase(secretServiceAccountPath);

const exp = express()
handleRequests(exp, app);
exp.listen(PORT, () => console.log('Express started on port', PORT));