import * as http from 'node:http';
import { getRequestHandler } from './requestHandling.js';

const PORT = process.argv[2];
const BASE_URL = `http://localhost:${PORT}`

const handleReq = getRequestHandler(BASE_URL);
const server = http.createServer(handleReq);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
