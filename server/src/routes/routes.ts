import admin from 'firebase-admin';
import express, { Express, NextFunction, Request, Response } from 'express';
import { addRecipeFromUrl } from './api/external-recipe/_post.ts';
import { getRecipeFromUrl } from './api/external-recipe/_get.ts';

import path from 'node:path';

export type ResponseData = {
    body: Record<string, unknown>,
    statusCode: number;
};

export const MESSAGE_UNKNOWN_UNEXPECTED_ERROR = 'Unknown, unexpected, error.'
export const MESSAGE_UNAUTHORISED_NO_JWT = "Unauthorised, expected JWT";
export const MESSAGE_UNAUTHORISED_INVALID_JWT = "Unauthorised, invalid JWT";


export function handleRequests(exp: Express, app: admin.app.App, rootDir: string): void {

    // exp.use ('/api', logRawChunks)
    exp.use ('/api', logReq("api"))
    exp.use ('/api', express.json());
    exp.get ('/api/external-recipe', (req, res) => getRecipeFromUrl(req, res));
    exp.post('/api/external-recipe', (req, res) => addRecipeFromUrl(req, res, app.firestore()));
    exp.use ('/api', (req, res) => fallThroughJson(req, res))
    
    const staticDir = path.join(rootDir, 'static')
    exp.use ('/static', logReq("s"));
    exp.use ('/static', express.static(staticDir));

    // we hardcode these, as the browser expects them to be here
    const favicon = path.join(rootDir, 'favicon.ico')
    exp.use ('/favicon.ico', (_req, res) => serveFile(favicon, res));
    const sw = path.join(rootDir, 'service-worker.js')
    exp.use ('/service-worker.js', (_req, res) => serveFile(sw, res));
    const robots = path.join(rootDir, 'robots.txt')
    exp.use ('/robots.txt', (_req, res) => serveFile(robots, res));
    const index = path.join(rootDir, 'index.html')
    exp.use ('/index.html', (_req, res) => serveFile(index, res));

    // finally- serve the index on all other paths, as we are a SPA :)
    exp.use ('/', (_req, res) => serveFile(index, res));
} 

function serveFile(absFilePath: string, res: Response) {
    res.sendFile(absFilePath, e => console.error("failed to serve", absFilePath, e || ""))
}

function fallThroughJson(req: Request, res: Response) {
    console.log("no matches");
    res.status(404)
        .json({ error: `The requested resource does not exist, or does not support ${req.method} requests.`})
}

function logReq(prefix: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(`[${prefix}]`, req.method, req.url);
        next()
    }
}

function logRawChunks(req: Request, res: Response, next: NextFunction) {
    req.on('data', (chunk) => {
        console.log("   chunk:", chunk.toString('utf8'))
    });
    next()
}

