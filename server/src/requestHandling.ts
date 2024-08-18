import * as http from 'node:http';
import { getResponseData as extractFromUrl } from './extract-from-url/requestHandling.js'

export type ResponseData = {
    body: Record<string, unknown>,
    statusCode: number
}

export function getRequestHandler(baseUrl: string): http.RequestListener {
    return (req, res) => {
        const { method, url: path } = req;
        console.log("recieved:", method, path)
    
        const { statusCode, body } = getResponseData(baseUrl, method, path)
        res.setHeader("Content-Type", "application/json");
        res.statusCode = statusCode;
        res.write(JSON.stringify(body));
        res.end();
    
        console.log("responded:", res.statusCode)
    }; 
}

function getResponseData(baseUrl: string, method?: string, path?: string): ResponseData {
    if (!method || !path) {
        return {
            body: { errors: ["invalid http request"]},
            statusCode: 400
        }
    }

    const url = new URL(path, baseUrl);
    if (url.pathname === '/extract-from-url') {    
        return extractFromUrl(method, url)
    }

    return {
        statusCode: 404,
        body: {
            errors: [ "the requested resource does not exist" ]
        }
    }
}