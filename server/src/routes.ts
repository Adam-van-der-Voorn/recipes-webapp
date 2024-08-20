import admin from 'firebase-admin';
import express, { Express, NextFunction, Request, Response } from 'express';
import { addRecipeFromUrl } from './add-from-url/entry.js';

export type ResponseData = {
    body: Record<string, unknown>,
    statusCode: number;
};

export const MESSAGE_UNKNOWN_UNEXPECTED_ERROR = 'Unknown, unexpected, error.'

export function handleRequests(exp: Express, app: admin.app.App): void {
    // exp.use ('/api', logRawChunks)
    exp.use ('/api', logReq)
    exp.use ('/api', express.json());
    exp.post('/api/add-from-url', (req, res) => addRecipeFromUrl(req, res, app.firestore()));
    exp.use ('/api', fallThroughJson)
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

