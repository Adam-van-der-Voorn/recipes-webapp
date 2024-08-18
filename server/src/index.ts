import * as http from 'node:http';
import { getRequestHandler } from './requestHandling.js';
import { setupFirebase } from './firebaseSetup.js';

const PORT = process.argv[2];
const secretServiceAccountPath = process.argv[3];

const BASE_URL = `http://localhost:${PORT}`

const app = setupFirebase(secretServiceAccountPath);

const handleReq = getRequestHandler(BASE_URL, app);
const server = http.createServer(handleReq);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
