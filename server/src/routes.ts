import admin from 'firebase-admin';
import express, { Express, NextFunction, Request, Response } from 'express';
import { addRecipeFromUrl } from './add-from-url/entry.js';
import path from 'node:path';

export type ResponseData = {
    body: Record<string, unknown>,
    statusCode: number;
};

export const MESSAGE_UNKNOWN_UNEXPECTED_ERROR = 'Unknown, unexpected, error.'
export const MESSAGE_UNAUTHORISED_NO_JWT = "Unauthorised, expected JWT";
export const MESSAGE_UNAUTHORISED_INVALID_JWT = "Unauthorised, invalid JWT";


export function handleRequests(exp: Express, app: admin.app.App, staticDir: string): void {
    // exp.use ('/api', logRawChunks)
    exp.use ('/api', logReq)
    exp.use ('/api', express.json());
    exp.post('/api/add-from-url', (req, res) => addRecipeFromUrl(req, res, app.firestore()));
    exp.use ('/api', fallThroughJson)
    exp.use ('/', express.static(staticDir));
    exp.use ('/', (req, res) => res.status(200).send(path.join(staticDir, "index.html")))
} 

function fallThroughJson(req: Request, res: Response, next: NextFunction) {
    console.log("no matches");
    res.status(404)
        .json({ error: `The requested resource does not exist, or does not support ${req.method} requests.`})
}

function logReq(req: Request, res: Response, next: NextFunction) {
    console.log("recieved:", req.url);
    next()
}

function logRawChunks(req: Request, res: Response, next: NextFunction) {
    req.on('data', (chunk) => {
        console.log("   chunk:", chunk.toString('utf8'))
    });
    next()
}

