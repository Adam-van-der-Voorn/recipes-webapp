import * as http from 'node:http';
import { getResponseData as extractFromUrl } from './extract-from-url/requestHandling.js'
import admin from 'firebase-admin';

export type ResponseData = {
    body: Record<string, unknown>,
    statusCode: number
}

export function getRequestHandler(baseUrl: string, app: admin.app.App): http.RequestListener {
    return async (req, res) => {
        const { method, url: path } = req;
        console.log("recieved:", method, path)
    
        const { statusCode, body } = await getResponseData(baseUrl, app, method, path)
        res.setHeader("Content-Type", "application/json");
        res.statusCode = statusCode;
        res.write(JSON.stringify(body));
        res.end();
    
        console.log("responded:", res.statusCode)
    }; 
}

async function getResponseData(baseUrl: string, app: admin.app.App, method?: string, path?: string): Promise<ResponseData> {
    if (!method || !path) {
        return {
            body: { errors: ["invalid http request"]},
            statusCode: 400
        }
    }

    const url = new URL(path, baseUrl);
    if (url.pathname === '/extract-from-url') {    
        return await extractFromUrl(app, method, url)
    }

    return {
        statusCode: 404,
        body: {
            errors: [ "the requested resource does not exist" ]
        }
    }
}