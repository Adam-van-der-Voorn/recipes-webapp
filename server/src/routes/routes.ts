import admin from 'firebase-admin';
import express, { Express, NextFunction, Request, Response } from 'express';
import { addRecipeFromUrl } from './api/external-recipe/_post.ts';
import { getRecipeFromUrl } from './api/external-recipe/_get.ts';

import path from 'node:path';
import { notFound } from "../applicationErrorCodes.ts";
import { getSchemaOrgDump } from "./api/dev/schema-org-dump/_get.ts";

export type ResponseData = {
    body: Record<string, unknown>,
    statusCode: number;
};

export function handleRequests(exp: Express, app: admin.app.App, rootDir: string): void {

    // exp.use ('/', logReq("all"))
    // exp.use ('/api', logRawChunks)
    exp.use ('/api', logReq("api"))
    exp.use ('/api', express.json());
    exp.get ('/api/external-recipe', (req, res) => getRecipeFromUrl(req, res));
    exp.post('/api/external-recipe', (req, res) => addRecipeFromUrl(req, res, app.firestore()));
    exp.get ('/api/dev/schema-org-dump', (req, res) => getSchemaOrgDump(req, res));
    exp.use ('/api', (req, res) => fallThroughJson(req, res))
    
    const staticDir = path.join(rootDir, 'static')
    //exp.use ('/static', logReq("s"));
    exp.use ('/static', express.static(staticDir));

    // we hardcode these, as the browser expects them to be here
    const rootFiles = ['favicon.ico', 'service-worker.js', 'robots.txt']
    for (const filename of rootFiles) {
        exp.get(`/${filename}`, serveFile(rootDir, filename));
    }
        
    // finally- serve the index on all other paths, as we are a SPA :)
    exp.use ('/', serveFile(rootDir, 'index.html'));
} 

function serveFile(rootDir: string, filePath: string) {
    const opts = {
        root: rootDir
    }
    const errCallback = (e: any) => {
        if (e) {
            console.error("failed to serve", filePath, e)
        }
    }
    return (_req: any, res: Response) => res.sendFile(filePath, opts, errCallback)
}

function fallThroughJson(req: Request, res: Response) {
    console.log("no matches");
    res.status(404)
        .json({ ecode: notFound, context: `The requested resource does not exist, or does not support ${req.method} requests.`})
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

