import { Firestore } from "firebase-admin/firestore";
import { addNewRecipe } from "./addRecipe.js";
import { Request, Response } from 'express';
import { MESSAGE_UNKNOWN_UNEXPECTED_ERROR } from "../routes.js";
import { extractRecipe } from "./extractRecipe.js";

const MESSAGE_BAD_URL = "Invalid request. The request body must be a JSON object with a 'url' property. The value of 'url' must be a valid URL."
const MESSAGE_NO_SCHEMA_ORG = "The requested URL does not appear to supply a recipe in a machine readable format"

export async function addRecipeFromUrl(req: Request, res: Response, db: Firestore) {
    const recipeUrlParam = req.body['url'];
    let recipeUrl;
    try {
        console.log("recipe url:", recipeUrlParam);
        recipeUrl = new URL(recipeUrlParam);
    }
    catch (e: any) {
        if (e?.code === 'ERR_INVALID_URL') {
            console.log('bad recipe url')
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
    
    // user ID is test user- TODO: test if user needs to be verified
    const result = await addNewRecipe(db, "1hUzwovTtpXV2Ix3cA8ej1DKtud2", recipe);
    if (result === null) {
        console.log("failed to  added new recipe")
        res.status(500)
            .json({ error: MESSAGE_UNKNOWN_UNEXPECTED_ERROR });
    }

    console.log("successfully added new recipe", `'${recipe.name}'`)
    res.status(200)
        .json({});
}; 