import { Firestore } from "firebase-admin/firestore";
import { addNewRecipe } from "./addRecipe.ts";
import { Request, Response } from 'express';
import { MESSAGE_UNAUTHORISED_INVALID_JWT, MESSAGE_UNAUTHORISED_NO_JWT, MESSAGE_UNKNOWN_UNEXPECTED_ERROR } from "../../routes.ts";
import { extractRecipe } from "./extractRecipe.ts";
import { MESSAGE_NO_SCHEMA_ORG } from "./constants.ts";
import { getAuth } from "firebase-admin/auth";

const MESSAGE_BAD_URL = "Invalid request. The request body must be a JSON object with a 'url' property. The value of 'url' must be a valid URL.";

const isJWT = (s: string) => s.startsWith("JWT ") || s.startsWith("jwt ")

export async function addRecipeFromUrl(req: Request, res: Response, db: Firestore) {
    let jwtHeader = undefined;
    const authHeader = req.headers.authorization
    console.log("authHeader", req.headers)
    if (typeof authHeader === 'string' && isJWT(authHeader)) {
        jwtHeader = authHeader;
    }
    else if (Array.isArray(authHeader)){
        jwtHeader = authHeader.find(isJWT)
    }

    if (jwtHeader === undefined) {
        console.log('no Authorization on request, expected JWT token');
        res.status(401)
            .json({ error: MESSAGE_UNAUTHORISED_NO_JWT });
        return;
    }
    
    // remove JWT part and remove
    const split = jwtHeader.split(/\s/)
    if (split.length !== 2) {
        // malformed token?
    }
    const jwt = split[1];

    let userId;
    try {
        const verifiedJwt = await getAuth().verifyIdToken(jwt)
        userId = verifiedJwt.uid;
    }
    catch (e) {
        console.log('JWT found on request but could not be validated');
        res.status(401)
            .json({ error: MESSAGE_UNAUTHORISED_INVALID_JWT });
        return;
    }

    const recipeUrlParam = req.body['url'];
    let recipeUrl;
    try {
        console.log("recipe url:", recipeUrlParam);
        recipeUrl = new URL(recipeUrlParam);
    }
    catch (e: unknown) {
        if (e instanceof TypeError) {
            console.log('bad recipe url');
            res.status(400)
                .json({ error: MESSAGE_BAD_URL });
        }
        else {
            console.error('unexpected error', e);
            res.status(500)
                .json({ error: MESSAGE_UNKNOWN_UNEXPECTED_ERROR });
        }
        return;
    }

    const extractRecipeRes = await extractRecipe(recipeUrl);
    if (!extractRecipeRes?.recipe) {
        if (extractRecipeRes?.error === "schema.org.unsupported") {
            res.status(400)
                .json({ error: MESSAGE_NO_SCHEMA_ORG });
            return;
        }
        else {
            res.status(500)
                .json({ error: MESSAGE_UNKNOWN_UNEXPECTED_ERROR });
            return;
        }
    }

    const recipe = extractRecipeRes.recipe;
    const result = await addNewRecipe(db, userId, recipe);
    if (result === null) {
        console.log("failed to  added new recipe");
        res.status(500)
            .json({ error: MESSAGE_UNKNOWN_UNEXPECTED_ERROR });
    }

    console.log("successfully added new recipe", `'${recipe.name}'`);
    res.status(200)
        .json({});
}; 