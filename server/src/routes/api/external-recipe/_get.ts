import { Request, Response } from 'express';
import { extractRecipe } from "./extractRecipe.ts";
import { MESSAGE_NO_SCHEMA_ORG } from "./constants.ts";
import { invalidUrl, noRecipeSchema, unknownUnexpected } from "../../../applicationErrorCodes.ts";

const MESSAGE_BAD_URL = "Invalid request. The request must include a 'url' query parameter. The value of 'url' must be a valid URL.";

export async function getRecipeFromUrl(req: Request, res: Response) {
    // string | string[] | undefined
    let recipeUrlParam: any = req.query['url']
    if (Array.isArray(recipeUrlParam)) {
        recipeUrlParam = recipeUrlParam[0];
    }
    console.log("url parms", req.query)
    let recipeUrl;
    try {
        console.log("recipe url:", recipeUrlParam);
        recipeUrl = new URL(recipeUrlParam);
    }
    catch (e: unknown) {
        if (e instanceof TypeError) {
            console.log('bad recipe url');
            res.status(400)
                .json({ ecode: invalidUrl, context: MESSAGE_BAD_URL });
        }
        else {
            console.error('unexpected error', e);
            res.status(500)
                .json({ ecode: unknownUnexpected });
        }
        return;
    }

    const extractRecipeRes = await extractRecipe(recipeUrl);
    if (!extractRecipeRes?.recipe) {
        if (extractRecipeRes?.error === "schema.org.unsupported") {
            res.status(400)
                .json({ ecode: noRecipeSchema, context: MESSAGE_NO_SCHEMA_ORG });
            return;
        }
        else {
            res.status(500)
                .json({ ecode: unknownUnexpected });
            return;
        }
    }

    const recipe = extractRecipeRes.recipe;
    console.log("successfully extracted recipe for response", `'${recipe.name}'`);
    res.status(200)
        .json({ recipe });
}; 